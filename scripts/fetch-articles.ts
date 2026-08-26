/**
 * Script to fetch and cache FX-related articles from RSS feeds
 * Run with: npx tsx scripts/fetch-articles.ts
 */

import { fetchFeeds } from "../lib/scraper";
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
  
  // International FX News
  "https://www.reuters.com/markets/currencies/rss",
  "https://www.forexlive.com/feed/news",
  
  // CBN & Government
  "https://www.cbn.gov.ng/rss/news.xml",
  
  // Crypto & Digital Currency (relevant to Naira)
  "https://cointelegraph.com/rss/tag/nigeria",
  "https://bitcoinmagazine.com/.rss/full/",
];

// Strict FX-related keywords
const FX_KEYWORDS = [
  // Currency codes
  "naira", "ngn", "usd", "gbp", "eur", "cny",
  
  // Exchange rate terms
  "exchange rate", "forex", "fx", "currency",
  "black market", "parallel market",
  
  // Institutions
  "cbn", "central bank", "fmdq",
  
  // Actions
  "devaluation", "appreciation", "depreciation",
  "dollar to naira", "pound to naira", "euro to naira",
  
  // Market terms
  "fx market", "currency market", "foreign exchange",
  "exchange control", "fx policy", "fx liquidity",
];

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (1 week)

async function main() {
  console.log("🔄 Fetching FX-related articles (1-week expiration window)...");
  console.log(`📡 Fetching from ${FX_FEEDS.length} RSS feeds`);
  
  try {
    const articles = await fetchFeeds(FX_FEEDS, true);
    console.log(`✅ Fetched ${articles.length} total articles`);
    
    const now = Date.now();

    // Filter for FX-related content AND published within the last 7 days (1 week)
    const activeFxArticles = articles.filter((article) => {
      // Expiration check
      if (article.date) {
        const articleDate = Date.parse(article.date);
        if (!isNaN(articleDate) && now - articleDate > ONE_WEEK_MS) {
          return false; // Expired (older than 7 days)
        }
      }

      const searchText = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase();
      return FX_KEYWORDS.some((keyword) => searchText.includes(keyword.toLowerCase()));
    });
    
    console.log(`✅ Filtered to ${activeFxArticles.length} active FX-related articles (≤ 7 days old)`);
    
    // Save to data/scraped.json
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const outputPath = path.join(dataDir, "scraped.json");
    fs.writeFileSync(outputPath, JSON.stringify(activeFxArticles, null, 2));
    
    console.log(`💾 Saved ${activeFxArticles.length} active articles to ${outputPath}`);
    console.log("✨ Done!");
    
    // Show sample titles
    console.log("\n📰 Sample articles (published within last 7 days):");
    activeFxArticles.slice(0, 5).forEach((article, i) => {
      console.log(`${i + 1}. [${article.date?.substring(0, 10)}] ${article.title} (${article.source})`);
    });
    
  } catch (error) {
    console.error("❌ Error fetching articles:", error);
    process.exit(1);
  }
}

main();
