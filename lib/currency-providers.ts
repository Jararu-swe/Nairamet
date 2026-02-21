/**
 * Multi-source currency rate providers with automatic fallback.
 *
 * Priority order:
 *   1. CurrencyLayer   (CURRENCYLAYER_API_KEY)
 *   2. ExchangeRate-API (EXCHANGERATE_API_KEY)
 *   3. Open Exchange Rates (OPEN_EXCHANGE_RATES_APP_ID)
 *
 * Each provider normalises its response into a common CurrencyResult shape
 * with XXXNGN quote pairs (e.g. USDNGN, GBPNGN).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CurrencyResult {
  /** Which provider returned the data */
  source: string;
  /** Unix timestamp (seconds) of the rate snapshot */
  timestamp: number;
  /** Currency pair quotes – key format: `${CODE}NGN`, value: rate */
  quotes: Record<string, number>;
}

export interface FetchOptions {
  /** Next.js fetch cache behaviour – defaults to ISR revalidation */
  cacheDuration?: number;
  /** If true, bypasses all caches (for admin / cron force-refresh) */
  noCache?: boolean;
}

// ---------------------------------------------------------------------------
// Curated currency list (shared across all providers)
// ---------------------------------------------------------------------------

export const CURATED_CURRENCIES = [
  "USD", "NGN", "GBP", "EUR", "CNY", "JPY", "CAD", "AUD", "NZD", "ZAR",
  "CHF", "SEK", "NOK", "DKK", "GHS", "XOF", "XAF", "KES", "UGX", "TZS",
  "EGP", "MAD", "TND", "ZMW", "SAR", "AED", "QAR", "KWD", "BHD", "INR",
  "PKR", "BDT", "GMD", "SLL", "LRD", "CDF", "ETB", "SOS",
];

// ---------------------------------------------------------------------------
// 1. CurrencyLayer
// ---------------------------------------------------------------------------

async function fetchFromCurrencyLayer(
  opts: FetchOptions = {}
): Promise<CurrencyResult | null> {
  const apiKey =
    process.env.CURRENCYLAYER_API_KEY ||
    process.env.CURRENCY_LAYER_API_KEY ||
    "";
  if (!apiKey) return null;

  try {
    const currenciesParam =
      process.env.CURRENCYLAYER_CURRENCIES || CURATED_CURRENCIES.join(",");

    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      headers: { "User-Agent": "NairaMet/1.0" },
    };

    if (opts.noCache) {
      fetchOpts.cache = "no-store";
    } else {
      fetchOpts.next = { revalidate: opts.cacheDuration ?? 43200 };
    }

    const response = await fetch(
      `https://api.currencylayer.com/live?access_key=${encodeURIComponent(
        apiKey
      )}&currencies=${encodeURIComponent(currenciesParam)}&source=USD&format=1`,
      fetchOpts
    );

    if (!response.ok) {
      console.warn(`[CurrencyLayer] HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.success) {
      console.warn(
        `[CurrencyLayer] API error: ${data.error?.info || "Unknown"}`
      );
      return null;
    }

    const rawQuotes = data.quotes as Record<string, number>;
    const directUsdToNgn = rawQuotes.USDNGN || 0;
    if (!directUsdToNgn) return null;

    const quotes = buildNgnQuotes(rawQuotes, directUsdToNgn, "USD");

    console.log(
      `[CurrencyLayer] ✓ Fetched ${Object.keys(quotes).length} pairs (USDNGN=${directUsdToNgn})`
    );

    return {
      source: "currencylayer",
      timestamp: data.timestamp ?? Math.floor(Date.now() / 1000),
      quotes,
    };
  } catch (error) {
    console.error("[CurrencyLayer] Fetch failed:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. ExchangeRate-API  (v6)
//    Docs: https://www.exchangerate-api.com/docs/standard-requests
// ---------------------------------------------------------------------------

async function fetchFromExchangeRateApi(
  opts: FetchOptions = {}
): Promise<CurrencyResult | null> {
  const apiKey = process.env.EXCHANGERATE_API_KEY || "";
  if (!apiKey) return null;

  try {
    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      headers: { "User-Agent": "NairaMet/1.0" },
    };

    if (opts.noCache) {
      fetchOpts.cache = "no-store";
    } else {
      fetchOpts.next = { revalidate: opts.cacheDuration ?? 43200 };
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${encodeURIComponent(
        apiKey
      )}/latest/USD`,
      fetchOpts
    );

    if (!response.ok) {
      console.warn(`[ExchangeRate-API] HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.result !== "success") {
      console.warn(
        `[ExchangeRate-API] API error: ${data["error-type"] || "Unknown"}`
      );
      return null;
    }

    const rates = data.conversion_rates as Record<string, number>;
    const ngnRate = rates.NGN || 0;
    if (!ngnRate) return null;

    // rates are USD→X, so XXXNGN = ngnRate / rates[X]
    const quotes: Record<string, number> = { USDNGN: ngnRate };
    for (const [currency, rate] of Object.entries(rates)) {
      if (
        currency !== "NGN" &&
        currency !== "USD" &&
        typeof rate === "number" &&
        rate > 0
      ) {
        quotes[`${currency}NGN`] = ngnRate / rate;
      }
    }

    console.log(
      `[ExchangeRate-API] ✓ Fetched ${Object.keys(quotes).length} pairs (USDNGN=${ngnRate})`
    );

    return {
      source: "exchangerate-api",
      timestamp: data.time_last_update_unix ?? Math.floor(Date.now() / 1000),
      quotes,
    };
  } catch (error) {
    console.error("[ExchangeRate-API] Fetch failed:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. Open Exchange Rates
//    Docs: https://docs.openexchangerates.org/reference/latest-json
// ---------------------------------------------------------------------------

async function fetchFromOpenExchangeRates(
  opts: FetchOptions = {}
): Promise<CurrencyResult | null> {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID || "";
  if (!appId) return null;

  try {
    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      headers: { "User-Agent": "NairaMet/1.0" },
    };

    if (opts.noCache) {
      fetchOpts.cache = "no-store";
    } else {
      fetchOpts.next = { revalidate: opts.cacheDuration ?? 43200 };
    }

    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(
        appId
      )}`,
      fetchOpts
    );

    if (!response.ok) {
      console.warn(`[OpenExchangeRates] HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    const rates = data.rates as Record<string, number>;
    if (!rates) {
      console.warn("[OpenExchangeRates] No rates in response");
      return null;
    }

    const ngnRate = rates.NGN || 0;
    if (!ngnRate) return null;

    // rates are USD→X, so XXXNGN = ngnRate / rates[X]
    const quotes: Record<string, number> = { USDNGN: ngnRate };
    for (const [currency, rate] of Object.entries(rates)) {
      if (
        currency !== "NGN" &&
        currency !== "USD" &&
        typeof rate === "number" &&
        rate > 0
      ) {
        quotes[`${currency}NGN`] = ngnRate / rate;
      }
    }

    console.log(
      `[OpenExchangeRates] ✓ Fetched ${Object.keys(quotes).length} pairs (USDNGN=${ngnRate})`
    );

    return {
      source: "openexchangerates",
      timestamp: data.timestamp ?? Math.floor(Date.now() / 1000),
      quotes,
    };
  } catch (error) {
    console.error("[OpenExchangeRates] Fetch failed:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Fallback orchestrator
// ---------------------------------------------------------------------------

/**
 * Try all providers in priority order and return the first successful result.
 * Returns `null` only if every provider fails.
 */
export async function fetchRatesWithFallback(
  opts: FetchOptions = {}
): Promise<CurrencyResult | null> {
  // 1. CurrencyLayer (primary)
  const cl = await fetchFromCurrencyLayer(opts);
  if (cl) return cl;
  console.log("[RateFallback] CurrencyLayer failed, trying ExchangeRate-API…");

  // 2. ExchangeRate-API
  const era = await fetchFromExchangeRateApi(opts);
  if (era) return era;
  console.log(
    "[RateFallback] ExchangeRate-API failed, trying Open Exchange Rates…"
  );

  // 3. Open Exchange Rates
  const oxr = await fetchFromOpenExchangeRates(opts);
  if (oxr) return oxr;
  console.log("[RateFallback] All providers failed");

  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build XXXNGN pairs from CurrencyLayer-style USDxxx raw quotes */
function buildNgnQuotes(
  rawQuotes: Record<string, number>,
  directUsdToNgn: number,
  prefix: string
): Record<string, number> {
  const quotes: Record<string, number> = { USDNGN: directUsdToNgn };

  for (const [key, value] of Object.entries(rawQuotes)) {
    if (key.startsWith(prefix) && key.length === prefix.length + 3) {
      const cur = key.slice(prefix.length);
      if (typeof value === "number" && value > 0 && cur !== "NGN") {
        quotes[`${cur}NGN`] = directUsdToNgn / value;
      }
    }
  }

  return quotes;
}

/** Round quote values: 4 decimal places for values < 10, 2 otherwise */
export function roundQuotes(
  quotes: Record<string, number>
): Record<string, number> {
  const rounded: Record<string, number> = {};
  for (const [pair, val] of Object.entries(quotes)) {
    const precision = val < 10 ? 4 : 2;
    const factor = Math.pow(10, precision);
    rounded[pair] = Math.round(val * factor) / factor;
  }
  return rounded;
}

/** Static fallback data used when all providers are unavailable */
export const FALLBACK_QUOTES: Record<string, number> = {
  USDNGN: 1650.5,
  GBPNGN: 2050.25,
  EURNGN: 1750.75,
  CNYNGN: 228.3,
};
