import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function CurrencyPairLinks() {
  const pairs = [
    { slug: "usd-ngn", title: "USD to NGN", description: "US Dollar to Naira" },
    { slug: "gbp-ngn", title: "GBP to NGN", description: "British Pound to Naira" },
    { slug: "eur-ngn", title: "EUR to NGN", description: "Euro to Naira" },
    { slug: "cny-ngn", title: "CNY to NGN", description: "Chinese Yuan to Naira" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Currency Pairs</CardTitle>
        <p className="text-sm text-muted-foreground">
          View detailed exchange rate information for specific currency pairs
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pairs.map((pair) => (
            <Link
              key={pair.slug}
              href={`/rates/${pair.slug}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
            >
              <div>
                <div className="font-semibold text-sm">{pair.title}</div>
                <div className="text-xs text-muted-foreground">
                  {pair.description}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
