import { ScrapedArticle } from "./scraper";

const ARTICLES_KEY = "scraped-articles";
const CACHE_DURATION = 60 * 60 * 6; // 6 hours in seconds

let kv: any = null;

// Try to import KV at runtime
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const vercelKv = require("@vercel/kv");
  kv = vercelKv.kv;
} catch (e) {
  console.warn(
    "Vercel KV not available - install with: npm install @vercel/kv"
  );
}

/**
 * Save articles to Vercel KV
 */
export async function saveArticlesToKV(articles: ScrapedArticle[]) {
  try {
    if (!kv) {
      console.warn("Vercel KV not configured, using fallback storage");
      return false;
    }

    await kv.setex(ARTICLES_KEY, CACHE_DURATION, JSON.stringify(articles));
    console.log(`✅ Saved ${articles.length} articles to Vercel KV`);
    return true;
  } catch (error) {
    console.error("Failed to save articles to KV:", error);
    return false;
  }
}

/**
 * Get articles from Vercel KV
 */
export async function getArticlesFromKV(): Promise<ScrapedArticle[]> {
  try {
    if (!kv) {
      console.warn("Vercel KV not configured");
      return [];
    }

    const cached = await kv.get<string>(ARTICLES_KEY);
    if (cached) {
      const articles = JSON.parse(cached);
      console.log(`✅ Retrieved ${articles.length} articles from Vercel KV`);
      return articles;
    }
    return [];
  } catch (error) {
    console.error("Failed to get articles from KV:", error);
    return [];
  }
}

/**
 * Clear articles from KV cache
 */
export async function clearArticlesFromKV() {
  try {
    if (!kv) return false;
    await kv.del(ARTICLES_KEY);
    console.log("✅ Cleared articles from Vercel KV");
    return true;
  } catch (error) {
    console.error("Failed to clear KV:", error);
    return false;
  }
}
