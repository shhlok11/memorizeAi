export type AppEnv = {
  databaseUrl: string;
  openaiApiKey: string;
  inngestEventKey: string;
  inngestSigningKey: string;
  chunkSize: number;
  chunkOverlap: number;
  uploadMaxBytes: number;
  embeddingModel: string;
  chatModel: string;
  topK: number;
};

export function getEnv(): AppEnv {
  return {
    databaseUrl: process.env["DATABASE_URL"] ?? "",
    openaiApiKey: process.env["OPENAI_API_KEY"] ?? "",
    inngestEventKey: process.env["INNGEST_EVENT_KEY"] ?? "",
    inngestSigningKey: process.env["INNGEST_SIGNING_KEY"] ?? "",
    chunkSize: Number(process.env["CHUNK_SIZE"] ?? 1000),
    chunkOverlap: Number(process.env["CHUNK_OVERLAP"] ?? 150),
    uploadMaxBytes: Number(process.env["UPLOAD_MAX_BYTES"] ?? 20_000_000),
    embeddingModel: process.env["EMBEDDING_MODEL"] ?? "text-embedding-3-small",
    chatModel: process.env["CHAT_MODEL"] ?? "gpt-4o-mini",
    topK: Number(process.env["TOP_K"] ?? 5)
  };
}

export function assertEnv(env: AppEnv = getEnv()) {
  const missing: string[] = [];
  if (!env.databaseUrl) missing.push("DATABASE_URL");
  if (!env.openaiApiKey) missing.push("OPENAI_API_KEY");
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
