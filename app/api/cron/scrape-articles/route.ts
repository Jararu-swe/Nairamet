import { NextResponse } from "next/server";

/**
 * Cron job to scrape articles every 3 hours
 */
export async function GET(request: Request) {
  try {
    const articlesRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/scrape`,
      { cache: 'no-store' }
    );
    const articlesData = await articlesRes.json();
    
    console.log('[Cron] Articles scraped successfully:', articlesData.articles?.length || 0, 'articles');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      articlesCount: articlesData.articles?.length || 0,
      data: articlesData,
    });
  } catch (error) {
    console.error('[Cron] Articles scraping failed:', error);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: String(error),
      },
      { status: 500 }
    );
  }
}
