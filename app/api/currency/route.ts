import { NextResponse } from "next/server";

// Cache for 12 hours = ~60 API calls/month (2 calls/day × 30 days)
// This stays safely within the 100 calls/month free tier limit
const CACHE_DURATION = 43200; // 12 hours in seconds
const STALE_WHILE_REVALIDATE = 86400; // 24 hours in seconds

// Production-ready cache headers for Vercel Edge + Browser caching
const CACHE_CONTROL_HEADER =
  process.env.CURRENCY_CACHE_HEADER || 
  `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

// Enable ISR (Incremental Static Regeneration) with revalidation
// Note: Must be a literal number, not a variable
export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const apiKey =
      process.env.CURRENCYLAYER_API_KEY || process.env.CURRENCY_LAYER_API_KEY || "";
    // Comma-separated ISO codes for currencies to include (USD base). You can override via env.
    const currenciesParam =
      process.env.CURRENCYLAYER_CURRENCIES ||
      [
        "USD",
        "NGN",
        "GBP",
        "EUR",
        "CNY",
        "JPY",
        "CAD",
        "AUD",
        "NZD",
        "ZAR",
        "CHF",
        "SEK",
        "NOK",
        "DKK",
        "GHS",
        "XOF",
        "XAF",
        "KES",
        "UGX",
        "TZS",
        "EGP",
        "MAD",
        "TND",
        "ZMW",
        "XOF",
        "XAF",
        "CFA",
        "SAR",
        "AED",
        "QAR",
        "KWD",
        "BHD",
        "INR",
        "PKR",
        "BDT",
        "GMD",
        "SLL",
        "LRD",
        "CDF",
        "ETB",
        "SOS",
      ].join(",");

    if (!apiKey) {
      // Return mock data if no API key is configured
      return NextResponse.json(
        {
          success: true,
          timestamp: Date.now(),
          source: "mock",
          quotes: {
            USDNGN: 1650.5,
            GBPNGN: 2050.25,
            EURNGN: 1750.75,
            CNYNGN: 228.3,
          },
        },
        { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
      );
    }

    // Fetch from CurrencyLayer API (request broad set) — cached for 12 hours
    const response = await fetch(
      `http://apilayer.net/api/live?access_key=${apiKey}&currencies=${encodeURIComponent(
        currenciesParam
      )}&source=USD&format=1`,
      {
        next: { revalidate: CACHE_DURATION }, // Cache for 12 hours
        headers: {
          "User-Agent": "NairaMet/1.0",
        },
      }
    );

    // Log API call for monitoring (production: use proper logging service)
    console.log(`[Currency API] Fetched fresh data at ${new Date().toISOString()}`);
    console.log(`[Currency API] Next revalidation in ${CACHE_DURATION / 3600} hours`);

    if (!response.ok) {
      throw new Error(`CurrencyLayer API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        `CurrencyLayer API error: ${data.error?.info || "Unknown error"}`
      );
    }

    // Build XXXNGN for all currencies returned by Currencylayer
    const quotes = data.quotes as Record<string, number>;
    const directUsdToNgn = quotes.USDNGN || 1650;

    const finalQuotes: Record<string, number> = { USDNGN: directUsdToNgn };
    Object.keys(quotes).forEach((k) => {
      if (k.startsWith("USD") && k.length === 6) {
        const cur = k.slice(3);
        const usdToCur = quotes[k];
        if (typeof usdToCur === "number" && usdToCur > 0) {
          finalQuotes[`${cur}NGN`] = directUsdToNgn / usdToCur;
        }
      }
    });

    // Round values (more precision for very small numbers)
    const roundedQuotes: Record<string, number> = {};
    Object.entries(finalQuotes).forEach(([pair, val]) => {
      const precision = val < 10 ? 4 : 2;
      const factor = Math.pow(10, precision);
      roundedQuotes[pair] = Math.round(val * factor) / factor;
    });

    // Compute 24h percentage changes if available
    const changeData = (data as any).change || {};
    const pct = (pair: string) => {
      const c = changeData[pair];
      if (!c) return null;
      if (typeof c.change_pct === "number") return c.change_pct;
      if (
        typeof c.start_rate === "number" &&
        typeof c.end_rate === "number" &&
        c.start_rate
      ) {
        return ((c.end_rate - c.start_rate) / c.start_rate) * 100;
      }
      return null;
    };

    const usdngnPct = pct("USDNGN");
    const changes: Record<string, number | null> = { USDNGN: usdngnPct };
    Object.keys(quotes).forEach((k) => {
      if (k.startsWith("USD") && k.length === 6) {
        const cur = k.slice(3);
        const usdX = pct(k);
        changes[`${cur}NGN`] =
          usdngnPct != null && usdX != null ? usdngnPct - usdX : null;
      }
    });

    return NextResponse.json(
      {
        success: true,
        timestamp: data.timestamp,
        source: "currencylayer",
        quotes: roundedQuotes,
        changes,
        rawQuotes: quotes, // Include raw data for debugging
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
        quotes: {
          USDNGN: 1650.5,
          GBPNGN: 2050.25,
          EURNGN: 1750.75,
          CNYNGN: 228.3,
        },
      },
      { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
    );
  }
}
