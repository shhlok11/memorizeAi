import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile, storageKeyForJob } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > env.uploadMaxBytes) {
      return NextResponse.json(
        { error: `File too large. Max ${env.uploadMaxBytes} bytes.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const jobId = crypto.randomUUID();
    const storageKey = storageKeyForJob(jobId);

    const document = await prisma.document.create({
      data: {
        originalFileName: file.name,
        storageKey,
        mimeType: file.type,
        sizeBytes: file.size
      }
    });

    const job = await prisma.job.create({
      data: {
        id: jobId,
        documentId: document.id,
        status: "queued",
        stage: "queued"
      }
    });

    await saveUploadedFile(storageKey, buffer);

    await inngest.send({
      name: "document.uploaded",
      data: { jobId: job.id }
    });

    return NextResponse.json({ jobId: job.id, documentId: document.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
