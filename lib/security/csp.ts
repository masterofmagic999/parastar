/**
 * Content Security Policy (CSP) Configuration
 * Protects against XSS, clickjacking, and other code injection attacks
 */

/**
 * CSP directives for different environments
 */
export const CSPDirectives = {
  // Development environment - more permissive for hot reload, etc.
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Next.js dev mode
      "'unsafe-inline'", // Required for Next.js dev mode
      'blob:',
      'https://rrojsddygnumolbdxesu.supabase.co'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'" // Required for Tailwind and styled-jsx
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://rrojsddygnumolbdxesu.supabase.co'
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://rrojsddygnumolbdxesu.supabase.co',
      'wss://rrojsddygnumolbdxesu.supabase.co',
      'ws://localhost:*',
      'http://localhost:*'
    ],
    'frame-src': ["'self'", 'blob:'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'blob:', 'data:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  },

  // Production environment - stricter security
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'sha256-SCRIPT_HASH'", // Replace with actual hashes of inline scripts
      'blob:',
      'https://rrojsddygnumolbdxesu.supabase.co'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'" // Required for Tailwind CSS
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://rrojsddygnumolbdxesu.supabase.co'
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://rrojsddygnumolbdxesu.supabase.co',
      'wss://rrojsddygnumolbdxesu.supabase.co'
    ],
    'frame-src': ["'self'", 'blob:'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'blob:', 'data:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  }
}

/**
 * Build CSP header string from directives
 */
export function buildCSPHeader(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key
      }
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

/**
 * Get CSP header for current environment
 */
export function getCSPHeader(environment: 'development' | 'production' = 'production'): string {
  const directives = CSPDirectives[environment]
  return buildCSPHeader(directives)
}

/**
 * Additional security headers
 */
export const SecurityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
}

/**
 * Get all security headers including CSP
 */
export function getAllSecurityHeaders(
  environment: 'development' | 'production' = 'production'
): Record<string, string> {
  return {
    'Content-Security-Policy': getCSPHeader(environment),
    ...SecurityHeaders
  }
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(
  response: Response,
  environment: 'development' | 'production' = 'production'
): Response {
  const headers = new Headers(response.headers)
  const securityHeaders = getAllSecurityHeaders(environment)
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value)
  })
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

/**
 * Nonce generator for inline scripts
 * Use this to allow specific inline scripts while maintaining CSP
 */
export function generateNonce(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  // In Node.js environment, throw error rather than weak fallback
  throw new Error('crypto.getRandomValues not available - cannot generate secure nonce')
}

/**
 * Create CSP with nonce for inline scripts
 */
export function createCSPWithNonce(
  nonce: string,
  environment: 'development' | 'production' = 'production'
): string {
  const directives = { ...CSPDirectives[environment] }
  
  // Add nonce to script-src
  directives['script-src'] = [
    ...directives['script-src'],
    `'nonce-${nonce}'`
  ]
  
  return buildCSPHeader(directives)
}
