import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { env } from "@/lib/env";

export function createEmbeddingsClient() {
  return new OpenAIEmbeddings({
    apiKey: env.openaiApiKey,
    model: env.embeddingModel
  });
}

export function createChatClient() {
  return new ChatOpenAI({
    apiKey: env.openaiApiKey,
    model: env.chatModel,
    temperature: 0
  });
}
