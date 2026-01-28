import { NextResponse } from "next/server";
import { fetchFeeds, filterArticlesByKeywords } from "@/lib/scraper";
import { saveArticlesToKV } from "@/lib/kv";
import fs from "fs";
import path from "path";

// FX-focused RSS feeds
const FX_FEEDS = [
  // Nigerian Financial News
  "https://nairametrics.com/feed/",
  "https://businessday.ng/feed/",
  
  // Business & Economy
  "https://www.vanguardngr.com/category/business/feed/",
  "https://punchng.com/category/business/feed/",
  "https://www.premiumtimesng.com/business/feed",
  
  // International FX News (optional - may be slow)
  // "https://www.reuters.com/markets/currencies/rss",
  // "https://www.forexlive.com/feed/news",
];

// Strict FX-related keywords
const FX_KEYWORDS = [
  "naira", "ngn", "usd/ngn", "gbp/ngn", "eur/ngn",
  "exchange rate", "forex", "fx rate", "currency rate",
  "black market rate", "parallel market", "cbn rate",
  "cbn", "central bank of nigeria", "fmdq",
  "dollar to naira", "pound to naira", "euro to naira",
  "naira devaluation", "naira appreciation", "naira depreciation",
  "fx market", "currency market", "foreign exchange",
  "fx policy", "fx liquidity", "fx allocation",
];

export async function GET(request: Request) {
  try {
    // Optional: Add authentication
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    console.log("🔄 Fetching FX-related articles...");
    
    const articles = await fetchFeeds(FX_FEEDS);
    console.log(`✅ Fetched ${articles.length} total articles`);
    
    // Filter for FX-related content
    const fxArticles = filterArticlesByKeywords(articles, FX_KEYWORDS);
    console.log(`✅ Filtered to ${fxArticles.length} FX-related articles`);
    
    // Save to data/scraped.json
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const outputPath = path.join(dataDir, "scraped.json");
    fs.writeFileSync(outputPath, JSON.stringify(fxArticles, null, 2));
    
    // Save to Vercel KV for production
    try {
      await saveArticlesToKV(fxArticles);
      console.log("✅ Saved articles to Vercel KV");
    } catch (kvError) {
      console.error("⚠️ Failed to save to KV:", kvError);
    }

    return NextResponse.json({
      success: true,
      totalFetched: articles.length,
      fxArticles: fxArticles.length,
      samples: fxArticles.slice(0, 5).map(a => ({
        title: a.title,
        source: a.source,
        date: a.date,
      })),
    });
    
  } catch (error: any) {
    console.error("❌ Error fetching articles:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch articles" 
      },
      { status: 500 }
    );
  }
}