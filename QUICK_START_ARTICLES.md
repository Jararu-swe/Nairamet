# Quick Start: Fetch FX Articles

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Fetch Articles
Choose one method:

**Method A: Command Line (Recommended)**
```bash
npm run fetch-articles
```

**Method B: API Endpoint**
Visit in browser or curl:
```bash
curl http://localhost:3000/api/admin/fetch-articles
```

**Method C: Manual Script**
```bash
npx tsx scripts/fetch-articles.ts
```

### 3. Check Results
- Articles saved to: `data/scraped.json`
- View on blog: `http://localhost:3000/blog`

## 📊 What You'll Get

**Before (Current):**
- Mixed content: politics, security, general news
- Low FX relevance
- ~100+ articles, mostly off-topic

**After (Improved):**
- FX-focused: exchange rates, currency news
- High relevance: Naira, CBN, forex markets
- ~20-30 quality articles

## 🎯 RSS Feeds Added

1. **Nairametrics** - Nigeria's #1 FX news
2. **BusinessDay** - Business & currency coverage
3. **Vanguard Business** - Economic news
4. **Punch Business** - Financial updates
5. **Premium Times Business** - Policy & markets

## 🔍 Improved Filtering

**Old:** Any article mentioning "naira" or "dollar"
**New:** Must have 2+ FX keywords OR keyword in title

**Example Matches:**
- ✅ "Naira gains 2% against dollar at official market"
- ✅ "CBN adjusts FX policy amid liquidity concerns"
- ✅ "Black market rate hits ₦1,650 per dollar"
- ❌ "Police arrest dollar counterfeiter" (not FX news)

## 🔄 Automate (Optional)

### Option 1: Cron Job
```bash
# Add to crontab (every 6 hours)
0 */6 * * * cd /path/to/nairamet && npm run fetch-articles
```

### Option 2: Vercel Cron
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/admin/fetch-articles",
    "schedule": "0 */6 * * *"
  }]
}
```

### Option 3: GitHub Actions
See `ARTICLE_SCRAPING_GUIDE.md` for full setup

## 🛠️ Troubleshooting

**No articles showing?**
1. Run: `npm run fetch-articles`
2. Check: `data/scraped.json` exists
3. Restart dev server

**Too many off-topic articles?**
- Edit keywords in `app/blog/page.tsx`
- Make filtering stricter in `lib/scraper.ts`

**Want more articles?**
- Add more RSS feeds in `scripts/fetch-articles.ts`
- Reduce match requirement to 1 keyword

## 📝 Next Steps

1. ✅ Run `npm run fetch-articles` now
2. ✅ Check your blog at `/blog`
3. ✅ Set up automation (choose option above)
4. ✅ Adjust keywords if needed

## 💡 Pro Tips

- Run fetch before each deployment for fresh content
- Monitor article quality weekly
- Add more Nigerian financial news feeds
- Consider paid FX data APIs for premium content

---

**Need help?** Check `ARTICLE_SCRAPING_GUIDE.md` for detailed documentation.
