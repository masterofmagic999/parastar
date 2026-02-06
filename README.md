# Parastar

Superfast web proxy with military-grade privacy and seamless browsing experience.

## What is This?

Parastar lets you browse any website through a secure proxy layer while maintaining your privacy. Think of it as your personal gateway to the web, with built-in account management, bookmark syncing, and cookie persistence.

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

## How It Works

**Homepage** → Enter any URL or search term
**Browser** → Multi-tab interface loads sites through proxy
**Auth** → Sign up to save bookmarks, history, and settings
**Persistence** → Everything syncs to your Supabase account

## Architecture

```
Landing Page (/)
  ↓ user enters URL
Browser Interface (/browser)
  ↓ requests proxy
API Route (/api/proxy)
  ↓ fetches & rewrites
Target Website
```

The proxy rewrites all URLs so navigation stays within the app.

## Database Setup

You need to run the SQL migration in your Supabase project:

1. Open Supabase dashboard
2. Go to SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql`
4. Tables created: bookmarks, stored_cookies, saved_logins, history, tab_sessions, user_preferences

## What's Built

✓ Landing page with animated UI
✓ Login and registration forms
✓ Browser interface with tabs
✓ Proxy API that rewrites URLs
✓ Glassmorphism design system
✓ Responsive layout

## What's Next

The foundation is ready. These features need implementation:

- Connect Supabase auth to login/register pages
- Make proxy handle all content types properly
- Add cookie storage and restoration
- Build bookmark manager UI
- Implement saved logins with encryption
- Add history tracking
- Create settings panel
- Tab session restoration
- Bot detection evasion improvements

## Tech Choices

- **Next.js 14+** with App Router for modern React
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for auth and database
- **Framer Motion** for animations
- **Lucide** for icons

## Deploy to Vercel

```bash
git push
```

Then import the repo in Vercel. The `vercel.json` has environment variables pre-configured.

## Notes

This is an educational project demonstrating proxy techniques and full-stack web development. Use responsibly and respect website terms of service.

## File Organization

- `app/page.tsx` - Landing page
- `app/(auth)/` - Login and registration
- `app/(proxy)/browser/` - Main browser UI
- `app/api/proxy/` - Proxy endpoint
- `app/globals.css` - Custom theme
- `lib/` - Utilities (future)
- `components/` - Reusable UI (future)

## Development

Build: `npm run build`
Lint: `npm run lint`
Dev: `npm run dev`

The app is fully TypeScript with strict mode enabled.
