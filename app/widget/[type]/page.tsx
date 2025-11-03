"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function WidgetPage({ params }: { params: { type: string } }) {
  const searchParams = useSearchParams();
  const currency = searchParams.get("currency") || "USD";
  const [rates, setRates] = useState<any>({
    official: 0,
    blackMarket: 0,
    remittance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/tracker", { 
          cache: "no-store",
          next: { revalidate: 0 }
        });
        if (res.ok) {
          const data = await res.json();
          const currencyData = data.rates.find(
            (r: any) => r.currency === currency
          );
          if (currencyData) {
            setRates({
              official: currencyData.official || 0,
              blackMarket: currencyData.blackMarket || 0,
              remittance: currencyData.remittance || currencyData.official || 0,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [currency]);

  const getTrendIcon = (value: number, baseline: number) => {
    if (value > baseline) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < baseline) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const renderWidget = () => {
    switch (params.type) {
      case "rates":
        return (
          <Card className="w-full h-full border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                NGN/{currency} Exchange Rates
                <Badge variant="outline" className="ml-2">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Official:</span>
                    <span className="font-medium">₦{rates.official.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Black Market:</span>
                    <div className="flex items-center">
                      <span className="font-medium">₦{rates.blackMarket.toLocaleString()}</span>
                      {getTrendIcon(rates.blackMarket, rates.official)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Parallel:</span>
                    <div className="flex items-center">
                      <span className="font-medium">₦{rates.remittance.toLocaleString()}</span>
                      {getTrendIcon(rates.remittance, rates.official)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case "converter":
        return (
          <Card className="w-full h-full border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                NGN/{currency} Converter
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-sm text-muted-foreground">1 {currency}</div>
                      <div className="font-medium">₦{rates.blackMarket.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <div className="text-sm text-muted-foreground">₦1000</div>
                      <div className="font-medium">{(1000 / rates.blackMarket).toFixed(2)} {currency}</div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Based on current black market rates
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card className="w-full h-full border-none">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Invalid Widget Type</h3>
                <p className="text-sm text-muted-foreground">
                  Supported types: rates, converter
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white">
      {renderWidget()}
      <div className="text-xs text-center text-muted-foreground mt-2">
        Powered by Nairamet
      </div>
    </div>
  );
}