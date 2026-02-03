import { NextResponse } from "next/server";

// Cache for 12 hours
const CACHE_DURATION = 43200; // 12 hours in seconds
const STALE_WHILE_REVALIDATE = 86400; // 24 hours in seconds
const CACHE_CONTROL_HEADER = `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const apiKey = process.env.CURRENCYFREAKS_API_KEY || "";

    if (!apiKey) {
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

    // Fetch from CurrencyFreaks API
    const response = await fetch(
      `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`,
      {
        next: { revalidate: CACHE_DURATION },
        headers: {
          "User-Agent": "NairaMet/1.0",
        },
      }
    );

    console.log(`[CurrencyFreaks API] Fetched fresh data at ${new Date().toISOString()}`);

    if (!response.ok) {
      throw new Error(`CurrencyFreaks API error: ${response.status}`);
    }

    const data = await response.json();

    // CurrencyFreaks response format:
    // { "date": "2023-03-21", "base": "USD", "rates": { "NGN": "1650.5", "GBP": "0.79", ... } }

    const rates = data.rates as Record<string, string>;
    const ngnRate = parseFloat(rates.NGN || "1650");

    if (!ngnRate) {
      throw new Error("NGN rate not found in response");
    }

    // Build XXXNGN pairs
    const finalQuotes: Record<string, number> = { USDNGN: ngnRate };

    Object.entries(rates).forEach(([currency, rateStr]) => {
      if (currency !== "NGN" && currency !== "USD") {
        const rate = parseFloat(rateStr);
        if (!isNaN(rate) && rate > 0) {
          // Convert: if 1 USD = X currency, then 1 currency = (NGN/X) NGN
          finalQuotes[`${currency}NGN`] = ngnRate / rate;
        }
      }
    });

    // Round values
    const roundedQuotes: Record<string, number> = {};
    Object.entries(finalQuotes).forEach(([pair, val]) => {
      const precision = val < 10 ? 4 : 2;
      const factor = Math.pow(10, precision);
      roundedQuotes[pair] = Math.round(val * factor) / factor;
    });

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date(data.date).getTime(),
        source: "currencyfreaks",
        quotes: roundedQuotes,
        rawRates: rates,
      },
      { headers: { "Cache-Control": CACHE_CONTROL_HEADER } }
    );
  } catch (error) {
    console.error("CurrencyFreaks API error:", error);

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
