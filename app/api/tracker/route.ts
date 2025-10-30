import { NextResponse } from "next/server";

// Configure spreads via env or sensible defaults
const BM_SPREAD = Number(process.env.BLACK_MARKET_SPREAD || 0.035); // 3.5%
const PARALLEL_SPREAD = Number(
  process.env.PARALLEL_MARKET_SPREAD || process.env.REMITTANCE_SPREAD || 0.025
); // 2.5%

export async function GET() {
  // Simple in-memory cache (module-level) - survives for the lifetime of the server process.
  const TTL = Number(process.env.TRACKER_CACHE_TTL || 30); // seconds
  // @ts-ignore
  if (!(globalThis as any).__NAIRAMET_TRACKER_CACHE)
    (globalThis as any).__NAIRAMET_TRACKER_CACHE = {};
  // @ts-ignore
  const CACHE = (globalThis as any).__NAIRAMET_TRACKER_CACHE as {
    [k: string]: any;
  };
  const cacheKey = "tracker:v1";

  // Return cached value if still valid
  const cached = CACHE[cacheKey];
  if (cached && cached.expiresAt && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const now = new Date().toISOString();

    // 1) Try local currency route first for quotes/changes
    let clQuotes: Record<string, number> | null = null;
    let changeData: Record<string, number | null> | null = null;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const origin =
        baseUrl && /^https?:\/\//.test(baseUrl)
          ? baseUrl
          : `http://localhost:${process.env.PORT || 3000}`;
      const currencyUrl = new URL("/api/currency", origin).toString();
      const baseRes = await fetch(currencyUrl, { next: { revalidate: 60 } });
      if (baseRes.ok) {
        const baseData = await baseRes.json();
        if (baseData?.quotes) clQuotes = baseData.quotes;
        if (baseData?.changes) changeData = baseData.changes;
      }
    } catch (e) {
      console.warn("Local currency route fetch failed", e);
      clQuotes = null;
      changeData = null;
    }

    // helper to extract numbers from HTML using multiple regexes
    const scrapeNumberFromHtml = (html: string, regexes: RegExp[]) => {
      for (const re of regexes) {
        const m = re.exec(html);
        if (m && m[1]) {
          const num = Number(String(m[1]).replace(/[,\s]/g, ""));
          if (Number.isFinite(num)) return num;
        }
      }
      return null;
    };

    // 2) Scrape CBN for USD if possible
    let cbnUSD: number | null = null;
    try {
      const cbnRes = await fetch(
        "https://www.cbn.gov.ng/rates/exratebycurrency.asp"
      );
      if (cbnRes.ok) {
        const html = await cbnRes.text();
        const usdPatterns = [
          /US\$\s*\(?1\)?\s*=\s*N\s*([0-9,]+\.?[0-9]*)/i,
          /USD[^\d]*([0-9,]+\.?[0-9]*)\s*NGN/i,
          /1\s*USD\s*=\s*NGN\s*([0-9,]+\.?[0-9]*)/i,
        ];
        cbnUSD = scrapeNumberFromHtml(html, usdPatterns);
      }
    } catch (e) {
      console.warn("CBN scrape failed", e);
      cbnUSD = null;
    }

    // 3) Scrape black-market (AbokiFX) if possible
    let blackUSD: number | null = null;
    try {
      const bmRes = await fetch("https://www.abokifx.com/");
      if (bmRes.ok) {
        const html = await bmRes.text();
        const bmPatterns = [
          /USD[^\d]*([0-9,]+\.?[0-9]*)/i,
          /"USD"\s*:\s*([0-9]+\.?[0-9]*)/i,
        ];
        blackUSD = scrapeNumberFromHtml(html, bmPatterns);
      }
    } catch (e) {
      console.warn("Black market scrape failed", e);
      blackUSD = null;
    }

    // helpers to pick values
    const getParallel = (key: string, fallbackBase: number) => {
      const val = clQuotes?.[key];
      if (typeof val === "number") return Math.round(val * 100) / 100;
      return Math.round(fallbackBase * (1 + PARALLEL_SPREAD) * 100) / 100;
    };

    const getCBN = (clBase: number) => {
      if (cbnUSD && Number.isFinite(cbnUSD))
        return Math.round(cbnUSD * 100) / 100;
      return Math.round(clBase * 100) / 100;
    };

    const getBlack = (clBase: number) => { 
      if (blackUSD && Number.isFinite(blackUSD))
        return Math.round(blackUSD * 100) / 100;
      return Math.round(clBase * (1 + BM_SPREAD) * 100) / 100;
    };

    // determine base values (from clQuotes if available)
    const usdBase = clQuotes?.USDNGN ?? 1650;
    const gbpBase = clQuotes?.GBPNGN ?? 2050;
    const eurBase = clQuotes?.EURNGN ?? 1750;
    const cnyBase = clQuotes?.CNYNGN ?? 228;

    const payload = [
      {
        currency: "USD",
        symbol: "$",
        flag: "🇺🇸",
        cbn: getCBN(usdBase),
        blackMarket: getBlack(usdBase),
        parallelMarket: getParallel("USDNGN", usdBase),
        change24h: changeData?.USDNGN ?? null,
        lastUpdated: now,
      },
      {
        currency: "GBP",
        symbol: "£",
        flag: "🇬🇧",
        cbn: getCBN(gbpBase),
        blackMarket: getBlack(gbpBase),
        parallelMarket: getParallel("GBPNGN", gbpBase),
        change24h: changeData?.GBPNGN ?? null,
        lastUpdated: now,
      },
      {
        currency: "EUR",
        symbol: "€",
        flag: "🇪🇺",
        cbn: getCBN(eurBase),
        blackMarket: getBlack(eurBase),
        parallelMarket: getParallel("EURNGN", eurBase),
        change24h: changeData?.EURNGN ?? null,
        lastUpdated: now,
      },
      {
        currency: "CNY",
        symbol: "¥",
        flag: "🇨🇳",
        cbn: getCBN(cnyBase),
        blackMarket: getBlack(cnyBase),
        parallelMarket: getParallel("CNYNGN", cnyBase),
        change24h: changeData?.CNYNGN ?? null,
        lastUpdated: now,
      },
    ];

    const result = {
      success: true,
      rates: payload,
      timestamp: Date.now(),
      source: clQuotes ? "local+scrape" : "scrape+fallback",
    };
    // cache
    CACHE[cacheKey] = {
      ts: Date.now(),
      expiresAt: Date.now() + TTL * 1000,
      data: result,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Tracker API error:", error);
    // fallback
    const fallback = [
      { currency: "USD", symbol: "$", flag: "🇺🇸", base: 1650 },
      { currency: "GBP", symbol: "£", flag: "🇬🇧", base: 2050 },
      { currency: "EUR", symbol: "€", flag: "🇪🇺", base: 1750 },
      { currency: "CNY", symbol: "¥", flag: "🇨🇳", base: 228 },
    ];
    const now = new Date().toISOString();
    const payload = fallback.map((f) => ({
      currency: f.currency,
      symbol: f.symbol,
      flag: f.flag,
      cbn: f.base,
      blackMarket: Math.round(f.base * (1 + BM_SPREAD)),
      parallelMarket: Math.round(f.base * (1 + PARALLEL_SPREAD)),
      change24h: null,
      lastUpdated: now,
    }));
    const result = { success: true, rates: payload, source: "fallback" };
    CACHE[cacheKey] = {
      ts: Date.now(),
      expiresAt: Date.now() + TTL * 1000,
      data: result,
    };
    return NextResponse.json(result);
  }
}
