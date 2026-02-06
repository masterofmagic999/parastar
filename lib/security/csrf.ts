/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Generates and validates CSRF tokens for form submissions
 */

import { randomBytes, createHash } from 'crypto'

// Store tokens in memory
// ⚠️ PRODUCTION WARNING: This in-memory store will NOT work correctly in:
//    - Serverless deployments (each invocation has separate memory)
//    - Multi-instance deployments (each instance has separate memory)
//    - Horizontal scaling scenarios
// For production use, replace with Redis, Memcached, or a database-backed store.
const tokenStore = new Map<string, { token: string; expires: number }>()

// Token expiration time (1 hour)
const TOKEN_EXPIRATION = 60 * 60 * 1000

/**
 * Generate a CSRF token for a session
 * @param sessionId - Unique session identifier
 * @returns CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  // Clean up expired tokens
  cleanupExpiredTokens()
  
  // Generate random token
  const token = randomBytes(32).toString('base64')
  
  // Store token with expiration
  tokenStore.set(sessionId, {
    token,
    expires: Date.now() + TOKEN_EXPIRATION
  })
  
  return token
}

/**
 * Validate a CSRF token
 * @param sessionId - Session identifier
 * @param token - Token to validate
 * @returns true if valid, false otherwise
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = tokenStore.get(sessionId)
  
  if (!stored) {
    return false
  }
  
  // Check if token has expired
  if (Date.now() > stored.expires) {
    tokenStore.delete(sessionId)
    return false
  }
  
  // Compare tokens
  return stored.token === token
}

/**
 * Remove a CSRF token (e.g., after use or logout)
 */
export function removeCSRFToken(sessionId: string): void {
  tokenStore.delete(sessionId)
}

/**
 * Clean up expired tokens from memory
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, data] of tokenStore.entries()) {
    if (now > data.expires) {
      tokenStore.delete(sessionId)
    }
  }
}

/**
 * Generate a hash of the CSRF token for use in cookies
 * This prevents the token from being directly exposed
 */
export function hashCSRFToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Middleware helper to check CSRF token in requests
 */
export function verifyCSRFFromRequest(sessionId: string, token: string | null): boolean {
  if (!token) {
    return false
  }
  
  return validateCSRFToken(sessionId, token)
}
