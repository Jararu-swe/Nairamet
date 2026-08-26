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
  category?: string;
  tags?: string[];
  relevanceScore?: number;
};

const parser = new Parser({
  timeout: 10000, // 10 second timeout
  headers: {
    'User-Agent': 'NairaMetBot/2.0 (+https://nairamet.com/bot)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  }
});

// Module-level cache
let cached: { articles: ScrapedArticle[]; fetchedAt: number } | null = null;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Enhanced FX-related keywords for better filtering
const FX_KEYWORDS = [
  // Currency terms
  'naira', 'dollar', 'usd', 'ngn', 'gbp', 'eur', 'pound', 'euro', 'yuan', 'cny',
  'exchange rate', 'forex', 'fx', 'currency', 'devaluation', 'appreciation',
  
  // Financial institutions
  'cbn', 'central bank', 'bdc', 'bureau de change', 'fmdq', 'nafex',
  
  // Economic terms
  'inflation', 'monetary policy', 'interest rate', 'economic policy',
  'foreign reserve', 'trade balance', 'import', 'export', 'remittance',
  
  // Market terms
  'black market', 'parallel market', 'official rate', 'interbank',
  'i&e window', 'domiciliary account', 'diaspora'
];

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000,  // 5 seconds
};

// Utility functions
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    const delayMs = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
      RETRY_CONFIG.maxDelay
    );
    
    console.warn(`Retry attempt ${RETRY_CONFIG.maxRetries - retries + 1}, waiting ${delayMs}ms:`, error);
    await delay(delayMs);
    return retryWithBackoff(fn, retries - 1);
  }
}

// Calculate relevance score for FX content
function calculateRelevanceScore(article: Partial<ScrapedArticle>): number {
  const text = `${article.title || ''} ${article.excerpt || ''} ${article.content || ''}`.toLowerCase();
  let score = 0;
  
  // High-value keywords (currency-specific)
  const highValueKeywords = ['naira', 'dollar', 'exchange rate', 'forex', 'cbn', 'bdc'];
  highValueKeywords.forEach(keyword => {
    const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
    score += matches * 3;
  });
  
  // Medium-value keywords
  const mediumValueKeywords = ['currency', 'monetary', 'inflation', 'economic policy'];
  mediumValueKeywords.forEach(keyword => {
    const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
    score += matches * 2;
  });
  
  // Low-value keywords
  const lowValueKeywords = ['finance', 'economy', 'market', 'trade'];
  lowValueKeywords.forEach(keyword => {
    const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
    score += matches * 1;
  });
  
  // Bonus for title mentions
  const titleText = (article.title || '').toLowerCase();
  if (titleText.includes('naira') || titleText.includes('dollar') || titleText.includes('exchange')) {
    score += 5;
  }
  
  return score;
}

// Enhanced content extraction with timeout handling
async function extractFullContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NairaMetBot/2.0 (+https://nairamet.com/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    const data = unfluff(html);
    
    if (data && data.text && data.text.length > 150) {
      return data.text;
    }
    
    // Fallback: try basic cheerio extraction
    const $ = cheerio.load(html);
    const articleSelectors = [
      'article',
      '.post-content',
      '.entry-content', 
      '.article-content',
      '.content',
      'main p'
    ];
    
    for (const selector of articleSelectors) {
      const content = $(selector).text().trim();
      if (content.length > 150) {
        return content;
      }
    }
    
    return '';
  } catch (error) {
    console.warn(`Failed to extract content from ${url}:`, error);
    return '';
  }
}

// Enhanced Nairaland scraping with better error handling
async function fetchNairalandNews(maxThreads = 8): Promise<ScrapedArticle[]> {
  const results: ScrapedArticle[] = [];
  
  try {
    const response = await retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch("https://www.nairaland.com/news", {
        headers: { 
          "User-Agent": "NairaMetBot/2.0 (+https://nairamet.com/bot)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Nairaland HTTP ${res.status}`);
      }
      
      return res;
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract thread links with better selectors
    const threadLinks: Array<{ href: string; text: string }> = [];
    
    // Try multiple selectors for thread links
    const selectors = [
      "td > b > a",
      ".narrow td b a",
      "table td b a"
    ];
    
    for (const selector of selectors) {
      $(selector).each((_: number, el: any) => {
        const href = $(el).attr("href");
        const text = $(el).text().trim();
        
        if (href && text && /^\d+/g.test(href) && text.length > 10) {
          // Filter for potentially FX-related threads
          const lowerText = text.toLowerCase();
          const hasFxKeywords = FX_KEYWORDS.some(keyword => 
            lowerText.includes(keyword.toLowerCase())
          );
          
          if (hasFxKeywords || threadLinks.length < maxThreads) {
            threadLinks.push({ href, text });
          }
        }
      });
      
      if (threadLinks.length >= maxThreads) break;
    }
    
    // Limit and prioritize FX-related threads
    const threadsToScrape = threadLinks
      .slice(0, maxThreads)
      .sort((a, b) => {
        const aScore = calculateRelevanceScore({ title: a.text });
        const bScore = calculateRelevanceScore({ title: b.text });
        return bScore - aScore;
      });

    // Scrape individual threads with concurrency control
    const threadPromises = threadsToScrape.map(async ({ href, text }) => {
      try {
        const url = `https://www.nairaland.com${href.startsWith("/") ? href : "/" + href}`;
        
        const threadResponse = await retryWithBackoff(async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const res = await fetch(url, {
            headers: { 
              "User-Agent": "NairaMetBot/2.0 (+https://nairamet.com/bot)",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!res.ok) {
            throw new Error(`Thread HTTP ${res.status}`);
          }
          
          return res;
        });
        
        const threadHtml = await threadResponse.text();
        const $thread = cheerio.load(threadHtml);
        
        // Enhanced content extraction
        const firstPost = $thread(".narrow").first();
        let body = firstPost.find(".body").text().trim();
        
        if (!body) {
          // Fallback selectors
          body = firstPost.find("div").first().text().trim() || 
                 firstPost.text().trim();
        }
        
        // Extract author with fallback
        let author = firstPost.find(".user").first().text().trim();
        if (!author) {
          author = firstPost.find("a[href*='/user/']").first().text().trim() || "Nairaland User";
        }
        
        // Extract date with better parsing
        const dateElem = firstPost.find("> .bold").first();
        let dateStr = dateElem.text().trim();
        
        if (!dateStr) {
          // Try alternative date selectors
          dateStr = firstPost.find(".s").first().text().trim() ||
                   firstPost.find("small").first().text().trim() ||
                   new Date().toISOString();
        }
        
        const relevanceScore = calculateRelevanceScore({ title: text, content: body });
        
        return {
          id: url,
          url,
          title: text,
          excerpt: body.split("\n").slice(0, 3).join(" ").substring(0, 200),
          content: body,
          author,
          date: dateStr,
          source: "Nairaland",
          sourceUrl: "https://www.nairaland.com",
          category: "Forum Discussion",
          relevanceScore,
        };
      } catch (error) {
        console.warn(`Failed to scrape Nairaland thread ${href}:`, error);
        return null;
      }
    });
    
    // Execute with controlled concurrency
    const threadResults = await Promise.allSettled(threadPromises);
    threadResults.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    });
    
  } catch (error) {
    console.error("Failed to fetch Nairaland main page:", error);
  }
  
  return results.filter(article => article.relevanceScore && article.relevanceScore > 2);
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (1 week)

// Enhanced RSS feed processing with 1-week expiration check
async function processFeedItem(item: any, source: string, feedUrl: string, seen: Set<string>): Promise<ScrapedArticle | null> {
  const link = item.link || item.guid || item.id || "";
  if (!link || seen.has(link)) return null;
  
  seen.add(link);

  const rawDate = item.isoDate || item.pubDate || undefined;
  if (rawDate) {
    const parsedDate = Date.parse(rawDate);
    if (!isNaN(parsedDate) && (Date.now() - parsedDate > ONE_WEEK_MS)) {
      // Skip articles published more than 7 days ago (1 week expiration)
      return null;
    }
  }
  
  let rawContent = item.content || item.contentSnippet || item.summary || "";
  let fullContent = rawContent;
  
  // Enhanced content extraction for short content
  if (!rawContent || rawContent.length < 100 || /<a [^>]*>.*<\/a> *(&nbsp;)?/i.test(rawContent)) {
    fullContent = await extractFullContent(link);
  }
  
  const article: ScrapedArticle = {
    id: link,
    title: item.title || "(no title)",
    excerpt: item.contentSnippet || item.summary || fullContent?.substring(0, 200) || undefined,
    content: fullContent || undefined,
    url: link,
    date: rawDate || new Date().toISOString(),
    source,
    sourceUrl: feedUrl,
    category: item.categories?.[0] || "News",
    relevanceScore: 0,
  };
  
  // Calculate relevance score
  article.relevanceScore = calculateRelevanceScore(article);
  
  return article;
}

// Main fetch function with enhanced error handling and more sources
export async function fetchFeeds(feedUrls: string[], force = false): Promise<ScrapedArticle[]> {
  const now = Date.now();
  if (!force && cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.articles;
  }

  // Enhanced feed URLs with more Nigerian sources
  const enhancedFeedUrls = [
    ...feedUrls,
    // Additional Nigerian news sources
    "https://www.thecable.ng/feed",
    "https://nairametrics.com/feed/",
    "https://www.channelstv.com/feed/",
    "https://dailypost.ng/feed",
    "https://www.leadership.ng/feed/",
    // Financial-specific feeds
    "https://www.proshareng.com/feed/",
    "https://www.financialwatchngr.com/feed/",
  ];

  const results: ScrapedArticle[] = [];
  const seen = new Set<string>();
  const feedPromises: Promise<void>[] = [];

  // Process feeds with controlled concurrency
  for (const feedUrl of enhancedFeedUrls) {
    feedPromises.push(
      retryWithBackoff(async () => {
        try {
          console.log(`Fetching feed: ${feedUrl}`);
          const feed = await parser.parseURL(feedUrl);
          const source = feed.title || new URL(feedUrl).hostname;
          
          const itemPromises = (feed.items || []).slice(0, 10).map(item => 
            processFeedItem(item, source, feedUrl, seen)
          );
          
          const processedItems = await Promise.allSettled(itemPromises);
          processedItems.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
              results.push(result.value);
            }
          });
          
        } catch (error) {
          console.warn(`Failed to fetch feed ${feedUrl}:`, error);
        }
      })
    );
  }

  // Wait for all feeds to complete
  await Promise.allSettled(feedPromises);

  // Fetch and merge Nairaland news
  try {
    const nairalandArticles = await fetchNairalandNews(8);
    nairalandArticles.forEach(article => {
      if (!seen.has(article.id)) {
        seen.add(article.id);
        results.push(article);
      }
    });
  } catch (error) {
    console.warn("Failed to fetch Nairaland articles:", error);
  }

  // Filter by relevance and sort
  const relevantArticles = results
    .filter(article => article.relevanceScore && article.relevanceScore > 1)
    .sort((a, b) => {
      // Sort by relevance score first, then by date
      if (a.relevanceScore !== b.relevanceScore) {
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      }
      
      const da = a.date ? Date.parse(a.date) : 0;
      const db = b.date ? Date.parse(b.date) : 0;
      return db - da;
    });

  console.log(`Scraped ${results.length} total articles, ${relevantArticles.length} relevant FX articles`);
  
  cached = { articles: relevantArticles, fetchedAt: now };
  return relevantArticles;
}

export function getCachedArticles(): ScrapedArticle[] {
  if (!cached) return [];
  return cached.articles;
}

// Enhanced filtering with relevance scoring
export function filterArticlesByKeywords(
  articles: ScrapedArticle[],
  keywords: string[]
): ScrapedArticle[] {
  if (!articles || articles.length === 0) return [];
  
  const kws = keywords.map((k) => k.toLowerCase());
  
  return articles
    .map(article => {
      const titleAndExcerpt = `${article.title || ""} ${article.excerpt || ""}`.toLowerCase();
      const fullContent = `${titleAndExcerpt} ${article.content || ""}`.toLowerCase();

      // Calculate keyword match score
      let keywordScore = 0;
      kws.forEach(kw => {
        const titleMatches = (titleAndExcerpt.match(new RegExp(kw, 'g')) || []).length;
        const contentMatches = (fullContent.match(new RegExp(kw, 'g')) || []).length;
        
        keywordScore += titleMatches * 3; // Title matches are more valuable
        keywordScore += contentMatches * 1;
      });

      return { ...article, keywordScore };
    })
    .filter(article => article.keywordScore > 0)
    .sort((a, b) => (b.keywordScore || 0) - (a.keywordScore || 0));
}

export function getCachedArticlesFiltered(keywords: string[]): ScrapedArticle[] {
  const articles = getCachedArticles();
  return filterArticlesByKeywords(articles, keywords);
}