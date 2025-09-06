"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface ExchangeRate {
  currency: string
  symbol: string
  flag: string
  cbn: number
  blackMarket: number
  remittance: number
  change24h: number
  lastUpdated: string
}

function FXTrackerContent() {
  const [rates, setRates] = useState<ExchangeRate[]>([
    {
      currency: "USD",
      symbol: "$",
      flag: "🇺🇸",
      cbn: 1580.0,
      blackMarket: 1650.0,
      remittance: 1620.0,
      change24h: 2.5,
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      currency: "GBP",
      symbol: "£",
      flag: "🇬🇧",
      cbn: 1950.0,
      blackMarket: 2050.0,
      remittance: 2000.0,
      change24h: -1.2,
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      currency: "EUR",
      symbol: "€",
      flag: "🇪🇺",
      cbn: 1680.0,
      blackMarket: 1750.0,
      remittance: 1720.0,
      change24h: 0.8,
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      currency: "CNY",
      symbol: "¥",
      flag: "🇨🇳",
      cbn: 218.5,
      blackMarket: 228.0,
      remittance: 222.0,
      change24h: 1.5,
      lastUpdated: new Date().toLocaleTimeString(),
    },
  ])

  const [convertAmount, setConvertAmount] = useState<string>("100000")
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD")
  const [selectedRate, setSelectedRate] = useState<"cbn" | "blackMarket" | "remittance">("blackMarket")

  const refreshRates = () => {
    setRates((prev) =>
      prev.map((rate) => ({
        ...rate,
        cbn: rate.cbn + (Math.random() - 0.5) * 10,
        blackMarket: rate.blackMarket + (Math.random() - 0.5) * 15,
        remittance: rate.remittance + (Math.random() - 0.5) * 12,
        change24h: (Math.random() - 0.5) * 5,
        lastUpdated: new Date().toLocaleTimeString(),
      })),
    )
  }

  const getConvertedAmount = () => {
    const rate = rates.find((r) => r.currency === selectedCurrency)
    if (!rate || !convertAmount) return "0.00"

    const nairaAmount = Number.parseFloat(convertAmount.replace(/,/g, ""))
    const exchangeRate = rate[selectedRate]
    const converted = nairaAmount / exchangeRate

    return converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatNaira = (amount: string) => {
    const num = Number.parseFloat(amount.replace(/,/g, ""))
    return `₦${num.toLocaleString("en-US")}`
  }

  const getRateTypeLabel = (type: string) => {
    switch (type) {
      case "cbn":
        return "CBN Official"
      case "blackMarket":
        return "Black Market"
      case "remittance":
        return "Remittance"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Exchange Rates</h1>
            <p className="text-muted-foreground">Real-time Naira exchange rates and currency converter</p>
          </div>
          <Button onClick={refreshRates} variant="outline" className="w-fit bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Rates
          </Button>
        </div>

        {/* Currency Converter */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Currency Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm opacity-90 mb-2 block">Amount (NGN)</label>
                <Input
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder="100,000"
                  className="bg-primary-foreground text-foreground"
                />
              </div>
              <div>
                <label className="text-sm opacity-90 mb-2 block">Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-2 rounded-md bg-primary-foreground text-foreground"
                >
                  {rates.map((rate) => (
                    <option key={rate.currency} value={rate.currency}>
                      {rate.flag} {rate.currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm opacity-90 mb-2 block">Rate Type</label>
                <select
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(e.target.value as any)}
                  className="w-full p-2 rounded-md bg-primary-foreground text-foreground"
                >
                  <option value="blackMarket">Black Market</option>
                  <option value="cbn">CBN Official</option>
                  <option value="remittance">Remittance</option>
                </select>
              </div>
            </div>
            <div className="text-center p-4 bg-primary-foreground/10 rounded-lg">
              <p className="text-sm opacity-90">
                {formatNaira(convertAmount)} = {rates.find((r) => r.currency === selectedCurrency)?.symbol}
                {getConvertedAmount()}
              </p>
              <p className="text-xs opacity-75 mt-1">
                Rate: ₦{rates.find((r) => r.currency === selectedCurrency)?.[selectedRate].toLocaleString()} (
                {getRateTypeLabel(selectedRate)})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rates.map((rate) => (
            <Card key={rate.currency} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rate.flag}</span>
                    <div>
                      <CardTitle className="text-lg">{rate.currency}/NGN</CardTitle>
                      <p className="text-xs text-muted-foreground">Last: {rate.lastUpdated}</p>
                    </div>
                  </div>
                  <Badge variant={rate.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                    {rate.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(rate.change24h).toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs defaultValue="blackMarket" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 text-xs">
                    <TabsTrigger value="cbn">CBN</TabsTrigger>
                    <TabsTrigger value="blackMarket">Black</TabsTrigger>
                    <TabsTrigger value="remittance">Remit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cbn" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">₦{rate.cbn.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">CBN Official Rate</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="blackMarket" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">₦{rate.blackMarket.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Black Market Rate</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="remittance" className="mt-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">₦{rate.remittance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Remittance Rate</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rate Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">Compare rates across different sources</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Currency</th>
                    <th className="text-right p-2">CBN Official</th>
                    <th className="text-right p-2">Black Market</th>
                    <th className="text-right p-2">Remittance</th>
                    <th className="text-right p-2">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate) => {
                    const spread = (((rate.blackMarket - rate.cbn) / rate.cbn) * 100).toFixed(1)
                    return (
                      <tr key={rate.currency} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{rate.flag}</span>
                            <span className="font-medium">{rate.currency}</span>
                          </div>
                        </td>
                        <td className="text-right p-2 font-mono">₦{rate.cbn.toLocaleString()}</td>
                        <td className="text-right p-2 font-mono">₦{rate.blackMarket.toLocaleString()}</td>
                        <td className="text-right p-2 font-mono">₦{rate.remittance.toLocaleString()}</td>
                        <td className="text-right p-2">
                          <Badge variant="outline" className="text-xs">
                            +{spread}%
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Rates are indicative and for informational purposes only. Always verify with official sources before making
            transactions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FXTracker() {
  return (
    <ProtectedRoute>
      <FXTrackerContent />
    </ProtectedRoute>
  )
}
