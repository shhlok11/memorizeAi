import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateFlashcards } from "@/lib/rag";

const requestSchema = z.object({
  documentId: z.string().uuid(),
  count: z.number().int().min(1).max(12).optional()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { documentId, count } = requestSchema.parse(payload);

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const cards = await generateFlashcards(documentId, count);
    return NextResponse.json({ flashcards: cards });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
