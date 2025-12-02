"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";

// Small helpers to provide a symbol and flag when the API doesn't include them
function getSymbolForCode(code?: string) {
  const c = String(code ?? "").toUpperCase();
  switch (c) {
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "CNY":
      return "¥";
    default:
      return "";
  }
}

// Helper function to get country code for currency
function getCountryCodeForCurrency(currency: string): string {
  const mapping: Record<string, string> = {
    USD: "us", GBP: "gb", EUR: "eu", CNY: "cn", JPY: "jp",
    CAD: "ca", AUD: "au", CHF: "ch", ZAR: "za", INR: "in",
    AED: "ae", SAR: "sa", KES: "ke", GHS: "gh", EGP: "eg",
    NGN: "ng", BRL: "br", MXN: "mx", ARS: "ar", CLP: "cl",
    COP: "co", PEN: "pe", TRY: "tr", RUB: "ru", PLN: "pl",
    SEK: "se", NOK: "no", DKK: "dk", CZK: "cz", HUF: "hu",
    NZD: "nz", THB: "th", MYR: "my", SGD: "sg", IDR: "id",
  };
  return mapping[currency.toUpperCase()] || "un";
}

// Helper function to get flag URL
function getFlagUrl(currency: string): string {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
}

function getFlagForCode(code?: string) {
  // Keep for backward compatibility, but return empty string
  // We'll use getFlagUrl for actual flag images
  return "";
}

interface ExchangeRate {
  currency: string;
  symbol: string;
  flag: string;
  cbn: number;
  blackMarket: number;
  parallelMarket: number;
  change24h: number;
  lastUpdated: string;
}

function FXTrackerContent() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [convertAmount, setConvertAmount] = useState<string>("100000");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedRate, setSelectedRate] = useState<
    "cbn" | "blackMarket" | "parallelMarket"
  >("blackMarket");

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add timestamp to prevent browser caching
      const res = await fetch(`/api/tracker?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch live rates");
      const data = await res.json();

      // defensively map incoming data to our ExchangeRate shape
      const incoming = data?.rates;
      let mapped: ExchangeRate[] = [];
      if (Array.isArray(incoming)) {
        mapped = incoming.map((r: any) => ({
          currency: String(r.currency ?? r.code ?? "").toUpperCase(),
          symbol: String(
            r.symbol ?? r.sym ?? getSymbolForCode(r.currency ?? r.code ?? "USD")
          ),
          flag: String(r.flag ?? getFlagForCode(r.currency ?? r.code ?? "USD")),
          cbn: Number(r.cbn ?? r.cbnRate ?? r.cbn_rate ?? 0) || 0,
          blackMarket:
            Number(r.blackMarket ?? r.black_market ?? r.black ?? r.rate ?? 0) ||
            0,
          parallelMarket:
            Number(r.parallelMarket ?? r.parallel_market ?? r.parallel ?? 0) ||
            0,
          change24h: Number(r.change24h ?? r.change ?? 0) || 0,
          lastUpdated: String(
            r.lastUpdated ?? r.updatedAt ?? new Date().toLocaleTimeString()
          ),
        }));
      } else if (incoming && typeof incoming === "object") {
        // if API returns an object with currency keys, transform known ones
        const keys = Object.keys(incoming);
        mapped = keys.map((key) => {
          const entry = incoming[key];
          return {
            currency: String(entry.currency ?? key).toUpperCase(),
            symbol: String(
              entry.symbol ?? getSymbolForCode(entry.currency ?? key)
            ),
            flag: String(entry.flag ?? getFlagForCode(entry.currency ?? key)),
            cbn: Number(entry.cbn ?? entry.cbnRate ?? 0) || 0,
            blackMarket: Number(entry.blackMarket ?? entry.rate ?? 0) || 0,
            parallelMarket:
              Number(entry.parallelMarket ?? entry.parallel ?? 0) || 0,
            change24h: Number(entry.change24h ?? entry.change ?? 0) || 0,
            lastUpdated: String(
              entry.lastUpdated ?? new Date().toLocaleTimeString()
            ),
          };
        });
      }

      setRates(mapped);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch live rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Fetch every 5 minutes to match cache duration
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // when rates load, pick the first currency as default if none selected
  useEffect(() => {
    if (rates.length && !rates.find((r) => r.currency === selectedCurrency)) {
      setSelectedCurrency(rates[0].currency);
    }
  }, [rates, selectedCurrency]);

  const getConvertedAmount = () => {
    const rate = rates.find((r) => r.currency === selectedCurrency);
    if (!rate) return "0.00";

    const raw = convertAmount ?? "";
    const nairaAmount = Number.parseFloat(
      String(raw).replace(/[^0-9.-]+/g, "")
    );
    if (!Number.isFinite(nairaAmount)) return "0.00";

    // map selectedRate to actual numeric value
    const exchangeRate =
      selectedRate === "cbn"
        ? rate.cbn
        : selectedRate === "parallelMarket"
        ? rate.parallelMarket
        : rate.blackMarket;

    if (!exchangeRate || !Number.isFinite(exchangeRate) || exchangeRate === 0)
      return "0.00";

    const converted = nairaAmount / exchangeRate;
    return converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNaira = (amount: string) => {
    const num = Number.parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (!Number.isFinite(num)) return "₦0";
    return `₦${num.toLocaleString("en-US")}`;
  };

  const getRateTypeLabel = (type: string) => {
    switch (type) {
      case "cbn":
        return "CBN Official";
      case "blackMarket":
        return "Black Market";
      case "parallelMarket":
        return "Parallel Market";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Live Exchange Rates
            </h1>
            <p className="text-muted-foreground">
              Real-time Naira exchange rates and currency converter
            </p>
          </div>
          <Button 
            onClick={fetchRates} 
            disabled={loading}
            variant="outline"
            className="w-fit"
          >
            {loading ? "Updating..." : "Refresh Rates"}
          </Button>
        </div>

        {/* Currency Converter */}
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              Currency Converter
            </CardTitle>
            <p className="text-sm text-white/80 mt-2">
              Convert Nigerian Naira to foreign currencies instantly
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white/90">
                  Amount (NGN)
                </label>
                <Input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder="100,000"
                  className="bg-white text-gray-900 border-0 h-11 text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white/90">
                  Currency
                </label>
                <div className="relative">
                  <Select
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                  >
                    <SelectTrigger className="w-full bg-white text-transparent border-0 h-11">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {rates.map((rate) => (
                        <SelectItem key={rate.currency} value={rate.currency}>
                          <div className="flex items-center gap-2">
                            <img
                              src={getFlagUrl(rate.currency)}
                              alt={rate.currency}
                              className="w-5 h-4 rounded border object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <span>{rate.currency}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Custom display overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 gap-2 bg-transparent">
                    <img
                      src={getFlagUrl(selectedCurrency)}
                      alt={selectedCurrency}
                      className="w-6 h-5 rounded border object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="text-lg font-semibold text-gray-900">{selectedCurrency}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white/90">
                  Rate Type
                </label>
                <select
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-md bg-white text-gray-900 border-0 font-medium"
                >
                  <option value="blackMarket">🏴 Black Market</option>
                  <option value="cbn">🏦 CBN Official</option>
                  <option value="parallelMarket">💱 Parallel Market</option>
                </select>
              </div>
            </div>
            {/* Result Display */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border-2 border-white/20">
              <div className="text-center space-y-3">
                <p className="text-sm text-white/70 font-medium uppercase tracking-wide">Converted Amount</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      {formatNaira(convertAmount)}
                    </span>
                  </div>
                  <ArrowUpDown className="w-5 h-5 text-white/60 rotate-90 md:rotate-0" />
                  <div className="flex items-center gap-2">
                    <img
                      src={getFlagUrl(selectedCurrency)}
                      alt={selectedCurrency}
                      className="w-6 h-4 rounded border object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="text-3xl font-bold text-white">
                      {rates.find((r) => r.currency === selectedCurrency)?.symbol}
                      {getConvertedAmount()}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-white/70">
                    Rate: <span className="font-semibold text-white">₦
                    {(() => {
                      const found = rates.find((r) => r.currency === selectedCurrency);
                      if (!found) return "0";
                      const val = selectedRate === "cbn" ? found.cbn : selectedRate === "parallelMarket" ? found.parallelMarket : found.blackMarket;
                      return val ? val.toLocaleString() : "0";
                    })()}</span> per {selectedCurrency}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Using {selectedRate === "blackMarket" ? "🏴 Black Market" : selectedRate === "cbn" ? "🏦 CBN Official" : "💱 Parallel Market"} rate
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rates Grid */}
        {error && <div className="text-sm text-amber-600">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rates.map((rate) => (
            <Card
              key={rate.currency}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg border-2 border-muted flex items-center justify-center overflow-hidden bg-muted/20">
                      <img
                        src={getFlagUrl(rate.currency)}
                        alt={`${rate.currency} flag`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {rate.currency}/NGN
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Last: {rate.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={rate.change24h >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {rate.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Number.isFinite(rate.change24h)
                      ? Math.abs(rate.change24h).toFixed(1)
                      : "0.0"}
                    %
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs defaultValue="blackMarket" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 text-xs">
                    <TabsTrigger value="cbn">CBN</TabsTrigger>
                    <TabsTrigger value="blackMarket">Black</TabsTrigger>
                    <TabsTrigger value="parallelMarket">Parallel</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cbn" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        ₦{rate.cbn.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CBN Official Rate
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="blackMarket" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        ₦{rate.blackMarket.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Black Market Rate
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="parallelMarket" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        ₦{rate.parallelMarket.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Parallel Market Rate
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rate Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">
              Compare rates across different sources
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Currency</th>
                    <th className="text-right p-2">CBN Official</th>
                    <th className="text-right p-2">Black Market</th>
                    <th className="text-right p-2">Parallel Market</th>
                    <th className="text-right p-2">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate) => {
                    const spread = (
                      ((rate.blackMarket - rate.cbn) / rate.cbn) *
                      100
                    ).toFixed(1);
                    return (
                      <tr
                        key={rate.currency}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={getFlagUrl(rate.currency)}
                              alt={`${rate.currency} flag`}
                              className="w-6 h-4 rounded border object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <span className="font-medium">{rate.currency}</span>
                          </div>
                        </td>
                        <td className="text-right p-2 font-mono">
                          ₦{rate.cbn.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-mono">
                          ₦{rate.blackMarket.toLocaleString()}
                        </td>
                        <td className="text-right p-2 font-mono">
                          ₦{rate.parallelMarket.toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          <Badge variant="outline" className="text-xs">
                            +{spread}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Rates are indicative and for informational purposes only. Always
            verify with official sources before making transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FXTracker() {
  return (
    <ProtectedRoute>
      <FXTrackerContent />
    </ProtectedRoute>
  );
}
