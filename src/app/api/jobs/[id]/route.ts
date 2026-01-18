import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const chunkCountResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM "Chunk"
      WHERE "documentId" = ${job.documentId}
    `;

    const embeddedCountResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM "Chunk"
      WHERE "documentId" = ${job.documentId}
        AND "embedding" IS NOT NULL
    `;

    return NextResponse.json({
      id: job.id,
      status: job.status,
      stage: job.stage,
      errorMessage: job.errorMessage,
      documentId: job.documentId,
      chunkCount: chunkCountResult[0]?.count ?? 0,
      embeddedCount: embeddedCountResult[0]?.count ?? 0
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
