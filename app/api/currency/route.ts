import { NextResponse } from "next/server";
import {
  fetchRatesWithFallback,
  roundQuotes,
  FALLBACK_QUOTES,
} from "@/lib/currency-providers";

// Cache for 12 hours = ~60 API calls/month (2 calls/day × 30 days)
// This stays safely within free tier limits for all providers
const CACHE_DURATION = 43200; // 12 hours in seconds
const STALE_WHILE_REVALIDATE = 86400; // 24 hours in seconds

// Production-ready cache headers for Vercel Edge + Browser caching
const CACHE_CONTROL_HEADER =
  process.env.CURRENCY_CACHE_HEADER ||
  `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

// Enable ISR (Incremental Static Regeneration) with revalidation
export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    // Fetch from multiple providers with automatic fallback
    const result = await fetchRatesWithFallback({
      cacheDuration: CACHE_DURATION,
    });

    if (!result) {
      // All providers failed — return static fallback
      console.log("[Currency API] All providers failed, using fallback data");
      return NextResponse.json(
        {
          success: true,
          timestamp: Date.now(),
          source: "fallback",
          quotes: FALLBACK_QUOTES,
        },
        { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
      );
    }

    // Round values (more precision for very small numbers)
    const roundedQuotes = roundQuotes(result.quotes);

    console.log(
      `[Currency API] Fetched from ${result.source} at ${new Date().toISOString()}`
    );
    console.log(
      `[Currency API] Next revalidation in ${CACHE_DURATION / 3600} hours`
    );

    return NextResponse.json(
      {
        success: true,
        timestamp: result.timestamp,
        source: result.source,
        quotes: roundedQuotes,
      },
      { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
    );
  } catch (error) {
    console.error("Currency API error:", error);

    // Return fallback data on error
    return NextResponse.json(
      {
        success: true,
        timestamp: Date.now(),
        source: "fallback",
        quotes: FALLBACK_QUOTES,
      },
      { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
    );
  }
}
