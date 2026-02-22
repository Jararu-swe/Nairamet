import { NextResponse } from "next/server";
import { fetchFeeds, getCachedArticles, ScrapedArticle } from "@/lib/scraper";
import { saveArticlesToKV } from "@/lib/kv";
import fs from "fs";
import path from "path";

const DEFAULT_FEEDS = [
  // Popular Nigerian news and finance feeds
  "https://punchng.com/feed/",
  "https://www.vanguardngr.com/feed/",
  "https://nairametrics.com/feed/",
  "https://www.cbn.gov.ng/rss.asp",
  "https://businessday.ng/feed/",
  // Existing feeds, if you still want Google News or BBC Africa
  "http://feeds.bbci.co.uk/news/world/africa/rss.xml",
  "https://news.google.com/rss/search?q=Nigeria&hl=en-US&gl=US&ceid=US:en",
];

// New approach: allow alternate feed URLs for each source
const FEEDS_WITH_ALTS = [
  // Each feed is an array: primary, then alternates
  ["https://punchng.com/feed/", "https://www.punchng.com/feed/"],
  ["https://www.vanguardngr.com/feed/"],
  ["https://nairametrics.com/feed/"],
  ["https://www.cbn.gov.ng/rss.asp", "https://cbn.gov.ng/rss.asp"],
  ["https://businessday.ng/feed/", "https://www.businessday.ng/feed/"],
  // Existing feeds
  ["http://feeds.bbci.co.uk/news/world/africa/rss.xml"],
  ["https://news.google.com/rss/search?q=Nigeria&hl=en-US&gl=US&ceid=US:en"],
];

export async function GET(request: Request) {
  try {
    // If ?feeds=... is given, override the special scheme, else use FEEDS_WITH_ALTS
    const url = new URL(request.url);
    const feedsParam = url.searchParams.get("feeds");
    const force = url.searchParams.get("force") === "true";
    let feeds: string[];
    if (feedsParam) {
      feeds = feedsParam.split(",");
    } else {
      // Flatten and deduplicate first found working feed per group
      feeds = [];
      for (const group of FEEDS_WITH_ALTS) {
        let worked = false;
        for (const alt of group) {
          try {
            const res = await fetch(alt, { method: "HEAD" });
            if (res.ok) {
              feeds.push(alt);
              worked = true;
              break;
            }
          } catch (e) {
            // try next alternate
          }
        }
        // If none work, use the primary anyway for error transparency/logs
        if (!worked) feeds.push(group[0]);
      }
    }
    // fetch and cache
    const articles: ScrapedArticle[] = await fetchFeeds(feeds, force);

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