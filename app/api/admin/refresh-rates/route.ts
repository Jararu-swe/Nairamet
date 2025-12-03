import { NextResponse } from "next/server";

/**
 * Force refresh currency rates by bypassing cache
 * WARNING: This makes a real API call to CurrencyLayer
 * Usage: curl https://www.nairamet.com/api/admin/refresh-rates
 */
export async function GET() {
  try {
    const apiKey = process.env.CURRENCYLAYER_API_KEY || "";
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    // Make a fresh API call (bypasses all caches)
    const response = await fetch(
      `https://api.currencylayer.com/live?access_key=${encodeURIComponent(apiKey)}&source=USD&format=1`,
      {
        cache: "no-store", // Force fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`CurrencyLayer API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`CurrencyLayer error: ${data.error?.info || "Unknown"}`);
    }

    // Clear tracker cache
    // @ts-ignore
    if ((globalThis as any).__NAIRAMET_TRACKER_CACHE) {
      (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
    }

    return NextResponse.json({
      success: true,
      message: "Rates refreshed successfully",
      timestamp: new Date().toISOString(),
      sampleRate: data.quotes?.USDNGN || "N/A",
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
