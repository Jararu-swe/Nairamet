"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Download, Search, TrendingUp, TrendingDown } from "lucide-react";
import {
  format,
  subDays,
  subYears,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ProtectedRoute } from "@/components/protected-route";

// Mock historical data - in a real app, this would come from an API
interface ExchangeEntry {
  id: string;
  date: string;
  currency: string;
  officialRate: number;
  blackMarketRate: number;
  parallelMarketRate: number;
  spread: number;
  timestamp: string;
}
const generateHistoricalData = (): ExchangeEntry[] => {
  const data: ExchangeEntry[] = [];
  const currencies = ["USD", "GBP", "EUR", "CNY"];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const date = subDays(today, i);
    currencies.forEach((currency) => {
      const baseRate =
        currency === "USD"
          ? 1580
          : currency === "GBP"
          ? 1950
          : currency === "EUR"
          ? 1720
          : 230;
      const variation = (Math.random() - 0.5) * 100;
      const officialRate = baseRate + variation;
      const blackMarketRate = officialRate + (Math.random() * 50 + 20);
      const parallelMarketRate = blackMarketRate + (Math.random() * 10 - 5); // small deviation from black market

      data.push({
        id: `${currency}-${format(date, "yyyy-MM-dd")}`,
        date: format(date, "yyyy-MM-dd"),
        currency,
        officialRate: Math.round(officialRate * 100) / 100,
        blackMarketRate: Math.round(blackMarketRate * 100) / 100,
        parallelMarketRate: Math.round(parallelMarketRate * 100) / 100,
        spread: Math.round((blackMarketRate - officialRate) * 100) / 100,
        timestamp: date.toISOString(),
      });
    });
  }

  return data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

function LogsPageContent() {
  const [searchDate, setSearchDate] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [searchQuery, setSearchQuery] = useState("");
  const [live, setLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // move generated historical data into state so we can patch today's entries with live data
  const [historicalData, setHistoricalData] = useState(() =>
    generateHistoricalData()
  );

  const filteredData = useMemo(() => {
    let filtered = historicalData;

    // Filter by currency
    if (selectedCurrency !== "all") {
      filtered = filtered.filter((item) => item.currency === selectedCurrency);
    }

    // Filter by date range
    const today = new Date();
    let startDate;
    switch (dateRange) {
      case "7":
        startDate = subDays(today, 7);
        break;
      case "30":
        startDate = subDays(today, 30);
        break;
      case "90":
        startDate = subDays(today, 90);
        break;
      case "365":
        startDate = subYears(today, 1);
        break;
      default:
        startDate = subDays(today, 30);
    }

    filtered = filtered.filter((item) =>
      isWithinInterval(parseISO(item.timestamp), {
        start: startDate,
        end: today,
      })
    );

    // Filter by specific date search
    if (searchDate) {
      filtered = filtered.filter((item) => item.date.includes(searchDate));
    }

    return filtered;
  }, [historicalData, selectedCurrency, dateRange, searchDate]);

  // Poll /api/tracker to update today's entries
  useEffect(() => {
    if (!live) return;
    let mounted = true;
    const POLL_INTERVAL =
      Number(process.env.NAIRAMET_POLL_INTERVAL_SEC || 60) * 1000;

    const applyLiveRates = (rates: any[]) => {
      if (!mounted) return;
      setHistoricalData((prev) => {
        const copy = [...prev];
        const todayKey = format(new Date(), "yyyy-MM-dd");
        rates.forEach((r) => {
          const currency = String(r.currency).toUpperCase();
          // find today's entry for this currency
          const idx = copy.findIndex(
            (d) => d.date === todayKey && d.currency === currency
          );
          const cbn = Number(r.cbn ?? r.cbnRate ?? r.cbn_rate ?? 0);
          const black = Number(r.blackMarket ?? r.black_market ?? r.rate ?? 0);
          const parallel = Number(
            r.parallel ?? r.parallelMarket ?? r.parallel_market ?? 0
          );
          if (idx >= 0) {
            copy[idx] = {
              ...copy[idx],
              officialRate: cbn,
              blackMarketRate: black,
              parallelMarketRate: parallel,
              spread: Math.round((black - cbn) * 100) / 100,
              timestamp: new Date().toISOString(),
            };
          } else {
            // prepend new today entries at the top
            copy.unshift({
              id: `${currency}-${todayKey}`,
              date: todayKey,
              currency,
              officialRate: cbn,
              blackMarketRate: black,
              parallelMarketRate: parallel,
              spread: Math.round((black - cbn) * 100) / 100,
              timestamp: new Date().toISOString(),
            });
          }
        });
        return copy;
      });
    };

    const fetchAndApply = async () => {
      try {
        const res = await fetch("/api/tracker", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch tracker");
        const body = await res.json();
        applyLiveRates(body.rates || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.warn("Live tracker fetch failed", err);
      }
    };

    fetchAndApply();
    const t = setInterval(fetchAndApply, POLL_INTERVAL);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [live]);

  const statistics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const currencies = ["USD", "GBP", "EUR", "CNY"];
    const stats = currencies
      .map((currency) => {
        const currencyData = filteredData.filter(
          (item) => item.currency === currency
        );
        if (currencyData.length === 0) return null;

        const officialRates = currencyData.map((item) => item.officialRate);
        const blackMarketRates = currencyData.map(
          (item) => item.blackMarketRate
        );
        const parallelRates = currencyData.map(
          (item) => item.parallelMarketRate ?? item.blackMarketRate
        );

        const avgOfficial =
          officialRates.reduce((a, b) => a + b, 0) / officialRates.length;
        const avgBlackMarket =
          blackMarketRates.reduce((a, b) => a + b, 0) / blackMarketRates.length;
        const minOfficial = Math.min(...officialRates);
        const maxOfficial = Math.max(...officialRates);
        const minBlackMarket = Math.min(...blackMarketRates);
        const maxBlackMarket = Math.max(...blackMarketRates);

        return {
          currency,
          avgOfficial: Math.round(avgOfficial * 100) / 100,
          avgBlackMarket: Math.round(avgBlackMarket * 100) / 100,
          avgParallel:
            Math.round(
              (parallelRates.reduce((a, b) => a + b, 0) /
                parallelRates.length) *
                100
            ) / 100,
          minOfficial,
          maxOfficial,
          minBlackMarket,
          maxBlackMarket,
          count: currencyData.length,
        };
      })
      .filter((s): s is NonNullable<typeof s> => Boolean(s));

    return stats;
  }, [filteredData]);

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Currency",
      "Official Rate",
      "Black Market Rate",
      "Parallel Market Rate",
      "Spread",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          item.date,
          item.currency,
          item.officialRate,
          item.blackMarketRate,
          item.parallelMarketRate ?? "",
          item.spread,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fx-rates-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FX Rate Logs - ${format(new Date(), "yyyy-MM-dd")}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FX Rate Logs</h1>
            <p>Generated on: ${format(new Date(), "PPP")}</p>
            <p>Total Records: ${filteredData.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Currency</th>
                <th>Official Rate</th>
                <th>Black Market Rate</th>
                <th>Parallel Market Rate</th>
                <th>Spread</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.currency}/NGN</td>
                  <td>₦${item.officialRate}</td>
                  <td>₦${item.blackMarketRate}</td>
                  <td>₦${item.parallelMarketRate ?? ""}</td>
                  <td>₦${item.spread}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">
            Rate Logs & Archive
          </h1>
          <p className="text-emerald-700">
            Search historical rates and export data
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find specific rates and filter by date range or currency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-date">Search Date</Label>
                <Input
                  id="search-date"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="USD">USD/NGN</SelectItem>
                    <SelectItem value="GBP">GBP/NGN</SelectItem>
                    <SelectItem value="EUR">EUR/NGN</SelectItem>
                    <SelectItem value="CNY">CNY/NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Data</Label>
                <div className="flex gap-2">
                  <Button onClick={exportToCSV} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button onClick={exportToPDF} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.map((stat) => (
              <Card key={stat.currency}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.currency}/NGN</CardTitle>
                  <CardDescription>{stat.count} records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Official:</span>
                    <span className="font-medium">₦{stat.avgOfficial}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Avg Black Market:
                    </span>
                    <span className="font-medium">₦{stat.avgBlackMarket}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Parallel:</span>
                    <span className="font-medium">₦{stat.avgParallel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Range:</span>
                    <span className="font-medium">
                      ₦{stat.minOfficial} - ₦{stat.maxOfficial}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Historical Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Historical Rate Data</span>
              <Badge variant="secondary">{filteredData.length} records</Badge>
            </CardTitle>
            <CardDescription>
              Complete archive of exchange rates with official and black market
              data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Currency</th>
                    <th className="text-right p-2 font-medium">
                      Official Rate
                    </th>
                    <th className="text-right p-2 font-medium">Black Market</th>
                    <th className="text-right p-2 font-medium">
                      Parallel Market
                    </th>
                    <th className="text-right p-2 font-medium">Spread</th>
                    <th className="text-center p-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 100).map((item, index) => {
                    const prevItem = filteredData[index + 1];
                    const trend = prevItem
                      ? item.officialRate > prevItem.officialRate
                        ? "up"
                        : item.officialRate < prevItem.officialRate
                        ? "down"
                        : "same"
                      : "same";

                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm">
                          {format(parseISO(item.timestamp), "MMM dd, yyyy")}
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{item.currency}/NGN</Badge>
                        </td>
                        <td className="p-2 text-right font-mono">
                          ₦{item.officialRate}
                        </td>
                        <td className="p-2 text-right font-mono">
                          ₦{item.blackMarketRate}
                        </td>
                        <td className="p-2 text-right font-mono">
                          ₦{item.parallelMarketRate ?? item.blackMarketRate}
                        </td>
                        <td className="p-2 text-right font-mono text-orange-600">
                          ₦{item.spread}
                        </td>
                        <td className="p-2 text-center">
                          {trend === "up" && (
                            <TrendingUp className="w-4 h-4 text-red-500 mx-auto" />
                          )}
                          {trend === "down" && (
                            <TrendingDown className="w-4 h-4 text-green-500 mx-auto" />
                          )}
                          {trend === "same" && (
                            <div className="w-4 h-4 mx-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredData.length > 100 && (
                <div className="text-center py-4 text-muted-foreground">
                  Showing first 100 of {filteredData.length} records. Use
                  filters to narrow results or export for complete data.
                </div>
              )}

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No data found for the selected criteria. Try adjusting your
                  filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LogsPage() {
  return (
    <ProtectedRoute>
      <LogsPageContent />
    </ProtectedRoute>
  );
}
