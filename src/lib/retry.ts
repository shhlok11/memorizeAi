export async function withRetries<T>(
  operation: () => Promise<T>,
  options: { retries: number; baseDelayMs?: number } = { retries: 3, baseDelayMs: 500 }
): Promise<T> {
  const { retries, baseDelayMs = 500 } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
