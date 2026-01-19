import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator } from "lucide-react";
import { InFeedAd, BottomBannerAd } from "@/components/monetag-ad";

const SUPPORTED_CURRENCIES = ["usd", "gbp", "eur", "cny", "zar", "ghs", "kes", "aed", "sar", "inr", "jpy", "cad", "aud"];
const POPULAR_AMOUNTS = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];

const CURRENCY_NAMES: Record<string, string> = {
  usd: "US Dollar", gbp: "British Pound", eur: "Euro", cny: "Chinese Yuan",
  zar: "South African Rand", ghs: "Ghanaian Cedi", kes: "Kenyan Shilling",
  aed: "UAE Dirham", sar: "Saudi Riyal", inr: "Indian Rupee",
  jpy: "Japanese Yen", cad: "Canadian Dollar", aud: "Australian Dollar",
  ngn: "Nigerian Naira",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$", gbp: "£", eur: "€", cny: "¥", zar: "R", ghs: "₵",
  kes: "KSh", aed: "د.إ", sar: "﷼", inr: "₹", jpy: "¥",
  cad: "C$", aud: "A$", ngn: "₦",
};

function parseSlug(slug: string): { amount: number; from: string; to: string } | null {
  // Format: "100-usd-to-ngn"
  const match = slug.match(/^(\d+)-([a-z]{3})-to-([a-z]{3})$/i);
  if (!match) return null;
  
  const [, amountStr, from, to] = match;
  const amount = parseInt(amountStr);
  
  if (isNaN(amount) || amount <= 0) return null;
  if (!SUPPORTED_CURRENCIES.includes(from.toLowerCase())) return null;
  if (to.toLowerCase() !== 'ngn') return null;
  
  return { amount, from: from.toLowerCase(), to: to.toLowerCase() };
}

export async function generateStaticParams() {
  const params = [];
  for (const from of SUPPORTED_CURRENCIES) {
    for (const amount of POPULAR_AMOUNTS) {
      params.push({ slug: `${amount}-${from}-to-ngn` });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};

  const { amount, from, to } = parsed;
  const fromName = CURRENCY_NAMES[from];
  const toName = CURRENCY_NAMES[to];
  const formattedAmount = amount.toLocaleString();
  
  return {
    title: `${formattedAmount} ${from.toUpperCase()} to ${to.toUpperCase()} - Convert ${fromName} to ${toName}`,
    description: `Convert ${formattedAmount} ${fromName} to Nigerian Naira. Live exchange rate with CBN, black market, and parallel market rates. Updated every 5 minutes.`,
    keywords: [
      `${amount} ${from} to ${to}`,
      `${amount} ${from} to naira`,
      `how much is ${amount} ${from} in naira`,
      `${from} to ${to} converter`,
      `${formattedAmount} ${from} to naira`,
    ],
    openGraph: {
      title: `${formattedAmount} ${from.toUpperCase()} to ${to.toUpperCase()} Converter`,
      description: `Convert ${formattedAmount} ${fromName} to Nigerian Naira with live rates`,
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
    return data.rates?.find((r: any) => r.currency === currency.toUpperCase());
  } catch {
    return null;
  }
}

export default async function ConvertPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { amount, from, to } = parsed;
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  const rateData = await getRateData(fromUpper);
  const fromName = CURRENCY_NAMES[from];
  const fromSymbol = CURRENCY_SYMBOLS[from];

  const cbnResult = rateData?.cbn ? (amount * rateData.cbn).toFixed(2) : null;
  const blackMarketResult = rateData?.blackMarket ? (amount * rateData.blackMarket).toFixed(2) : null;
  const parallelResult = rateData?.parallelMarket ? (amount * rateData.parallelMarket).toFixed(2) : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${amount} ${fromUpper} to NGN Converter`,
    description: `Convert ${amount} ${fromName} to Nigerian Naira`,
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      price: blackMarketResult || "0",
      priceCurrency: "NGN",
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
              Back to Tracker
            </Link>
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl font-bold text-foreground">
                {amount.toLocaleString()} {fromUpper} to NGN
              </h1>
            </div>
            <p className="text-muted-foreground">
              Convert {fromName} to Nigerian Naira with live rates
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
                    <p className="text-sm text-muted-foreground mb-1">
                      1 {fromUpper} = ₦{rateData.cbn?.toLocaleString()}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      ₦{cbnResult ? parseFloat(cbnResult).toLocaleString() : "N/A"}
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
                    <p className="text-sm text-muted-foreground mb-1">
                      1 {fromUpper} = ₦{rateData.blackMarket?.toLocaleString()}
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      ₦{blackMarketResult ? parseFloat(blackMarketResult).toLocaleString() : "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      Parallel Market Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-1">
                      1 {fromUpper} = ₦{rateData.parallelMarket?.toLocaleString()}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      ₦{parallelResult ? parseFloat(parallelResult).toLocaleString() : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Popular {fromUpper} to NGN Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {POPULAR_AMOUNTS.filter(a => a !== amount).slice(0, 8).map((amt) => (
                      <Link
                        key={amt}
                        href={`/convert/${amt}-${from}-to-ngn`}
                        className="p-3 border rounded hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                      >
                        <p className="text-sm text-muted-foreground">{fromSymbol}{amt.toLocaleString()}</p>
                        <p className="font-semibold text-emerald-600">
                          ₦{rateData.blackMarket ? (amt * rateData.blackMarket).toLocaleString(undefined, {maximumFractionDigits: 0}) : "N/A"}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About This Conversion</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p>
                    Converting {amount.toLocaleString()} {fromName} ({fromUpper}) to Nigerian Naira (NGN) 
                    gives you different amounts depending on which exchange rate you use:
                  </p>
                  <ul>
                    <li>
                      <strong>CBN Official Rate:</strong> The Central Bank of Nigeria's official rate, 
                      typically used for government transactions
                    </li>
                    <li>
                      <strong>Black Market Rate:</strong> The parallel market rate where most retail 
                      currency exchanges happen
                    </li>
                    <li>
                      <strong>Parallel Market Rate:</strong> Used by money transfer services and remittances
                    </li>
                  </ul>
                  <p>
                    Our rates are updated every 5 minutes to give you the most accurate conversion for 
                    your {fromName} to Naira exchange.
                  </p>
                </CardContent>
              </Card>

              {/* In-feed ad after conversion details */}
              <InFeedAd />
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

          <div className="text-center space-y-4">
            <Button asChild size="lg" className="bg-emerald-600">
              <Link href={`/rates/${from}-ngn`}>
                View {fromUpper}/NGN Rate Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom banner ad */}
        <BottomBannerAd />
      </div>
    </>
  );
}
