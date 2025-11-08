import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

/**
 * Build the scraped article id from a URL, matching lib/blog.ts convention.
 */
function scrapedIdFromUrl(url: string): string {
  return `scraped:${encodeURIComponent(url)}`;
}

type ScrapedItem = {
  url: string;
  date?: string; // ISO or parseable date string
};

function readScrapedJson(): ScrapedItem[] {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : parsed?.articles || [];
    return (arr || []).filter((x: any) => typeof x?.url === "string");
  } catch (err) {
    console.error("cleanup: failed to read scraped.json", err);
    return [];
  }
}

/**
 * Delete comments for scraped articles whose `date` is older than the threshold.
 * Returns the number of deleted comments.
 */
export async function cleanupOldScrapedComments(
  olderThanDays: number = Number(process.env.CLEANUP_COMMENTS_AGE_DAYS || 14)
): Promise<{ deletedCount: number; affectedArticleCount: number }> {
  const items = readScrapedJson();
  if (!items.length) {
    return { deletedCount: 0, affectedArticleCount: 0 };
  }

  const ms = Math.max(1, olderThanDays) * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - ms;

  const oldIds: string[] = [];
  for (const it of items) {
    const d = it.date ? Date.parse(String(it.date)) : NaN;
    if (!Number.isNaN(d) && d < cutoff) {
      oldIds.push(scrapedIdFromUrl(it.url));
    }
  }

  if (oldIds.length === 0) {
    return { deletedCount: 0, affectedArticleCount: 0 };
  }

  try {
    const res = await prisma.comment.deleteMany({
      where: { articleId: { in: oldIds } },
    });
    return {
      deletedCount: res.count || 0,
      affectedArticleCount: oldIds.length,
    };
  } catch (err) {
    console.error("cleanup: deleteMany failed", err);
    throw err;
  }
}

/**
 * Delete comments older than the threshold purely by comment `createdAt` age.
 * Useful fallback when scraped.json dates are missing.
 */
export async function cleanupCommentsByAge(
  olderThanDays: number = Number(process.env.CLEANUP_COMMENTS_AGE_DAYS || 14)
): Promise<{ deletedCount: number }> {
  const ms = Math.max(1, olderThanDays) * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - ms);
  try {
    const res = await prisma.comment.deleteMany({
      where: { createdAt: { lt: cutoffDate } },
    });
    return { deletedCount: res.count || 0 };
  } catch (err) {
    console.error("cleanup: deleteMany by age failed", err);
    throw err;
  }
}