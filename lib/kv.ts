import { ScrapedArticle } from "./scraper";
import { kv } from "@vercel/kv";

const ARTICLES_KEY = "scraped-articles";
const CACHE_DURATION = 60 * 60 * 6; // 6 hours in seconds

/**
 * Save articles to Vercel KV
 */
export async function saveArticlesToKV(articles: ScrapedArticle[]) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn("Vercel KV env vars not set, skipping KV save");
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
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log("Vercel KV env vars not set, skipping KV fetch");
      return [];
    }

    const cached = await kv.get<string | ScrapedArticle[]>(ARTICLES_KEY);
    if (cached) {
      // If it's already an object (Redis JSON or auto-parsed), return it
      if (typeof cached === 'object' && Array.isArray(cached)) {
        console.log(`✅ Retrieved ${cached.length} articles from KV (object format)`);
        return cached as ScrapedArticle[];
      }
      // If it's a string, parse it
      if (typeof cached === 'string') {
        const parsed = JSON.parse(cached);
        console.log(`✅ Retrieved ${parsed.length} articles from KV (string format)`);
        return parsed;
      }
    }
    console.log("No cached articles found in KV");
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