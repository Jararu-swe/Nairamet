import Parser from "rss-parser";
import * as cheerio from "cheerio";

// @ts-ignore - unfluff has no types
import unfluff from "unfluff";

export type ScrapedArticle = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  url: string;
  date?: string;
  source?: string;
  sourceUrl?: string;
  author?: string;
};

const parser = new Parser();

// Module-level cache
let cached: { articles: ScrapedArticle[]; fetchedAt: number } | null = null;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

async function fetchNairalandNews(maxThreads = 5) {
  const results: ScrapedArticle[] = [];
  try {
    const res = await fetch("https://www.nairaland.com/news", {
      headers: { "User-Agent": "NairaMetBot/1.0 (+https://example.com)" },
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    // Select the latest news thread links (Nairaland structure: every 'td > b > a' in the main table)
    const threadLinks: Array<{ href: string; text: string }> = [];
    $("td > b > a").each((_: number, el: any) => {
      const href = $(el).attr("href");
      const text = $(el).text();
      if (href && text && /^\d+/g.test(href)) {
        // Only topic threads
        threadLinks.push({ href, text });
      }
    });
    const threadsToScrape = threadLinks.slice(0, maxThreads);

    for (const { href, text } of threadsToScrape) {
      try {
        const url = `https://www.nairaland.com${
          href.startsWith("/") ? href : "/" + href
        }`;
        const threadRes = await fetch(url, {
          headers: { "User-Agent": "NairaMetBot/1.0 (+https://example.com)" },
        });
        const threadHtml = await threadRes.text();
        const $$ = cheerio.load(threadHtml);
        // Top post is first .narrow (the post container)
        const firstPost = $$(".narrow").first();
        const body =
          firstPost.find(".body").text().trim() || firstPost.text().trim();
        const authorElem = firstPost.find(".user").first();
        const author = authorElem.text().trim() || "Nairaland user";
        // Date is in first .bold
        const dateElem = firstPost.find("> .bold").first();
        const dateStr = dateElem.text().trim();
        // Use url as id; include the thread title and url
        results.push({
          id: url,
          url,
          title: text,
          excerpt: body.split("\n").slice(0, 2).join(" "),
          content: body,
          author,
          date: dateStr,
          source: "Nairaland",
          sourceUrl: url,
        });
      } catch (err) {
        // Ignore failed thread fetch
      }
    }
  } catch (err) {
    // Ignore main page fetch error
  }
  return results;
}

export async function fetchFeeds(feedUrls: string[]) {
  const now = Date.now();
  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.articles;
  }

  // Fetch RSS feeds normally
  const results: ScrapedArticle[] = [];
  const seen = new Set<string>();

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const source = feed.title || feedUrl;
      for (const item of feed.items || []) {
        const link = item.link || item.guid || item.id || "";
        if (!link) continue;
        if (seen.has(link)) continue;
        seen.add(link);

        let rawContent = item.content || "";
        // If content looks empty or is mostly an anchor, try to scrape the full article
        let fullContent = rawContent;
        if (
          !rawContent ||
          /<a [^>]*>.*<\/a> *(&nbsp;)?/i.test(rawContent) ||
          rawContent.length < 100
        ) {
          try {
            const response = await fetch(link, {
              headers: {
                "User-Agent": "NairaMetBot/1.0 (+https://example.com)",
              },
            });
            const html = await response.text();
            // Use unfluff to extract main article body
            const data = unfluff(html);
            if (data && data.text && data.text.length > 150) {
              fullContent = data.text;
            }
          } catch (e) {
            // ignore fetch/parse errors
            fullContent = rawContent || "";
          }
        }

        results.push({
          id: link,
          title: item.title || "(no title)",
          excerpt:
            item.contentSnippet || item.summary || fullContent || undefined,
          content: fullContent || undefined,
          url: link,
          date: item.isoDate || item.pubDate || undefined,
          source,
          sourceUrl: feed.link || feedUrl,
        });
      }
    } catch (err) {
      // ignore individual feed failures
      console.error("Failed to fetch feed", feedUrl, err);
    }
  }

  // Fetch and merge Nairaland news
  const nairalandArticles = await fetchNairalandNews(5); // fetch top 5 threads
  for (const art of nairalandArticles) {
    if (!seen.has(art.id)) {
      seen.add(art.id);
      results.push(art);
    }
  }

  // sort by date desc (items without dates go last)
  results.sort((a, b) => {
    const da = a.date ? Date.parse(a.date) : 0;
    const db = b.date ? Date.parse(b.date) : 0;
    return db - da;
  });

  cached = { articles: results, fetchedAt: now };
  return results;
}

export function getCachedArticles() {
  if (!cached) return [];
  return cached.articles;
}

export function filterArticlesByKeywords(
  articles: ScrapedArticle[],
  keywords: string[]
) {
  if (!articles || articles.length === 0) return [];
  const kws = keywords.map((k) => k.toLowerCase());
  
  return articles.filter((a) => {
    // Focus on title and excerpt for better relevance
    const titleAndExcerpt = `${a.title || ""} ${a.excerpt || ""}`.toLowerCase();
    const fullContent = `${titleAndExcerpt} ${a.content || ""}`.toLowerCase();
    
    // Must match at least 2 keywords for better precision
    const matchCount = kws.filter((kw) => fullContent.includes(kw)).length;
    
    // Or match 1 keyword in title/excerpt (high relevance)
    const titleMatch = kws.some((kw) => titleAndExcerpt.includes(kw));
    
    return matchCount >= 2 || titleMatch;
  });
}

export function getCachedArticlesFiltered(keywords: string[]) {
  const articles = getCachedArticles();
  return filterArticlesByKeywords(articles, keywords);
}
