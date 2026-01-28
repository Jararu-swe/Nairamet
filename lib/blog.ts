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
      "Weekly summaries, policy analysis and market insights on the naira.",
    content:
      "This is a short welcome article. For full posts use markdown files in /data.",
    author: "NairaMet Editorial Team",
    date: new Date().toISOString(),
    readTime: "2",
    category: "Weekly Summary",
    trend: null,
    featured: true,
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
      return kvArticles;
    }
  } catch (e) {
    console.warn("Failed to fetch from KV, falling back to fs", e);
  }
  // Fallback to local file
  return readScraped();
}

export async function getArticles(): Promise<Article[]> {
  const scraped = await fetchScrapedData();
  const mapped = (scraped || []).map((s: any) => ({
    id: `scraped:${encodeURIComponent(s.url || String(Math.random()))}`,
    title: decodeEntities(s.title || "(no title)"),
    excerpt: decodeEntities(s.excerpt || s.content || ""),
    content: decodeEntities(s.content || ""),
    author: decodeEntities(s.source || "Wire"),
    originalUrl: s.url,
    date: s.date || new Date().toISOString(),
    readTime: "1",
    category: s.source || "Wire",
    trend: null,
    featured: false,
  })) as Article[];

  return [...articles, ...mapped].sort(
    (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  const all = await getArticles();

  let found = all.find((a) => a.id === id);
  if (found) return found;

  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
  } catch {}

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
    } catch {}
  }

  try {
    const maybeUrl = decodeURIComponent(id);
    found = all.find((a) => (a as any).originalUrl === maybeUrl);
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
