const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const entries = new Map<string, RateLimitEntry>();

/** Best-effort per-instance protection; CDN caching handles most repeated reads. */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const existing = entries.get(key);
  const entry =
    !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + WINDOW_MS }
      : existing;
  entry.count += 1;
  entries.set(key, entry);
  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}
