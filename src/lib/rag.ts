import { Prisma } from "../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createChatClient, createEmbeddingsClient } from "@/lib/ai";
import { assertEnv, env } from "@/lib/env";
import { withRetries } from "@/lib/retry";
import { toPgVector } from "@/lib/vector";

const SYSTEM_PROMPT = `You are a QA assistant for PDF documents.
Use ONLY the provided sources. If the answer is not fully contained in the sources, say "I don't know".
Return JSON with keys: answer (string) and citations (array of {chunkId, pageStart, pageEnd, snippet}).
Citations must quote short snippets from the sources.`;

export type RetrievedChunk = {
  id: string;
  content: string;
  pageStart: number | null;
  pageEnd: number | null;
};

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  chunkId: string;
  pageStart: number | null;
  pageEnd: number | null;
  snippet: string;
};

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export async function retrieveChunks(documentId: string, query: string) {
  assertEnv();
  const embeddings = createEmbeddingsClient();
  const queryEmbedding = await withRetries(
    () => embeddings.embedQuery(query),
    { retries: 3 }
  );
  const vector = toPgVector(queryEmbedding);

  const rows = await prisma.$queryRaw<RetrievedChunk[]>(Prisma.sql`
    SELECT "id", "content", "pageStart", "pageEnd"
    FROM "Chunk"
    WHERE "documentId" = ${documentId}
      AND "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${Prisma.raw(`'${vector}'::vector`)}
    LIMIT ${env.topK}
  `);

  return rows;
}

function extractPageNumber(question: string) {
  const match = question.match(/page\\s+(\\d+)/i);
  if (!match) return null;
  const page = Number(match[1]);
  return Number.isFinite(page) ? page : null;
}

async function retrieveChunksForQuestion(documentId: string, question: string) {
  const page = extractPageNumber(question);
  if (page !== null) {
    const rows = await prisma.$queryRaw<RetrievedChunk[]>(Prisma.sql`
      SELECT "id", "content", "pageStart", "pageEnd"
      FROM "Chunk"
      WHERE "documentId" = ${documentId}
        AND "pageStart" IS NOT NULL
        AND ("pageStart" = ${page} OR "pageEnd" = ${page} OR ("pageStart" <= ${page} AND "pageEnd" >= ${page}))
      ORDER BY "pageStart" ASC
      LIMIT ${env.topK}
    `);
    if (rows.length) return rows;
  }

  return retrieveChunks(documentId, question);
}

export async function answerQuestion(documentId: string, question: string) {
  const page = extractPageNumber(question);
  const chunks = await retrieveChunksForQuestion(documentId, question);
  if (!chunks.length) {
    return { answer: "I don't know", citations: [] };
  }

  if (page !== null) {
    const citations = chunks.slice(0, Math.min(3, chunks.length)).map((chunk) => ({
      chunkId: chunk.id,
      pageStart: chunk.pageStart ?? null,
      pageEnd: chunk.pageEnd ?? null,
      snippet: chunk.content.slice(0, 200)
    }));
    const answer = `Here are excerpts from page ${page}:\n` +
      citations.map((c) => `- ${c.snippet}`).join("\n");
    return { answer, citations };
  }

  const chunkMap = new Map(
    chunks.map((chunk) => [
      chunk.id,
      { content: chunk.content, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd }
    ])
  );

  const sources = chunks.map((chunk) => ({
    id: chunk.id,
    pageStart: chunk.pageStart,
    pageEnd: chunk.pageEnd,
    text: chunk.content
  }));

  const chat = createChatClient();
  const response = await withRetries(
    () =>
      chat.invoke([
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Question: ${question}\nSources: ${JSON.stringify(sources)}`
        }
      ]),
    { retries: 2 }
  );

  const raw = response.content?.toString() ?? "";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.answer !== "string" || !Array.isArray(parsed.citations)) {
      throw new Error("Invalid model response");
    }
    const citations = parsed.citations
      .filter((citation: { chunkId?: string; snippet?: string }) => {
        if (!citation?.chunkId || !citation?.snippet) return false;
        const source = chunkMap.get(citation.chunkId);
        if (!source) return false;
        return source.content.includes(citation.snippet);
      })
      .map((citation: { chunkId: string; snippet: string }) => {
        const source = chunkMap.get(citation.chunkId)!;
        return {
          chunkId: citation.chunkId,
          pageStart: source.pageStart ?? null,
          pageEnd: source.pageEnd ?? null,
          snippet: citation.snippet
        };
      });

    if (!citations.length || parsed.answer.trim() === "") {
      return { answer: "I don't know", citations: [] };
    }

    return { answer: parsed.answer, citations };
  } catch (error) {
    return {
      answer: "I don't know",
      citations: []
    };
  }
}

const FLASHCARD_PROMPT = `You create study flashcards from sources only.
Return JSON with key "flashcards": array of objects:
{ id, question, answer, chunkId, snippet }.
The answer must be an exact quote from the source chunk.
The snippet must be a short quote from the same chunk.
Use only chunkId values provided in sources.`;

export async function generateFlashcards(documentId: string, count = 6) {
  assertEnv();
  const query = "key concepts, definitions, and important facts";
  const chunks = await retrieveChunks(documentId, query);
  if (!chunks.length) return [];

  const chunkMap = new Map(
    chunks.map((chunk) => [
      chunk.id,
      { content: chunk.content, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd }
    ])
  );

  const sources = chunks.map((chunk) => ({
    id: chunk.id,
    text: chunk.content
  }));

  const chat = createChatClient();
  const response = await withRetries(
    () =>
      chat.invoke([
        { role: "system", content: FLASHCARD_PROMPT },
        {
          role: "user",
          content: `Create up to ${count} flashcards. Sources: ${JSON.stringify(sources)}`
        }
      ]),
    { retries: 2 }
  );

  const raw = response.content?.toString() ?? "";
  let cleaned: Flashcard[] = [];
  try {
    const parsed = JSON.parse(raw) as { flashcards?: Array<Record<string, string>> };
    const cards = parsed.flashcards ?? [];
    const seen = new Set<string>();

    for (const card of cards) {
      if (!card?.chunkId || !card?.question) continue;
      const source = chunkMap.get(card.chunkId);
      if (!source) continue;
      const sourceNorm = normalizeText(source.content);
      let answer = card.answer ?? "";
      let snippet = card.snippet ?? "";
      const answerNorm = normalizeText(answer);
      const snippetNorm = normalizeText(snippet);

      if (answer && snippet && !sourceNorm.includes(answerNorm) && sourceNorm.includes(snippetNorm)) {
        answer = snippet;
      }
      if (!answer && snippet && sourceNorm.includes(snippetNorm)) {
        answer = snippet;
      }
      if (!snippet && answer && sourceNorm.includes(answerNorm)) {
        snippet = answer;
      }

      if (!answer || !snippet) continue;
      if (!sourceNorm.includes(normalizeText(answer))) continue;
      if (!sourceNorm.includes(normalizeText(snippet))) continue;
      const key = `${card.chunkId}:${normalizeText(answer)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      cleaned.push({
        id: card.id ?? card.chunkId,
        question: card.question,
        answer,
        chunkId: card.chunkId,
        pageStart: source.pageStart ?? null,
        pageEnd: source.pageEnd ?? null,
        snippet
      });
    }
  } catch {
    cleaned = [];
  }

  if (cleaned.length) return cleaned.slice(0, count);

  const fallback: Flashcard[] = [];
  for (const chunk of chunks.slice(0, count)) {
    const source = chunkMap.get(chunk.id);
    if (!source) continue;
    const text = normalizeText(source.content);
    if (!text) continue;
    const snippet = text.slice(0, 160);
    const words = snippet.split(" ").slice(0, 8).join(" ");
    fallback.push({
      id: chunk.id,
      question: `What does the document say about "${words}"?`,
      answer: snippet,
      chunkId: chunk.id,
      pageStart: source.pageStart ?? null,
      pageEnd: source.pageEnd ?? null,
      snippet
    });
  }

  return fallback;
}
