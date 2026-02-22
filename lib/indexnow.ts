import { ScrapedArticle } from "./scraper";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "8e3a2b4c5d6e7f8a9b0c1d2e3f4a5b6c";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com";

/**
 * Submit URLs to IndexNow for instant indexing.
 * @param urls List of URLs to index
 */
export async function submitToIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) return;

  // Ensure URLs are absolute and use the correct base URL
  const absoluteUrls = urls.map(url => {
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  });

  const payload = {
    host: new URL(BASE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: absoluteUrls,
  };

  try {
    console.log(`Sending ${absoluteUrls.length} URLs to IndexNow...`);
    
    // Bing/IndexNow API endpoint
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`✅ Successfully submitted ${absoluteUrls.length} URLs to IndexNow.`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ IndexNow submission failed: ${response.status} ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error submitting to IndexNow:", error);
    return false;
  }
}

/**
 * Trigger IndexNow for a list of articles.
 */
export async function notifyNewArticles(articles: ScrapedArticle[]) {
  if (!articles || articles.length === 0) return;

  const urls = articles.map(article => {
    const slug = encodeURIComponent(article.id);
    return `/blog/${slug}`;
  });

  // Always include the home page and tracker to ensure they stay indexed
  urls.push("/");
  urls.push("/tracker");
  urls.push("/blog");

  return await submitToIndexNow(urls);
}
