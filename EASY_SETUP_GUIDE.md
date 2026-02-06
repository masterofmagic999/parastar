# 🚀 Parastar - Complete Setup Guide for Non-Technical Users

> **Super simple guide to get your own fast web proxy running in under 10 minutes!**

No technical skills needed. Just follow along step by step. 🎉

---

## 📋 What You'll Get

- ⚡ **Super fast web proxy** (like DogeUB)
- 🌐 Browse any website anonymously
- 💾 Save bookmarks and history
- 🔐 Encrypted password storage
- 📱 Works on any device
- 🆓 **100% FREE forever**

---

## 🎯 Quick Start (3 Steps)

### Step 1: Get the Code (2 minutes)

1. **Go to this page** (you're probably already here!):
   ```
   https://github.com/masterofmagic999/parastar
   ```

2. **Click the green "Code" button** at the top

3. **Click "Download ZIP"**

4. **Unzip the file** on your computer

✅ Done! You now have the code.

---

### Step 2: Deploy to Vercel (5 minutes)

**What's Vercel?** It's a free hosting service that makes your proxy available on the internet!

1. **Go to Vercel.com**:
   ```
   https://vercel.com/signup
   ```

2. **Click "Continue with GitHub"**
   - Don't have GitHub? Click "Sign Up" first (it's free!)
   - Follow the simple steps to create an account

3. **After logging in, click "Add New..."** → **"Project"**

4. **Click "Import Git Repository"**

5. **Upload the code:**
   - Option A: Connect your GitHub (recommended)
   - Option B: Upload the ZIP file directly

6. **Click "Deploy"**
   - Vercel will automatically build and deploy your site
   - Wait 2-3 minutes for it to finish

7. **Get your URL:**
   - You'll see: `your-project-name.vercel.app`
   - **This is your personal proxy!** Save this link!

✅ Your proxy is now online!

---

### Step 3: Setup Database (3 minutes)

**What's this for?** Saves your bookmarks, history, and settings!

1. **Go to Supabase.com**:
   ```
   https://supabase.com/dashboard/sign-in
   ```

2. **Click "Start your project"** (it's free!)
   - Sign up with GitHub (easiest)

3. **Create a new project:**
   - Click "New project"
   - Name it anything (e.g., "parastar-db")
   - Choose a password (save it somewhere!)
   - Pick region closest to you
   - Click "Create new project"
   - Wait 2 minutes for setup

4. **Get your API keys:**
   - Click on your project
   - Click "Settings" in sidebar
   - Click "API"
   - You'll see two keys:
     - `URL`: Something like `https://xyz.supabase.co`
     - `anon public`: Starts with `eyJ...`
   - **Copy both** (we'll use them soon)

5. **Setup the database:**
   - Click "SQL Editor" in sidebar
   - Click "New query"
   - Open the file `supabase/migrations/001_initial_schema.sql` from your downloaded code
   - Copy ALL the text from that file
   - Paste it in the Supabase SQL Editor
   - Click "Run"
   - You should see "Success. No rows returned"

6. **Add keys to Vercel:**
   - Go back to Vercel.com
   - Click on your project
   - Click "Settings" → "Environment Variables"
   - Add these two variables:
     - Name: `NEXT_PUBLIC_SUPABASE_URL`
       Value: (paste your Supabase URL)
     - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
       Value: (paste your anon key)
   - Click "Save"
   - Click "Redeploy" to apply changes

✅ Database connected! Your bookmarks and history will now be saved!

---

## 🎉 You're Done!

### How to Use Your Proxy

1. **Open your Vercel URL** (e.g., `your-project.vercel.app`)

2. **Create an account:**
   - Click "Sign Up"
   - Enter email and password
   - You're logged in!

3. **Start browsing:**
   - Click "Browser" or enter a URL on the homepage
   - Try visiting: `reddit.com`, `youtube.com`, `discord.com`
   - Everything is proxied!

4. **Save bookmarks:**
   - Click the star icon in the browser
   - Your bookmarks sync across devices!

---

## ⚡ Speed Tips

### Make It Even Faster

1. **Use Chrome or Edge** (fastest browsers)
2. **Clear browser cache** if sites load slowly
3. **Try different sites** - some work better than others

### Troubleshooting

**Site won't load?**
- Try a different URL
- Refresh the page (F5)
- Check if the site works normally (not blocked)

**Slow loading?**
- The proxy is processing the site
- Wait a few seconds
- Public wisp servers can be busy

**Login not working?**
- Check your environment variables in Vercel
- Make sure you ran the SQL migration in Supabase
- Try logging out and back in

---

## 🆓 Costs

| Service | Free Tier | Your Cost |
|---------|-----------|-----------|
| Vercel | 100GB bandwidth/month | **$0** |
| Supabase | 500MB database, 2GB bandwidth | **$0** |
| Wisp Servers | Unlimited (public) | **$0** |
| **Total** | | **$0/month** |

**Your proxy costs $0 per month!** Perfect for personal use or small groups.

---

## 📱 Mobile Setup

Want to use on your phone?

1. Open your Vercel URL on mobile browser
2. Tap browser menu (⋮)
3. Select "Add to Home Screen"
4. Now it's an app icon!

Works on iPhone and Android!

---

## 🎨 Customization

### Change the Theme

1. Open `/app/globals.css`
2. Find the color variables
3. Change the values (e.g., `--primary: #00ffff;`)
4. Commit changes
5. Vercel auto-deploys!

### Add Your Logo

1. Replace `/public/logo.svg` with your image
2. Commit and push
3. Your logo appears!

---

## 🔒 Privacy & Security

### Is it safe?

✅ **Your data is encrypted**
- Passwords use AES-256 encryption
- Database has row-level security
- HTTPS everywhere

⚠️ **Remember:**
- Public wisp servers can see proxied traffic
- Don't use for banking or sensitive logins
- For maximum privacy, self-host wisp server (advanced)

---

## 🌟 What Makes This Better Than Others?

| Feature | Parastar | Other Proxies |
|---------|----------|---------------|
| Speed | ⚡ Wisp protocol | 🐌 HTTP only |
| UI | 🎨 Modern, tabbed | 📄 Basic |
| Accounts | ✅ Full auth system | ❌ None |
| Bookmarks | ✅ Cloud synced | ❌ Local only |
| History | ✅ Searchable | ❌ None |
| Cost | 🆓 Free | 💰 Often paid |
| Setup | ⏰ 10 minutes | ⏰ Hours |

---

## 🆘 Need Help?

### Common Questions

**Q: Can I customize it?**
A: Yes! It's 100% open source. Edit anything!

**Q: Can multiple people use it?**
A: Yes! Everyone creates their own account.

**Q: Will it be taken down?**
A: No, it's hosted on your own Vercel account!

**Q: Do I need to keep my computer on?**
A: No! It runs on Vercel's servers 24/7.

**Q: What if Vercel deletes my project?**
A: Very unlikely, but you can redeploy anytime with the code!

### Getting Help

1. **Check the troubleshooting section** above
2. **Read PROXY_SOLUTION.md** for technical details
3. **Open a GitHub issue** if something's broken
4. **Join Discord** (coming soon!) for community support

---

## 🚀 Advanced Features

Once you're comfortable, explore:

### Deploy Your Own Wisp Server

For maximum speed and privacy:

1. Use Cloudflare Workers (free tier)
2. See `/workers/bare-server/README.md`
3. Update config to use your server
4. Much faster!

### Add Custom Domains

Instead of `.vercel.app`:

1. Buy a domain ($10/year)
2. Connect in Vercel settings
3. Now it's `yourdomain.com`!

### GitHub Codespaces

Free development environment:

1. Open repo in Codespaces
2. Run `npm run dev`
3. Test changes before deploying!

---

## 📚 More Documentation

- **PROXY_SOLUTION.md** - How the proxy works
- **OPTIMIZATION_RESEARCH.md** - Speed technologies used
- **REMAINING_WORK.md** - Future features
- **SECURITY.md** - Security details

---

## 🎯 Quick Summary

1. **Download** the code (or fork on GitHub)
2. **Deploy** to Vercel (2 clicks)
3. **Setup** Supabase database (copy & paste SQL)
4. **Add** environment variables to Vercel
5. **Use** your proxy!

**Total time:** Less than 10 minutes  
**Total cost:** $0  
**Technical skill required:** None!

---

## ✨ Share Your Proxy

Love it? Share with friends!

⚠️ **Important:**
- Don't share publicly (keep URL private)
- Only share with trusted people
- Vercel has bandwidth limits (100GB/month free)
- For public use, upgrade to Vercel Pro ($20/month)

---

## 🙏 Credits

Built with:
- [Scramjet](https://github.com/MercuryWorkshop/scramjet) - Proxy engine
- [Wisp Protocol](https://github.com/MercuryWorkshop/wisp-protocol) - Fast transport
- [Next.js](https://nextjs.org) - Framework
- [Supabase](https://supabase.com) - Database
- [Vercel](https://vercel.com) - Hosting

Inspired by [DogeUB](https://github.com/DogeNetwork/dogeub)

---

## 🎊 Enjoy Your Proxy!

You now have a super fast, feature-rich web proxy that:
- ⚡ Loads sites instantly
- 💾 Saves your data
- 🔐 Keeps you private
- 🆓 Costs $0

**Start browsing anonymously now!** 🚀

---

*Made with ❤️ for the community*
