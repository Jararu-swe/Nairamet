"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// Helper function to get country code for currency
const getCountryCodeForCurrency = (currency: string): string => {
  const mapping: Record<string, string> = {
    USD: "us", GBP: "gb", EUR: "eu", CNY: "cn", JPY: "jp",
    CAD: "ca", AUD: "au", CHF: "ch", ZAR: "za", INR: "in",
    AED: "ae", SAR: "sa", KES: "ke", GHS: "gh", EGP: "eg",
    NGN: "ng", BRL: "br", MXN: "mx", TRY: "tr", RUB: "ru",
  };
  return mapping[currency.toUpperCase()] || "un";
};

// Helper function to get flag URL
const getFlagUrl = (currency: string): string => {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

interface CurrencyRate {
  currency: string;
  flag: string;
  rate: number;
  parallel: number;
  change: number;
  lastUpdated: string;
}

interface CurrencyData {
  success: boolean;
  timestamp: number;
  source: string;
  quotes: {
    USDNGN: number;
    GBPNGN: number;
    EURNGN: number;
    CNYNGN: number;
  };
  changes?: {
    USDNGN?: number | null;
    GBPNGN?: number | null;
    EURNGN?: number | null;
    CNYNGN?: number | null;
  };
}

export function LiveCurrencyRates() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const LOCAL_KEY = "nairamet_prev_rates_v1";

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/currency");
      const data = await res.json();

      if (!data || !data.quotes) {
        throw new Error("Invalid currency API response");
      }

      // read previous rates from localStorage to compute percent change
      let prevRates: Record<string, number> | null = null;
      let prevTs = 0;
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === "object" &&
            parsed.rates &&
            typeof parsed.ts === "number"
          ) {
            prevRates = parsed.rates as Record<string, number>;
            prevTs = parsed.ts as number;
          }
        }
      } catch (e) {
        prevRates = null;
        prevTs = 0;
      }

      const STALE_MS = 24 * 60 * 60 * 1000; // 24 hours
      const usePrev = prevRates && Date.now() - prevTs <= STALE_MS;

      const toPercentChange = (
        currKey: string,
        current: number,
        apiChange?: number | null
      ) => {
        try {
          // Prioritize API change data if available
          if (typeof apiChange === "number" && Number.isFinite(apiChange) && apiChange !== 0) {
            return apiChange;
          }

          // Fall back to localStorage comparison
          if (usePrev) {
            const prev = Number(prevRates?.[currKey]);
            if (Number.isFinite(prev) && prev !== 0) {
              const pct = ((current - prev) / prev) * 100;
              if (Number.isFinite(pct)) return pct;
            }
          }

          return 0;
        } catch {
          return 0;
        }
      };

      // Build currency objects; ensure we also capture "parallel" from the API (currency-layer style quotes)
      const currencyRates: CurrencyRate[] = [
        {
          currency: "USD",
          flag: getFlagUrl("USD"),
          rate: data.quotes.USDNGN ?? 0,
          parallel:
            data.quotes.USDNGN ??
            data.quotes["USD_NGN"] ??
            data.quotes["USDEUR"] ??
            data.quotes?.USD ??
            0,
          change: toPercentChange(
            "USDNGN",
            data.quotes.USDNGN,
            data.changes?.USDNGN
          ),
          lastUpdated:
            data.timestamp &&
            new Date(data.timestamp * 1000).toLocaleTimeString(),
        },
        {
          currency: "GBP",
          flag: getFlagUrl("GBP"),
          rate: data.quotes.GBPNGN ?? 0,
          parallel: data.quotes.GBPNGN ?? data.quotes["GBP_NGN"] ?? 0,
          change: toPercentChange(
            "GBPNGN",
            data.quotes.GBPNGN,
            data.changes?.GBPNGN
          ),
          lastUpdated:
            data.timestamp &&
            new Date(data.timestamp * 1000).toLocaleTimeString(),
        },
        {
          currency: "EUR",
          flag: getFlagUrl("EUR"),
          rate: data.quotes.EURNGN ?? 0,
          parallel: data.quotes.EURNGN ?? data.quotes["EUR_NGN"] ?? 0,
          change: toPercentChange(
            "EURNGN",
            data.quotes.EURNGN,
            data.changes?.EURNGN
          ),
          lastUpdated:
            data.timestamp &&
            new Date(data.timestamp * 1000).toLocaleTimeString(),
        },
        {
          currency: "CNY",
          flag: getFlagUrl("CNY"),
          rate: data.quotes.CNYNGN ?? 0,
          parallel: data.quotes.CNYNGN ?? data.quotes["CNY_NGN"] ?? 0,
          change: toPercentChange(
            "CNYNGN",
            data.quotes.CNYNGN,
            data.changes?.CNYNGN
          ),
          lastUpdated:
            data.timestamp &&
            new Date(data.timestamp * 1000).toLocaleTimeString(),
        },
      ];

      // persist current rates for next comparison (include timestamp)
      try {
        const store = {
          rates: {
            USDNGN: data.quotes.USDNGN ?? 0,
            GBPNGN: data.quotes.GBPNGN ?? 0,
            EURNGN: data.quotes.EURNGN ?? 0,
            CNYNGN: data.quotes.CNYNGN ?? 0,
          },
          ts: Date.now(),
        };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
      } catch (e) {
        // ignore storage errors
      }

      setRates(currencyRates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Failed to load live rates");

      // Fallback to static data (keep previous behavior) — ensure parallel present
      setRates([
        {
          currency: "USD",
          flag: getFlagUrl("USD"),
          rate: 1650,
          parallel: 1650,
          change: 2.5,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "GBP",
          flag: getFlagUrl("GBP"),
          rate: 2050,
          parallel: 2050,
          change: -1.2,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "EUR",
          flag: getFlagUrl("EUR"),
          rate: 1750,
          parallel: 1750,
          change: 0.8,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "CNY",
          flag: getFlagUrl("CNY"),
          rate: 228,
          parallel: 228,
          change: 1.5,
          lastUpdated: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defer initial fetch to improve LCP
    const timer = setTimeout(() => {
      fetchRates();
    }, 100);

    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const formatRate = (rate: number) => {
    // Show more precision for smaller rates (CNY) and standard precision for larger rates
    const maxDecimals = rate < 100 ? 2 : 0;
    return `₦${rate.toLocaleString(undefined, {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: maxDecimals === 2 ? 2 : 0,
    })}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading && rates.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Live Exchange Rates
            </h3>
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          </div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            Live Exchange Rates
          </h3>
          {loading && (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {lastUpdated}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {rates.map((item) => (
          <div 
            key={item.currency} 
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 hover:shadow-md"
          >
            {/* Currency Header */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                <img
                  src={getFlagUrl(item.currency)}
                  alt={`${item.currency} flag`}
                  width="24"
                  height="24"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="font-bold text-xs text-foreground">{item.currency}/NGN</span>
            </div>
            
            {/* Main Rate */}
            <div className="text-center mb-2">
              <div className="font-bold text-lg text-foreground">{formatRate(item.rate)}</div>
              <div className="text-xs text-muted-foreground">Official</div>
            </div>
            
            {/* Parallel Rate */}
            <div className="text-center mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-muted-foreground">{formatRate(item.parallel)}</div>
              <div className="text-xs text-muted-foreground">Parallel</div>
            </div>
            
            {/* Change Indicator */}
            <div className="flex items-center justify-center">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                item.change >= 0 
                  ? "bg-emerald-100 dark:bg-emerald-900/30" 
                  : "bg-red-100 dark:bg-red-900/30"
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    item.change >= 0 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatChange(item.change)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
            {error} - Showing cached rates
          </p>
        </div>
      )}
    </div>
  );
}
