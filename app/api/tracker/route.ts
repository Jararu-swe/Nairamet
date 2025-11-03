import { NextResponse } from "next/server";

// Configure spreads via env or sensible defaults
const BM_SPREAD = Number(process.env.BLACK_MARKET_SPREAD || 0.035); // 3.5%
const PARALLEL_SPREAD = Number(
  process.env.PARALLEL_MARKET_SPREAD || process.env.REMITTANCE_SPREAD || 0.025
); // 2.5%

// Shared cache header for CDN/edge caching of API responses
const CACHE_CONTROL_HEADER =
  process.env.TRACKER_CACHE_HEADER || "s-maxage=300, stale-while-revalidate=600";

// Expanded fallback data used when live fetch fails
const FALLBACK_RATES = [
  { currency: "USD", official: 1580, blackMarket: 1620, remittance: 1595 },
  { currency: "GBP", official: 1950, blackMarket: 2000, remittance: 1975 },
  { currency: "EUR", official: 1720, blackMarket: 1760, remittance: 1740 },
  { currency: "CNY", official: 218, blackMarket: 225, remittance: 220 },
  { currency: "CAD", official: 1150, blackMarket: 1180, remittance: 1165 },
  { currency: "AUD", official: 1020, blackMarket: 1050, remittance: 1035 },
  { currency: "JPY", official: 10.2, blackMarket: 10.5, remittance: 10.35 },
  { currency: "CHF", official: 1750, blackMarket: 1790, remittance: 1770 },
  { currency: "ZAR", official: 85, blackMarket: 88, remittance: 86.5 },
  { currency: "AED", official: 430, blackMarket: 442, remittance: 436 },
  { currency: "SAR", official: 420, blackMarket: 432, remittance: 426 },
  { currency: "GHS", official: 120, blackMarket: 124, remittance: 122 },
];

export async function GET() {
  // Simple in-memory cache (module-level)
  const TTL = Number(process.env.TRACKER_CACHE_TTL || 60); // seconds
  // @ts-ignore
  if (!(globalThis as any).__NAIRAMET_TRACKER_CACHE)
    (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
  // @ts-ignore
  const CACHE = (globalThis as any).__NAIRAMET_TRACKER_CACHE as {
    [k: string]: any;
  };
  const cacheKey = "tracker:v2";

  // Return cached value if still valid
  const cached = CACHE[cacheKey];
  if (cached && cached.expiresAt && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  }

  const now = new Date().toISOString();

  // Assemble rates using the internal cached currency endpoint

  // Helper to compute spreads
  const withSpreads = (official: number) => ({
    official,
    blackMarket: Number((official * (1 + BM_SPREAD)).toFixed(2)),
    remittance: Number((official * (1 + PARALLEL_SPREAD)).toFixed(2)),
  });

  // Provide legacy/alias fields expected by various frontend consumers
  const addAliases = (base: { official: number; blackMarket: number; remittance: number }) => ({
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const currencyRes = await fetch(`${baseUrl}/api/currency`, {
      next: { revalidate: 300 }, // small cache for tracker assembly
      headers: { "User-Agent": "NairaMet/Tracker/1.0" },
    });
    if (!currencyRes.ok)
      throw new Error(`Currency API HTTP ${currencyRes.status}`);
    const currencyData = await currencyRes.json();

    const quotes: Record<string, number> = currencyData.quotes || {};
    const usdNgn = Number(quotes["USDNGN"] || 0);
    if (!usdNgn || Number.isNaN(usdNgn)) {
      throw new Error("Currency API missing USDNGN");
    }

    // Build rates from `${CODE}NGN` pairs (e.g., GBPNGN → GBP)
    const liveRates = Object.keys(quotes)
      .filter((pair) => pair.endsWith("NGN") && pair.length === 6)
      .map((pair) => {
        const code = pair.slice(0, 3);
        const official = Number(quotes[pair]);
        if (!official || Number.isNaN(official)) return null;
        const spreaded = withSpreads(official);
        return { currency: code, ...addAliases(spreaded) };
      })
      .filter(Boolean);

    const result = { timestamp: now, rates: liveRates };

    // Cache the result
    CACHE[cacheKey] = {
      data: result,
      expiresAt: Date.now() + TTL * 1000,
    };

    return NextResponse.json(result, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  } catch (error) {
    console.warn("Currencylayer fetch failed, using fallback.", error);
    const fallback = {
      timestamp: now,
      rates: FALLBACK_RATES.map((r) => ({
        currency: r.currency,
        ...addAliases({
          official: r.official,
          blackMarket: r.blackMarket,
          remittance: r.remittance,
        }),
      })),
    };
    // Cache fallback to avoid repeated failures
    CACHE[cacheKey] = {
      data: fallback,
      expiresAt: Date.now() + TTL * 1000,
    };
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  }
}
