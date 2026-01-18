export function toPgVector(embedding: number[]) {
  const sanitized = embedding.map((value) => {
    if (!Number.isFinite(value)) {
      throw new Error("Embedding contains non-finite values");
    }
    return Number(value).toFixed(8);
  });

  return `[${sanitized.join(",")}]`;
}
