import { NextResponse } from "next/server";

/**
 * Combined cron job that updates both articles and currency rates
 * Runs once daily at 6 AM UTC with 12-hour caching
 */
export async function GET(request: Request) {
  const results = {
    articles: { success: false, error: null as any },
    currency: { success: false, error: null as any },
  };

  // 1. Fetch articles
  try {
    const articlesRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/scrape`,
      { cache: 'no-store' }
    );
    const articlesData = await articlesRes.json();
    results.articles = { 
      success: true, 
      error: null, 
      data: articlesData,
      articlesCount: articlesData.articles?.length || 0 
    };
    console.log('[Cron] Articles updated successfully:', articlesData.articles?.length || 0, 'articles');
  } catch (error) {
    results.articles = { success: false, error: String(error) };
    console.error('[Cron] Articles update failed:', error);
  }

  // 2. Fetch currency rates
  try {
    const currencyRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/currency`,
      { cache: 'no-store' }
    );
    const currencyData = await currencyRes.json();
    results.currency = { success: true, error: null, data: currencyData };
    console.log('[Cron] Currency rates updated successfully');
  } catch (error) {
    results.currency = { success: false, error: String(error) };
    console.error('[Cron] Currency update failed:', error);
  }

  return NextResponse.json({
    success: results.articles.success && results.currency.success,
    timestamp: new Date().toISOString(),
    schedule: 'Daily at 06:00 UTC',
    caching: 'Articles: 12 hours, Currency: 12 hours',
    results,
  });
}
