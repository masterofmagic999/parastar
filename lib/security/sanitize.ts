/**
 * Input Sanitization Utilities
 * Protects against XSS and injection attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  
  return text.replace(/[&<>"'/]/g, char => map[char])
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeUrl(url: string): string {
  // Trim whitespace
  url = url.trim()
  
  // Check for dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = url.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return 'about:blank'
    }
  }
  
  // Allow only http, https, and relative URLs
  if (!url.startsWith('http://') && 
      !url.startsWith('https://') && 
      !url.startsWith('/') &&
      !url.startsWith('#')) {
    return 'https://' + url
  }
  
  return url
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  // Remove whitespace
  email = email.trim().toLowerCase()
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }
  
  return email
}

/**
 * Sanitize username (alphanumeric, underscore, hyphen only)
 */
export function sanitizeUsername(username: string): string {
  // Remove whitespace
  username = username.trim()
  
  // Allow only alphanumeric, underscore, and hyphen
  username = username.replace(/[^a-zA-Z0-9_-]/g, '')
  
  // Limit length
  if (username.length > 50) {
    username = username.substring(0, 50)
  }
  
  return username
}

/**
 * Sanitize text input (remove control characters)
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  // Remove null bytes and control characters
  text = text.replace(/\0/g, '')
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Trim whitespace
  text = text.trim()
  
  // Limit length
  if (text.length > maxLength) {
    text = text.substring(0, maxLength)
  }
  
  return text
}

/**
 * Sanitize SQL LIKE pattern to prevent injection
 */
export function sanitizeLikePattern(pattern: string): string {
  // Escape special SQL LIKE characters
  return pattern
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

/**
 * Validate and sanitize domain name
 */
export function sanitizeDomain(domain: string): string {
  // Remove protocol and path
  domain = domain.replace(/^https?:\/\//, '')
  domain = domain.split('/')[0]
  domain = domain.split('?')[0]
  domain = domain.split('#')[0]
  
  // Remove port if present
  domain = domain.split(':')[0]
  
  // Convert to lowercase
  domain = domain.toLowerCase()
  
  // Remove www. prefix
  if (domain.startsWith('www.')) {
    domain = domain.substring(4)
  }
  
  // Validate domain format
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/
  
  if (!domainRegex.test(domain)) {
    throw new Error('Invalid domain format')
  }
  
  return domain
}

/**
 * Sanitize JSON to prevent prototype pollution
 */
export function sanitizeJson<T = any>(data: any): T {
  if (typeof data !== 'object' || data === null) {
    return data
  }
  
  // Remove dangerous properties
  const dangerous = ['__proto__', 'constructor', 'prototype']
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJson(item)) as T
  }
  
  const sanitized: any = {}
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key) && !dangerous.includes(key)) {
      sanitized[key] = sanitizeJson(data[key])
    }
  }
  
  return sanitized as T
}

/**
 * Validate and sanitize integer input
 */
export function sanitizeInteger(value: any, min?: number, max?: number): number {
  const num = parseInt(value, 10)
  
  if (isNaN(num)) {
    throw new Error('Invalid integer value')
  }
  
  if (min !== undefined && num < min) {
    return min
  }
  
  if (max !== undefined && num > max) {
    return max
  }
  
  return num
}

/**
 * Sanitize boolean input
 */
export function sanitizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    return lower === 'true' || lower === '1' || lower === 'yes'
  }
  
  return Boolean(value)
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path separators
  fileName = fileName.replace(/[\/\\]/g, '')
  
  // Remove dangerous characters
  fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  
  // Limit length
  if (fileName.length > 255) {
    const ext = fileName.split('.').pop()
    const name = fileName.substring(0, 255 - (ext ? ext.length + 1 : 0))
    fileName = ext ? `${name}.${ext}` : name
  }
  
  return fileName
}

/**
 * Comprehensive input sanitizer
 */
export function sanitizeInput(
  value: any,
  type: 'text' | 'email' | 'url' | 'username' | 'domain' | 'html' | 'integer' | 'boolean',
  options?: { maxLength?: number; min?: number; max?: number }
): any {
  switch (type) {
    case 'text':
      return sanitizeText(value, options?.maxLength)
    case 'email':
      return sanitizeEmail(value)
    case 'url':
      return sanitizeUrl(value)
    case 'username':
      return sanitizeUsername(value)
    case 'domain':
      return sanitizeDomain(value)
    case 'html':
      return escapeHtml(value)
    case 'integer':
      return sanitizeInteger(value, options?.min, options?.max)
    case 'boolean':
      return sanitizeBoolean(value)
    default:
      return value
  }
}
