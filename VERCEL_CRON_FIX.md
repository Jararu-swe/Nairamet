# ✅ Vercel Cron Job Fixed - Hobby Plan Compatible

## Problem
- Vercel Hobby plan allows **only 1 cron job**
- You had **2 cron jobs** configured (daily-update + scrape-articles)
- This caused errors

## Solution
Created a **single consolidated cron job** that does everything:

### New Cron Job: `/api/cron/daily-tasks`
Runs **once per day at 6 AM UTC**

**Tasks performed:**
1. ✅ Refresh currency rates (forces CurrencyLayer API call)
2. ✅ Scrape latest articles from news feeds
3. ✅ Clear old caches

---

## What Changed

### 1. Created New Endpoint
- **File**: `app/api/cron/daily-tasks/route.ts`
- **Schedule**: Daily at 6 AM UTC
- **Tasks**: All maintenance tasks in one job

### 2. Updated `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-tasks",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### 3. Added Security (Optional)
- Added `CRON_SECRET` environment variable
- Prevents unauthorized access to cron endpoint

---

## Deployment Steps

### 1. Deploy the Changes
```bash
git add -A
git commit -m "Fix: Consolidate cron jobs for Vercel Hobby plan"
git push
```

### 2. Add Environment Variable in Vercel (Optional but Recommended)
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add:
```
CRON_SECRET=your_random_secret_here_12345
```

Generate a random secret:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string
```

### 3. Verify Cron Job
After deployment:
1. Go to **Vercel Dashboard → Your Project → Cron Jobs**
2. You should see **1 cron job**: `daily-tasks`
3. Schedule: **0 6 * * *** (Daily at 6 AM UTC)

---

## Cron Schedule Explained

```
0 6 * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**0 6 * * *** = Every day at 6:00 AM UTC

---

## Why 6 AM UTC?

- **Nigeria Time**: 7 AM WAT (UTC+1)
- **Before market opens**: Fresh rates for morning traders
- **Low traffic time**: Won't impact user experience
- **Once per day**: Stays within Hobby plan limits

---

## Manual Testing

You can manually trigger the cron job:

```bash
curl https://www.nairamet.com/api/cron/daily-tasks
```

Expected response:
```json
{
  "success": true,
  "message": "Completed 3/3 tasks",
  "timestamp": "2026-02-03T06:00:00.000Z",
  "tasks": [
    {
      "name": "Refresh Currency Rates",
      "success": true,
      "message": "Updated rates. Sample: USDNGN = 1650.5"
    },
    {
      "name": "Scrape Articles",
      "success": true,
      "message": "Scraped 25 articles"
    },
    {
      "name": "Clear Caches",
      "success": true,
      "message": "Cleared old caches"
    }
  ]
}
```

---

## Monitoring

### Check Cron Logs in Vercel:
1. Go to **Vercel Dashboard**
2. Click your project
3. Go to **Logs** tab
4. Filter by `/api/cron/daily-tasks`

### What to Look For:
- ✅ **Success**: All 3 tasks completed
- ⚠️ **Partial Success**: Some tasks failed (check logs)
- ❌ **Failure**: Cron didn't run (check schedule)

---

## Troubleshooting

### Cron Not Running?
1. Check Vercel Dashboard → Cron Jobs
2. Verify schedule is correct
3. Check deployment logs

### Tasks Failing?
1. Check environment variables are set
2. Verify API keys are valid
3. Check logs for specific errors

### Unauthorized Error?
- Add `CRON_SECRET` to Vercel environment variables
- Or remove the auth check from the code

---

## Benefits of This Setup

✅ **Hobby Plan Compatible**: Only 1 cron job
✅ **Efficient**: All tasks in one execution
✅ **Reliable**: Runs daily at consistent time
✅ **Monitored**: Detailed logging of each task
✅ **Secure**: Optional secret protection
✅ **Cost-Effective**: Stays within free tier limits

---

## Summary

Your cron job is now:
- ✅ **Fixed** for Vercel Hobby plan
- ✅ **Consolidated** into single daily task
- ✅ **Optimized** for your use case
- ✅ **Ready to deploy**

**Just push and you're done!** 🚀
