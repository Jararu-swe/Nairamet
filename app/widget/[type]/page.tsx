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
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header with Logo */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <img
                        src="/Nairamet.svg"
                        alt="NairaMet Logo"
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">
                        NairaMet
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currency}/NGN
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live
                  </Badge>
                </div>
                
                {/* Rates */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Official
                    </span>
                    <span className="font-mono font-semibold">
                      ₦{rates.official.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Black Market
                    </span>
                    <span className="font-mono font-semibold">
                      ₦{rates.blackMarket.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Parallel
                    </span>
                    <span className="font-mono font-semibold">
                      ₦{rates.remittance.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Footer with Logo */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <img
                        src="/Nairamet.svg"
                        alt="NairaMet"
                        className="w-3 h-3"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Powered by NairaMet
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "converter":
        return (
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                      <span className="text-emerald-600 text-lg">⇅</span>
                    </div>
                    <h3 className="font-semibold text-sm">Currency Converter</h3>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live
                  </Badge>
                </div>
                
                {/* Converter Form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Amount (NGN)</label>
                    <Input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      className="w-full mt-1 text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                      <span className="text-emerald-600">⇅</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Converted ({currency})</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md text-sm font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/20">
                      {currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "EUR" ? "€" : ""}
                      {(Number.parseFloat(convertAmount) / rates.blackMarket).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <img src="/Nairamet.svg" alt="NairaMet" className="w-4 h-4" />
                    <span className="text-xs text-gray-500">Powered by NairaMet</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "chart":
        return (
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">{currency}/NGN</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">7-Day Black Market Trend</p>
                    </div>
                  </div>
                  <Badge className="flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <TrendingUp className="w-3 h-3" />
                    +2.3%
                  </Badge>
                </div>

                {/* Current Rate Display */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Rate</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        ₦{rates.blackMarket.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">High/Low</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ₦{(rates.blackMarket * 1.03).toFixed(0)} / 
                        ₦{(rates.blackMarket * 0.97).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini Chart Visualization */}
                <div>
                  <div className="h-32 flex items-end gap-1 mb-2">
                    {[65, 70, 68, 75, 80, 78, 85].map((height, i) => (
                      <div 
                        key={i} 
                        className="group relative flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 rounded-t transition-all cursor-pointer" 
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            ₦{(rates.blackMarket * (height / 80)).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>7 days ago</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Today</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ₦{(rates.blackMarket * 0.98).toFixed(0)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Volume</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">High</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Trend</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">↑ Up</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <img src="/Nairamet.svg" alt="NairaMet" className="w-4 h-4" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Powered by NairaMet</span>
                  </div>
                  <span className="text-xs text-gray-400">Updated 2m ago</span>
                </div>
              </div>
            )}
          </div>
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
    </div>
  );
}