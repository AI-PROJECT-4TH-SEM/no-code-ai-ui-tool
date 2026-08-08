const buckets = new Map()

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now()
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs }

  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + windowMs
  }

  bucket.count += 1
  buckets.set(key, bucket)

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(limit - bucket.count + 1, 0),
  }
}
