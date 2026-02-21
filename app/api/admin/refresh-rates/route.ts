import { NextResponse } from "next/server";
import { fetchRatesWithFallback } from "@/lib/currency-providers";

/**
 * Force refresh currency rates by bypassing cache.
 * Tries all configured providers (CurrencyLayer → ExchangeRate-API → Open Exchange Rates).
 * WARNING: This makes a real API call and uses quota.
 * Usage: curl https://www.nairamet.com/api/admin/refresh-rates
 */
export async function GET() {
  try {
    // Make a fresh API call (bypasses all caches)
    const result = await fetchRatesWithFallback({ noCache: true });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error:
            "All API providers failed. Check that at least one API key is configured.",
        },
        { status: 500 }
      );
    }

    // Clear tracker cache
    // @ts-ignore
    if ((globalThis as any).__NAIRAMET_TRACKER_CACHE) {
      (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
    }

    return NextResponse.json({
      success: true,
      message: "Rates refreshed successfully",
      source: result.source,
      timestamp: new Date().toISOString(),
      sampleRate: result.quotes.USDNGN ?? "N/A",
      warning: "This used 1 API call from your monthly quota",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to refresh rates",
      },
      { status: 500 }
    );
  }
}
