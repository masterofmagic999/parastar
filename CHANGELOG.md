# Changelog

All notable changes to Parastar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- **Saved Logins with AES-256 Encryption**
  - Implemented client-side AES-256-GCM encryption for password storage
  - Master password system for encrypting/decrypting credentials
  - SavedLoginsManager class for CRUD operations on encrypted logins
  - Full UI for managing saved logins in settings page
  - Per-domain credential storage
  - Last used timestamp tracking
  - Security information display in UI

- **Security Enhancements**
  - CSRF (Cross-Site Request Forgery) protection utilities
  - Rate limiting middleware with configurable presets
  - Content Security Policy (CSP) headers for all routes
  - Comprehensive input sanitization utilities
  - Security headers applied via middleware (X-Frame-Options, HSTS, etc.)
  - SECURITY.md documentation with best practices

- **Tab Session Restoration**
  - TabSessionManager class for saving and restoring browser tabs
  - Automatic tab saving every 30 seconds
  - Tab restoration on browser page load
  - Active tab and tab order preservation
  - Auto-save on page unload
  - Session cleanup (keeps last 5 sessions)

- **Security Utilities**
  - `lib/security/encryption.ts` - AES-256 encryption with Web Crypto API
  - `lib/security/csrf.ts` - CSRF token generation and validation
  - `lib/security/rate-limit.ts` - Rate limiting with multiple presets
  - `lib/security/csp.ts` - Content Security Policy configuration
  - `lib/security/sanitize.ts` - Input sanitization functions

- **Data Management**
  - `lib/data/saved-logins.ts` - Encrypted login management
  - `lib/data/tab-sessions.ts` - Tab restoration management

### Changed
- Updated middleware to apply security headers to all routes
- Enhanced settings page with functional saved logins UI
- Updated browser page with tab restoration integration
- Applied rate limiting to proxy API route
- Updated README with comprehensive feature documentation

### Security
- All passwords now encrypted with AES-256-GCM before storage
- Master password never stored or transmitted to servers
- PBKDF2 key derivation with 100,000 iterations
- Unique salt and IV for each encryption operation
- Rate limiting applied to prevent brute force attacks
- CSRF protection utilities ready for form integration
- CSP headers prevent XSS and injection attacks
- Input sanitization prevents SQL injection and XSS

## [0.1.0] - Initial Release

### Added
- Basic application structure with Next.js 16
- User authentication (register, login, password reset)
- Protected routes with middleware
- Multi-tab browser interface
- Bookmark management (CRUD operations)
- History tracking
- Cookie management
- Settings persistence
- Proxy with Scramjet service worker
- Glassmorphism UI design
- Supabase integration for auth and database

### Infrastructure
- Database schema with Row Level Security
- TypeScript strict mode
- Tailwind CSS styling
- Framer Motion animations
- Lucide React icons

---

## Development Milestones

### Phase 1: Foundation (Completed)
- ✅ Authentication system
- ✅ Database schema
- ✅ Basic UI components
- ✅ Proxy infrastructure

### Phase 2: Core Features (Completed)
- ✅ Bookmark management
- ✅ History tracking
- ✅ Cookie persistence
- ✅ Settings management
- ✅ Tab restoration
- ✅ Saved logins with encryption

### Phase 3: Security (Completed)
- ✅ AES-256 encryption
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ CSP headers
- ✅ Input sanitization

### Phase 4: Testing & Polish (In Progress)
- ⏳ Proxy testing on major websites
- ⏳ Auto-fill functionality
- ⏳ Password save prompts
- ⏳ Mobile optimization
- ⏳ UI/UX polish
- ⏳ Performance optimization

### Phase 5: Production Ready (Planned)
- 📋 Comprehensive testing
- 📋 Security audit
- 📋 Performance optimization
- 📋 Documentation updates
- 📋 Deployment guides

---

## Contributors

- masterofmagic999 - Initial work and continued development
- GitHub Copilot - Development assistance

## Notes

This project is under active development. Features are being added and tested regularly.
For the most up-to-date status, see [CURRENT_STATUS.md](CURRENT_STATUS.md).
