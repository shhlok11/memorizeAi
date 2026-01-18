import { Prisma } from "@prisma/client";
import { createEmbeddingsClient } from "@/lib/ai";
import { assertEnv } from "@/lib/env";
import { chunkPages, loadPdfPages } from "@/lib/ingest";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { withRetries } from "@/lib/retry";
import { storagePathForKey } from "@/lib/storage";
import { toPgVector } from "@/lib/vector";

export const ingestDocument = inngest.createFunction(
  { id: "ingest-document" },
  { event: "document.uploaded" },
  async ({ event, step }) => {
    assertEnv();
    const { jobId } = event.data as { jobId: string };

    const job = await step.run("load-job", async () => {
      return prisma.job.findUnique({ where: { id: jobId } });
    });

    if (!job) {
      return { ok: false, reason: "Job not found" };
    }

    if (job.status === "ready") {
      return { ok: true, reason: "Already processed" };
    }

    await step.run("mark-processing", async () => {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "processing", stage: "extracting" }
      });
    });

    await step.sendEvent("emit-processing", {
      name: "document.processing",
      data: { jobId }
    });

    try {
      const document = await step.run("load-document", async () => {
        return prisma.document.findUnique({ where: { id: job.documentId } });
      });

      if (!document) {
        throw new Error("Document not found");
      }

      const filePath = storagePathForKey(document.storageKey);

      const pages = await step.run("extract-pages", async () => {
        return loadPdfPages(filePath);
      });

      await step.run("mark-chunking", async () => {
        await prisma.job.update({
          where: { id: jobId },
          data: { stage: "chunking" }
        });
      });

      const chunks = await step.run("chunk-pages", async () => {
        return chunkPages(pages);
      });

      const existingHashes = await step.run("load-existing", async () => {
        if (!chunks.length) return [] as string[];
        const hashes = chunks.map((chunk) => chunk.contentHash);
        const rows = await prisma.chunk.findMany({
          where: {
            documentId: document.id,
            contentHash: { in: hashes }
          },
          select: { contentHash: true }
        });
        return rows.map((row) => row.contentHash);
      });

      const existingHashSet = new Set(existingHashes);

      const seenHashes = new Set<string>();
      const newChunks = chunks.filter((chunk) => {
        if (existingHashSet.has(chunk.contentHash)) return false;
        if (seenHashes.has(chunk.contentHash)) return false;
        seenHashes.add(chunk.contentHash);
        return true;
      });

      const embeddings = createEmbeddingsClient();

      await step.run("mark-embedding", async () => {
        await prisma.job.update({
          where: { id: jobId },
          data: { stage: "embedding" }
        });
      });

      const batchSize = 20;
      for (let i = 0; i < newChunks.length; i += batchSize) {
        const batch = newChunks.slice(i, i + batchSize);
        const texts = batch.map((chunk) => chunk.content);
        const vectors = await withRetries(
          () => embeddings.embedDocuments(texts),
          { retries: 3 }
        );

        for (let j = 0; j < batch.length; j += 1) {
          const chunk = batch[j];
          const created = await prisma.chunk.upsert({
            where: {
              documentId_contentHash: {
                documentId: document.id,
                contentHash: chunk.contentHash
              }
            },
            create: {
              documentId: document.id,
              chunkIndex: chunk.chunkIndex,
              content: chunk.content,
              contentHash: chunk.contentHash,
              pageStart: chunk.pageStart,
              pageEnd: chunk.pageEnd
            },
            update: {
              content: chunk.content,
              pageStart: chunk.pageStart,
              pageEnd: chunk.pageEnd
            }
          });

          const vector = toPgVector(vectors[j]);
          await prisma.$executeRaw(
            Prisma.sql`
              UPDATE "Chunk"
              SET "embedding" = ${Prisma.raw(`'${vector}'::vector`)}
              WHERE "id" = ${created.id}
            `
          );
        }
      }

      await step.sendEvent("emit-embedded", {
        name: "document.embedded",
        data: { jobId }
      });

      await step.run("mark-ready", async () => {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "ready", stage: "ready" }
        });
      });

      await step.sendEvent("emit-ready", {
        name: "document.ready",
        data: { jobId }
      });

      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      await step.run("mark-failed", async () => {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "failed", stage: "failed", errorMessage: message }
        });
      });

      await step.sendEvent("emit-failed", {
        name: "document.failed",
        data: { jobId, error: message }
      });

      throw error;
    }
  }
);
