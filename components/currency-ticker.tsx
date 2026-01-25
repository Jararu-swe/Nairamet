"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface TickerCurrency {
  code: string;
  rate: number;
  change: number;
  countryCode: string;
}

/**
 * Live Currency Ticker - Shows top 3 currencies with rates and changes
 * Displays: USD, GBP, EUR with real-time data
 */
export function CurrencyTicker() {
  const [currencies, setCurrencies] = useState<TickerCurrency[]>([]);
  const [loading, setLoading] = useState(true);

  // Map currency to country code for flags
  const getCountryCode = (currency: string): string => {
    const mapping: Record<string, string> = {
      USD: "us",
      GBP: "gb",
      EUR: "eu",
    };
    return mapping[currency] || "un";
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/currency");
      const data = await res.json();

      if (data?.quotes) {
        const tickerData: TickerCurrency[] = [
          {
            code: "USD",
            rate: data.quotes.USDNGN || 0,
            change: data.changes?.USDNGN || 0,
            countryCode: getCountryCode("USD"),
          },
          {
            code: "GBP",
            rate: data.quotes.GBPNGN || 0,
            change: data.changes?.GBPNGN || 0,
            countryCode: getCountryCode("GBP"),
          },
          {
            code: "EUR",
            rate: data.quotes.EURNGN || 0,
            change: data.changes?.EURNGN || 0,
            countryCode: getCountryCode("EUR"),
          },
        ];

        setCurrencies(tickerData);
      }
    } catch (error) {
      console.error("Failed to fetch ticker rates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-8 justify-center md:justify-start">
          <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
          <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
          <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <Link href="/rates">
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer">
        <div className="max-w-7xl mx-auto flex gap-8 justify-center md:justify-start text-sm md:text-base overflow-x-auto">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {/* Flag */}
              <Image
                src={`https://flagcdn.com/w32/${currency.countryCode}.png`}
                alt={currency.code}
                className="w-6 h-4 rounded"
                width={32}
                height={20}
              />

              {/* Currency Code & Rate */}
              <span className="font-semibold">{currency.code}</span>
              <span className="font-mono text-sm">
                ₦{currency.rate.toFixed(2)}
              </span>

              {/* Change Indicator */}
              {currency.change !== 0 && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    currency.change > 0 ? "text-green-200" : "text-red-200"
                  }`}
                >
                  {currency.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(currency.change).toFixed(2)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
