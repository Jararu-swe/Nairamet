"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Bell,
  BookOpen,
  Columns2,
} from "lucide-react";
import { InFeedAd, BottomBannerAd } from "@/components/monetag-ad";
import { CurrencyComparison } from "@/components/currency-comparison";

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
    NZD: "nz",
    THB: "th",
    MYR: "my",
    SGD: "sg",
    IDR: "id",
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
  const [fromCurrency, setFromCurrency] = useState<string>("NGN");
  const [toCurrency, setToCurrency] = useState<string>("USD");

  const fetchRates = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // If force refresh, call admin endpoint first to clear cache
      if (forceRefresh) {
        try {
          await fetch("/api/admin/refresh-rates", { cache: "no-store" });
        } catch (e) {
          console.warn("Force refresh failed, fetching normally");
        }
      }

      // Add timestamp to prevent browser caching
      const res = await fetch(`/api/tracker?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch live rates");
      const data = await res.json();

      // defensively map incoming data to our ExchangeRate shape
      const incoming = data?.rates;
      let mapped: ExchangeRate[] = [];
      if (Array.isArray(incoming)) {
        mapped = incoming.map((r: any) => ({
          currency: String(r.currency ?? r.code ?? "").toUpperCase(),
          symbol: String(
            r.symbol ??
              r.sym ??
              getSymbolForCode(r.currency ?? r.code ?? "USD"),
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
            r.lastUpdated ?? r.updatedAt ?? new Date().toLocaleTimeString(),
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
              entry.symbol ?? getSymbolForCode(entry.currency ?? key),
            ),
            flag: String(entry.flag ?? getFlagForCode(entry.currency ?? key)),
            cbn: Number(entry.cbn ?? entry.cbnRate ?? 0) || 0,
            blackMarket: Number(entry.blackMarket ?? entry.rate ?? 0) || 0,
            parallelMarket:
              Number(entry.parallelMarket ?? entry.parallel ?? 0) || 0,
            change24h: Number(entry.change24h ?? entry.change ?? 0) || 0,
            lastUpdated: String(
              entry.lastUpdated ?? new Date().toLocaleTimeString(),
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
    // Update toCurrency when selectedCurrency changes for backward compatibility
    if (fromCurrency === "NGN") {
      setToCurrency(selectedCurrency);
    }
  }, [rates, selectedCurrency, fromCurrency]);

  const getConvertedAmount = () => {
    const rate = rates.find((r) => r.currency === (fromCurrency === "NGN" ? toCurrency : fromCurrency));
    if (!rate) return "0.00";

    const raw = convertAmount ?? "";
    const inputAmount = Number.parseFloat(
      String(raw).replace(/[^0-9.-]+/g, ""),
    );
    if (!Number.isFinite(inputAmount)) return "0.00";

    // map selectedRate to actual numeric value
    const exchangeRate =
      selectedRate === "cbn"
        ? rate.cbn
        : selectedRate === "parallelMarket"
          ? rate.parallelMarket
          : rate.blackMarket;

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

    return converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAmount = (amount: string, currency: string) => {
    const num = Number.parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (!Number.isFinite(num)) return currency === "NGN" ? "₦0" : "0";
    
    if (currency === "NGN") {
      return `₦${num.toLocaleString("en-US")}`;
    } else {
      const symbol = rates.find((r) => r.currency === currency)?.symbol || "";
      return `${symbol}${num.toLocaleString("en-US")}`;
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // Update selectedCurrency for backward compatibility
    if (temp === "NGN") {
      setSelectedCurrency(toCurrency);
    } else {
      setSelectedCurrency(temp);
    }
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
        </div>

        {/* Currency Converter */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 text-white shadow-2xl border-0 animate-converter-glow">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
          </div>
          
          <CardHeader className="pb-4 sm:pb-6 relative z-10 px-4 sm:px-6">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                <ArrowUpDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="block">Currency Converter</span>
                <span className="text-xs sm:text-sm font-normal text-white/80 block mt-1">
                  Real-time bidirectional conversion
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 relative z-10 px-4 sm:px-6">
            {/* Main Converter Interface */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
              {/* Mobile-First Layout */}
              <div className="space-y-4 sm:space-y-6">
                {/* Amount Input - Full Width on Mobile */}
                <div>
                  <label className="text-sm font-semibold mb-3 block text-white/90 uppercase tracking-wide">
                    Amount
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-white/95 backdrop-blur text-gray-900 border-0 h-12 sm:h-14 text-lg sm:text-xl font-bold rounded-xl shadow-lg focus:ring-2 focus:ring-white/50 transition-all duration-200 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      {fromCurrency}
                    </div>
                  </div>
                </div>

                {/* Currency Selection Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* From Currency */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block text-white/90 uppercase tracking-wide">
                      From
                    </label>
                    <div className="relative">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-full bg-white/95 backdrop-blur text-transparent border-0 h-12 sm:h-14 rounded-xl shadow-lg hover:bg-white transition-all duration-200 touch-manipulation">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur border-0 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                          <SelectItem value="NGN" className="hover:bg-emerald-50 rounded-lg py-3 touch-manipulation">
                            <div className="flex items-center gap-3">
                              <Image
                                src={getFlagUrl("NGN")}
                                alt="NGN"
                                className="w-6 h-4 rounded border object-cover shadow-sm"
                                width={24}
                                height={16}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                              <span className="font-medium">NGN</span>
                            </div>
                          </SelectItem>
                          {rates.map((rate) => (
                            <SelectItem key={rate.currency} value={rate.currency} className="hover:bg-emerald-50 rounded-lg py-3 touch-manipulation">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={getFlagUrl(rate.currency)}
                                  alt={rate.currency}
                                  className="w-6 h-4 rounded border object-cover shadow-sm"
                                  width={24}
                                  height={16}
                                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                                <span className="font-medium">{rate.currency}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Custom display overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center px-3 sm:px-4 gap-2 sm:gap-3">
                        <Image
                          src={getFlagUrl(fromCurrency)}
                          alt={fromCurrency}
                          className="w-6 h-4 sm:w-7 sm:h-5 rounded border object-cover shadow-sm"
                          width={24}
                          height={16}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <span className="text-lg sm:text-xl font-bold text-gray-900">{fromCurrency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Swap Button - Centered */}
                  <div className="flex justify-center order-last sm:order-none">
                    <Button
                      onClick={swapCurrencies}
                      variant="secondary"
                      size="lg"
                      className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-white/20 hover:bg-white/30 active:bg-white/40 border-2 border-white/30 hover:border-white/50 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group touch-manipulation"
                    >
                      <ArrowUpDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block text-white/90 uppercase tracking-wide">
                      To
                    </label>
                    <div className="relative">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-full bg-white/95 backdrop-blur text-transparent border-0 h-12 sm:h-14 rounded-xl shadow-lg hover:bg-white transition-all duration-200 touch-manipulation">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur border-0 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                          <SelectItem value="NGN" className="hover:bg-emerald-50 rounded-lg py-3 touch-manipulation">
                            <div className="flex items-center gap-3">
                              <Image
                                src={getFlagUrl("NGN")}
                                alt="NGN"
                                className="w-6 h-4 rounded border object-cover shadow-sm"
                                width={24}
                                height={16}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                              <span className="font-medium">NGN</span>
                            </div>
                          </SelectItem>
                          {rates.map((rate) => (
                            <SelectItem key={rate.currency} value={rate.currency} className="hover:bg-emerald-50 rounded-lg py-3 touch-manipulation">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={getFlagUrl(rate.currency)}
                                  alt={rate.currency}
                                  className="w-6 h-4 rounded border object-cover shadow-sm"
                                  width={24}
                                  height={16}
                                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                                <span className="font-medium">{rate.currency}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Custom display overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center px-3 sm:px-4 gap-2 sm:gap-3">
                        <Image
                          src={getFlagUrl(toCurrency)}
                          alt={toCurrency}
                          className="w-6 h-4 sm:w-7 sm:h-5 rounded border object-cover shadow-sm"
                          width={24}
                          height={16}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <span className="text-lg sm:text-xl font-bold text-gray-900">{toCurrency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate Type Selector - Mobile Optimized */}
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-1 border border-white/20 w-full sm:w-auto">
                    <div className="grid grid-cols-3 sm:flex gap-1">
                      {[
                        { value: "blackMarket", label: "🏴 Black Market", shortLabel: "🏴 Black", desc: "Street rate" },
                        { value: "cbn", label: "🏦 CBN Official", shortLabel: "🏦 CBN", desc: "Central bank" },
                        { value: "parallelMarket", label: "💱 Parallel Market", shortLabel: "💱 Parallel", desc: "Bureau de change" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedRate(option.value as any)}
                          className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                            selectedRate === option.value
                              ? "bg-white text-emerald-700 shadow-lg"
                              : "text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20"
                          }`}
                        >
                          <div className="text-center">
                            <div className="block sm:hidden">{option.shortLabel}</div>
                            <div className="hidden sm:block">{option.label}</div>
                            <div className="text-xs opacity-75 hidden sm:block">{option.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display - Mobile Optimized */}
            <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/30 shadow-2xl">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs sm:text-sm text-white/80 font-semibold uppercase tracking-wider">
                    Live Conversion Result
                  </p>
                </div>
                
                <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row items-center justify-center sm:gap-6">
                  {/* From Amount */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/20">
                    <Image
                      src={getFlagUrl(fromCurrency)}
                      alt={fromCurrency}
                      className="w-6 h-4 sm:w-8 sm:h-6 rounded border-2 border-white/30 object-cover shadow-lg flex-shrink-0"
                      width={24}
                      height={16}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <div className="text-center sm:text-left">
                      <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white break-all">
                        {formatAmount(convertAmount, fromCurrency)}
                      </div>
                      <div className="text-xs sm:text-sm text-white/70">{fromCurrency}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur rounded-full p-2 sm:p-3 border border-white/30">
                      <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 text-white rotate-90 sm:rotate-0" />
                    </div>
                  </div>

                  {/* To Amount */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/20">
                    <Image
                      src={getFlagUrl(toCurrency)}
                      alt={toCurrency}
                      className="w-6 h-4 sm:w-8 sm:h-6 rounded border-2 border-white/30 object-cover shadow-lg flex-shrink-0"
                      width={24}
                      height={16}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl lg:text-4xl font-bold text-white break-all">
                        {formatAmount(getConvertedAmount(), toCurrency)}
                      </div>
                      <div className="text-xs sm:text-sm text-white/70">{toCurrency}</div>
                    </div>
                  </div>
                </div>

                {/* Rate Information - Mobile Stacked */}
                <div className="bg-white/5 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="text-center sm:text-left">
                      <span className="text-white/70">Exchange Rate: </span>
                      <span className="font-bold text-white block sm:inline">
                        {(() => {
                          const foreignCurrency = fromCurrency === "NGN" ? toCurrency : fromCurrency;
                          const found = rates.find((r) => r.currency === foreignCurrency);
                          if (!found) return "N/A";
                          const val = selectedRate === "cbn" ? found.cbn : selectedRate === "parallelMarket" ? found.parallelMarket : found.blackMarket;
                          return val ? `₦${val.toLocaleString()} per ${foreignCurrency}` : "N/A";
                        })()}
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-white/70">Rate Source: </span>
                      <span className="font-bold text-white block sm:inline">
                        {selectedRate === "blackMarket" ? "🏴 Black Market" : selectedRate === "cbn" ? "🏦 CBN Official" : "💱 Parallel Market"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons - Mobile Optimized */}
            <div className="space-y-3">
              <p className="text-center text-xs sm:text-sm text-white/70">Quick amounts:</p>
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3">
                {["1000", "5000", "10000", "50000", "100000", "500000"].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setConvertAmount(amount)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 active:bg-white/30 border-white/30 hover:border-white/50 text-white hover:text-white transition-all duration-200 text-xs sm:text-sm py-2 px-2 sm:px-3 touch-manipulation"
                  >
                    {Number(amount).toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View-Based CPM Ad between Converter and Rates Comparison */}
        <InFeedAd />

        {/* Currency Comparison Section */}
        <CurrencyComparison rates={rates} baseCurrency="NGN" />

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
                      <Image
                        src={getFlagUrl(rate.currency)}
                        alt={`${rate.currency} flag`}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
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
                {/* Set Alert CTA Button */}
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  onClick={() => {
                    // TODO: Open alert creation modal
                    console.log(`Set alert for ${rate.currency}`);
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Price Alert
                </Button>
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
            <div className="overflow-x-touch pb-2">
              <table className="w-full min-w-[700px]">
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
                            <Image
                              src={getFlagUrl(rate.currency)}
                              alt={`${rate.currency} flag`}
                              className="w-6 h-4 rounded border object-cover"
                              width={24}
                              height={16}
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

        {/* Educational Resources */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <CardTitle>Learn How to Use Exchange Rates Effectively</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Understanding exchange rates is key to making smart financial
              decisions. Explore our guides:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
              >
                <h4 className="font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-2">
                  NGN/USD Exchange Rates Guide
                  <TrendingUp className="w-4 h-4" />
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete guide to understanding factors affecting Naira-Dollar
                  rates
                </p>
              </Link>
              <Link
                href="/blog"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
              >
                <h4 className="font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-2">
                  Parallel vs Official Rates
                  <TrendingUp className="w-4 h-4" />
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Understand Nigeria's dual exchange rate system and market
                  dynamics
                </p>
              </Link>
              <Link
                href="/charts"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
              >
                <h4 className="font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-2">
                  Historical Rate Trends
                  <TrendingUp className="w-4 h-4" />
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Explore interactive charts and historical data patterns
                </p>
              </Link>
              <Link
                href="/blog"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              >
                <h4 className="font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-2">
                  Remittances & Exchange Rates
                  <TrendingUp className="w-4 h-4" />
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Maximize value when sending money to Nigeria from abroad
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Subtle in-feed ad after main content */}
        <InFeedAd />
      </div>

      {/* Bottom banner ad */}
      <BottomBannerAd />
    </div>
  );
}

export default function FXTracker() {
  return <FXTrackerContent />;
}
