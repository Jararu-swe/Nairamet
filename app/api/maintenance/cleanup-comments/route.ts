import { NextResponse } from "next/server";
import { cleanupOldScrapedComments, cleanupCommentsByAge } from "@/lib/maintenance";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const olderThanDays = Number(body?.olderThanDays || process.env.CLEANUP_COMMENTS_AGE_DAYS || 14);
    const mode = String(body?.mode || "scraped").toLowerCase();

    if (mode === "age") {
      const res = await cleanupCommentsByAge(olderThanDays);
      return NextResponse.json({ mode, olderThanDays, ...res }, { status: 200 });
    }

    const res = await cleanupOldScrapedComments(olderThanDays);
    return NextResponse.json({ mode: "scraped", olderThanDays, ...res }, { status: 200 });
  } catch (err) {
    console.error("cleanup-comments API failed:", err);
    const msg = (err as any)?.message || String(err || "");
    return NextResponse.json({ error: "Cleanup failed", message: msg }, { status: 500 });
  }
}