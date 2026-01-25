"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

interface Rate {
  currency: string;
  cbn: number;
  blackMarket: number;
  parallel?: number;
}

interface CurrencyComparison extends Rate {
  symbol: string;
  change?: number;
}

interface CurrencyComparisonProps {
  rates: Rate[];
  baseCurrency?: string;
  onClose?: () => void;
}

export function CurrencyComparison({
  rates,
  baseCurrency = "NGN",
  onClose,
}: CurrencyComparisonProps) {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "USD",
    "GBP",
  ]);
  const [compareMetric, setCompareMetric] = useState<"cbn" | "blackMarket">(
    "cbn",
  );

  const getSymbolForCode = (code: string) => {
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
      case "JPY":
        return "¥";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      case "ZAR":
        return "R";
      case "INR":
        return "₹";
      case "AED":
        return "د.إ";
      case "SAR":
        return "﷼";
      default:
        return code;
    }
  };

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
    };
    return mapping[currency.toUpperCase()] || "";
  };

  const getFlagUrl = (currency: string): string => {
    const countryCode = getCountryCodeForCurrency(currency);
    if (!countryCode) return "";
    return `https://flagcdn.com/w40/${countryCode}.png`;
  };

  const getComparisonData = (): CurrencyComparison[] => {
    return selectedCurrencies
      .map((code) => {
        const rate = rates.find((r) => r.currency === code);
        if (!rate) return null;
        return {
          ...rate,
          symbol: getSymbolForCode(code),
        };
      })
      .filter((item): item is CurrencyComparison => item !== null);
  };

  const addCurrency = (currency: string) => {
    if (!selectedCurrencies.includes(currency)) {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  const removeCurrency = (currency: string) => {
    setSelectedCurrencies(selectedCurrencies.filter((c) => c !== currency));
  };

  const comparisonData = getComparisonData();
  const metricLabel =
    compareMetric === "cbn" ? "CBN Official Rate" : "Black Market Rate";
  const metricKey = compareMetric;

  // Find min and max for color coding
  const rates_values = comparisonData.map((c) => c[metricKey]);
  const maxRate = Math.max(...rates_values);
  const minRate = Math.min(...rates_values);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Compare Metric</label>
              <Select
                value={compareMetric}
                onValueChange={(v) =>
                  setCompareMetric(v as "cbn" | "blackMarket")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbn">CBN Official Rate</SelectItem>
                  <SelectItem value="blackMarket">Black Market Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Add Currency</label>
              <Select onValueChange={addCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency to add" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((rate) => {
                    const isSelected = selectedCurrencies.includes(
                      rate.currency,
                    );
                    return (
                      <SelectItem
                        key={rate.currency}
                        value={rate.currency}
                        disabled={isSelected}
                      >
                        {rate.currency}
                        {isSelected && " ✓"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.map((currency) => {
              const rate = currency[metricKey];
              const isMax = rate === maxRate;
              const isMin = rate === minRate;
              const bgClass = isMax
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                : isMin
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800";

              return (
                <Card
                  key={currency.currency}
                  className={`relative border-2 ${bgClass}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={getFlagUrl(currency.currency)}
                          alt={currency.currency}
                          className="w-6 h-4 rounded border object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <CardTitle className="text-lg">
                          {currency.currency}
                        </CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCurrency(currency.currency)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {isMax && (
                      <Badge variant="destructive" className="w-fit">
                        Highest Rate
                      </Badge>
                    )}
                    {isMin && (
                      <Badge variant="default" className="w-fit bg-green-600">
                        Lowest Rate
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {metricLabel}
                      </p>
                      <p className="text-2xl font-bold font-mono">
                        {currency.symbol}
                        {rate.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ₦
                        {rate.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                        /unit
                      </p>
                    </div>

                    {/* Alternative metric for reference */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        {compareMetric === "cbn"
                          ? "Black Market (Reference)"
                          : "CBN Official (Reference)"}
                      </p>
                      <p className="text-sm font-mono">
                        ₦
                        {(compareMetric === "cbn"
                          ? currency.blackMarket
                          : currency.cbn
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>

                    {/* Spread */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        Spread (BM - Official)
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          ₦
                          {Math.abs(
                            currency.blackMarket - currency.cbn,
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        {currency.blackMarket > currency.cbn ? (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Insights */}
          {comparisonData.length >= 2 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Strongest:</strong> {comparisonData[0].currency} with
                  the lowest NGN rate (₦{minRate.toLocaleString()})
                </p>
                <p>
                  <strong>Weakest:</strong>{" "}
                  {
                    comparisonData[
                      comparisonData.findIndex((c) => c[metricKey] === maxRate)
                    ]?.currency
                  }{" "}
                  with the highest NGN rate (₦{maxRate.toLocaleString()})
                </p>
                <p>
                  <strong>Best for Conversion:</strong> If converting Naira to
                  foreign currency, you get more units with{" "}
                  {minRate === rates_values[0]
                    ? comparisonData[0].currency
                    : comparisonData[comparisonData.length - 1].currency}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
