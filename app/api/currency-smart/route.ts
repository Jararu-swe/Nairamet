import { NextResponse } from "next/server";

/**
 * Smart Currency API - Uses multiple sources with automatic fallback
 * Priority: CurrencyLayer → CurrencyFreaks → Fallback data
 */

const CACHE_DURATION = 43200; // 12 hours
const STALE_WHILE_REVALIDATE = 86400; // 24 hours
const CACHE_CONTROL_HEADER = `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

export const revalidate = 43200;

async function fetchFromCurrencyLayer() {
  const apiKey = process.env.CURRENCYLAYER_API_KEY || "";
  if (!apiKey) return null;

  try {
    const currenciesParam = [
      "USD", "NGN", "GBP", "EUR", "CNY", "JPY", "CAD", "AUD", "NZD", "ZAR",
      "CHF", "SEK", "NOK", "DKK", "GHS", "KES", "SAR", "AED", "INR",
    ].join(",");

    const response = await fetch(
      `http://apilayer.net/api/live?access_key=${apiKey}&currencies=${encodeURIComponent(currenciesParam)}&source=USD&format=1`,
      {
        next: { revalidate: CACHE_DURATION },
        headers: { "User-Agent": "NairaMet/1.0" },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success) return null;

    const quotes = data.quotes as Record<string, number>;
    const directUsdToNgn = quotes.USDNGN || 0;
    if (!directUsdToNgn) return null;

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

    return {
      source: "currencylayer",
      timestamp: data.timestamp,
      quotes: finalQuotes,
    };
  } catch (error) {
    console.error("CurrencyLayer error:", error);
    return null;
  }
}

async function fetchFromCurrencyFreaks() {
  const apiKey = process.env.CURRENCYFREAKS_API_KEY || "";
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`,
      {
        next: { revalidate: CACHE_DURATION },
        headers: { "User-Agent": "NairaMet/1.0" },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const rates = data.rates as Record<string, string>;
    const ngnRate = parseFloat(rates.NGN || "0");
    if (!ngnRate) return null;

    const finalQuotes: Record<string, number> = { USDNGN: ngnRate };
    Object.entries(rates).forEach(([currency, rateStr]) => {
      if (currency !== "NGN" && currency !== "USD") {
        const rate = parseFloat(rateStr);
        if (!isNaN(rate) && rate > 0) {
          finalQuotes[`${currency}NGN`] = ngnRate / rate;
        }
      }
    });

    return {
      source: "currencyfreaks",
      timestamp: new Date(data.date).getTime(),
      quotes: finalQuotes,
    };
  } catch (error) {
    console.error("CurrencyFreaks error:", error);
    return null;
  }
}

export async function GET() {
  try {
    // Try CurrencyLayer first (primary)
    let result = await fetchFromCurrencyLayer();
    
    // Fallback to CurrencyFreaks if CurrencyLayer fails
    if (!result) {
      console.log("[Smart API] CurrencyLayer failed, trying CurrencyFreaks...");
      result = await fetchFromCurrencyFreaks();
    }

    // If both fail, use fallback data
    if (!result) {
      console.log("[Smart API] Both APIs failed, using fallback data");
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

    // Round values
    const roundedQuotes: Record<string, number> = {};
    Object.entries(result.quotes).forEach(([pair, val]) => {
      const precision = val < 10 ? 4 : 2;
      const factor = Math.pow(10, precision);
      roundedQuotes[pair] = Math.round(val * factor) / factor;
    });

    console.log(`[Smart API] Successfully fetched from ${result.source}`);

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
    console.error("Smart Currency API error:", error);

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
