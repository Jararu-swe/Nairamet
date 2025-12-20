# Article Scraping on Vercel - Setup Guide

## Overview

Your article scraping is now configured to work on Vercel using:

- **Vercel KV** for persistent article storage across deployments
- **Vercel Cron Jobs** to automatically scrape articles daily
- **Fallback to local files** for local development

## Setup Steps

### 1. Install Vercel KV Package

```bash
npm install @vercel/kv
```

### 2. Create Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** → **Storage** → **Create Database**
3. Select **KV** and create in your preferred region
4. Click **Continue**
5. Connect to your project (it will auto-populate environment variables)

### 3. Add Environment Variables

After creating KV, Vercel automatically adds these to your project:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

You'll also need to set:

- `CRON_SECRET` - A secure random string for cron job authentication

Add it in Vercel dashboard:

```
Settings → Environment Variables → Add
Name: CRON_SECRET
Value: [generate a random secure string, e.g., using `openssl rand -base64 32`]
```

### 4. Verify Configuration

In Vercel KV dashboard, you should see:

```
✓ KV_URL=redis://...
✓ KV_REST_API_URL=https://...
✓ KV_REST_API_TOKEN=...
```

## How It Works

### Cron Job Schedule

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-update",
      "schedule": "0 6 * * *"
    }
  ]
}
```

- Runs at **6 AM UTC** every day
- Calls `/api/scrape` to fetch articles
- Saves them to Vercel KV automatically

### Article Flow

1. **Cron triggers** → `/api/cron/daily-update`
2. **Cron calls** → `/api/scrape`
3. **Scrape fetches articles** from RSS feeds
4. **Articles saved to**:
   - Vercel KV (production)
   - `data/scraped.json` (local development)
5. **Blog reads from**:
   - Vercel KV first (via `getArticlesAsync()`)
   - Local files as fallback (via `getArticles()`)

## Local Development

### Run Locally with Local Files

```bash
npm run dev
```

Articles will be read from `data/scraped.json` if available.

### Manually Fetch Articles

```bash
npm run fetch-articles
```

Or visit: `http://localhost:3000/api/admin/fetch-articles`

### Test Cron Route Locally

```bash
# Set CRON_SECRET locally
export CRON_SECRET="your-test-secret"

# Call the cron endpoint
curl -H "Authorization: Bearer your-test-secret" \
  http://localhost:3000/api/cron/daily-update
```

## Production Deployment

### 1. Deploy to Vercel

```bash
git push origin main
```

### 2. Verify Cron is Active

- Go to **Vercel Dashboard** → **Project** → **Cron Jobs**
- You should see `/api/cron/daily-update` scheduled
- Check **Cron Invocations** tab for execution history

### 3. Monitor Articles

- **First run**: Cron will fetch articles within 1 hour of deployment
- **Check KV**: Go to Vercel Storage → KV → View data
- **View articles**: Navigate to `/blog` to see live articles

### 4. Manual Trigger (if needed)

If you need to manually scrape before the cron runs:

```bash
curl -X GET "https://your-deployed-url.vercel.app/api/scrape"
```

## Troubleshooting

### Articles not showing on Vercel

1. **Check KV is connected**:

   - Vercel Dashboard → Storage → KV
   - Verify environment variables are set

2. **Check cron execution**:

   - Vercel Dashboard → Project → Cron Jobs
   - Look for recent invocations in logs

3. **Manual test**:

   ```bash
   curl -X GET "https://your-url.vercel.app/api/scrape"
   # Should return JSON with articles
   ```

4. **Check for errors**:
   - Vercel Dashboard → Project → Deployments → Logs
   - Look for `/api/scrape` errors

### Local development not showing articles

1. **Run fetch-articles**:

   ```bash
   npm run fetch-articles
   ```

2. **Verify file exists**:

   ```bash
   ls -la data/scraped.json
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

## Code References

### Key Files

- **[lib/kv.ts](../lib/kv.ts)** - KV storage functions
- **[lib/blog.ts](../lib/blog.ts)** - `getArticlesAsync()` for KV support
- **[app/api/scrape/route.ts](../app/api/scrape/route.ts)** - Saves to KV
- **[app/api/cron/daily-update/route.ts](../app/api/cron/daily-update/route.ts)** - Cron job

### Use getArticlesAsync() in Server Components

```typescript
// Use in async server components or API routes
import { getArticlesAsync } from "@/lib/blog";

export default async function BlogPage() {
  const articles = await getArticlesAsync();
  return <div>{/* render articles */}</div>;
}
```

### Use getArticles() for SSG

```typescript
// Use in getStaticProps or static generation
import { getArticles } from "@/lib/blog";

const articles = getArticles(); // Synchronous, uses local files
```

## Performance Tips

1. **KV is cached for 6 hours** - Set in `lib/kv.ts`
2. **Cron runs daily** - Adjust schedule in `vercel.json` if needed
3. **Articles are sorted by date** - Most recent first
4. **Local development** uses files for instant feedback

## Additional Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [RSS Feed Sources](./ARTICLE_SCRAPING_GUIDE.md)

---

**Need help?** Check the logs in your Vercel Dashboard or contact support.
