import { createHash } from "node:crypto";
const windowMs = 15 * 60 * 1000;
const buckets = new Map<string, { count: number; reset: number }>();
export function localLimit(key: string, now = Date.now()) {
  for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 10000) return false;
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }
  return ++bucket.count <= 5;
}
export async function rateLimit(ip: string) {
  const key = "lead:" + createHash("sha256").update(ip).digest("hex");
  const url = process.env.UPSTASH_REDIS_REST_URL,
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    if (!url.startsWith("https://"))
      throw new Error("Invalid rate limit configuration");
    const lua =
      "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return n";
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", lua, "1", key, String(windowMs)]),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!r.ok) throw new Error("Rate limit unavailable");
    const result = await r.json();
    if (typeof result.result !== "number")
      throw new Error("Rate limit unavailable");
    return result.result <= 5;
  }
  if (process.env.NODE_ENV === "production")
    throw new Error("Shared limiter required");
  return localLimit(key);
}
