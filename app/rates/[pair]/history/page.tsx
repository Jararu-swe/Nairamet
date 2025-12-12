import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from "lucide-react";

const SUPPORTED_PAIRS = [
  "usd-ngn", "gbp-ngn", "eur-ngn", "cny-ngn",
  "zar-ngn", "ghs-ngn", "kes-ngn", "aed-ngn", "sar-ngn", "inr-ngn", "jpy-ngn", "cad-ngn", "aud-ngn",
];

const PAIR_INFO: Record<string, { from: string; to: string; name: string }> = {
  "usd-ngn": { from: "USD", to: "NGN", name: "US Dollar to Nigerian Naira" },
  "gbp-ngn": { from: "GBP", to: "NGN", name: "British Pound to Nigerian Naira" },
  "eur-ngn": { from: "EUR", to: "NGN", name: "Euro to Nigerian Naira" },
  "cny-ngn": { from: "CNY", to: "NGN", name: "Chinese Yuan to Nigerian Naira" },
  "zar-ngn": { from: "ZAR", to: "NGN", name: "South African Rand to Nigerian Naira" },
  "ghs-ngn": { from: "GHS", to: "NGN", name: "Ghanaian Cedi to Nigerian Naira" },
  "kes-ngn": { from: "KES", to: "NGN", name: "Kenyan Shilling to Nigerian Naira" },
  "aed-ngn": { from: "AED", to: "NGN", name: "UAE Dirham to Nigerian Naira" },
  "sar-ngn": { from: "SAR", to: "NGN", name: "Saudi Riyal to Nigerian Naira" },
  "inr-ngn": { from: "INR", to: "NGN", name: "Indian Rupee to Nigerian Naira" },
  "jpy-ngn": { from: "JPY", to: "NGN", name: "Japanese Yen to Nigerian Naira" },
  "cad-ngn": { from: "CAD", to: "NGN", name: "Canadian Dollar to Nigerian Naira" },
  "aud-ngn": { from: "AUD", to: "NGN", name: "Australian Dollar to Nigerian Naira" },
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
    title: `${pairInfo.name} Historical Exchange Rates | ${pairInfo.from}/NGN History`,
    description: `View historical ${pairInfo.from} to NGN exchange rates. Track past trends, analyze rate changes, and see how the ${pairInfo.from}/NGN rate has evolved over time.`,
    keywords: [
      `${pairInfo.from} to NGN history`,
      `${pairInfo.from} to naira historical rates`,
      `${pairInfo.from}/NGN past rates`,
      `${pairInfo.from} exchange rate history`,
      `historical ${pairInfo.from.toLowerCase()} to naira`,
    ],
    openGraph: {
      title: `${pairInfo.name} - Historical Rates`,
      description: `Track historical ${pairInfo.from}/NGN exchange rates and trends`,
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

export default async function HistoryPage({
  params,
}: {
  params: { pair: string };
}) {
  const pairInfo = PAIR_INFO[params.pair];
  if (!pairInfo) notFound();

  const rateData = await getRateData(pairInfo.from);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${pairInfo.name} Historical Exchange Rates`,
    description: `Historical exchange rate data for ${pairInfo.from} to NGN`,
    temporalCoverage: `${currentYear - 4}/${currentYear}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href={`/rates/${params.pair}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Current Rate
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl font-bold text-foreground">
                {pairInfo.name} History
              </h1>
            </div>
            <p className="text-muted-foreground">
              Historical exchange rates and trends for {pairInfo.from}/NGN
            </p>
          </div>

          {rateData && (
            <Card className="border-2 border-emerald-500">
              <CardHeader>
                <CardTitle>Current Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">CBN Official</p>
                    <p className="text-2xl font-bold">₦{rateData.cbn?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Black Market</p>
                    <p className="text-2xl font-bold text-emerald-600">₦{rateData.blackMarket?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parallel Market</p>
                    <p className="text-2xl font-bold">₦{rateData.parallelMarket?.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Browse Historical Rates by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {years.map((year) => (
                  <Link
                    key={year}
                    href={`/rates/${params.pair}/history/${year}`}
                    className="p-4 border rounded hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors text-center"
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                    <p className="font-semibold">{year}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {months.slice(0, 12).reverse().slice(0, 8).map((month, idx) => {
                  const monthNum = 12 - idx;
                  return (
                    <Link
                      key={month}
                      href={`/rates/${params.pair}/history/${currentYear}/${month.toLowerCase()}`}
                      className="p-3 border rounded hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                    >
                      <p className="text-sm text-muted-foreground">{month} {currentYear}</p>
                      <p className="font-semibold text-emerald-600">View Rates</p>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Historical {pairInfo.from}/NGN Rates</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Track how the {pairInfo.name} exchange rate has changed over time. 
                Our historical data includes:
              </p>
              <ul>
                <li>Daily exchange rates from CBN, black market, and parallel markets</li>
                <li>Monthly averages and trends</li>
                <li>Year-over-year comparisons</li>
                <li>Major rate movements and policy changes</li>
              </ul>
              <p>
                Understanding historical exchange rates helps you make better decisions 
                about currency exchange timing and identify long-term trends in the 
                Nigerian foreign exchange market.
              </p>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button asChild size="lg" className="bg-emerald-600">
              <Link href="/charts">
                View Rate Charts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
