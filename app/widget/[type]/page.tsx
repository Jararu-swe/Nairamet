"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { TooltipProvider } from "@/components/ui/tooltip";

// Helper function to get country code for currency
const getCountryCodeForCurrency = (currency: string): string => {
  const mapping: Record<string, string> = {
    USD: "us",
    GBP: "gb",
    EUR: "eu",
    CNY: "cn",
    JPY: "jp",
    CAD: "ca",
    AUD: "au",
    CHF: "ch",
    ZAR: "za",
    INR: "in",
    AED: "ae",
    SAR: "sa",
    KES: "ke",
    GHS: "gh",
    EGP: "eg",
    NGN: "ng",
    BRL: "br",
    MXN: "mx",
    ARS: "ar",
    CLP: "cl",
    COP: "co",
    PEN: "pe",
    TRY: "tr",
    RUB: "ru",
    PLN: "pl",
    SEK: "se",
    NOK: "no",
    DKK: "dk",
    CZK: "cz",
    HUF: "hu",
  };
  return mapping[currency.toUpperCase()] || "un";
};

// Helper function to get flag URL
const getFlagUrl = (currency: string): string => {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const widgetType = (params.type as string) || "rates";
  const currency = searchParams.get("currency") || "USD";
  const colorParam = searchParams.get("color");
  const themeParam = searchParams.get("theme"); // light, dark

  const [rates, setRates] = useState<any>({
    official: 0,
    blackMarket: 0,
    remittance: 0,
  });
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [convertAmount, setConvertAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("USD");

  const primaryColor = colorParam ? (colorParam.startsWith("#") ? colorParam : `#${colorParam}`) : "#10b981"; // Default emerald-500

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/tracker", {
          cache: "no-store",
          next: { revalidate: 0 },
        });
        if (res.ok) {
          const data = await res.json();
          const currencyData = data.rates.find(
            (r: any) => r.currency === currency,
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

    async function fetchNews() {
      try {
        const res = await fetch("/api/scrape", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setNews(data.articles?.slice(0, 5) || []);
        }
      } catch (e) {
        console.error("Failed to fetch news for widget:", e);
      }
    }

    fetchRates();
    if (widgetType === "news-ticker") {
      fetchNews();
    }
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchRates, 60000);
    
    // Initialize currency states based on URL parameter
    if (currency !== "NGN") {
      setToCurrency(currency);
      setFromCurrency("NGN");
    }
    
    return () => clearInterval(interval);
  }, [currency, widgetType]);

  const getTrendIcon = (value: number, baseline: number) => {
    if (value > baseline)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < baseline)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getConvertedAmount = () => {
    const inputAmount = Number.parseFloat(convertAmount);
    if (!Number.isFinite(inputAmount)) return "0.00";

    const exchangeRate = rates.blackMarket;
    if (!exchangeRate || !Number.isFinite(exchangeRate) || exchangeRate === 0)
      return "0.00";

    let converted: number;
    if (fromCurrency === "NGN") {
      // Converting from NGN to foreign currency
      converted = inputAmount / exchangeRate;
    } else {
      // Converting from foreign currency to NGN
      converted = inputAmount * exchangeRate;
    }

    return converted.toFixed(2);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getCurrencySymbol = (curr: string) => {
    if (curr === "NGN") return "₦";
    if (curr === "USD") return "$";
    if (curr === "GBP") return "£";
    if (curr === "EUR") return "€";
    return "";
  };

  const renderWidget = () => {
    switch (widgetType) {
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
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
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

                {/* Footer with Logo and Share Button */}
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
                  <ShareButton
                    currency={currency}
                    rate={rates.blackMarket}
                    widgetType="rates"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "converter":
        return (
          <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-3 sm:p-4 shadow-lg">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm sm:text-lg font-bold">⇅</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                        Currency Converter
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                        Bidirectional conversion
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs"
                  >
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live
                  </Badge>
                </div>

                {/* Converter Form */}
                <div className="flex-1 space-y-3 sm:space-y-4">
                  {/* From Currency */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 sm:p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 sm:mb-2 block">
                      From ({fromCurrency})
                    </label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      className="w-full text-sm sm:text-lg font-bold border-0 bg-transparent focus:ring-2 focus:ring-emerald-500/20 p-0 h-auto touch-manipulation"
                      placeholder="Enter amount"
                      style={{ fontSize: '16px' }} // Prevents zoom on iOS
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={swapCurrencies}
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                    >
                      <span className="text-sm sm:text-lg font-bold">⇅</span>
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-2 sm:p-3 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1 sm:mb-2 block">
                      To ({toCurrency})
                    </label>
                    <div className="text-sm sm:text-xl font-bold text-emerald-900 dark:text-emerald-100 mobile-text-wrap">
                      {getCurrencySymbol(toCurrency)}{getConvertedAmount()}
                    </div>
                  </div>

                  {/* Rate Info */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Rate: <span className="font-semibold">₦{rates.blackMarket.toLocaleString()}</span> per {currency}
                    </p>
                  </div>
                </div>

                {/* Footer with Share Button */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <img
                        src="/Nairamet.svg"
                        alt="NairaMet"
                        className="w-2 h-2 sm:w-3 sm:h-3"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      NairaMet
                    </span>
                  </div>
                  <ShareButton
                    currency={currency}
                    rate={rates.blackMarket}
                    widgetType="converter"
                  />
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
                      <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">
                        {currency}/NGN
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        7-Day Black Market Trend
                      </p>
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Current Rate
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        ₦{rates.blackMarket.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        High/Low
                      </p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ₦{(rates.blackMarket * 1.03).toFixed(0)} / ₦
                        {(rates.blackMarket * 0.97).toFixed(0)}
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
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Today
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Avg
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ₦{(rates.blackMarket * 0.98).toFixed(0)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Volume
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      High
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Trend
                    </p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ↑ Up
                    </p>
                  </div>
                </div>

                {/* Footer with Share Button */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <img
                      src="/Nairamet.svg"
                      alt="NairaMet"
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Powered by NairaMet
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      Updated 2m ago
                    </span>
                    <ShareButton
                      currency={currency}
                      rate={rates.blackMarket}
                      widgetType="chart"
                      trend="up"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "news-ticker":
        return (
          <div className="w-full h-full bg-white dark:bg-gray-900 flex items-center overflow-hidden border-y border-gray-200 dark:border-gray-800">
            <div className="bg-emerald-600 dark:bg-emerald-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider z-10 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: primaryColor }}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Latest FX News
            </div>
            <div className="flex-1 overflow-hidden relative group">
              <div className="flex whitespace-nowrap animate-infinite-scroll hover:[animation-play-state:paused] items-center py-2 h-full">
                {news.length > 0 ? (
                  news.map((n, i) => (
                    <div key={i} className="inline-flex items-center px-6 border-r border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-gray-400 dark:text-gray-600 text-[10px] mr-2 font-mono">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <a href={`/blog/${encodeURIComponent(`scraped:${n.url}`)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        {n.title}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="px-6 text-sm text-gray-500">Fetching latest market updates...</div>
                )}
                {/* Duplicate for seamless scrolling */}
                {news.map((n, i) => (
                    <div key={`dup-${i}`} className="inline-flex items-center px-6 border-r border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-gray-400 dark:text-gray-600 text-[10px] mr-2 font-mono">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <a href={`/blog/${encodeURIComponent(`scraped:${n.url}`)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        {n.title}
                      </a>
                    </div>
                ))}
              </div>
            </div>
            <div className="px-4 border-l border-gray-100 dark:border-gray-800 flex items-center">
                <img src="/Nairamet.svg" alt="Logo" className="w-5 h-5 opacity-50" />
            </div>
          </div>
        );

      default:
        return (
          <Card className="w-full h-full border-none">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Invalid Widget Type</h3>
                <p className="text-sm text-muted-foreground">
                  Supported types: rates, converter, chart, news-ticker
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "w-screen h-screen bg-transparent overflow-hidden flex flex-col transition-colors duration-300",
        themeParam === "dark" ? "dark bg-gray-900" : (themeParam === "light" ? "bg-white" : "")
      )}>
        {renderWidget()}
      </div>
    </TooltipProvider>
  );
}

// Helper for conditional classes
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
