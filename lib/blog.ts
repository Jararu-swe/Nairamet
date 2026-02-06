import fs from "fs";
import path from "path";
import { getArticlesFromKV } from "./kv";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  originalUrl?: string;
  trend?: "up" | "down" | null;
  featured?: boolean;
};

// Minimal static articles list. Keep concise to avoid large inline strings.
export const articles: Article[] = [
  {
    id: "1",
    title: "Welcome to NairaMet - Naira Watch",
    excerpt:
      "Your trusted source for Nigerian FX market analysis, weekly summaries, and policy insights on the naira exchange rate.",
    content:
      "Welcome to Naira Watch, your comprehensive source for Nigerian foreign exchange market insights. We provide weekly market summaries, in-depth policy analysis, and educational content to help you understand the dynamics of the naira exchange rate. Stay informed about CBN policies, parallel market trends, and factors affecting Nigeria's currency landscape.",
    author: "NairaMet Editorial Team",
    date: new Date().toISOString(),
    readTime: "3",
    category: "Weekly Summary",
    trend: null,
    featured: true,
  },
  {
    id: "2",
    title: "Understanding Nigeria's Multiple Exchange Rate System",
    excerpt:
      "A comprehensive guide to CBN official rates, parallel market rates, and the factors that drive the spread between them.",
    content:
      "Nigeria operates a complex multiple exchange rate system with several key rates: the CBN official rate, the Investors & Exporters (I&E) window rate, and the parallel (black) market rate. Understanding these different rates and the factors that influence their spreads is crucial for businesses, investors, and individuals dealing with foreign exchange in Nigeria. This guide explains how each rate is determined and what drives the variations between them.",
    author: "NairaMet Research Team",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    readTime: "5",
    category: "Education",
    trend: null,
    featured: false,
  },
  {
    id: "3",
    title: "Weekly FX Market Outlook",
    excerpt:
      "Current market conditions, key events to watch, and factors likely to influence naira performance in the coming week.",
    content:
      "This week's FX market outlook covers key developments affecting the naira, including CBN policy announcements, oil price movements, and global economic factors. We analyze current liquidity conditions, recent interventions, and provide insights into potential market movements. Key events to monitor include upcoming CBN meetings, economic data releases, and global market developments that could impact Nigeria's foreign exchange market.",
    author: "NairaMet Market Analysts",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    readTime: "4",
    category: "Market Insights",
    trend: "up",
    featured: false,
  },
];

function readMarkdownFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return "";
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error(`Failed to read ${filename}`, err);
    return "";
  }
}

function readScraped(): any[] {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.articles || [];
  } catch (err) {
    // Don't crash the server for malformed scraped data
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

async function fetchScrapedData(): Promise<any[]> {
  // Try KV first (for Vercel production)
  try {
    const kvArticles = await getArticlesFromKV();
    if (kvArticles && kvArticles.length > 0) {
      console.log(`✅ Loaded ${kvArticles.length} articles from KV`);
      return kvArticles;
    }
  } catch (e) {
    console.warn("Failed to fetch from KV, falling back to fs:", e);
  }
  
  // Fallback to local file
  try {
    const localArticles = readScraped();
    console.log(`✅ Loaded ${localArticles.length} articles from local file`);
    return localArticles;
  } catch (e) {
    console.error("Failed to read local scraped data:", e);
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const scraped = await fetchScrapedData();
    
    // Filter for FX/Naira related content only
    const fxKeywords = [
      'naira', 'ngn', 'dollar', 'usd', 'pound', 'gbp', 'euro', 'eur',
      'exchange rate', 'forex', 'fx', 'currency', 'cbn', 'central bank',
      'black market', 'parallel market', 'devaluation', 'appreciation',
      'depreciation', 'fx policy', 'fx allocation', 'fx liquidity',
      'foreign exchange', 'currency market', 'fx market'
    ];
    
    const filteredScraped = (scraped || []).filter((s: any) => {
      const title = (s.title || '').toLowerCase();
      const content = (s.content || '').toLowerCase();
      const excerpt = (s.excerpt || '').toLowerCase();
      
      return fxKeywords.some(keyword => 
        title.includes(keyword) || 
        content.includes(keyword) || 
        excerpt.includes(keyword)
      );
    });
    
    const mapped = filteredScraped.map((s: any) => {
      try {
        return {
          id: `scraped:${encodeURIComponent(s.url || String(Math.random()))}`,
          title: decodeEntities(s.title || "(no title)"),
          excerpt: decodeEntities(s.excerpt || s.content || "").substring(0, 200),
          content: decodeEntities(s.content || ""),
          author: decodeEntities(s.source || "Wire"),
          originalUrl: s.url,
          date: s.date || new Date().toISOString(),
          readTime: "1",
          category: s.source || "Wire",
          trend: null,
          featured: false,
        };
      } catch (error) {
        console.error("Error mapping scraped article:", error);
        return null;
      }
    }).filter(Boolean) as Article[];

    console.log(`✅ Filtered ${mapped.length} FX-related articles from ${scraped.length} total articles`);

    return [...articles, ...mapped].sort(
      (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
    );
  } catch (error) {
    console.error("Error getting articles:", error);
    // Return at least the static articles if everything fails
    return articles;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const all = await getArticles();

    let found = all.find((a) => a.id === id);
    if (found) return found;

    try {
      const decoded = decodeURIComponent(id);
      found = all.find((a) => a.id === decoded);
      if (found) return found;
    } catch (decodeError) {
      console.warn("Failed to decode article ID:", decodeError);
    }

    if (id.startsWith("scraped:") || id.includes("scraped%3A")) {
      try {
        const normalized = id.replace(/scraped%3A/i, "scraped:");
        const part = normalized.slice("scraped:".length);
        found = all.find((a) => a.id === `scraped:${part}`);
        if (found) return found;

        const decodedPart = decodeURIComponent(part);
        found = all.find((a) => a.id === `scraped:${decodedPart}`);
        if (found) return found;

        const reencoded = `scraped:${encodeURIComponent(decodedPart)}`;
        found = all.find((a) => a.id === reencoded);
        if (found) return found;
      } catch (scrapedError) {
        console.warn("Failed to process scraped article ID:", scrapedError);
      }
    }

    try {
      const maybeUrl = decodeURIComponent(id);
      found = all.find((a) => (a as any).originalUrl === maybeUrl);
      if (found) return found;
    } catch (urlError) {
      console.warn("Failed to process URL-based article lookup:", urlError);
    }

    return null;
  } catch (error) {
    console.error("Error getting article by ID:", error);
    return null;
  }
}

function decodeEntities(str: string = ""): string {
  const map: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&ndash;": "–",
    "&mdash;": "—",
    "&ldquo;": "\u201c",
    "&rdquo;": "\u201d",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&hellip;": "…",
  };

  let s = String(str || "");
  s = s.replace(/&#(\d+);/g, (_, num) =>
    String.fromCharCode(parseInt(num, 10))
  );
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  s = s.replace(
    /&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g,
    (entity) => map[entity] ?? entity
  );
  return s.replace(/\s+/g, " ").trim();
}

export { readMarkdownFile };

