# ✅ Setup Checklist

Use this checklist to make sure you've completed all required setup steps.

## Before Running the App

- [ ] **Installed Node.js 18+**
- [ ] **Cloned the repository**
- [ ] **Ran `npm install`**

## Supabase Setup (REQUIRED)

- [ ] **Created Supabase account** at https://supabase.com
- [ ] **Created new Supabase project**
- [ ] **Ran database migration** in SQL Editor (`supabase/migrations/001_initial_schema.sql`)
- [ ] **Copied Project URL** from Supabase settings
- [ ] **Copied anon/public key** from Supabase API settings
- [ ] **Copied service_role key** from Supabase API settings

## Environment Configuration

- [ ] **Created `.env.local` file** (copied from `.env.example`)
- [ ] **Added NEXT_PUBLIC_SUPABASE_URL** to `.env.local`
- [ ] **Added NEXT_PUBLIC_SUPABASE_ANON_KEY** to `.env.local`
- [ ] **Added SUPABASE_SERVICE_ROLE_KEY** to `.env.local`
- [ ] **Generated and added ENCRYPTION_KEY** (32 random characters)

## Running the App

- [ ] **Ran `npm run dev`**
- [ ] **Opened http://localhost:3000**
- [ ] **Confirmed all pages load**

## Optional: Deploy to Vercel

- [ ] **Pushed code to GitHub**
- [ ] **Created Vercel account**
- [ ] **Imported repository to Vercel**
- [ ] **Added all environment variables** to Vercel project settings
- [ ] **Deployed successfully**

---

## If Something Doesn't Work

### Check these first:

1. **Did you run the database migration?**
   - Go to Supabase → SQL Editor
   - Paste and run `supabase/migrations/001_initial_schema.sql`

2. **Are your environment variables correct?**
   - Check `.env.local` exists
   - Verify all keys are from your Supabase project
   - Make sure there are no extra spaces

3. **Did you restart the dev server?**
   - After changing `.env.local`, you MUST restart
   - Press Ctrl+C, then run `npm run dev` again

4. **Still not working?**
   - Delete `.next` folder: `rm -rf .next`
   - Restart: `npm run dev`

---

**Need detailed instructions?** Read [SETUP.md](SETUP.md)

**Want to know what's implemented?** Read [PROJECT_STATUS.md](PROJECT_STATUS.md)

**Technical documentation?** Read [README.md](README.md)
