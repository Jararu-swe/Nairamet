import { NextResponse } from "next/server";

/**
 * Consolidated daily cron job for Vercel Hobby plan (1 cron/day limit)
 * Runs once per day at 6 AM UTC
 * 
 * Tasks:
 * 1. Refresh currency rates (forces cache revalidation)
 * 2. Scrape latest articles
 * 3. Clean up old data
 */
export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const results = {
      timestamp: new Date().toISOString(),
      tasks: [] as Array<{ name: string; success: boolean; message: string }>,
    };

    // Task 1: Refresh currency rates
    try {
      const apiKey = process.env.CURRENCYLAYER_API_KEY || "";
      
      if (apiKey) {
        const response = await fetch(
          `https://api.currencylayer.com/live?access_key=${encodeURIComponent(apiKey)}&source=USD&format=1`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const data = await response.json();
          results.tasks.push({
            name: "Refresh Currency Rates",
            success: data.success,
            message: `Updated rates. Sample: USDNGN = ${data.quotes?.USDNGN || "N/A"}`,
          });
        } else {
          results.tasks.push({
            name: "Refresh Currency Rates",
            success: false,
            message: `API error: ${response.status}`,
          });
        }
      } else {
        results.tasks.push({
          name: "Refresh Currency Rates",
          success: false,
          message: "API key not configured",
        });
      }
    } catch (error: any) {
      results.tasks.push({
        name: "Refresh Currency Rates",
        success: false,
        message: error.message || "Unknown error",
      });
    }

    // Task 2: Scrape articles (trigger cache refresh)
    try {
      // Import and run the scraper
      const { fetchFeeds } = await import("@/lib/scraper");
      
      const feedUrls = [
        "https://www.vanguardngr.com/feed/",
        "https://punchng.com/feed/",
        "https://www.premiumtimesng.com/feed",
        "https://guardian.ng/feed/",
        "https://businessday.ng/feed/",
      ];

      const articles = await fetchFeeds(feedUrls, true); // force refresh
      
      results.tasks.push({
        name: "Scrape Articles",
        success: true,
        message: `Scraped ${articles.length} articles`,
      });
    } catch (error: any) {
      results.tasks.push({
        name: "Scrape Articles",
        success: false,
        message: error.message || "Unknown error",
      });
    }

    // Task 3: Clear old caches
    try {
      // Clear tracker cache
      // @ts-ignore
      if ((globalThis as any).__NAIRAMET_TRACKER_CACHE) {
        (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
      }
      
      results.tasks.push({
        name: "Clear Caches",
        success: true,
        message: "Cleared old caches",
      });
    } catch (error: any) {
      results.tasks.push({
        name: "Clear Caches",
        success: false,
        message: error.message || "Unknown error",
      });
    }

    const successCount = results.tasks.filter(t => t.success).length;
    const totalTasks = results.tasks.length;

    return NextResponse.json({
      success: successCount === totalTasks,
      message: `Completed ${successCount}/${totalTasks} tasks`,
      ...results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Cron job failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
