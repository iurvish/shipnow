# Rate Limiting Implementation

This project uses Upstash Redis for implementing rate limiting to prevent abuse of API endpoints, particularly the AI-powered chat functionality.

## Setup

### 1. Upstash Redis Configuration

1. Sign up for [Upstash Console](https://console.upstash.com/redis)
2. Create a new Redis database
3. Copy the REST URL and token from your dashboard
4. Add them to your environment variables:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```

### 2. Rate Limiting Rules

The current implementation includes two types of rate limiters:

- **General Rate Limiter**: 10 requests per minute per user
- **Chat Rate Limiter**: 5 chat requests per minute per user (more restrictive for expensive AI operations)

## Implementation Details

### Rate Limiter Configuration (`lib/rate-limit.ts`)

```typescript
// General rate limiter
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "shipnow:ratelimit",
});

// Chat-specific rate limiter (more restrictive)
export const chatRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 chat requests per minute
  analytics: true,
  prefix: "shipnow:chat:ratelimit",
});
```

### Usage in Server Actions

The `generatePeopleSuggestions` function in `lib/actions/chat-actions.ts` is wrapped with rate limiting:

```typescript
return await withRateLimit(
  userId,
  async () => {
    // Your expensive operation here
    return result;
  },
  chatRateLimiter // Use chat-specific rate limiter
);
```

### Error Handling

When rate limits are exceeded, users receive a user-friendly message:

- **Rate Limit Exceeded**: "You've made too many requests. Please wait X seconds before trying again."
- **Analytics**: Upstash provides built-in analytics for monitoring rate limit hits

## Benefits

1. **Prevents Abuse**: Stops users from overwhelming the AI API with too many requests
2. **Cost Control**: Reduces unnecessary API calls to Google's Gemini AI model
3. **Fair Usage**: Ensures all users have equal access to the service
4. **Performance**: Maintains system responsiveness under load

## Customization

You can adjust the rate limits by modifying the values in `lib/rate-limit.ts`:

- Change `slidingWindow(5, "1 m")` to `slidingWindow(10, "2 m")` for 10 requests per 2 minutes
- Use `fixedWindow()` instead of `slidingWindow()` for different behavior
- Add different rate limiters for different endpoints

## Monitoring

Upstash provides analytics on your rate limiting usage through their console dashboard, helping you monitor:

- Number of requests blocked
- Most active users
- Peak usage times
- Rate limit effectiveness
