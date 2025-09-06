"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Code, Calculator, Map, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"

function ToolsPageContent() {
  const [amount, setAmount] = useState("100000")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [widgetCode, setWidgetCode] = useState("")
  const [copiedWidget, setCopiedWidget] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock exchange rates data
  const exchangeRates = {
    USD: { official: 1580, blackMarket: 1620, remittance: 1595 },
    GBP: { official: 1950, blackMarket: 2000, remittance: 1975 },
    EUR: { official: 1720, blackMarket: 1760, remittance: 1740 },
    CNY: { official: 218, blackMarket: 225, remittance: 220 },
  }

  // Currency strength data (mock)
  const currencyStrength = [
    { currency: "USD", strength: 85, trend: "up", change: "+2.3%" },
    { currency: "GBP", strength: 78, trend: "down", change: "-1.2%" },
    { currency: "EUR", strength: 72, trend: "up", change: "+0.8%" },
    { currency: "CNY", strength: 65, trend: "neutral", change: "0.0%" },
  ]

  const generateWidgetCode = (type: string, currency: string) => {
    const baseUrl = "https://your-fx-tracker.com"
    return `<iframe 
  src="${baseUrl}/widget/${type}?currency=${currency}" 
  width="300" 
  height="200" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
</iframe>`
  }

  const copyToClipboard = async (text: string, type: "widget" | "code") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "widget") {
        setCopiedWidget(true)
        setTimeout(() => setCopiedWidget(false), 2000)
      } else {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const calculateConversions = () => {
    const nairaAmount = Number.parseFloat(amount) || 0
    const rates = exchangeRates[selectedCurrency as keyof typeof exchangeRates]

    return {
      official: (nairaAmount / rates.official).toFixed(2),
      blackMarket: (nairaAmount / rates.blackMarket).toFixed(2),
      remittance: (nairaAmount / rates.remittance).toFixed(2),
    }
  }

  const conversions = calculateConversions()

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">Widgets & Tools</h1>
          <p className="text-emerald-700 max-w-2xl mx-auto">
            Embeddable widgets for your website and powerful calculation tools for currency analysis
          </p>
        </div>

        <Tabs defaultValue="widgets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Embeddable Widgets</TabsTrigger>
            <TabsTrigger value="calculator">Rate Calculator</TabsTrigger>
            <TabsTrigger value="strength">Currency Strength</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Widget Generator
                  </CardTitle>
                  <CardDescription>Generate embeddable widgets for your blog or website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="widget-type">Widget Type</Label>
                    <Select defaultValue="rates">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rates">Live Rates Display</SelectItem>
                        <SelectItem value="converter">Currency Converter</SelectItem>
                        <SelectItem value="chart">Mini Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-currency">Currency Pair</Label>
                    <Select
                      defaultValue="USD"
                      onValueChange={(value) => {
                        setWidgetCode(generateWidgetCode("rates", value))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD/NGN</SelectItem>
                        <SelectItem value="GBP">GBP/NGN</SelectItem>
                        <SelectItem value="EUR">EUR/NGN</SelectItem>
                        <SelectItem value="CNY">CNY/NGN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={() => setWidgetCode(generateWidgetCode("rates", "USD"))} className="w-full">
                    Generate Widget Code
                  </Button>

                  {widgetCode && (
                    <div className="space-y-2">
                      <Label>Embed Code</Label>
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={widgetCode}
                          readOnly
                          className="w-full h-32 p-3 text-sm font-mono bg-gray-50 border rounded-lg resize-none"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-transparent"
                          onClick={() => copyToClipboard(widgetCode, "widget")}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedWidget ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widget Preview</CardTitle>
                  <CardDescription>See how your widget will look on your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-emerald-900">USD/NGN Live Rate</h3>
                        <Badge variant="secondary">Live</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Official</span>
                          <span className="font-mono">₦1,580.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Black Market</span>
                          <span className="font-mono">₦1,620.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Remittance</span>
                          <span className="font-mono">₦1,595.00</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">Powered by FX Tracker</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Advanced Rate Calculator
                </CardTitle>
                <CardDescription>Compare conversions across all rate sources instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Naira Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in Naira"
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Convert To</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-blue-700">Official Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-blue-900">
                          {selectedCurrency} {conversions.official}
                        </div>
                        <div className="text-sm text-blue-600">
                          @ ₦{exchangeRates[selectedCurrency as keyof typeof exchangeRates].official}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-red-700">Black Market</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-red-900">
                          {selectedCurrency} {conversions.blackMarket}
                        </div>
                        <div className="text-sm text-red-600">
                          @ ₦{exchangeRates[selectedCurrency as keyof typeof exchangeRates].blackMarket}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-green-700">Remittance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-900">
                          {selectedCurrency} {conversions.remittance}
                        </div>
                        <div className="text-sm text-green-600">
                          @ ₦{exchangeRates[selectedCurrency as keyof typeof exchangeRates].remittance}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Rate Comparison Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • Best rate: Black Market (₦
                      {exchangeRates[selectedCurrency as keyof typeof exchangeRates].blackMarket})
                    </p>
                    <p>
                      • Difference: ₦
                      {exchangeRates[selectedCurrency as keyof typeof exchangeRates].blackMarket -
                        exchangeRates[selectedCurrency as keyof typeof exchangeRates].official}{" "}
                      more than official
                    </p>
                    <p>
                      • You get{" "}
                      {(
                        ((Number.parseFloat(conversions.blackMarket) - Number.parseFloat(conversions.official)) /
                          Number.parseFloat(conversions.official)) *
                        100
                      ).toFixed(1)}
                      % more with black market rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Currency Strength Map
                </CardTitle>
                <CardDescription>Visual representation of currency performance against the Naira</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {currencyStrength.map((currency) => (
                    <div key={currency.currency} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center font-bold text-emerald-900">
                          {currency.currency}
                        </div>
                        <div>
                          <div className="font-semibold">{currency.currency}/NGN</div>
                          <div className="text-sm text-gray-600">Strength: {currency.strength}%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              currency.strength >= 80
                                ? "bg-green-500"
                                : currency.strength >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                            style={{ width: `${currency.strength}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-1 min-w-[80px]">
                          {getTrendIcon(currency.trend)}
                          <span
                            className={cn(
                              "text-sm font-medium",
                              currency.trend === "up"
                                ? "text-green-600"
                                : currency.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600",
                            )}
                          >
                            {currency.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">2</div>
                        <div className="text-sm text-green-700">Strengthening</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-900">1</div>
                        <div className="text-sm text-red-700">Weakening</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">1</div>
                        <div className="text-sm text-gray-700">Stable</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <ToolsPageContent />
    </ProtectedRoute>
  )
}
