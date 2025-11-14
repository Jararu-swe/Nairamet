# 🚀 Vercel Production Deployment Guide

## Complete Setup for https://nairamet.com

### 1️⃣ Environment Variables for Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production**:

```env
# Base URLs
NEXT_PUBLIC_BASE_URL=https://nairamet.com
NEXT_PUBLIC_APP_URL=https://nairamet.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fgppwdgqpzwrkmahfzql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncHB3ZGdxcHp3cmttYWhmenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDcxNDQsImV4cCI6MjA3MjgyMzE0NH0.tplnI2VAVFARyEBKjPWr3BUm2obnuq1JsRQKh_V8-hw
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase

# NextAuth
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://nairamet.com
DATABASE_URL=your_database_connection_string

# OneSignal (Optional)
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key

# Resend Email (Optional)
RESEND_API_KEY=your_resend_api_key

# Currency API (Optional)
CURRENCYLAYER_API_KEY=your_currencylayer_api_key
```

### For **Development** environment:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
# ... rest same as production
```

---

## 2️⃣ Supabase Configuration

### A. Add Redirect URLs

Go to **Supabase Dashboard → Authentication → URL Configuration**

Add these **Redirect URLs**:

```
http://localhost:3000/api/auth/callback
https://nairamet.com/api/auth/callback
https://www.nairamet.com/api/auth/callback
https://nairamet.vercel.app/api/auth/callback
```

### B. Add Site URLs

In **Site URL** field:
```
https://nairamet.com
```

### C. Database Tables

Run these SQL commands in **Supabase SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  target_rate DECIMAL NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments table (for blog)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Likes table (for blog)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_likes_article_id ON likes(article_id);
```

---

## 3️⃣ Vercel Deployment

### Option A: Automatic (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Production ready with Supabase OAuth"
git push origin main
```

2. Vercel will auto-deploy (if connected to GitHub)

### Option B: Manual via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 4️⃣ Custom Domain Setup

### In Vercel:

1. Go to **Project Settings → Domains**
2. Add domain: `nairamet.com`
3. Add domain: `www.nairamet.com`

### In Your DNS Provider:

Add these records:

**For nairamet.com:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.nairamet.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 5️⃣ Verify Cron Jobs

The `vercel.json` file enables automatic article scraping:

```json
{
  "crons": [
    {
      "path": "/api/scrape",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule**: Every 6 hours (12am, 6am, 12pm, 6pm UTC)

**Check logs**: Vercel Dashboard → Deployments → Functions

---

## 6️⃣ Post-Deployment Testing

### Test Authentication Flow:

1. Visit https://nairamet.com
2. Click "Sign In"
3. Create account
4. Verify redirect works
5. Check Supabase Dashboard → Authentication → Users

### Test Protected Routes:

- `/tracker` - Should require auth
- `/alerts` - Should work
- `/charts` - Should work
- `/blog` - Should work

### Test Scraping:

Manual trigger:
```
https://nairamet.com/api/scrape
```

Or use the "Refresh Articles" button on blog page.

### Test Performance:

```bash
npx lighthouse https://nairamet.com --view
```

**Expected:**
- Performance: 90-100
- LCP: <2.5s ✅
- INP: <200ms ✅
- CLS: <0.1 ✅

---

## 7️⃣ Monitoring

### Vercel Dashboard:

- **Analytics**: Real user metrics
- **Logs**: Function execution logs
- **Deployments**: Build history

### Supabase Dashboard:

- **Auth**: User signups/logins
- **Database**: Query performance
- **API**: Usage statistics

---

## 🔧 Troubleshooting

### Issue: OAuth Redirect Not Working

**Solution:**
1. Check `NEXT_PUBLIC_BASE_URL` matches your domain
2. Verify redirect URL in Supabase matches exactly
3. Clear browser cache and cookies

### Issue: "Missing Supabase URL"

**Solution:**
1. Verify environment variables in Vercel
2. Redeploy after adding variables
3. Check variable names match exactly

### Issue: Cron Not Running

**Solution:**
1. Ensure `vercel.json` is in root directory
2. Check function logs for errors
3. Manually trigger `/api/scrape` to test

### Issue: Database Connection Failed

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase connection pooler settings
3. Ensure database tables exist

---

## 📋 Quick Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Database tables created
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Verify cron jobs working
- [ ] Run Lighthouse performance test
- [ ] Monitor logs for first hour

---

## 🎉 Success!

Your site is now live at:
- https://nairamet.com
- https://www.nairamet.com

**Features enabled:**
- ✅ Authentication with Supabase
- ✅ Protected routes
- ✅ Automatic article scraping (every 6 hours)
- ✅ Manual refresh button
- ✅ All Core Web Vitals optimized
- ✅ Custom domain with SSL

**Monitor for 24 hours and enjoy!** 🚀
