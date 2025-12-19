import fs from "fs";
import path from "path";

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

// Function to read markdown content (currently unused but kept for future use)
function readMarkdownFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return "";
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (err) {
    console.error(`Failed to read ${filename}`, err);
    return "";
  }
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Weekly Rate Summary: Naira Strengthens Against Dollar",
    excerpt:
      "The naira gained 2.3% against the USD this week, closing at ₦1,545 on the official market. Black market rates also improved to ₦1,580.",
    content:
      "Full write-up: The naira saw measured gains driven by improved FX inflows and tighter CBN liquidity. Market participants reported increased FX availability across major corridors.\n\nKey drivers included remittance flows and reduced speculative demand. Traders expect volatility to persist around policy announcements.",
    author: "FX Analysis Team",
    date: "2024-01-15",
    readTime: "3 min read",
    category: "Weekly Summary",
    trend: "up",
    featured: true,
  },
  {
    id: "2",
    title: "Understanding Black Market FX Rates: A Complete Guide",
    excerpt:
      "Learn how parallel market rates are determined, why they differ from official rates, and what factors influence the spread.",
    content:
      "The parallel or black market operates with its own supply/demand dynamics. This guide explains common indicators, how to interpret spreads, and risk management for businesses relying on FX.",
    author: "Education Team",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "Education",
    trend: null,
    featured: false,
  },
  {
    id: "4",
    title: "What Nigeria's $50 Billion Crypto Boom Reveals About Its Financial Future",
    excerpt: "Nigeria's cryptocurrency sector has experienced remarkable growth, with transactions valued at over $50 billion between July 2023 and June 2024, according to the SEC.",
    content: "Nigeria's cryptocurrency sector has experienced remarkable growth, with transactions valued at over $50 billion between July 2023 and June 2024, according to the Securities and Exchange Commission (SEC). This surge in digital asset activity highlights a significant shift in how Nigerians are approaching financial investments and services.\n\nNigerians aren't just speculating for quick profits. They're treating digital assets like real financial instruments, using them to save, move, and hedge money in a system that often feels unstable. For millions of Nigerians, crypto has become an indispensable tool to combat soaring inflation—which surpassed 32% in August 2024—and the continuous devaluation of the Naira.",
    author: "Financial Analysis Team",
    date: "2024-10-27",
    readTime: "5 min read",
    category: "Cryptocurrency",
    originalUrl: "https://news.google.com/rss/articles/CBMinAFBVV95cUxOMGFPc3FGbkt0VXJuakU1TnZWekFfdVdmM3hwR1hmUUl3Qmk3WEZPbV8tcVhfdUFtdUZzUXkyMGY3ZTA3TDY4dlBzODhPZTNlT21CT0l4TlZXaWYxYnllb2JpZFlucVAtOFF1ZGp2UWxqTXk1cTZWWE10QzRHVC1YLWcwRWRmd25DNEptMVlXSjFJWUpJcHlrSHVhS0g?oc=5",
    trend: "up",
    featured: false,
  },
  {    id: "3",    title: "CBN's New FX Policy: What It Means for You",    excerpt:
      "Central Bank announces new foreign exchange guidelines. We break down the key changes and their impact on exchange rates.",
    content:
      "CBN introduced guidance targeting greater transparency in FX allocation. For businesses, this means updating hedging strategies and monitoring official auction schedules.",
    author: "Policy Analysis",
    date: "2024-01-10",
    readTime: "5 min read",
    category: "Policy",
    trend: null,
    featured: false,
  },
];

function readScraped() {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.articles || [];
  } catch (err) {
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

export function getArticles() {
  const scraped = readScraped();

  const mapped = (scraped || []).map((s: any) => ({
    id: `scraped:${encodeURIComponent(s.url)}`,
    title: decodeEntities(s.title || "(no title)"),
    excerpt: decodeEntities(s.excerpt || s.content || ""),
    content: decodeEntities(s.content || ""),
    author: decodeEntities(s.source || "Wire"),
    originalUrl: s.url,
    date: s.date || new Date().toISOString(),
    readTime: "1 min read",
    category: s.source || "Wire",
    trend: null,
    featured: false,
  })) as Article[];

  // combine and sort by date desc
  const combined = [...articles, ...mapped];
  combined.sort((a, b) => {
    const da = Date.parse(a.date) || 0;
    const db = Date.parse(b.date) || 0;
    return db - da;
  });

  return combined;
}

export function getArticleById(id: string) {
  const all = getArticles();

  // Try exact match first
  let found = all.find((a) => a.id === id);
  if (found) return found;

  // Try decoding the incoming id (handles percent-encoded segments)
  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
    
    // Also try double-decoded for cases where it was encoded twice
    const doubleDecoded = decodeURIComponent(decoded);
    found = all.find((a) => a.id === doubleDecoded);
    if (found) return found;
  } catch {}

  // If id looks like 'scraped:<encodedUrl>' try decoding the part after the colon
  if (id.startsWith("scraped:") || id.includes("scraped%3A")) {
    try {
      // Handle both encoded and non-encoded "scraped:" prefix
      const normalized = id.replace(/scraped%3A/i, "scraped:");
      const part = normalized.slice("scraped:".length);
      
      // Try the part as-is
      found = all.find((a) => a.id === `scraped:${part}`);
      if (found) return found;
      
      // Try decoding the part
      const decodedPart = decodeURIComponent(part);
      found = all.find((a) => a.id === `scraped:${decodedPart}`);
      if (found) return found;
      
      // Try re-encoding the decoded part (in case it needs to match the stored format)
      const reencoded = `scraped:${encodeURIComponent(decodedPart)}`;
      found = all.find((a) => a.id === reencoded);
      if (found) return found;
    } catch {}
  }

  // As a last resort try matching by originalUrl
  try {
    const maybeUrl = decodeURIComponent(id);
    found = all.find(
      (a) =>
        (a as any).originalUrl === maybeUrl ||
        a.id === `scraped:${encodeURIComponent(maybeUrl)}`
    );
    if (found) return found;
  } catch {}

  return null;
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
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&hellip;": "…",
  };
  let s = str
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
  s = s.replace(/\s+/g, " ").trim();
  return s;
}
