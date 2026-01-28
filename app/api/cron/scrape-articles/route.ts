import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * Cron job to scrape articles every 3 hours.
 * Uses ?force=true to bypass cache and ensure fresh content.
 */
export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    console.log('[Cron] Starting scheduled article scrape...');
    const response = await fetch(`${baseUrl}/api/scrape?force=true`, {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || ''}`
      },
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Scraping failed');
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      articlesCount: data.articles?.length || 0,
      message: 'Articles scraped successfully'
    });
    
  } catch (error) {
    console.error('[Cron] Scrape job failed:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
