import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Check if Redis is configured
const isRedisConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client (only if configured)
let redis: Redis | null = null;
export let rateLimiter: Ratelimit | null = null;
export let chatRateLimiter: Ratelimit | null = null;

if (isRedisConfigured) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Create rate limiter instance
    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
      analytics: true,
      prefix: "shipnow:ratelimit",
    });

    // Rate limiter for chat actions specifically
    chatRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 chat requests per minute
      analytics: true,
      prefix: "shipnow:chat:ratelimit",
    });
  } catch (error) {
    console.warn("⚠️ Failed to initialize Redis client:", error);
    redis = null;
    rateLimiter = null;
    chatRateLimiter = null;
  }
} else {
  console.warn("⚠️ Redis not configured. Rate limiting will be disabled.");
}

// Helper function to check rate limit for a user
export async function checkRateLimit(userId: string, limiter = rateLimiter) {
  // If rate limiting is not available, allow the request
  if (!limiter) {
    console.warn("⚠️ Rate limiter not available, allowing request");
    return {
      success: true,
      limit: Infinity,
      reset: Date.now() + 60000,
      remaining: Infinity,
      resetTime: new Date(Date.now() + 60000),
    };
  }

  try {
    const identifier = `user:${userId}`;
    const { success, limit, reset, remaining } = await limiter.limit(identifier);
    
    return {
      success,
      limit,
      reset,
      remaining,
      resetTime: new Date(reset),
    };
  } catch (error) {
    // If Redis connection fails, log warning and allow request (graceful degradation)
    console.warn("⚠️ Rate limit check failed, allowing request:", error);
    return {
      success: true,
      limit: Infinity,
      reset: Date.now() + 60000,
      remaining: Infinity,
      resetTime: new Date(Date.now() + 60000),
    };
  }
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
  try {
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
  } catch (error) {
    // If it's a RateLimitError, re-throw it
    if (error instanceof RateLimitError) {
      throw error;
    }
    
    // For any other error (like Redis connection failure), log and allow the request
    console.warn("⚠️ Rate limiting error, allowing request to proceed:", error);
    return await fn();
  }
}