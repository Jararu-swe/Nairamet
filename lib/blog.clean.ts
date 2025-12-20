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

export function readMarkdownFile(filename: string): string {
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
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

export function getArticles(): Article[] {
  const scraped = readScraped();
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

export function getArticleById(id: string): Article | null {
  const all = getArticles();
  let found = all.find((a) => a.id === id);
  if (found) return found;
  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
  } catch {}
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
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&lsquo;": "‘",
    "&rsquo;": "’",
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
