import crypto from "crypto";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEnv } from "@/lib/env";

export type RawPage = {
  content: string;
  pageNumber: number | null;
};

export type ChunkPayload = {
  content: string;
  contentHash: string;
  pageStart: number | null;
  pageEnd: number | null;
  chunkIndex: number;
};

export async function loadPdfPages(filePath: string): Promise<RawPage[]> {
  const loader = new PDFLoader(filePath, { splitPages: true });
  const docs = await loader.load();

  return docs.map((doc, index) => {
    const meta = doc.metadata as { pageNumber?: number };
    return {
      content: doc.pageContent,
      pageNumber: meta?.pageNumber ?? index + 1
    };
  });
}

export async function chunkPages(pages: RawPage[]): Promise<ChunkPayload[]> {
  const env = getEnv();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: env.chunkSize,
    chunkOverlap: env.chunkOverlap
  });

  const chunks: ChunkPayload[] = [];
  let chunkIndex = 0;

  for (const page of pages) {
    const pieces = await splitter.splitText(page.content);
    for (const piece of pieces) {
      const trimmed = piece.trim();
      if (!trimmed) continue;
      chunks.push({
        content: trimmed,
        contentHash: hashContent(trimmed),
        pageStart: page.pageNumber,
        pageEnd: page.pageNumber,
        chunkIndex
      });
      chunkIndex += 1;
    }
  }

  return chunks;
}

export function hashContent(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
