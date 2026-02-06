# Security Features Implementation Guide

## Overview

Parastar now includes comprehensive security features to protect users and the application from common web vulnerabilities. This document describes the security implementations and how to use them.

## 🔒 Security Features

### 1. AES-256 Encryption

**Location:** `lib/security/encryption.ts`

**Purpose:** Secure encryption for sensitive data like saved passwords.

**Features:**
- AES-256-GCM encryption algorithm
- PBKDF2 key derivation with 100,000 iterations
- Random salt and IV for each encryption
- Web Crypto API implementation (browser-native)

**Usage:**
```typescript
import { encrypt, decrypt } from '@/lib/security/encryption'

// Encrypt data
const masterPassword = 'user-master-password'
const encrypted = await encrypt('sensitive-data', masterPassword)

// Decrypt data
const decrypted = await decrypt(encrypted, masterPassword)
```

**Key Points:**
- Never store the master password in plain text
- Master password is never sent to the server
- Each user should have their own master password
- Encryption is done client-side

### 2. CSRF Protection

**Location:** `lib/security/csrf.ts`

**Purpose:** Prevent Cross-Site Request Forgery attacks.

**Features:**
- Token generation and validation
- Token expiration (1 hour by default)
- Session-based token storage
- Automatic cleanup of expired tokens

**Usage:**
```typescript
import { generateCSRFToken, validateCSRFToken } from '@/lib/security/csrf'

// Generate token (on page load)
const sessionId = 'user-session-id'
const token = generateCSRFToken(sessionId)

// Validate token (on form submission)
const isValid = validateCSRFToken(sessionId, token)
if (!isValid) {
  throw new Error('Invalid CSRF token')
}
```

**Best Practices:**
- Generate a new token for each user session
- Include token in forms as hidden input
- Validate token on all state-changing operations (POST, PUT, DELETE)
- Never expose tokens in URLs or GET parameters

### 3. Rate Limiting

**Location:** `lib/security/rate-limit.ts`

**Purpose:** Prevent abuse by limiting request frequency.

**Features:**
- Configurable rate limits
- Multiple presets (STRICT, STANDARD, RELAXED, AUTH, API)
- Per-user or per-IP limiting
- Automatic cleanup of expired entries

**Presets:**
- **STRICT:** 5 requests/minute
- **STANDARD:** 20 requests/minute  
- **RELAXED:** 100 requests/minute
- **AUTH:** 3 requests/15 minutes (for failed login attempts)
- **API:** 60 requests/minute

**Usage:**
```typescript
import { checkRateLimit, RateLimitPresets } from '@/lib/security/rate-limit'

// Check rate limit
const identifier = 'user-id-or-ip'
const result = checkRateLimit(identifier, RateLimitPresets.API)

if (!result.allowed) {
  return new Response('Too many requests', { 
    status: 429,
    headers: {
      'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
    }
  })
}
```

**API Route Example:**
```typescript
import { getRequestIdentifier } from '@/lib/security/rate-limit'

export async function POST(request: Request) {
  const identifier = getRequestIdentifier(request)
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.STANDARD)
  
  if (!rateLimit.allowed) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // Process request...
}
```

### 4. Content Security Policy (CSP)

**Location:** `lib/security/csp.ts`

**Purpose:** Prevent XSS, clickjacking, and code injection attacks.

**Features:**
- Separate configurations for development and production
- Strict directives for script, style, and resource loading
- Support for Supabase integration
- Additional security headers (X-Frame-Options, HSTS, etc.)

**Configuration:**
The CSP is automatically applied via middleware to all routes.

**Directives:**
- `default-src 'self'` - Only load resources from same origin
- `script-src` - Restrict JavaScript sources
- `style-src` - Restrict CSS sources
- `img-src` - Restrict image sources
- `connect-src` - Restrict AJAX/WebSocket connections
- `frame-ancestors 'none'` - Prevent clickjacking

**Additional Headers:**
- `X-Frame-Options: DENY` - Prevent iframe embedding
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filter
- `Strict-Transport-Security` - Force HTTPS
- `Permissions-Policy` - Restrict browser features

### 5. Input Sanitization

**Location:** `lib/security/sanitize.ts`

**Purpose:** Clean and validate user input to prevent injection attacks.

**Functions:**

#### escapeHtml
Escape HTML special characters to prevent XSS.
```typescript
import { escapeHtml } from '@/lib/security/sanitize'
const safe = escapeHtml('<script>alert("xss")</script>')
// Output: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
```

#### sanitizeUrl
Prevent javascript: and data: protocol attacks.
```typescript
import { sanitizeUrl } from '@/lib/security/sanitize'
const safe = sanitizeUrl('javascript:alert(1)') // Returns 'about:blank'
```

#### sanitizeEmail
Validate and normalize email addresses.
```typescript
import { sanitizeEmail } from '@/lib/security/sanitize'
const email = sanitizeEmail(' USER@EXAMPLE.COM ') // Returns 'user@example.com'
```

#### sanitizeDomain
Extract and validate domain names.
```typescript
import { sanitizeDomain } from '@/lib/security/sanitize'
const domain = sanitizeDomain('https://www.example.com:8080/path')
// Returns 'example.com'
```

#### sanitizeText
Remove control characters and limit length.
```typescript
import { sanitizeText } from '@/lib/security/sanitize'
const clean = sanitizeText(userInput, 1000) // Max 1000 characters
```

#### sanitizeJson
Prevent prototype pollution attacks.
```typescript
import { sanitizeJson } from '@/lib/security/sanitize'
const safe = sanitizeJson(userJson) // Removes __proto__, constructor, etc.
```

**Best Practices:**
- Always sanitize user input before storing or displaying
- Use appropriate sanitization for each data type
- Sanitize on both client and server side
- Never trust client-side sanitization alone

## 🔐 Saved Logins Feature

**Location:** `lib/data/saved-logins.ts`

**Purpose:** Securely store and manage website login credentials.

**Features:**
- AES-256 encryption for passwords
- Per-domain credential storage
- Last used timestamp tracking
- Automatic updates for existing credentials

**Usage:**
```typescript
import SavedLoginsManager from '@/lib/data/saved-logins'

// Save a login
await SavedLoginsManager.saveLogin(
  userId,
  'example.com',
  'username@email.com',
  'password123',
  masterPassword
)

// Get logins for a domain
const logins = await SavedLoginsManager.getLoginsForDomain(userId, 'example.com')

// Get decrypted password
const login = await SavedLoginsManager.getDecryptedLogin(loginId, userId, masterPassword)

// Delete a login
await SavedLoginsManager.deleteLogin(loginId, userId)
```

## 📑 Tab Session Restoration

**Location:** `lib/data/tab-sessions.ts`

**Purpose:** Save and restore browser tabs across sessions.

**Features:**
- Automatic tab saving every 30 seconds
- Tab order preservation
- Active tab tracking
- Session cleanup (keeps last 5 sessions)

**Usage:**
```typescript
import TabSessionManager from '@/lib/data/tab-sessions'

// Save tabs
const tabs = [
  { url: 'https://example.com', title: 'Example', isActive: true },
  { url: 'https://google.com', title: 'Google', isActive: false }
]
const sessionId = await TabSessionManager.saveTabs(userId, tabs)

// Restore latest session
const savedTabs = await TabSessionManager.getLatestSession(userId)

// Clean up old sessions
await TabSessionManager.cleanupOldSessions(userId, 5)
```

**Browser Integration:**
The browser page (`app/(proxy)/browser/page.tsx`) automatically:
- Loads saved tabs on mount
- Saves tabs every 30 seconds
- Saves tabs on page unload
- Preserves tab order and active state

## 🛡️ Security Best Practices

### For Developers

1. **Always validate input:**
   - Use sanitization functions for all user input
   - Validate on both client and server
   - Never trust client-side validation alone

2. **Apply rate limiting:**
   - Use appropriate presets for different endpoints
   - Use stricter limits for authentication endpoints
   - Monitor and adjust limits based on usage

3. **Use CSRF protection:**
   - Generate tokens for all forms
   - Validate tokens on state-changing operations
   - Regenerate tokens after successful operations

4. **Encrypt sensitive data:**
   - Use AES-256 for passwords and credentials
   - Never store encryption keys in code
   - Use different keys per user

5. **Apply CSP headers:**
   - Keep CSP directives as strict as possible
   - Review and update CSP regularly
   - Test thoroughly after CSP changes

### For Users

1. **Master Password:**
   - Use a strong, unique master password
   - Never share your master password
   - Change it periodically

2. **Session Security:**
   - Log out when leaving the browser
   - Clear cookies regularly
   - Use "Clear on Exit" feature for sensitive browsing

3. **Saved Logins:**
   - Only save credentials on trusted devices
   - Review saved logins periodically
   - Delete unused credentials

## 🔍 Security Monitoring

### Rate Limit Monitoring
```typescript
import { getRateLimitStatus } from '@/lib/security/rate-limit'

const status = getRateLimitStatus(identifier, RateLimitPresets.API)
console.log(`Requests: ${status.count}, Remaining: ${status.remaining}`)
```

### CSRF Token Status
```typescript
import { validateCSRFToken } from '@/lib/security/csrf'

const isValid = validateCSRFToken(sessionId, token)
console.log(`Token valid: ${isValid}`)
```

## 🚨 Security Incident Response

If a security vulnerability is discovered:

1. **Immediate Actions:**
   - Document the vulnerability
   - Assess the impact
   - Implement a fix
   - Test thoroughly

2. **User Notification:**
   - Notify affected users
   - Provide guidance for remediation
   - Update security documentation

3. **Prevention:**
   - Review security practices
   - Update security policies
   - Conduct security audit
   - Implement additional safeguards

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSRF Protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## 🔄 Updates and Maintenance

Security features should be reviewed and updated regularly:

- **Weekly:** Review rate limit logs
- **Monthly:** Update dependencies for security patches
- **Quarterly:** Security audit and penetration testing
- **Annually:** Full security review and policy updates
