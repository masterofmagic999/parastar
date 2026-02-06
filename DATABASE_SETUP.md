# ⚠️ CRITICAL: Database Setup Required

## You Must Do This Now!

The authentication and bookmarks won't fully work until you set up the database tables.

### Steps (Takes 2 Minutes):

1. **Open Supabase Dashboard**
   - Go to: https://rrojsddygnumolbdxesu.supabase.co

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Run the Migration**
   - Open this file: `supabase/migrations/001_initial_schema.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" button (bottom right)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - bookmarks
     - stored_cookies
     - saved_logins
     - history
     - tab_sessions
     - user_preferences

### What This Does:
- Creates all database tables
- Sets up security policies (Row Level Security)
- Creates indexes for performance
- Auto-initializes user preferences

### If You Don't Do This:
- Bookmarks won't save permanently
- History won't be tracked
- Settings won't persist
- Cookies won't be stored

### After Setup:
You can test by:
1. Creating an account at http://localhost:3000/register
2. Adding a bookmark
3. Logging out and back in
4. Your bookmark should still be there!

---

**Current Status:** Database schema file exists but not applied to your Supabase instance.

**Action Required:** Run the SQL migration now!
