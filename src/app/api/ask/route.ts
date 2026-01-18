import { NextResponse } from "next/server";
import { z } from "zod";
import { answerQuestion } from "@/lib/rag";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  documentId: z.string().uuid(),
  question: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { documentId, question } = requestSchema.parse(payload);

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const chunkCount = await prisma.chunk.count({
      where: { documentId }
    });

    if (!chunkCount) {
      return NextResponse.json(
        { error: "Document is not ready yet" },
        { status: 409 }
      );
    }

    const response = await answerQuestion(documentId, question);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
