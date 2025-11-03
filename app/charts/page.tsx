"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";

// Mock historical data generator (can accept custom base rates for non-default currencies)
const generateHistoricalData = (
  days: number,
  currency: string,
  baseOverride?: { official: number; black: number; parallel: number }
) => {
  const data = [];
  const baseRates = {
    USD: { official: 1580, black: 1620, parallel: 1645 },
    GBP: { official: 1950, black: 2000, parallel: 2035 },
    EUR: { official: 1720, black: 1760, parallel: 1790 },
    CNY: { official: 218, black: 225, parallel: 228 },
  };

  const base = baseOverride ||
    (baseRates as any)[currency] || {
      official: 1500,
      black: 1550,
      parallel: 1530,
    };

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some realistic volatility
    const officialVariation = (Math.random() - 0.5) * 0.02; // ±1%
    const blackVariation = (Math.random() - 0.5) * 0.03; // ±1.5%
    const parallelVariation = (Math.random() - 0.5) * 0.028; // ±1.4%

    data.push({
      date: date.toISOString().split("T")[0],
      dateFormatted: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      official: Math.round(base.official * (1 + officialVariation)),
      blackMarket: Math.round(base.black * (1 + blackVariation)),
      parallelMarket: Math.round(base.parallel * (1 + parallelVariation)),
    });
  }

  return data;
};

const dateRanges = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
];

const currencies = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
];

function ChartsPageContent() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedRange, setSelectedRange] = useState("30");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState(currencies);

  const POLL_INTERVAL =
    Number(process.env.NAIRAMET_POLL_INTERVAL_SEC || 60) * 1000;

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const seedAndStart = async () => {
      setLoading(true);

      // Seed with generated historical data for the selected range.
      // If selected currency isn't in defaults, derive base from current tracker once.
      const days = Number.parseInt(selectedRange);
      try {
        const res = await fetch("/api/tracker", { cache: "no-store" });
        let baseOverride:
          | { official: number; black: number; parallel: number }
          | undefined = undefined;
        if (res.ok) {
          const body = await res.json();
          const rates = body?.rates ?? [];
          const foundSeed = rates.find(
            (r: any) => String(r.currency).toUpperCase() === selectedCurrency
          );
          if (foundSeed) {
            baseOverride = {
              official:
                Number(
                  foundSeed.cbn ?? foundSeed.cbnRate ?? foundSeed.cbn_rate ?? 0
                ) || 1500,
              black:
                Number(
                  foundSeed.blackMarket ??
                    foundSeed.black_market ??
                    foundSeed.rate ??
                    0
                ) || 1550,
              parallel:
                Number(foundSeed.parallelMarket ?? foundSeed.parallel ?? 0) ||
                1530,
            };
          }
        }
        if (!mounted) return;
        const initial = generateHistoricalData(
          days,
          selectedCurrency,
          baseOverride
        );
        setChartData(initial);
      } catch {
        if (!mounted) return;
        const fallback = generateHistoricalData(days, selectedCurrency);
        setChartData(fallback);
      }

      // Fetch latest immediately and then poll
      const fetchLatest = async () => {
        try {
          const res = await fetch("/api/tracker", { cache: "no-store" });
          if (!res.ok) throw new Error("Failed to fetch tracker");
          const body = await res.json();
          const rates = body?.rates ?? [];
          // Dynamically populate currency options from tracker
          if (Array.isArray(rates) && rates.length) {
            const mapped = rates.map((r: any) => {
              const code = String(r.currency || r.code || "").toUpperCase();
              const symbol = r.symbol || (code === "USD" ? "$" : code);
              return { value: code, label: code, symbol };
            });
            const dedup: Record<
              string,
              { value: string; label: string; symbol: string }
            > = {};
            mapped.forEach((m) => {
              if (m.value && !dedup[m.value]) dedup[m.value] = m;
            });
            const list = Object.values(dedup).sort((a, b) =>
              a.value === "USD"
                ? -1
                : b.value === "USD"
                ? 1
                : a.value.localeCompare(b.value)
            );
            setCurrencyOptions(list);
            if (!list.find((o) => o.value === selectedCurrency)) {
              setSelectedCurrency("USD");
            }
          }
          const found = rates.find(
            (r: any) => String(r.currency).toUpperCase() === selectedCurrency
          );
          if (!found) return;

          const now = new Date();
          const dateKey = now.toISOString().split("T")[0];
          const formatted = now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          const newPoint = {
            date: dateKey,
            dateFormatted: formatted,
            official: Number(found.cbn ?? found.cbnRate ?? found.cbn_rate ?? 0),
            blackMarket: Number(
              found.blackMarket ?? found.black_market ?? found.rate ?? 0
            ),
            parallelMarket: Number(found.parallelMarket ?? found.parallel ?? 0),
          };

          setChartData((prev) => {
            if (!prev || prev.length === 0) return [newPoint];
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last.date === dateKey) {
              // replace last entry for today
              copy[copy.length - 1] = newPoint;
            } else {
              copy.push(newPoint);
            }
            // ensure we keep at most `days` points
            while (copy.length > days) copy.shift();
            return copy;
          });

          setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
          // ignore errors for polling
          console.warn("Tracker poll error", err);
        }
      };

      await fetchLatest();
      if (!mounted) return;
      timer = setInterval(fetchLatest, POLL_INTERVAL);
      setLoading(false);
    };

    seedAndStart();

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [selectedCurrency, selectedRange]);

  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { trend: 0, percentage: 0 };
    const latest = data[data.length - 1][key];
    const previous = data[0][key];
    const change = latest - previous;
    const percentage = (change / previous) * 100;
    return { trend: change, percentage };
  };

  const officialTrend = calculateTrend(chartData, "official");
  const blackTrend = calculateTrend(chartData, "blackMarket");
  const parallelTrend = calculateTrend(chartData, "parallelMarket");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₦{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Historical Rate Charts
          </h1>
          <p className="text-muted-foreground">
            Track exchange rate trends and compare official vs black market
            rates over time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Currency</label>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Time Range</label>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    <Calendar className="w-4 h-4 mr-2 inline" />
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Official Rate Trend</CardTitle>
            <CardDescription>CBN official rate movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                ₦
                {chartData.length > 0
                  ? chartData[chartData.length - 1]?.official?.toLocaleString()
                  : "---"}
              </div>
              <Badge
                variant={
                  officialTrend.percentage >= 0 ? "destructive" : "default"
                }
                className="flex items-center gap-1"
              >
                {officialTrend.percentage >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(officialTrend.percentage).toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {officialTrend.trend >= 0 ? "+" : ""}₦
              {officialTrend.trend.toFixed(2)} over {selectedRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Black Market Trend</CardTitle>
            <CardDescription>Parallel market rate movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                ₦
                {chartData.length > 0
                  ? chartData[
                      chartData.length - 1
                    ]?.blackMarket?.toLocaleString()
                  : "---"}
              </div>
              <Badge
                variant={blackTrend.percentage >= 0 ? "destructive" : "default"}
                className="flex items-center gap-1"
              >
                {blackTrend.percentage >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(blackTrend.percentage).toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {blackTrend.trend >= 0 ? "+" : ""}₦{blackTrend.trend.toFixed(2)}{" "}
              over {selectedRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Parallel Market Trend</CardTitle>
            <CardDescription>Parallel market rate movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                ₦
                {chartData.length > 0
                  ? chartData[
                      chartData.length - 1
                    ]?.parallelMarket?.toLocaleString()
                  : "---"}
              </div>
              <Badge
                variant={
                  parallelTrend.percentage >= 0 ? "destructive" : "default"
                }
                className="flex items-center gap-1"
              >
                {parallelTrend.percentage >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(parallelTrend.percentage).toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {parallelTrend.trend >= 0 ? "+" : ""}₦
              {parallelTrend.trend.toFixed(2)} over {selectedRange} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currencyOptions.find((c) => c.value === selectedCurrency)
              ?.symbol || ""}{" "}
            {selectedCurrency}/NGN Historical Rates
            {loading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </CardTitle>
          <CardDescription>
            Compare official CBN, black market and parallel market rates over
            time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="opacity-20"
                  stroke="hsl(var(--muted-foreground))"
                />
                <XAxis
                  dataKey="dateFormatted"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  interval="preserveStartEnd"
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  domain={["dataMin - 20", "dataMax + 20"]}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `₦${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="official"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth={3}
                  name="Official CBN Rate"
                  dot={{
                    fill: "hsl(160 84% 39%)",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "white",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(160 84% 39%)",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="blackMarket"
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={3}
                  name="Black Market Rate"
                  dot={{
                    fill: "hsl(0 84% 60%)",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "white",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(0 84% 60%)",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="parallelMarket"
                  stroke="hsl(45 93% 47%)"
                  strokeWidth={3}
                  name="Parallel Market Rate"
                  dot={{
                    fill: "hsl(45 93% 47%)",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "white",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(45 93% 47%)",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  animationDuration={1400}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rate Spread Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Spread Analysis</CardTitle>
          <CardDescription>
            Difference between official and black market rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₦
                {chartData.length > 0
                  ? (
                      chartData[chartData.length - 1]?.blackMarket -
                      chartData[chartData.length - 1]?.official
                    ).toLocaleString()
                  : "---"}
              </div>
              <p className="text-sm text-muted-foreground">Current Spread</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {chartData.length > 0
                  ? (
                      ((chartData[chartData.length - 1]?.blackMarket -
                        chartData[chartData.length - 1]?.official) /
                        chartData[chartData.length - 1]?.official) *
                      100
                    ).toFixed(1)
                  : "---"}
                %
              </div>
              <p className="text-sm text-muted-foreground">Spread Percentage</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₦
                {chartData.length > 0
                  ? Math.max(
                      ...chartData.map((d) => d.blackMarket - d.official)
                    ).toLocaleString()
                  : "---"}
              </div>
              <p className="text-sm text-muted-foreground">
                Max Spread ({selectedRange} days)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChartsPage() {
  return (
    <ProtectedRoute>
      <ChartsPageContent />
    </ProtectedRoute>
  );
}
