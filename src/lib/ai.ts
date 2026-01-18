import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { getEnv } from "@/lib/env";

export function createEmbeddingsClient() {
  const env = getEnv();
  return new OpenAIEmbeddings({
    apiKey: env.openaiApiKey,
    model: env.embeddingModel
  });
}

export function createChatClient() {
  const env = getEnv();
  return new ChatOpenAI({
    apiKey: env.openaiApiKey,
    model: env.chatModel,
    temperature: 0
  });
}
