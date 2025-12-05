"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Code,
  Calculator,
  Map,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";


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

function ToolsPageContent() {
  const [amount, setAmount] = useState("100000");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [widgetType, setWidgetType] = useState("rates");
  const [widgetCode, setWidgetCode] = useState("");
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live exchange rates (fallback to defaults)
  const [exchangeRates, setExchangeRates] = useState<
    Record<
      string,
      { official: number; blackMarket: number; remittance?: number }
    >
  >({
    USD: { official: 1580, blackMarket: 1620, remittance: 1595 },
    GBP: { official: 1950, blackMarket: 2000, remittance: 1975 },
    EUR: { official: 1720, blackMarket: 1760, remittance: 1740 },
    CNY: { official: 218, blackMarket: 225, remittance: 220 },
    CAD: { official: 1150, blackMarket: 1180, remittance: 1165 },
    AUD: { official: 1020, blackMarket: 1050, remittance: 1035 },
    JPY: { official: 10.2, blackMarket: 10.5, remittance: 10.35 },
    CHF: { official: 1750, blackMarket: 1790, remittance: 1770 },
    ZAR: { official: 85, blackMarket: 88, remittance: 86.5 },
    AED: { official: 430, blackMarket: 442, remittance: 436 },
    SAR: { official: 420, blackMarket: 432, remittance: 426 },
    GHS: { official: 120, blackMarket: 124, remittance: 122 },
  });

  // Fetch live rates from the tracker API and merge into exchangeRates
  const [loadingRates, setLoadingRates] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([
    "USD",
    "GBP",
    "EUR",
    "CNY",
    "CAD",
    "AUD",
    "JPY",
    "CHF",
    "ZAR",
    "AED",
    "SAR",
    "GHS",
  ]);
  const fetchRates = async () => {
    try {
      setLoadingRates(true);
      const res = await fetch("/api/tracker", { 
        cache: "no-store",
        next: { revalidate: 0 } 
      });
      if (!res.ok) {
        console.error("Failed to fetch rates:", res.status);
        setLoadingRates(false);
        return;
      }
      const body = await res.json();
      const rates: any[] = body?.rates ?? [];
      if (!Array.isArray(rates)) {
        console.error("Invalid rates format:", body);
        setLoadingRates(false);
        return;
      }

      const mapped: Record<
        string,
        { official: number; blackMarket: number; remittance?: number }
      > = {};
      const codes: string[] = [];
      rates.forEach((r) => {
        const code = String(r.currency || r.code || r.pair || "").toUpperCase();
        if (!code) return;
        codes.push(code);
        const official =
          Number(r.official ?? r.cbn ?? r.cbnRate ?? r.cbn_rate ?? 0) || 0;
        const black =
          Number(r.blackMarket ?? r.black_market ?? r.black ?? r.rate ?? 0) ||
          0;
        const parallel =
          Number(
            r.remittance ??
              r.parallel ??
              r.parallelMarket ??
              r.parallel_market ??
              0
          ) || 0;
        mapped[code] = {
          official:
            official ||
            (mapped[code]?.official ?? exchangeRates[code]?.official ?? 0),
          blackMarket:
            black ||
            (mapped[code]?.blackMarket ??
              exchangeRates[code]?.blackMarket ??
              0),
          remittance: parallel || undefined,
        };
      });

      // merge with defaults
      setExchangeRates((prev) => ({ ...prev, ...mapped }));
      // update available currency list
      const unique = Array.from(new Set(codes)).sort((a, b) =>
        a === "USD" ? -1 : b === "USD" ? 1 : a.localeCompare(b)
      );
      setAvailableCurrencies(unique.length ? unique : availableCurrencies);
    } catch (err) {
      console.warn("Failed to fetch tracker rates", err);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(
      () => fetchRates(),
      Number(process.env.NAIRAMET_POLL_INTERVAL_SEC || 60) * 1000
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Currency strength data (computed from tracker rates)
  const currencyStrength = availableCurrencies
    .filter((c) => !!exchangeRates[c])
    .map((c) => {
      const r = exchangeRates[c]!;
      const official = r.official || 0;
      const black = r.blackMarket || 0;
      const delta = official && black ? black / official - 1 : 0; // relative difference
      const strength = Math.max(0, Math.min(100, Math.round(60 + delta * 40))); // normalize
      const trend = delta > 0.01 ? "up" : delta < -0.01 ? "down" : "neutral";
      const change = `${(delta * 100).toFixed(1)}%`;
      return { currency: c, strength, trend, change };
    });

  const generateWidgetCode = (type: string, currency: string) => {
    const baseUrl = window.location.origin || "https://your-fx-tracker.com";
    // include a simple query to select source (official|black|parallel)
    return `<iframe 
  src="${baseUrl}/widget/${type}?currency=${currency}" 
  width="320" 
  height="220" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
</iframe>`;
  };

  const copyToClipboard = async (text: string, type: "widget" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "widget") {
        setCopiedWidget(true);
        setTimeout(() => setCopiedWidget(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const calculateConversions = () => {
    const nairaAmount = Number.parseFloat(amount) || 0;
    const rates = exchangeRates[selectedCurrency] ?? exchangeRates["USD"];

    return {
      official: (nairaAmount / rates.official).toFixed(2),
      blackMarket: (nairaAmount / rates.blackMarket).toFixed(2),
      remittance: (nairaAmount / (rates.remittance ?? rates.official)).toFixed(
        2
      ),
    };
  };

  const conversions = calculateConversions();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Widgets & Tools
          </h1>
          <p className="text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Embeddable widgets for your website and powerful calculation tools
            for currency analysis
          </p>
        </div>

        <Tabs defaultValue="widgets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="widgets" className="text-xs sm:text-sm">Embeddable Widgets</TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm">Rate Calculator</TabsTrigger>
            <TabsTrigger value="strength" className="text-xs sm:text-sm">Currency Strength</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Widget Generator
                  </CardTitle>
                  <CardDescription>
                    Generate embeddable widgets for your blog or website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="widget-type">Widget Type</Label>
                    <Select 
                      value={widgetType}
                      onValueChange={(value) => {
                        setWidgetType(value);
                        setWidgetCode(generateWidgetCode(value, selectedCurrency));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rates">
                          Live Rates Display
                        </SelectItem>
                        <SelectItem value="converter">
                          Currency Converter
                        </SelectItem>
                        <SelectItem value="chart">Mini Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-currency">Currency Pair</Label>
                    <Select
                      defaultValue="USD"
                      onValueChange={(value) => {
                        setWidgetCode(generateWidgetCode("rates", value));
                        setSelectedCurrency(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCurrencies.map((c) => (
                          <SelectItem key={c} value={c}>
                            <div className="flex items-center gap-2">
                              <img
                                src={getFlagUrl(c)}
                                alt={c}
                                className="w-5 h-4 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <span>{c}/NGN</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() =>
                      setWidgetCode(
                        generateWidgetCode("rates", selectedCurrency || "USD")
                      )
                    }
                    className="w-full"
                  >
                    Generate Widget Code
                  </Button>

                  {widgetCode && (
                    <div className="space-y-2">
                      <Label>Embed Code</Label>
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={widgetCode}
                          readOnly
                          className="w-full h-32 p-3 text-sm font-mono bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg resize-none dark:text-gray-100"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-transparent"
                          onClick={() => copyToClipboard(widgetCode, "widget")}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedWidget ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widget Preview</CardTitle>
                  <CardDescription>
                    See how your widget will look on your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                    {widgetType === "rates" && (
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
                                {selectedCurrency}/NGN
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Live
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Official
                            </span>
                            <span className="font-mono font-semibold">
                              ₦
                              {exchangeRates[selectedCurrency]?.official ??
                                exchangeRates["USD"].official}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Black Market
                            </span>
                            <span className="font-mono font-semibold">
                              ₦
                              {exchangeRates[selectedCurrency]?.blackMarket ??
                                exchangeRates["USD"].blackMarket}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Parallel
                            </span>
                            <span className="font-mono font-semibold">
                              ₦
                              {exchangeRates[selectedCurrency]?.remittance ??
                                exchangeRates[selectedCurrency]?.official ??
                                exchangeRates["USD"].official}
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

                    {widgetType === "converter" && (
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-600" />
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
                            <input 
                              type="number" 
                              value="100000"
                              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                              readOnly
                            />
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                              <span className="text-emerald-600">⇅</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Converted ({selectedCurrency})</label>
                            <div className="w-full mt-1 px-3 py-2 border rounded-md text-sm font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/20">
                              {selectedCurrency === "USD" ? "$" : selectedCurrency === "GBP" ? "£" : selectedCurrency === "EUR" ? "€" : ""}
                              {(100000 / (exchangeRates[selectedCurrency]?.blackMarket ?? 1620)).toFixed(2)}
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

                    {widgetType === "chart" && (
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                              <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">{selectedCurrency}/NGN</h3>
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
                                ₦{exchangeRates[selectedCurrency]?.blackMarket?.toLocaleString() ?? "1,620"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">High/Low</p>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                ₦{((exchangeRates[selectedCurrency]?.blackMarket ?? 1620) * 1.03).toFixed(0)} / 
                                ₦{((exchangeRates[selectedCurrency]?.blackMarket ?? 1620) * 0.97).toFixed(0)}
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
                                    ₦{((exchangeRates[selectedCurrency]?.blackMarket ?? 1620) * (height / 80)).toFixed(0)}
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
                              ₦{((exchangeRates[selectedCurrency]?.blackMarket ?? 1620) * 0.98).toFixed(0)}
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Advanced Rate Calculator
                </CardTitle>
                <CardDescription>
                  Compare conversions across all rate sources instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Naira Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in Naira"
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Convert To</Label>
                    <Select
                      value={selectedCurrency}
                      onValueChange={setSelectedCurrency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCurrencies.map((c) => (
                          <SelectItem key={c} value={c}>
                            <div className="flex items-center gap-2">
                              <img
                                src={getFlagUrl(c)}
                                alt={c}
                                className="w-5 h-4 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <span>{c}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
                        Official Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {selectedCurrency} {conversions.official}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          @ ₦
                          {
                            exchangeRates[
                              selectedCurrency as keyof typeof exchangeRates
                            ].official
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-red-700 dark:text-red-300">
                        Black Market
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                          {selectedCurrency} {conversions.blackMarket}
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-400">
                          @ ₦
                          {
                            exchangeRates[
                              selectedCurrency as keyof typeof exchangeRates
                            ].blackMarket
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-green-700 dark:text-green-300">
                        Parallel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {selectedCurrency} {conversions.remittance}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          @ ₦
                          {
                            exchangeRates[
                              selectedCurrency as keyof typeof exchangeRates
                            ].remittance
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">
                    Rate Comparison Summary
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      • Best rate: Black Market (₦
                      {
                        exchangeRates[
                          selectedCurrency as keyof typeof exchangeRates
                        ].blackMarket
                      }
                      )
                    </p>
                    <p>
                      • Difference: ₦
                      {exchangeRates[
                        selectedCurrency as keyof typeof exchangeRates
                      ].blackMarket -
                        exchangeRates[
                          selectedCurrency as keyof typeof exchangeRates
                        ].official}{" "}
                      more than official
                    </p>
                    <p>
                      • You get{" "}
                      {(
                        ((Number.parseFloat(conversions.blackMarket) -
                          Number.parseFloat(conversions.official)) /
                          Number.parseFloat(conversions.official)) *
                        100
                      ).toFixed(1)}
                      % more with black market rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Currency Strength Map
                </CardTitle>
                <CardDescription>
                  Visual representation of currency performance against the
                  Naira
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {currencyStrength.map((currency) => (
                    <div
                      key={currency.currency}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-100">
                          {currency.currency}
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base dark:text-gray-100">
                            {currency.currency}/NGN
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Strength: {currency.strength}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-1 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              currency.strength >= 80
                                ? "bg-green-500"
                                : currency.strength >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${currency.strength}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-1 min-w-[60px] sm:min-w-[80px]">
                          {getTrendIcon(currency.trend)}
                          <span
                            className={cn(
                              "text-xs sm:text-sm font-medium",
                              currency.trend === "up"
                                ? "text-green-600"
                                : currency.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            )}
                          >
                            {currency.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          2
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Strengthening
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">1</div>
                        <div className="text-sm text-red-700 dark:text-red-300">Weakening</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          1
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">Stable</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return <ToolsPageContent />;
}
