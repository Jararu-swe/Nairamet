import { NextResponse } from "next/server";
import { fetchFeeds, getCachedArticles, ScrapedArticle } from "@/lib/scraper";
import { saveArticlesToKV } from "@/lib/kv";
import fs from "fs";
import path from "path";

// Consolidated FX-focused RSS feeds
const FX_FEEDS = [
  "https://nairametrics.com/feed/",
  "https://businessday.ng/feed/",
  "https://www.vanguardngr.com/category/business/feed/",
  "https://punchng.com/category/business/feed/",
  "https://www.premiumtimesng.com/business/feed",
  "https://www.reuters.com/markets/currencies/rss",
  "https://www.forexlive.com/feed/news",
  "https://www.cbn.gov.ng/rss/news.xml",
  "https://cointelegraph.com/rss/tag/nigeria",
  "https://bitcoinmagazine.com/.rss/full/",
];

export async function GET(request: Request) {
  try {
    // Verify authorization (CRON_SECRET)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const feedsParam = url.searchParams.get("feeds");
    const force = url.searchParams.get("force") === "true";
    let feeds: string[];
    
    if (feedsParam) {
      feeds = feedsParam.split(",");
    } else {
      feeds = FX_FEEDS;
    }
    // fetch and cache
    const allArticles: ScrapedArticle[] = await fetchFeeds(feeds, force);
    
    // Filter to only articles published within the last 7 days (1 week)
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const articles = allArticles.filter(a => {
      if (!a.date) return true;
      const parsed = Date.parse(a.date);
      return !isNaN(parsed) && (now - parsed <= ONE_WEEK_MS);
    });

    // Save to Vercel KV (for production)
    await saveArticlesToKV(articles);

    // Notify IndexNow for instant indexing of new content
    try {
      const { notifyNewArticles } = await import("@/lib/indexnow");
      await notifyNewArticles(articles.slice(0, 10)); // Just 10 to be safe
    } catch (e) {
      console.error("Failed to notify IndexNow", e);
    }

    // Persist to data/scraped.json for local development and caching
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const filePath = path.join(dataDir, "scraped.json");
      fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to persist scraped.json", e);
    }

    return NextResponse.json({ articles });
  } catch (err) {
    console.error("/api/scrape error", err);
    // Fallback to cached values if available
    const cached = getCachedArticles();
    return NextResponse.json(
      { articles: cached, error: String(err) },
      { status: 500 }
    );
  }
}