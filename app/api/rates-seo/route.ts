import { NextResponse } from "next/server";

/**
 * SEO-friendly endpoint that returns current rates in structured format
 * This can be used by search engines to index current exchange rates
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const trackerRes = await fetch(`${baseUrl}/api/tracker`, {
      next: { revalidate: 300 },
    });

    if (!trackerRes.ok) {
      throw new Error("Failed to fetch rates");
    }

    const data = await trackerRes.json();
    const rates = data.rates || [];

    // Generate structured data for each currency pair
    const currencyExchangeData = rates.map((rate: any) => ({
      "@context": "https://schema.org",
      "@type": "ExchangeRateSpecification",
      currency: "NGN",
      currentExchangeRate: {
        "@type": "UnitPriceSpecification",
        price: rate.blackMarket || rate.rate,
        priceCurrency: "NGN",
      },
      exchangeRateSpread: {
        "@type": "MonetaryAmount",
        currency: "NGN",
        value: rate.blackMarket - rate.cbn,
      },
    }));

    // Generate human-readable text for SEO
    const seoText = rates
      .map((rate: any) => {
        const currency = rate.currency;
        const official = rate.cbn || rate.official;
        const blackMarket = rate.blackMarket || rate.rate;
        const parallel = rate.parallelMarket || rate.parallel;

        return `${currency} to NGN: Official CBN rate is ₦${official.toLocaleString()}, Black market rate is ₦${blackMarket.toLocaleString()}, Parallel market rate is ₦${parallel.toLocaleString()}. Last updated: ${data.timestamp}.`;
      })
      .join(" ");

    return NextResponse.json(
      {
        success: true,
        timestamp: data.timestamp,
        seoText,
        structuredData: currencyExchangeData,
        rates: rates.map((rate: any) => ({
          currency: rate.currency,
          official: rate.cbn || rate.official,
          blackMarket: rate.blackMarket || rate.rate,
          parallel: rate.parallelMarket || rate.parallel,
          change24h: rate.change24h || 0,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}
