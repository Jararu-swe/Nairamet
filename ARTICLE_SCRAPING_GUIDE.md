# Article Scraping & Filtering Guide

## Overview
Your blog now has improved FX-focused article scraping with better keyword filtering to show only currency-related content.

## What Was Improved

### 1. **Better RSS Feed Sources**
Added FX-specific feeds in `scripts/fetch-articles.ts`:

**Nigerian Financial News:**
- Nairametrics (FX-focused)
- BusinessDay Nigeria
- Vanguard Business
- Punch Business
- Premium Times Business

**International FX:**
- Reuters Currencies
- ForexLive
- CBN Official RSS

**Crypto (Naira-relevant):**
- CoinTelegraph Nigeria
- Bitcoin Magazine

### 2. **Stricter Keyword Filtering**
Improved filtering in `lib/scraper.ts`:
- Requires **2+ keyword matches** OR **1 match in title/excerpt**
- Focuses on title and excerpt for relevance
- Filters out generic news

**New Keywords:**
- Currency codes: naira, ngn, usd/ngn, gbp/ngn
- Exchange terms: exchange rate, forex, fx rate
- Market terms: black market rate, parallel market, cbn rate
- Institutions: cbn, central bank of nigeria, fmdq
- Specific phrases: dollar to naira, naira devaluation

### 3. **Automated Fetching Script**
Created `scripts/fetch-articles.ts` to fetch and filter articles automatically.

## How to Use

### Fetch Articles Manually
```bash
npm run fetch-articles
```

This will:
1. Fetch from all RSS feeds
2. Filter for FX-related content
3. Save to `data/scraped.json`
4. Show sample article titles

### Set Up Automatic Fetching

**Option 1: Cron Job (Production)**
Add to your server's crontab:
```bash
# Fetch articles every 6 hours
0 */6 * * * cd /path/to/nairamet && npm run fetch-articles
```

**Option 2: Vercel Cron (Recommended)**
Create `app/api/cron/fetch-articles/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { fetchFeeds } from "@/lib/scraper";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run the fetch script
  // ... (copy logic from scripts/fetch-articles.ts)
  
  return NextResponse.json({ success: true });
}
```

Then add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/fetch-articles",
    "schedule": "0 */6 * * *"
  }]
}
```

**Option 3: GitHub Actions**
Create `.github/workflows/fetch-articles.yml`:
```yaml
name: Fetch FX Articles
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run fetch-articles
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/scraped.json
          git commit -m "Update scraped articles" || exit 0
          git push
```

## Feed Sources Explained

### Why These Feeds?

**Nairametrics** - Nigeria's leading financial news site, FX-focused
**BusinessDay** - Comprehensive business coverage including currency
**Reuters Currencies** - Global FX news affecting Naira
**ForexLive** - Real-time FX market updates
**CBN RSS** - Official central bank announcements

### Adding More Feeds

Edit `scripts/fetch-articles.ts`:
```typescript
const FX_FEEDS = [
  // Add your feed here
  "https://example.com/fx-news/feed/",
  ...
];
```

## Keyword Strategy

### Current Approach
- **Strict matching**: Requires multiple keywords or title match
- **FX-specific**: Avoids generic business news
- **Naira-focused**: Prioritizes Nigerian currency content

### Adjusting Sensitivity

**More articles (less strict):**
```typescript
// In lib/scraper.ts
return matchCount >= 1 || titleMatch;  // Changed from 2 to 1
```

**Fewer articles (more strict):**
```typescript
return matchCount >= 3 && titleMatch;  // Requires both
```

## Monitoring Quality

### Check Article Relevance
```bash
npm run fetch-articles
```

Look at the sample titles printed. If you see:
- ✅ "Naira gains against dollar"
- ✅ "CBN adjusts FX policy"
- ✅ "Black market rate hits ₦1,650"
- ❌ "Police arrest suspects" (not FX-related)

### Adjust Keywords
If getting too many off-topic articles, add more specific keywords:
```typescript
const nairaKeywords = [
  "naira exchange",  // More specific than just "naira"
  "fx rate nigeria",  // More specific than just "fx"
  ...
];
```

## Troubleshooting

### No Articles Fetched
- Check internet connection
- Verify RSS feeds are accessible
- Check console for errors

### Too Many Off-Topic Articles
- Make keywords more specific
- Increase match count requirement
- Remove generic keywords

### Too Few Articles
- Add more RSS feeds
- Reduce match count requirement
- Add more keyword variations

## Best Practices

1. **Run fetch before deployment** to have fresh content
2. **Monitor article quality** regularly
3. **Update feeds** if sources change
4. **Adjust keywords** based on results
5. **Cache articles** to reduce API calls

## Next Steps

1. Install tsx: `npm install`
2. Run fetch: `npm run fetch-articles`
3. Check results in `data/scraped.json`
4. Set up automated fetching (choose option above)
5. Monitor and adjust as needed

## Support

If articles aren't relevant:
1. Check the keywords in `app/blog/page.tsx`
2. Adjust filtering in `lib/scraper.ts`
3. Add/remove feeds in `scripts/fetch-articles.ts`
