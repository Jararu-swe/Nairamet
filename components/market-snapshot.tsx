"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketSnapshotData {
  weeklyChange: number;
  monthlyAverage: number;
  volatilityIndex: "Low" | "Medium" | "High";
  nextCbnMeeting: string;
}

const STORAGE_KEY = "nairamet_market_snapshot_v1";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export function MarketSnapshot() {
  const [stats, setStats] = useState<MarketSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setLoading(true);

        // Fetch current currency rates
        const res = await fetch("/api/currency");
        const data = await res.json();

        if (!data || !data.quotes || !data.quotes.USDNGN) {
          throw new Error("Invalid currency data");
        }

        const currentRate = data.quotes.USDNGN;
        const currentChange = data.changes?.USDNGN || 0;

        // Load historical data from localStorage
        let historicalData: {
          rates: Array<{ rate: number; timestamp: number }>;
          lastUpdated: number;
        } | null = null;

        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            historicalData = JSON.parse(stored);
          }
        } catch (e) {
          // Ignore parse errors
        }

        const now = Date.now();
        let rates = historicalData?.rates || [];

        // Add current rate to history
        rates.push({ rate: currentRate, timestamp: now });

        // Clean old data (keep only last 30 days)
        rates = rates.filter((r) => now - r.timestamp <= MONTH_MS);

        // Calculate weekly change
        const weekAgo = now - WEEK_MS;
        const weekAgoRate = rates.find((r) => r.timestamp <= weekAgo)?.rate;
        let weeklyChange = 0;
        if (weekAgoRate && weekAgoRate > 0) {
          weeklyChange = ((currentRate - weekAgoRate) / weekAgoRate) * 100;
        } else if (currentChange !== 0) {
          // Use API change as fallback (might be 24h change)
          weeklyChange = currentChange * 7; // Approximate weekly
        }

        // Calculate monthly average
        const monthAgo = now - MONTH_MS;
        const monthlyRates = rates.filter((r) => r.timestamp >= monthAgo);
        let monthlyAverage = currentRate;
        if (monthlyRates.length > 0) {
          const sum = monthlyRates.reduce((acc, r) => acc + r.rate, 0);
          monthlyAverage = sum / monthlyRates.length;
        }

        // Calculate volatility index (standard deviation of recent rates)
        let volatilityIndex: "Low" | "Medium" | "High" = "Medium";
        if (monthlyRates.length >= 7) {
          const avg = monthlyAverage;
          const variance =
            monthlyRates.reduce(
              (acc, r) => acc + Math.pow(r.rate - avg, 2),
              0
            ) / monthlyRates.length;
          const stdDev = Math.sqrt(variance);
          const volatilityPct = (stdDev / avg) * 100;

          if (volatilityPct < 1) volatilityIndex = "Low";
          else if (volatilityPct > 3) volatilityIndex = "High";
          else volatilityIndex = "Medium";
        }

        // Calculate next CBN meeting (typically last Tuesday of each month)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Find last Tuesday of current month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        let lastTuesday = new Date(lastDay);

        // Go back to find Tuesday
        while (lastTuesday.getDay() !== 2) {
          lastTuesday.setDate(lastTuesday.getDate() - 1);
        }

        // If last Tuesday has passed, get next month's
        if (lastTuesday < today) {
          const nextMonth = new Date(currentYear, currentMonth + 1, 1);
          const nextLastDay = new Date(
            nextMonth.getFullYear(),
            nextMonth.getMonth() + 1,
            0
          );
          let nextLastTuesday = new Date(nextLastDay);
          while (nextLastTuesday.getDay() !== 2) {
            nextLastTuesday.setDate(nextLastTuesday.getDate() - 1);
          }
          lastTuesday = nextLastTuesday;
        }

        const nextCbnMeeting = lastTuesday.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Save updated historical data
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              rates,
              lastUpdated: now,
            })
          );
        } catch (e) {
          // Ignore storage errors
        }

        setStats({
          weeklyChange,
          monthlyAverage,
          volatilityIndex,
          nextCbnMeeting,
        });
      } catch (error) {
        console.error("Error calculating market snapshot:", error);
        // Fallback to static values
        setStats({
          weeklyChange: 0,
          monthlyAverage: 1650,
          volatilityIndex: "Medium",
          nextCbnMeeting: "TBD",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();

    // Refresh every 5 minutes
    const interval = setInterval(fetchAndCalculate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = stats
    ? [
        {
          label: "This Week's Change",
          value: `${stats.weeklyChange >= 0 ? "+" : ""}${stats.weeklyChange.toFixed(1)}%`,
          trend: stats.weeklyChange >= 0 ? "up" : "down" as "up" | "down",
        },
        {
          label: "Monthly Average",
          value: `₦${Math.round(stats.monthlyAverage).toLocaleString()}`,
          trend: "neutral" as const,
        },
        {
          label: "Volatility Index",
          value: stats.volatilityIndex,
          trend: "neutral" as const,
        },
        {
          label: "Next CBN Meeting",
          value: stats.nextCbnMeeting,
          trend: "neutral" as const,
        },
      ]
    : [
        {
          label: "This Week's Change",
          value: "+0.0%",
          trend: "neutral" as const,
        },
        {
          label: "Monthly Average",
          value: "₦1,650",
          trend: "neutral" as const,
        },
        {
          label: "Volatility Index",
          value: "Medium",
          trend: "neutral" as const,
        },
        {
          label: "Next CBN Meeting",
          value: "TBD",
          trend: "neutral" as const,
        },
      ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Market Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg"
            >
              <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                {stat.label}
              </div>
              {loading ? (
                <div className="font-bold text-emerald-900 dark:text-emerald-100 animate-pulse">
                  ...
                </div>
              ) : (
                <div className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center justify-center gap-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                  )}
                  {stat.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

