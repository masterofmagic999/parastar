/**
 * Rate Limiting Middleware
 * Protects API routes from abuse by limiting request frequency
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limits
// ⚠️ PRODUCTION WARNING: This in-memory store will NOT work correctly in:
//    - Serverless deployments (each invocation has separate memory)
//    - Multi-instance deployments (each instance has separate memory)
//    - Horizontal scaling scenarios
// For production use, replace with Redis, Memcached, or a database-backed store.
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let cleanupTimer: NodeJS.Timeout | null = null

/**
 * Start cleanup timer
 */
function startCleanup() {
  if (!cleanupTimer) {
    cleanupTimer = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of rateLimitStore.entries()) {
        if (now >= entry.resetTime) {
          rateLimitStore.delete(key)
        }
      }
    }, CLEANUP_INTERVAL)
  }
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional message to return when rate limit is exceeded */
  message?: string
}

/**
 * Default rate limit configurations
 */
export const RateLimitPresets = {
  // Strict: 5 requests per minute
  STRICT: { maxRequests: 5, windowMs: 60 * 1000 },
  
  // Standard: 20 requests per minute
  STANDARD: { maxRequests: 20, windowMs: 60 * 1000 },
  
  // Relaxed: 100 requests per minute
  RELAXED: { maxRequests: 100, windowMs: 60 * 1000 },
  
  // Authentication: 3 failed attempts per 15 minutes
  AUTH: { maxRequests: 3, windowMs: 15 * 60 * 1000 },
  
  // API: 60 requests per minute
  API: { maxRequests: 60, windowMs: 60 * 1000 }
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimitPresets.STANDARD
): { allowed: boolean; remaining: number; resetTime: number } {
  startCleanup()
  
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  // No existing entry or window has expired
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Increment count
  entry.count++
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = RateLimitPresets.STANDARD
): { count: number; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry || now >= entry.resetTime) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs
    }
  }
  
  return {
    count: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime
  }
}

/**
 * Express/Next.js middleware helper for rate limiting
 */
export function createRateLimitMiddleware(config: RateLimitConfig = RateLimitPresets.STANDARD) {
  return (identifier: string): Response | null => {
    const result = checkRateLimit(identifier, config)
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
      
      return new Response(
        JSON.stringify({
          error: config.message || 'Too many requests, please try again later.',
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      )
    }
    
    return null
  }
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getRequestIdentifier(request: Request, userId?: string): string {
  if (userId) return `user_${userId}`
  
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  
  return `ip_${ip}`
}

/**
 * Clean up and stop the timer (for testing or shutdown)
 */
export function stopCleanup(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
  rateLimitStore.clear()
}
