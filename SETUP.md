# 🚀 Parastar Setup Guide

Follow these steps **in order** to get Parastar running.

## Prerequisites

Before you start, make sure you have:
- Node.js 18 or newer installed
- A GitHub account
- A Supabase account (free tier is fine)

---

## Step 1: Clone and Install

```bash
git clone https://github.com/masterofmagic999/parastar.git
cd parastar
npm install
```

---

## Step 2: Set Up Supabase (REQUIRED)

### 2.1 Create a Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** parastar (or whatever you want)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
6. Click "Create new project"
7. Wait 2-3 minutes for project to initialize

### 2.2 Run the Database Migration

**This creates all the tables needed for the app.**

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this repo
4. **Copy the entire contents** and paste into the Supabase SQL Editor
5. Click **"Run"** (bottom right)
6. You should see "Success. No rows returned"

This creates 6 tables:
- `bookmarks` - Your saved websites
- `stored_cookies` - Browser cookies
- `saved_logins` - Encrypted login credentials
- `history` - Browsing history
- `tab_sessions` - Open tabs for restoration
- `user_preferences` - Your settings

### 2.3 Get Your Supabase Keys

**You need TWO keys:**

1. In Supabase dashboard, click **"Project Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon/public key** - Copy this (under "Project API keys")
   - **service_role key** - Click "Reveal" and copy this

**⚠️ IMPORTANT:** Keep the service_role key secret! Never commit it to GitHub.

---

## Step 3: Configure Environment Variables

1. In the parastar folder, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your editor

3. Replace these values with YOUR Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

4. Generate a random 32-character encryption key:
   ```bash
   # On Mac/Linux:
   openssl rand -base64 32
   
   # Or just use any random 32-character string
   ```
   
5. Add it to `.env.local`:
   ```env
   ENCRYPTION_KEY=your-generated-key-here
   ```

6. Save the file

---

## Step 4: Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

You should see the Parastar landing page!

---

## Step 5: Test It Works

### Test Authentication

1. Click **"Create Account"**
2. Fill in your details
3. Click "Create Account"
4. **Check your email** for verification link
5. Click the verification link
6. Sign in with your credentials

If authentication doesn't work yet, that's expected - it needs to be wired up in the code.

### Test the UI

Navigate through:
- `/login` - Login page
- `/register` - Registration page  
- `/browser` - Browser interface
- `/bookmarks` - Bookmarks manager
- `/settings` - Settings panel

All pages should load without errors.

---

## Step 6: Deploy to Vercel (Optional)

1. Push your code to GitHub (if not already)
2. Go to https://vercel.com
3. Click "New Project"
4. Import your parastar repository
5. Vercel will auto-detect Next.js
6. Add environment variables:
   - Click "Environment Variables"
   - Add all 3 variables from your `.env.local`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ENCRYPTION_KEY`
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app is live!

---

## Troubleshooting

### "Failed to fetch" errors

**Problem:** Can't connect to Supabase

**Solution:**
1. Check your `.env.local` file
2. Make sure the keys are correct
3. Restart the dev server (`Ctrl+C` then `npm run dev`)

### Build fails

**Problem:** `npm run build` shows errors

**Solution:**
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Try again: `npm run build`

### Database errors

**Problem:** "relation does not exist" or similar

**Solution:**
1. Go to Supabase SQL Editor
2. Run the migration again (Step 2.2)
3. Check if tables exist: Go to "Table Editor" in Supabase

### Authentication not working

**Problem:** Login/register buttons do nothing

**This is expected!** The authentication forms are built but not yet connected to Supabase. This is part of Phase 2 implementation (see PROJECT_STATUS.md).

---

## What Works Now

✅ All pages load and look correct
✅ UI is fully functional
✅ Database schema is set up
✅ App builds successfully
✅ Ready for backend integration

## What Needs Implementation

⏳ Connecting authentication forms to Supabase
⏳ Saving bookmarks to database
⏳ Cookie persistence
⏳ History tracking
⏳ Settings synchronization
⏳ Enhanced proxy functionality

See `PROJECT_STATUS.md` for detailed implementation status.

---

## Need Help?

1. Check `PROJECT_STATUS.md` for what's implemented
2. Read `README.md` for technical details
3. Open an issue on GitHub
4. Check Supabase docs: https://supabase.com/docs

---

## Next Steps for Development

If you want to continue building this project:

1. **Wire up authentication** - Connect login/register forms to Supabase Auth
2. **Connect bookmarks** - Make bookmarks save to database
3. **Enhance proxy** - Improve proxy API for better website compatibility
4. **Add encryption** - Implement password encryption for saved logins
5. **Test on sites** - Try proxying Reddit, Discord, YouTube

See the "Remaining Work" section in the PR description for the full roadmap.
