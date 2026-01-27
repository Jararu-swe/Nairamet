"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

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
    TRY: "tr",
    RUB: "ru",
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousRatesRef = useRef<CurrencyRate[]>([]);

  const LOCAL_KEY = "nairamet_prev_rates_v1";
  const CURRENCIES_PER_SLIDE = 4; // Show 4 currencies at a time

  const fetchRates = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Use tracker endpoint which has fresher data (5min cache vs 12hr cache)
      const res = await fetch(`/api/tracker?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();

      if (!data || !data.rates || !Array.isArray(data.rates)) {
        throw new Error("Invalid tracker API response");
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
          if (
            typeof apiChange === "number" &&
            Number.isFinite(apiChange) &&
            apiChange !== 0
          ) {
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

      // Extended list of currencies to show (prioritize popular ones)
      const currencyPriority = [
        "USD",
        "GBP",
        "EUR",
        "CNY",
        "JPY",
        "CAD",
        "AUD",
        "CHF",
        "ZAR",
        "INR",
        "AED",
        "SAR",
        "KES",
        "GHS",
        "EGP",
      ];

      // Build currency objects from tracker API response
      const allRates = data.rates as Array<{
        currency: string;
        official: number;
        blackMarket: number;
        remittance: number;
        change24h?: number;
        lastUpdated?: string;
      }>;

      // Filter and sort by priority, then take available ones
      const currencyRates: CurrencyRate[] = currencyPriority
        .map((code) => {
          const rateData = allRates.find((r) => r.currency === code);
          if (!rateData || !rateData.official) return null;

          return {
            currency: code,
            flag: getFlagUrl(code),
            rate: rateData.official,
            parallel: rateData.blackMarket || rateData.remittance || rateData.official,
            change: rateData.change24h || 0,
            lastUpdated: rateData.lastUpdated || data.lastUpdated || new Date().toLocaleTimeString(),
          };
        })
        .filter((rate): rate is CurrencyRate => rate !== null);

      // persist current rates for next comparison (include timestamp)
      try {
        const store: Record<string, number> = {};
        currencyRates.forEach((rate) => {
          store[`${rate.currency}NGN`] = rate.rate;
        });
        localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify({ rates: store, ts: Date.now() })
        );
      } catch (e) {
        // ignore storage errors
      }

      // Trigger fade/slide animation for cards that changed
      const changedCurrencies = new Set<string>();
      currencyRates.forEach((newRate) => {
        const oldRate = previousRatesRef.current.find(
          (r) => r.currency === newRate.currency
        );
        if (!oldRate || oldRate.rate !== newRate.rate) {
          changedCurrencies.add(newRate.currency);
        }
      });

      // Animate cards that changed
      if (changedCurrencies.size > 0) {
        setAnimatingCards(changedCurrencies);
        setTimeout(() => {
          setAnimatingCards(new Set());
        }, 1200); // Match animation duration (1s + stagger delays)
      }

      previousRatesRef.current = currencyRates;
      setRates(currencyRates);
      const updateTime = data.lastUpdated || new Date().toLocaleTimeString();
      setLastUpdated(updateTime);
      
      // Show brief flash to indicate update
      if (showRefreshIndicator) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Failed to load live rates");
      setIsRefreshing(false);

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
        {
          currency: "JPY",
          flag: getFlagUrl("JPY"),
          rate: 11.2,
          parallel: 11.2,
          change: 0.5,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "CAD",
          flag: getFlagUrl("CAD"),
          rate: 1200,
          parallel: 1200,
          change: -0.8,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "AUD",
          flag: getFlagUrl("AUD"),
          rate: 1100,
          parallel: 1100,
          change: 1.2,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          currency: "CHF",
          flag: getFlagUrl("CHF"),
          rate: 1850,
          parallel: 1850,
          change: -0.5,
          lastUpdated: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchRates();

    // Refresh every 2 minutes for live updates
    const interval = setInterval(fetchRates, 2 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Auto-slide animation
  useEffect(() => {
    if (rates.length <= CURRENCIES_PER_SLIDE) {
      // Don't slide if we have 4 or fewer currencies
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
      return;
    }

    const totalSlides = Math.ceil(rates.length / CURRENCIES_PER_SLIDE);

    // Clear existing interval
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    
    // Start auto-slide after a short delay
    const timeoutId = setTimeout(() => {
      slideIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        // Use the *current* slide from state callback to avoid stutter/resets
        setCurrentSlide((prev) => {
          // Animate cards out (current)
          const currentCurrencies = rates
            .slice(
              prev * CURRENCIES_PER_SLIDE,
              prev * CURRENCIES_PER_SLIDE + CURRENCIES_PER_SLIDE
            )
            .map((r) => r.currency);
          setAnimatingCards(new Set(currentCurrencies));

          const next = (prev + 1) % totalSlides;

          // Animate cards in (next) slightly after
          setTimeout(() => {
            const nextCurrencies = rates
              .slice(
                next * CURRENCIES_PER_SLIDE,
                next * CURRENCIES_PER_SLIDE + CURRENCIES_PER_SLIDE
              )
              .map((r) => r.currency);
            setAnimatingCards(new Set(nextCurrencies));

            // Clear animation flags after enter animation finishes
            setTimeout(() => {
              setIsTransitioning(false);
              setAnimatingCards(new Set());
            }, 1400);
          }, 120);

          return next;
        });
      }, 5000); // Change slide every 5 seconds
    }, 2000); // Wait 2 seconds before starting auto-slide

    return () => {
      clearTimeout(timeoutId);
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
  }, [rates.length]);

  const totalSlides = Math.ceil(rates.length / CURRENCIES_PER_SLIDE);
  const canSlide = rates.length > CURRENCIES_PER_SLIDE;

  const handlePrevious = () => {
    if (!canSlide || isTransitioning) return;
    setIsTransitioning(true);
    // Animate all visible cards
    const visibleCurrencies = rates
      .slice(
        ((currentSlide - 1 + totalSlides) % totalSlides) * CURRENCIES_PER_SLIDE,
        ((currentSlide - 1 + totalSlides) % totalSlides) * CURRENCIES_PER_SLIDE + CURRENCIES_PER_SLIDE
      )
      .map((r) => r.currency);
    setAnimatingCards(new Set(visibleCurrencies));
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsTransitioning(false);
      setTimeout(() => setAnimatingCards(new Set()), 600);
    }, 300);
  };

  const handleNext = () => {
    if (!canSlide || isTransitioning) return;
    setIsTransitioning(true);
    // Animate all visible cards
    const visibleCurrencies = rates
      .slice(
        ((currentSlide + 1) % totalSlides) * CURRENCIES_PER_SLIDE,
        ((currentSlide + 1) % totalSlides) * CURRENCIES_PER_SLIDE + CURRENCIES_PER_SLIDE
      )
      .map((r) => r.currency);
    setAnimatingCards(new Set(visibleCurrencies));
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
      setTimeout(() => setAnimatingCards(new Set()), 600);
    }, 300);
  };

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
          {(loading || isRefreshing) && (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          )}
          {!loading && !isRefreshing && (
            <button
              onClick={() => fetchRates(true)}
              className="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors"
              aria-label="Refresh rates"
              title="Refresh rates"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-700" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canSlide && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <span className="text-xs font-medium text-muted-foreground">
                {currentSlide + 1}/{totalSlides}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isRefreshing ? 'animate-pulse' : 'animate-pulse'}`}></div>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Updated: {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Sliding Container */}
      <div className="relative overflow-hidden">
        {/* Currency Cards Container - Flex wrapper for sliding */}
        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: canSlide
                ? `translateX(-${currentSlide * 100}%)`
                : "translateX(0)",
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {rates
                  .slice(
                    slideIndex * CURRENCIES_PER_SLIDE,
                    slideIndex * CURRENCIES_PER_SLIDE + CURRENCIES_PER_SLIDE
                  )
                  .map((item, cardIndex) => {
                    const isAnimating = animatingCards.has(item.currency);
                    const isVisible = slideIndex === currentSlide;
                    const animationDelay = cardIndex * 120; // smoother, less "waity"
                    
                    return (
                      <div
                        key={`${item.currency}-${slideIndex}-${cardIndex}`}
                        className={`p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md ${
                          isVisible ? "opacity-100" : "opacity-0"
                        } ${isVisible ? (isAnimating || isTransitioning ? "animate-fade-slide-in" : "") : ""}`}
                        style={{
                          animationDelay:
                            (isAnimating || isTransitioning) && isVisible
                              ? `${animationDelay}ms`
                              : "0ms",
                          willChange: "transform, opacity",
                        }}
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
                        <span className="font-bold text-xs text-foreground">
                          {item.currency}/NGN
                        </span>
                      </div>

                      {/* Main Rate */}
                      <div className="text-center mb-2">
                        <div className="font-bold text-lg text-foreground">
                          {formatRate(item.rate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Official
                        </div>
                      </div>

                      {/* Parallel Rate */}
                      <div className="text-center mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="text-sm font-medium text-muted-foreground">
                          {formatRate(item.parallel)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Parallel
                        </div>
                      </div>

                      {/* Change Indicator */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                            item.change >= 0
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
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
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        {canSlide && totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning && index !== currentSlide) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setIsTransitioning(false);
                    }, 300);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-emerald-600 dark:bg-emerald-400"
                    : "w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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
