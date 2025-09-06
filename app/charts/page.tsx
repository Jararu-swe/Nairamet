"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock historical data generator
const generateHistoricalData = (days: number, currency: string) => {
  const data = []
  const baseRates = {
    USD: { official: 1580, black: 1620 },
    GBP: { official: 1950, black: 2000 },
    EUR: { official: 1720, black: 1760 },
    CNY: { official: 218, black: 225 },
  }

  const base = baseRates[currency as keyof typeof baseRates]

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some realistic volatility
    const officialVariation = (Math.random() - 0.5) * 0.02 // ±1%
    const blackVariation = (Math.random() - 0.5) * 0.03 // ±1.5%

    data.push({
      date: date.toISOString().split("T")[0],
      dateFormatted: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      official: Math.round(base.official * (1 + officialVariation)),
      blackMarket: Math.round(base.black * (1 + blackVariation)),
    })
  }

  return data
}

const dateRanges = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
]

const currencies = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
]

function ChartsPageContent() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedRange, setSelectedRange] = useState("30")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const data = generateHistoricalData(Number.parseInt(selectedRange), selectedCurrency)
      setChartData(data)
      setLoading(false)
    }, 500)
  }, [selectedCurrency, selectedRange])

  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { trend: 0, percentage: 0 }
    const latest = data[data.length - 1][key]
    const previous = data[0][key]
    const change = latest - previous
    const percentage = (change / previous) * 100
    return { trend: change, percentage }
  }

  const officialTrend = calculateTrend(chartData, "official")
  const blackTrend = calculateTrend(chartData, "blackMarket")

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
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Historical Rate Charts</h1>
          <p className="text-muted-foreground">
            Track exchange rate trends and compare official vs black market rates over time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Currency</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Official Rate Trend</CardTitle>
            <CardDescription>CBN official rate movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                ₦{chartData.length > 0 ? chartData[chartData.length - 1]?.official?.toLocaleString() : "---"}
              </div>
              <Badge
                variant={officialTrend.percentage >= 0 ? "destructive" : "default"}
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
              {officialTrend.trend >= 0 ? "+" : ""}₦{officialTrend.trend.toFixed(2)} over {selectedRange} days
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
                ₦{chartData.length > 0 ? chartData[chartData.length - 1]?.blackMarket?.toLocaleString() : "---"}
              </div>
              <Badge
                variant={blackTrend.percentage >= 0 ? "destructive" : "default"}
                className="flex items-center gap-1"
              >
                {blackTrend.percentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(blackTrend.percentage).toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {blackTrend.trend >= 0 ? "+" : ""}₦{blackTrend.trend.toFixed(2)} over {selectedRange} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currencies.find((c) => c.value === selectedCurrency)?.symbol} {selectedCurrency}/NGN Historical Rates
            {loading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </CardTitle>
          <CardDescription>Compare official CBN rates vs black market rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="hsl(var(--muted-foreground))" />
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
                  strokeDasharray="5 5"
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rate Spread Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Spread Analysis</CardTitle>
          <CardDescription>Difference between official and black market rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₦
                {chartData.length > 0
                  ? (
                      chartData[chartData.length - 1]?.blackMarket - chartData[chartData.length - 1]?.official
                    ).toLocaleString()
                  : "---"}
              </div>
              <p className="text-sm text-muted-foreground">Current Spread</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {chartData.length > 0
                  ? (
                      ((chartData[chartData.length - 1]?.blackMarket - chartData[chartData.length - 1]?.official) /
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
                  ? Math.max(...chartData.map((d) => d.blackMarket - d.official)).toLocaleString()
                  : "---"}
              </div>
              <p className="text-sm text-muted-foreground">Max Spread ({selectedRange} days)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ChartsPage() {
  return (
    <ProtectedRoute>
      <ChartsPageContent />
    </ProtectedRoute>
  )
}
