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

// Helper function to get country code for currency
function getCountryCodeForCurrency(currency: string): string {
  const mapping: Record<string, string> = {
    USD: "us", GBP: "gb", EUR: "eu", CNY: "cn", JPY: "jp",
    CAD: "ca", AUD: "au", NZD: "nz", CHF: "ch", ZAR: "za",
    NGN: "ng", INR: "in", BRL: "br", RUB: "ru", KRW: "kr",
    MXN: "mx", IDR: "id", TRY: "tr", SAR: "sa", AED: "ae",
    QAR: "qa", KWD: "kw", BHD: "bh", THB: "th", SGD: "sg",
    MYR: "my", PHP: "ph", VND: "vn", EGP: "eg", KES: "ke",
    GHS: "gh", XOF: "sn", XAF: "cm", UGX: "ug", TZS: "tz",
    MAD: "ma", TND: "tn", ZMW: "zm", PKR: "pk", BDT: "bd",
    GMD: "gm", SLL: "sl", LRD: "lr", CDF: "cd", ETB: "et",
    SOS: "so", SEK: "se", NOK: "no", DKK: "dk",
  };
  return mapping[currency.toUpperCase()] || "";
}

// Helper function to get flag URL
function getFlagUrl(currency: string): string {
  const countryCode = getCountryCodeForCurrency(currency);
  if (!countryCode) return "";
  return `https://flagcdn.com/w20/${countryCode}.png`;
}

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
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([
    "USD",
    "GBP",
    "EUR",
    "CNY",
  ]);

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

  // Poll /api/tracker to update today's entries and update availableCurrencies
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
        const rates = body.rates || [];
        applyLiveRates(rates);
        if (Array.isArray(rates) && rates.length) {
          const codes = Array.from(
            new Set(
              rates.map((r: any) =>
                String(r.currency || r.code || "").toUpperCase()
              )
            )
          ).sort((a, b) =>
            a === "USD" ? -1 : b === "USD" ? 1 : a.localeCompare(b)
          );
          if (mounted) setAvailableCurrencies(codes);

          // Backfill recent historical data for newly added currencies (last 90 days)
          const today = new Date();
          const backfillDays = 90;
          const rateMap: Record<
            string,
            { cbn: number; black: number; parallel: number }
          > = {};
          rates.forEach((r: any) => {
            const code = String(r.currency || r.code || "").toUpperCase();
            if (!code) return;
            rateMap[code] = {
              cbn: Number(r.cbn ?? r.cbnRate ?? r.cbn_rate ?? 0) || 0,
              black:
                Number(r.blackMarket ?? r.black_market ?? r.rate ?? 0) || 0,
              parallel:
                Number(
                  r.parallel ?? r.parallelMarket ?? r.parallel_market ?? 0
                ) || 0,
            };
          });

          setHistoricalData((prev) => {
            const out = [...prev];
            codes.forEach((code) => {
              const hasAny = out.some((e) => e.currency === code);
              if (hasAny) return;
              for (let i = backfillDays; i >= 1; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = format(d, "yyyy-MM-dd");
                const base = rateMap[code] || {
                  cbn: 1500,
                  black: 1550,
                  parallel: 1530,
                };
                const drift = 1 + (Math.random() - 0.5) * 0.02;
                const blackDrift = 1 + (Math.random() - 0.5) * 0.03;
                const parallelDrift = 1 + (Math.random() - 0.5) * 0.028;
                const officialRate = Math.round(base.cbn * drift * 100) / 100;
                const blackMarketRate =
                  Math.round(base.black * blackDrift * 100) / 100;
                const parallelMarketRate =
                  Math.round(
                    (base.parallel || base.black) * parallelDrift * 100
                  ) / 100;
                out.push({
                  id: `${code}-${dateStr}`,
                  date: dateStr,
                  currency: code,
                  officialRate,
                  blackMarketRate,
                  parallelMarketRate,
                  spread:
                    Math.round((blackMarketRate - officialRate) * 100) / 100,
                  timestamp: d.toISOString(),
                });
              }
            });
            return out.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          });
        }
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

    const codes = Array.from(new Set(filteredData.map((d) => d.currency)));
    const stats = codes
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
      "NairaMet - FX Rate Logs",
      `Generated on: ${format(new Date(), "PPP")}`,
      `Total Records: ${filteredData.length}`,
      `Website: https://nairamet.com`,
      "",
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
    a.download = `nairamet-fx-rates-${format(new Date(), "yyyy-MM-dd")}.csv`;
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
          <title>NairaMet - FX Rate Logs - ${format(new Date(), "yyyy-MM-dd")}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 30px; 
              color: #333;
            }
            .header { 
              margin-bottom: 30px; 
              border-bottom: 3px solid #10b981;
              padding-bottom: 20px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 15px;
            }
            .logo {
              width: 50px;
              height: 50px;
              background: #ecfdf5;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              border: 1px solid #d1fae5;
            }
            .logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .brand {
              font-size: 32px;
              font-weight: bold;
              margin: 0;
            }
            .brand-naira {
              color: #000;
            }
            .brand-met {
              color: #10b981;
            }
            .tagline {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0 0 0;
            }
            .info {
              background: #f0fdf4;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #10b981;
            }
            .info p {
              margin: 5px 0;
              font-size: 14px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left;
              font-size: 13px;
            }
            th { 
              background: linear-gradient(135deg, #10b981, #14b8a6);
              color: white;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.5px;
            }
            tbody tr:nth-child(even) {
              background-color: #f9fafb;
            }
            tbody tr:hover {
              background-color: #f0fdf4;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { margin: 15px; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="logo">
                <img src="/Nairamet.svg" alt="NairaMet Logo" />
              </div>
              <div>
                <h1 class="brand"><span class="brand-naira">Naira</span><span class="brand-met">Met</span></h1>
                <p class="tagline">Nigeria's #1 FX Platform</p>
              </div>
            </div>
          </div>
          <div class="info">
            <p><strong>Report:</strong> FX Rate Logs</p>
            <p><strong>Generated on:</strong> ${format(new Date(), "PPP 'at' p")}</p>
            <p><strong>Total Records:</strong> ${filteredData.length}</p>
            <p><strong>Website:</strong> https://nairamet.com</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Currency</th>
                <th>Official Rate</th>
                <th>Black Market</th>
                <th>Parallel Market</th>
                <th>Spread</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  <td>${item.date}</td>
                  <td><strong>${item.currency}/NGN</strong></td>
                  <td>₦${item.officialRate.toLocaleString()}</td>
                  <td>₦${item.blackMarketRate.toLocaleString()}</td>
                  <td>₦${(item.parallelMarketRate ?? 0).toLocaleString()}</td>
                  <td>₦${item.spread.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NairaMet. All rights reserved.</p>
            <p>Rates are for informational purposes only. Not financial advice.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
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
                    <SelectItem value="all">
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>All Currencies</span>
                      </span>
                    </SelectItem>
                    {availableCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        <span className="flex items-center gap-2">
                          {getFlagUrl(c) && (
                            <img 
                              src={getFlagUrl(c)}
                              alt={c}
                              className="w-5 h-4 object-cover rounded-sm"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <span>{c}/NGN</span>
                        </span>
                      </SelectItem>
                    ))}
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
