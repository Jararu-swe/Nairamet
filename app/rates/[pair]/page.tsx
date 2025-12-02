import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

const SUPPORTED_PAIRS = ["usd-ngn", "gbp-ngn", "eur-ngn", "cny-ngn"];

const PAIR_INFO: Record<string, { from: string; to: string; name: string }> = {
  "usd-ngn": { from: "USD", to: "NGN", name: "US Dollar to Nigerian Naira" },
  "gbp-ngn": { from: "GBP", to: "NGN", name: "British Pound to Nigerian Naira" },
  "eur-ngn": { from: "EUR", to: "NGN", name: "Euro to Nigerian Naira" },
  "cny-ngn": { from: "CNY", to: "NGN", name: "Chinese Yuan to Nigerian Naira" },
};

export async function generateStaticParams() {
  return SUPPORTED_PAIRS.map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Promise<Metadata> {
  const pairInfo = PAIR_INFO[params.pair];
  if (!pairInfo) return {};

  return {
    title: `${pairInfo.name} Exchange Rate Today | Live ${pairInfo.from}/NGN Rate`,
    description: `Current ${pairInfo.from} to NGN exchange rate. Track live ${pairInfo.from}/NGN rates including CBN official, black market, and parallel market rates. Updated every 5 minutes.`,
    keywords: [
      `${pairInfo.from} to NGN`,
      `${pairInfo.from} to naira`,
      `${pairInfo.from}/NGN rate`,
      `${pairInfo.from} exchange rate`,
      `${pairInfo.from.toLowerCase()} to naira today`,
      "black market rate",
      "CBN rate",
    ],
    openGraph: {
      title: `${pairInfo.name} - Live Exchange Rate`,
      description: `Track live ${pairInfo.from}/NGN rates. Compare CBN, black market, and parallel rates.`,
      type: "website",
    },
  };
}

async function getRateData(currency: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/tracker`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.rates?.find((r: any) => r.currency === currency);
  } catch {
    return null;
  }
}

export default async function CurrencyPairPage({
  params,
}: {
  params: { pair: string };
}) {
  const pairInfo = PAIR_INFO[params.pair];
  if (!pairInfo) notFound();

  const rateData = await getRateData(pairInfo.from);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    name: pairInfo.name,
    currency: pairInfo.to,
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: rateData?.blackMarket || 0,
      priceCurrency: pairInfo.to,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/tracker">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Rates
            </Link>
          </Button>

          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {pairInfo.name}
            </h1>
            <p className="text-muted-foreground">
              Live {pairInfo.from}/NGN exchange rate with CBN, black market, and
              parallel rates
            </p>
          </div>

          {rateData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      CBN Official Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ₦{rateData.cbn?.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-500">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      Black Market Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-emerald-600">
                      ₦{rateData.blackMarket?.toLocaleString()}
                    </p>
                    {rateData.change24h !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {rateData.change24h > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={
                            rateData.change24h > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {Math.abs(rateData.change24h).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      Parallel Market Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ₦{rateData.parallelMarket?.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>About {pairInfo.from}/NGN Exchange Rate</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p>
                    The {pairInfo.name} exchange rate shows how much Nigerian
                    Naira (NGN) you need to buy one {pairInfo.from}. We track
                    three different rates:
                  </p>
                  <ul>
                    <li>
                      <strong>CBN Official Rate:</strong> The Central Bank of
                      Nigeria's official exchange rate
                    </li>
                    <li>
                      <strong>Black Market Rate:</strong> The parallel market
                      rate where most transactions occur
                    </li>
                    <li>
                      <strong>Parallel Market Rate:</strong> The rate used by
                      money transfer services and remittances
                    </li>
                  </ul>
                  <p>
                    Our rates are updated every 5 minutes to ensure you have the
                    most current information for your currency exchange needs.
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button asChild size="lg" className="bg-emerald-600">
                  <Link href="/tracker">View All Exchange Rates</Link>
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Unable to load current rates. Please try again later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
