"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

// Helper function to get country code for currency
const getCountryCodeForCurrency = (currency: string): string => {
  const mapping: Record<string, string> = {
    USD: "us", GBP: "gb", EUR: "eu", CNY: "cn", JPY: "jp",
    CAD: "ca", AUD: "au", CHF: "ch", ZAR: "za", INR: "in",
    AED: "ae", SAR: "sa", KES: "ke", GHS: "gh", EGP: "eg",
    NGN: "ng", BRL: "br", MXN: "mx", ARS: "ar", CLP: "cl",
    COP: "co", PEN: "pe", TRY: "tr", RUB: "ru", PLN: "pl",
    SEK: "se", NOK: "no", DKK: "dk", CZK: "cz", HUF: "hu",
  };
  return mapping[currency.toUpperCase()] || "un";
};

// Helper function to get flag URL
const getFlagUrl = (currency: string): string => {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

export default function WidgetPage({ params }: { params: { type: string } }) {
  const searchParams = useSearchParams();
  const currency = searchParams.get("currency") || "USD";
  const [rates, setRates] = useState<any>({
    official: 0,
    blackMarket: 0,
    remittance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [convertAmount, setConvertAmount] = useState("1000");

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
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
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
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(currency)}
                    alt={currency}
                    className="w-6 h-4 rounded border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span>NGN/{currency} Exchange Rates</span>
                </div>
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
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(currency)}
                    alt={currency}
                    className="w-6 h-4 rounded border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span>NGN/{currency} Converter</span>
                </div>
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
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="text-center"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <div className="text-xs text-muted-foreground">NGN → {currency}</div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">
                        {(Number.parseFloat(convertAmount) / rates.blackMarket).toFixed(2)} {currency}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-muted-foreground">{currency} → NGN</div>
                      <div className="font-bold text-blue-700 dark:text-blue-300">
                        ₦{(Number.parseFloat(convertAmount) * rates.blackMarket).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Rate: ₦{rates.blackMarket.toLocaleString()} (Black Market)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case "chart":
        return (
          <Card className="w-full h-full border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(currency)}
                    alt={currency}
                    className="w-6 h-4 rounded border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span>{currency}/NGN Rate Chart</span>
                </div>
                <Badge variant="outline" className="ml-2">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Official</div>
                      <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        ₦{rates.official.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-xs text-red-600 dark:text-red-400 mb-1">Black</div>
                      <div className="text-lg font-bold text-red-900 dark:text-red-100">
                        ₦{rates.blackMarket.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xs text-green-600 dark:text-green-400 mb-1">Parallel</div>
                      <div className="text-lg font-bold text-green-900 dark:text-green-100">
                        ₦{rates.remittance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual comparison bars */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-600 dark:text-blue-400">Official</span>
                        <span className="text-blue-900 dark:text-blue-100">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600 dark:text-red-400">Black Market</span>
                        <span className="text-red-900 dark:text-red-100">
                          {((rates.blackMarket / rates.official) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((rates.blackMarket / rates.official) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600 dark:text-green-400">Parallel</span>
                        <span className="text-green-900 dark:text-green-100">
                          {((rates.remittance / rates.official) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((rates.remittance / rates.official) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-center text-muted-foreground">
                    Spread: ₦{(rates.blackMarket - rates.official).toFixed(2)} ({(((rates.blackMarket - rates.official) / rates.official) * 100).toFixed(1)}%)
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
    <div className="w-full h-full bg-transparent">
      {renderWidget()}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 px-2">
        <span>Powered by Nairamet</span>
        <span className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          {lastUpdate.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}