import { NextResponse } from "next/server";
import { fetchRatesWithFallback } from "@/lib/currency-providers";

// Configure spreads via env or sensible defaults
const BM_SPREAD = Number(process.env.BLACK_MARKET_SPREAD || 0.035); // 3.5%
const PARALLEL_SPREAD = Number(
  process.env.PARALLEL_MARKET_SPREAD || process.env.REMITTANCE_SPREAD || 0.025
); // 2.5%

// Shared cache header for CDN/edge caching of API responses
const CACHE_CONTROL_HEADER =
  process.env.TRACKER_CACHE_HEADER ||
  "s-maxage=300, stale-while-revalidate=600";

// Updated fallback data with more current rates (as of Dec 2024)
const FALLBACK_RATES = [
  { currency: "USD", official: 1650, blackMarket: 1708, remittance: 1691 },
  { currency: "GBP", official: 2090, blackMarket: 2163, remittance: 2142 },
  { currency: "EUR", official: 1780, blackMarket: 1842, remittance: 1825 },
  { currency: "CNY", official: 228, blackMarket: 236, remittance: 234 },
  { currency: "CAD", official: 1180, blackMarket: 1221, remittance: 1210 },
  { currency: "AUD", official: 1070, blackMarket: 1107, remittance: 1097 },
  { currency: "JPY", official: 10.8, blackMarket: 11.2, remittance: 11.1 },
  { currency: "CHF", official: 1850, blackMarket: 1915, remittance: 1897 },
  { currency: "ZAR", official: 90, blackMarket: 93, remittance: 92 },
  { currency: "AED", official: 449, blackMarket: 465, remittance: 460 },
  { currency: "SAR", official: 440, blackMarket: 455, remittance: 451 },
  { currency: "GHS", official: 125, blackMarket: 129, remittance: 128 },
];

export async function GET() {
  // Simple in-memory cache (module-level) - 1 hour to match API cache
  const TTL = Number(process.env.TRACKER_CACHE_TTL || 3600); // seconds (1 hour)
  // @ts-ignore
  if (!(globalThis as any).__NAIRAMET_TRACKER_CACHE)
    (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
  // @ts-ignore
  const CACHE = (globalThis as any).__NAIRAMET_TRACKER_CACHE as {
    [k: string]: any;
  };
  // Cache key changes every 24 hours to match currency API cache
  const cacheVersion = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const cacheKey = `tracker:v7:${cacheVersion}`;
  const historyCacheKey = `tracker:history:${cacheVersion}`;

  // Return cached value if still valid
  const cached = CACHE[cacheKey];
  if (cached && cached.expiresAt && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=172800",
        "X-Cache-Status": "HIT",
      },
    });
  }

  // Get historical rates for 24h change calculation
  const history = CACHE[historyCacheKey] || {};

  // Helper to compute spreads
  const withSpreads = (official: number) => ({
    official,
    blackMarket: Number((official * (1 + BM_SPREAD)).toFixed(2)),
    remittance: Number((official * (1 + PARALLEL_SPREAD)).toFixed(2)),
  });

  // Provide legacy/alias fields expected by various frontend consumers
  const addAliases = (base: {
    official: number;
    blackMarket: number;
    remittance: number;
  }) => ({
    // existing canonical fields
    ...base,
    // official aliases
    cbn: base.official,
    cbnRate: base.official,
    cbn_rate: base.official,
    // black market aliases
    black_market: base.blackMarket,
    rate: base.blackMarket,
    // parallel/remittance aliases
    parallel: base.remittance,
    parallelMarket: base.remittance,
    parallel_market: base.remittance,
  });

  try {
    // Fetch rates from multiple providers with automatic fallback
    const rateResult = await fetchRatesWithFallback({
      cacheDuration: 3600, // 1 hour cache
    });

    if (!rateResult) {
      throw new Error("All currency API providers failed");
    }

    const quotes = rateResult.quotes;
    const usdNgn = Number(quotes["USDNGN"] || 0);
    if (!usdNgn || Number.isNaN(usdNgn)) {
      throw new Error("Missing USDNGN rate from providers");
    }

    // Build rates from `${CODE}NGN` pairs (e.g., GBPNGN → GBP)
    const liveRates = Object.keys(quotes)
      .filter((pair) => pair.endsWith("NGN") && pair.length === 6)
      .map((pair) => {
        const code = pair.slice(0, 3);
        const official = Number(quotes[pair]);
        if (!official || Number.isNaN(official)) return null;
        const spreaded = withSpreads(official);

        // Calculate 24h change
        const previousRate = history[code];
        let change24h = 0;
        if (previousRate && previousRate.blackMarket) {
          change24h =
            ((spreaded.blackMarket - previousRate.blackMarket) /
              previousRate.blackMarket) *
            100;
        }

        // Store current rate for next comparison
        history[code] = {
          blackMarket: spreaded.blackMarket,
          timestamp: Date.now(),
        };

        return {
          currency: code,
          ...addAliases(spreaded),
          change24h: Number(change24h.toFixed(2)),
          lastUpdated: new Date(
            rateResult.timestamp * 1000
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
      })
      .filter(Boolean);

    const result = {
      timestamp: new Date(rateResult.timestamp * 1000).toISOString(),
      lastUpdated: new Date(rateResult.timestamp * 1000).toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit", second: "2-digit" }
      ),
      source: rateResult.source,
      rates: liveRates,
    };

    // Cache the result
    CACHE[cacheKey] = {
      data: result,
      expiresAt: Date.now() + TTL * 1000,
    };

    // Update history cache (keep for 24 hours)
    CACHE[historyCacheKey] = history;

    return NextResponse.json(result, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=172800",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error) {
    console.warn("All currency providers failed, using fallback.", error);
    const now = new Date();
    const fallback = {
      timestamp: now.toISOString(),
      lastUpdated: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      source: "fallback",
      rates: FALLBACK_RATES.map((r) => {
        // Calculate 24h change for fallback data
        const previousRate = history[r.currency];
        let change24h = 0;
        if (previousRate && previousRate.blackMarket) {
          change24h =
            ((r.blackMarket - previousRate.blackMarket) /
              previousRate.blackMarket) *
            100;
        }

        // Store current rate
        history[r.currency] = {
          blackMarket: r.blackMarket,
          timestamp: Date.now(),
        };

        return {
          currency: r.currency,
          ...addAliases({
            official: r.official,
            blackMarket: r.blackMarket,
            remittance: r.remittance,
          }),
          change24h: Number(change24h.toFixed(2)),
          lastUpdated: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
      }),
    };
    // Cache fallback to avoid repeated failures
    CACHE[cacheKey] = {
      data: fallback,
      expiresAt: Date.now() + TTL * 1000,
    };

    // Update history cache
    CACHE[historyCacheKey] = history;

    return NextResponse.json(fallback, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  }
}
