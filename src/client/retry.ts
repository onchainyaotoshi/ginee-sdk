export type RetryOptions = {
  maxRetries?: number;     // total retry attempts (default 6)
  baseDelayMs?: number;    // default 300
  maxDelayMs?: number;     // default 8000
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function calcDelay(attempt: number, baseDelayMs: number, maxDelayMs: number) {
  // exponential backoff: base * 2^attempt
  const exp = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  // full jitter: random between 0 and exp
  return Math.floor(Math.random() * exp);
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  opts: RetryOptions = {}
): Promise<T> {
  const maxRetries = opts.maxRetries ?? 6;
  const baseDelayMs = opts.baseDelayMs ?? 300;
  const maxDelayMs = opts.maxDelayMs ?? 8000;

  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (attempt >= maxRetries || !shouldRetry(err)) throw err;

      const delay = calcDelay(attempt, baseDelayMs, maxDelayMs);
      await sleep(delay);
    }
  }
  throw lastErr;
}
