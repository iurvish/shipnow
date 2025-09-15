import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiter instance
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "shipnow:ratelimit",
});

// Rate limiter for chat actions specifically
export const chatRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 chat requests per minute
  analytics: true,
  prefix: "shipnow:chat:ratelimit",
});

// Helper function to check rate limit for a user
export async function checkRateLimit(userId: string, limiter = rateLimiter) {
  const identifier = `user:${userId}`;
  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  
  return {
    success,
    limit,
    reset,
    remaining,
    resetTime: new Date(reset),
  };
}

// Rate limit error class
export class RateLimitError extends Error {
  constructor(
    message: string,
    public limit: number,
    public remaining: number,
    public reset: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

// Rate limit wrapper function
export async function withRateLimit<T>(
  userId: string,
  fn: () => Promise<T>,
  limiter = rateLimiter
): Promise<T> {
  const result = await checkRateLimit(userId, limiter);
  
  if (!result.success) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`,
      result.limit,
      result.remaining,
      result.reset
    );
  }
  
  return await fn();
}