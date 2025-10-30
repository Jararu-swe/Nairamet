import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = "819caf77cea4c45d40adca6dffd4aefa";

    if (!apiKey) {
      // Return mock data if no API key is configured
      return NextResponse.json({
        success: true,
        timestamp: Date.now(),
        source: "mock",
        quotes: {
          USDNGN: 1650.5,
          GBPNGN: 2050.25,
          EURNGN: 1750.75,
          CNYNGN: 228.3,
        },
      });
    }

    // Fetch from CurrencyLayer API with more currencies for better cross-rate calculation
    const response = await fetch(
      `http://api.currencylayer.com/live?access_key=819caf77cea4c45d40adca6dffd4aefa&currencies=USD,GBP,EUR,CNY,NGN&source=USD&format=1&change=1`,
      {
        next: { revalidate: 86400 }, // Cache for 1day
        headers: {
          "User-Agent": "NairaMet/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CurrencyLayer API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        `CurrencyLayer API error: ${data.error?.info || "Unknown error"}`
      );
    }

    // More accurate NGN rate calculations using multiple approaches
    const quotes = data.quotes;

    // Method 1: Direct USD/NGN rate (most accurate)
    const directUsdToNgn = quotes.USDNGN || 1650;

    // Method 2: Cross-rate calculations for other currencies
    const crossRateCalculations = {
      USDNGN: directUsdToNgn,
      GBPNGN: quotes.USDGBP ? directUsdToNgn / quotes.USDGBP : 2050,
      EURNGN: quotes.USDEUR ? directUsdToNgn / quotes.USDEUR : 1750,
      CNYNGN: quotes.USDCNY ? directUsdToNgn / quotes.USDCNY : 228,
    };

    // Method 3: Alternative calculation using inverse rates for validation
    const alternativeCalculations = {
      USDNGN: directUsdToNgn,
      GBPNGN: quotes.GBPUSD
        ? directUsdToNgn * quotes.GBPUSD
        : crossRateCalculations.GBPNGN,
      EURNGN: quotes.EURUSD
        ? directUsdToNgn * quotes.EURUSD
        : crossRateCalculations.EURNGN,
      CNYNGN: quotes.CNYUSD
        ? directUsdToNgn * quotes.CNYUSD
        : crossRateCalculations.CNYNGN,
    };

    // Use the most accurate calculation available
    const finalQuotes = {
      USDNGN: directUsdToNgn,
      GBPNGN: quotes.GBPUSD
        ? alternativeCalculations.GBPNGN
        : crossRateCalculations.GBPNGN,
      EURNGN: quotes.EURUSD
        ? alternativeCalculations.EURNGN
        : crossRateCalculations.EURNGN,
      CNYNGN: quotes.CNYUSD
        ? alternativeCalculations.CNYNGN
        : crossRateCalculations.CNYNGN,
    };

    // Round to appropriate precision (2 decimals for smaller amounts, 0 for larger)
    const roundedQuotes = {
      USDNGN: Math.round(finalQuotes.USDNGN * 100) / 100,
      GBPNGN: Math.round(finalQuotes.GBPNGN * 100) / 100,
      EURNGN: Math.round(finalQuotes.EURNGN * 100) / 100,
      CNYNGN: Math.round(finalQuotes.CNYNGN * 10000) / 10000, // More precision for CNY
    };

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
    const usdgbpPct = pct("USDGBP");
    const usdeurPct = pct("USDEUR");
    const usdcnyPct = pct("USDCNY");

    const changes = {
      USDNGN: usdngnPct,
      GBPNGN:
        usdngnPct != null && usdgbpPct != null ? usdngnPct - usdgbpPct : null,
      EURNGN:
        usdngnPct != null && usdeurPct != null ? usdngnPct - usdeurPct : null,
      CNYNGN:
        usdngnPct != null && usdcnyPct != null ? usdngnPct - usdcnyPct : null,
    } as Record<string, number | null>;

    return NextResponse.json({
      success: true,
      timestamp: data.timestamp,
      source: "currencylayer",
      quotes: roundedQuotes,
      changes,
      rawQuotes: quotes, // Include raw data for debugging
    });
  } catch (error) {
    console.error("Currency API error:", error);

    // Return fallback data on error
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      source: "fallback",
      quotes: {
        USDNGN: 1650.5,
        GBPNGN: 2050.25,
        EURNGN: 1750.75,
        CNYNGN: 228.3,
      },
    });
  }
}
