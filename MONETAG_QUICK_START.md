# Monetag Quick Start Guide

## 🚀 Get Your Ads Running in 5 Steps

### Step 1: Sign Up (5 minutes)
1. Go to **[monetag.com](https://monetag.com)**
2. Click **"Sign Up"** → Choose **"Publisher"**
3. Enter your email and create password
4. Verify your email

### Step 2: Add Your Website (2 minutes)
1. In Monetag dashboard, click **"Websites"**
2. Click **"Add Website"**
3. Enter: `nairamet.com`
4. Select category: **Finance**
5. Wait for approval (usually instant)

### Step 3: Create Ad Zones (10 minutes)
Create 6 ad zones with these settings:

| Zone Name | Type | Size | Variable Name |
|-----------|------|------|---------------|
| Top Banner | Banner | 728x90 | `NEXT_PUBLIC_MONETAG_TOP_BANNER` |
| Sidebar | Native Banner | 300x250 | `NEXT_PUBLIC_MONETAG_SIDEBAR` |
| In Content | Native Banner | Responsive | `NEXT_PUBLIC_MONETAG_IN_CONTENT` |
| Bottom Banner | Banner | 728x90 | `NEXT_PUBLIC_MONETAG_BOTTOM_BANNER` |
| In Feed | Native Banner | Responsive | `NEXT_PUBLIC_MONETAG_IN_FEED` |
| Sidebar Card | Native Banner | 300x250 | `NEXT_PUBLIC_MONETAG_SIDEBAR_CARD` |

**Copy each Zone ID** - you'll need them next!

### Step 4: Update Environment Variables (3 minutes)

Open `.env.local` and replace the placeholders:

```bash
NEXT_PUBLIC_MONETAG_SITE_KEY=1234567  # From Monetag → Websites → Site Key
NEXT_PUBLIC_MONETAG_DOMAIN=alwingulla.com  # Usually this, check dashboard
NEXT_PUBLIC_MONETAG_TOP_BANNER=8901234  # Zone ID from step 3
NEXT_PUBLIC_MONETAG_SIDEBAR=8901235
NEXT_PUBLIC_MONETAG_IN_CONTENT=8901236
NEXT_PUBLIC_MONETAG_BOTTOM_BANNER=8901237
NEXT_PUBLIC_MONETAG_IN_FEED=8901238
NEXT_PUBLIC_MONETAG_SIDEBAR_CARD=8901239
```

**Also update in Vercel:**
1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Add all 8 variables above
4. Remove old `NEXT_PUBLIC_ADSENSE_CLIENT_ID`

### Step 5: Deploy (2 minutes)

```bash
git add -A
git commit -m "Add Monetag configuration"
git push
```

Vercel will auto-deploy. Ads should appear within 5-10 minutes!

---

## ✅ Verification

### Check if it's working:
1. Visit your deployed site
2. Open browser console (F12)
3. Look for Monetag scripts loading
4. Check Monetag dashboard → Statistics for impressions

### Troubleshooting:
- **No ads?** Wait 10 minutes, clear cache, check zone IDs
- **Console errors?** Verify environment variables in Vercel
- **Still nothing?** Check Monetag dashboard for approval status

---

## 💰 Payment Setup

1. Go to Monetag dashboard → **"Payment Settings"**
2. Choose payment method: **PayPal** (easiest)
3. Enter your PayPal email
4. Set minimum payout: **$5** (recommended)
5. Choose payment frequency: **Weekly** or **Monthly**

---

## 📊 Monitor Performance

Check your Monetag dashboard daily:
- **Impressions** - How many times ads were shown
- **Clicks** - How many times ads were clicked
- **CPM** - Cost per 1000 impressions
- **Earnings** - Your revenue

---

## 🎯 Optimize Earnings

Try these ad formats for better revenue:
1. **Popunders** - High CPM, opens in background
2. **Push Notifications** - Browser notifications
3. **Direct Links** - Monetize text links

Enable them in: Monetag Dashboard → Ad Zones → Create New Zone

---

## Need Help?

- **Full Guide**: See `MONETAG_SETUP.md`
- **Migration Details**: See `MONETAG_MIGRATION_SUMMARY.md`
- **Monetag Support**: support@monetag.com

---

**That's it! You're ready to earn with Monetag! 🚀**
