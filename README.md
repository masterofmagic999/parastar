# Parastar

Superfast web proxy with military-grade privacy and seamless browsing experience.

## What is This?

Parastar lets you browse any website through a secure proxy layer while maintaining your privacy. Think of it as your personal gateway to the web, with built-in account management, bookmark syncing, cookie persistence, encrypted password storage, and automatic tab restoration.

## 🚀 Quick Start

**⚠️ IMPORTANT:** Before running the app, you MUST set up Supabase.

### Follow the complete setup guide:

👉 **[SETUP.md](SETUP.md)** 👈

The setup guide walks you through:
1. Installing dependencies
2. Creating a Supabase project
3. Running the database migration
4. Getting your API keys
5. Configuring environment variables
6. Running the app
7. Deploying to Vercel

**Don't skip the Supabase setup!** The app needs a database to function.

## ✨ Features

### 🔐 Security & Privacy
- **AES-256 Encryption** - Saved passwords encrypted with military-grade encryption
- **Master Password** - Client-side encryption, never stored on servers
- **CSRF Protection** - Prevent cross-site request forgery attacks
- **Rate Limiting** - Protect against abuse and brute force
- **CSP Headers** - Content Security Policy prevents XSS attacks
- **Input Sanitization** - All user input is validated and sanitized
- **Row Level Security** - Database access controlled at user level

### 🌐 Browsing Features
- **Multi-Tab Interface** - Open and manage multiple websites simultaneously
- **Tab Restoration** - Automatically saves and restores your tabs
- **History Tracking** - Track visited URLs with timestamps and visit counts
- **Bookmark Management** - Save and organize favorite websites
- **Cookie Persistence** - Save and restore cookies across sessions
- **Service Worker Proxy** - Scramjet-based proxy for seamless browsing

### 💾 Data Management
- **Saved Logins** - Securely store website credentials with AES-256 encryption
- **Auto-Save Tabs** - Tabs saved every 30 seconds and on page unload
- **Search History** - Find previously visited pages
- **Cookie Manager** - View, manage, and delete cookies by domain
- **Settings Persistence** - All preferences saved to database

### 🎨 User Experience
- **Modern UI** - Glassmorphism design with smooth animations
- **Dark Theme** - Eye-friendly interface
- **Responsive Design** - Works on desktop and mobile
- **Loading States** - Clear feedback for all operations
- **Error Handling** - Graceful error messages

## How It Works

**Homepage** → Enter any URL or search term  
**Browser** → Multi-tab interface loads sites through proxy  
**Auth** → Sign up to save bookmarks, history, and settings  
**Persistence** → Everything syncs to your Supabase account  
**Encryption** → Passwords encrypted client-side before storage

## Architecture

```
Landing Page (/)
  ↓ user enters URL
Browser Interface (/browser)
  ↓ requests proxy
Service Worker + API Route
  ↓ fetches & rewrites
Target Website
  ↓ saves data
Supabase Database (encrypted)
```

The proxy rewrites all URLs so navigation stays within the app. Sensitive data is encrypted client-side before storage.

## Database Setup

You need to run the SQL migration in your Supabase project:

1. Open Supabase dashboard
2. Go to SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql`
4. Tables created: 
   - `bookmarks` - Saved website bookmarks
   - `stored_cookies` - Persistent browser cookies
   - `saved_logins` - Encrypted login credentials
   - `history` - Browsing history
   - `tab_sessions` - Tab restoration data
   - `user_preferences` - User settings

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup instructions
- **[SECURITY.md](SECURITY.md)** - Security features and best practices
- **[CURRENT_STATUS.md](CURRENT_STATUS.md)** - Current implementation status
- **[REMAINING_WORK.md](REMAINING_WORK.md)** - What's left to build

## What's Built (55% Complete)

### ✅ Fully Functional
- ✅ User authentication (register, login, password reset)
- ✅ Protected routes with middleware
- ✅ Browser interface with multi-tab support
- ✅ Bookmark management (CRUD operations)
- ✅ History tracking with search
- ✅ Cookie management by domain
- ✅ Settings persistence
- ✅ Tab session restoration
- ✅ Saved logins with AES-256 encryption
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Rate limiting on API routes
- ✅ CSRF protection utilities
- ✅ Input sanitization
- ✅ Proxy with URL rewriting

### 🚧 In Progress
- ⏳ Proxy testing on major websites
- ⏳ Auto-fill functionality for saved logins
- ⏳ Password save prompt
- ⏳ Enhanced error handling

### 📋 Planned
- 📋 Mobile optimization
- 📋 UI/UX polish
- 📋 Comprehensive testing
- 📋 Performance optimization

## Tech Stack

- **Next.js 16** with App Router for modern React
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for auth and database
- **Framer Motion** for animations
- **Lucide React** for icons
- **Web Crypto API** for AES-256 encryption
- **Scramjet** for service worker proxy

## Security Features

### Encryption
```typescript
// Client-side AES-256-GCM encryption
import { encrypt, decrypt } from '@/lib/security/encryption'

const encrypted = await encrypt(password, masterPassword)
const decrypted = await decrypt(encrypted, masterPassword)
```

### Rate Limiting
```typescript
// Protect API routes from abuse
import { checkRateLimit, RateLimitPresets } from '@/lib/security/rate-limit'

const rateLimit = checkRateLimit(identifier, RateLimitPresets.API)
if (!rateLimit.allowed) {
  return new Response('Too many requests', { status: 429 })
}
```

### Input Sanitization
```typescript
// Clean and validate user input
import { sanitizeUrl, sanitizeEmail } from '@/lib/security/sanitize'

const safeUrl = sanitizeUrl(userInput)
const safeEmail = sanitizeEmail(emailInput)
```

## Deploy to Vercel

```bash
git push
```

Then import the repo in Vercel. The `vercel.json` has environment variables pre-configured.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

The app is fully TypeScript with strict mode enabled.

## File Organization

```
parastar/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (proxy)/             # Browser and settings pages
│   │   ├── browser/         # Multi-tab browser interface
│   │   ├── bookmarks/       # Bookmark manager
│   │   └── settings/        # Settings page
│   ├── api/                 # API routes
│   │   ├── proxy/           # Proxy endpoint
│   │   └── bare/            # Bare server endpoint
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── lib/
│   ├── auth/                # Authentication utilities
│   ├── data/                # Data managers (bookmarks, history, etc.)
│   │   ├── bookmarks.ts     # Bookmark CRUD
│   │   ├── cookies.ts       # Cookie manager
│   │   ├── history.ts       # History tracker
│   │   ├── saved-logins.ts  # Encrypted login storage
│   │   ├── settings.ts      # Settings manager
│   │   └── tab-sessions.ts  # Tab restoration
│   ├── proxy/               # Proxy configuration
│   └── security/            # Security utilities
│       ├── encryption.ts    # AES-256 encryption
│       ├── csrf.ts          # CSRF protection
│       ├── rate-limit.ts    # Rate limiting
│       ├── csp.ts           # Content Security Policy
│       └── sanitize.ts      # Input sanitization
├── supabase/
│   └── migrations/          # Database schema
└── public/
    └── scramjet/            # Proxy service worker
```

## Notes

This is an educational project demonstrating:
- Full-stack web development with Next.js
- Secure authentication and authorization
- Client-side encryption for sensitive data
- Modern proxy techniques
- Security best practices (CSP, rate limiting, sanitization)
- Database design with Row Level Security

Use responsibly and respect website terms of service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Educational use only. See LICENSE for details.

## Support

- 📖 Read the documentation in `/docs`
- 🐛 Report issues on GitHub
- 💬 Join discussions
- 📧 Contact: [support email]

---

Built with ❤️ using Next.js, TypeScript, and Supabase
