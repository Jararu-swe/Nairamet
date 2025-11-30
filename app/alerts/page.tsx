"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, BellOff, Plus, Trash2, Smartphone, SmartphoneNfc, RefreshCw } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useAlertStorage } from "@/hooks/use-alert-storage"
import { useRateMonitor } from "@/hooks/use-rate-monitor"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast, ToastContainer } from "@/components/ui/toast"

// Helper function to get country code for currency
const getCountryCodeForCurrency = (currency: string): string => {
  const mapping: Record<string, string> = {
    USD: "us", GBP: "gb", EUR: "eu", CNY: "cn", JPY: "jp",
    CAD: "ca", AUD: "au", CHF: "ch", ZAR: "za", INR: "in",
    AED: "ae", SAR: "sa", KES: "ke", GHS: "gh", EGP: "eg",
    NGN: "ng", BRL: "br", MXN: "mx", ARS: "ar", CLP: "cl",
    COP: "co", PEN: "pe", TRY: "tr", RUB: "ru", PLN: "pl",
    SEK: "se", NOK: "no", DKK: "dk", CZK: "cz", HUF: "hu",
  };
  return mapping[currency.toUpperCase()] || "un";
};

// Helper function to get flag URL
const getFlagUrl = (currency: string): string => {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

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

// Expanded currency list with symbols and flags
const CURRENCY_CONFIG = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "CNY", symbol: "¥", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "ZAR", symbol: "R", flag: "🇿🇦", name: "South African Rand" },
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "KES", symbol: "KSh", flag: "🇰🇪", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "₵", flag: "🇬🇭", name: "Ghanaian Cedi" },
  { code: "EGP", symbol: "£", flag: "🇪🇬", name: "Egyptian Pound" },
]

function AlertsPageContent() {
  const { toasts, removeToast, success, error, info } = useToast()
  const [rates, setRates] = useState<ExchangeRate[]>(
    CURRENCY_CONFIG.map(curr => ({
      currency: curr.code,
      symbol: curr.symbol,
      flag: curr.flag,
      cbn: 0,
      blackMarket: 0,
      remittance: 0,
      change24h: 0,
      lastUpdated: new Date().toLocaleTimeString(),
    }))
  )
  const [isLoadingRates, setIsLoadingRates] = useState(false)

  // Fetch real-time rates from tracker API (accurate rates)
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingRates(true)
      try {
        // Use tracker API for accurate real-time rates
        const response = await fetch("/api/tracker", { 
          cache: "no-store",
          next: { revalidate: 0 }
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch rates")
        }

        const data = await response.json()
        const trackerRates = data.rates || []

        if (Array.isArray(trackerRates) && trackerRates.length > 0) {
          const updatedRates = trackerRates.map((rate: any) => {
            const currencyCode = String(rate.currency || "").toUpperCase()
            const config = CURRENCY_CONFIG.find(c => c.code === currencyCode)
            
            if (!config) return null

            // Extract real rates from tracker
            const cbnRate = Number(rate.official || rate.cbn || rate.cbnRate || rate.cbn_rate || 0)
            const blackMarketRate = Number(rate.blackMarket || rate.black_market || rate.black || 0)
            const remittanceRate = Number(rate.remittance || rate.parallel || rate.parallelMarket || 0)

            // Only include if we have at least one valid rate
            if (cbnRate === 0 && blackMarketRate === 0 && remittanceRate === 0) {
              return null
            }

            return {
              currency: currencyCode,
              symbol: config.symbol,
              flag: config.flag,
              cbn: cbnRate,
              blackMarket: blackMarketRate || cbnRate * 1.03, // Fallback to 3% above CBN if not available
              remittance: remittanceRate || cbnRate * 1.01, // Fallback to 1% above CBN if not available
              change24h: 0, // Can be calculated if historical data available
              lastUpdated: new Date().toLocaleTimeString(),
            }
          }).filter(Boolean) // Remove null entries

          if (updatedRates.length > 0) {
            setRates(updatedRates as ExchangeRate[])
            console.log("[Alerts] Loaded accurate rates for", updatedRates.length, "currencies")
          }
        }
      } catch (error) {
        console.error("[Alerts] Error fetching rates:", error)
        // Keep existing rates on error
      } finally {
        setIsLoadingRates(false)
      }
    }

    fetchRates()
    // Refresh rates every 60 seconds for accurate monitoring
    const interval = setInterval(fetchRates, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const [newAlert, setNewAlert] = useState({
    currency: "USD",
    rateType: "blackMarket" as const,
    condition: "above" as const,
    threshold: "",
    email: "",
    pushEnabled: false,
  })

  const { isSupported, isSubscribed, isLoading, userId, subscribe, unsubscribe, sendTestNotification } = usePushNotifications()

  const handleSubscribe = async () => {
    const result = await subscribe()
    if (result) {
      success("Push notifications enabled!")
    } else {
      error("Failed to enable push notifications. Please check browser permissions.")
    }
  }

  const handleUnsubscribe = async () => {
    const result = await unsubscribe()
    if (result) {
      info("Push notifications disabled")
    } else {
      error("Failed to disable push notifications")
    }
  }

  const handleTestNotification = async () => {
    const result = await sendTestNotification()
    if (result) {
      success("Test notification sent!")
    } else {
      error("Failed to send test notification")
    }
  }

  const {
    alerts,
    alertHistory,
    alertSettings,
    addAlert,
    updateAlert,
    deleteAlert: deleteAlertHook,
    addAlertHistory,
    clearAlertHistory,
    updateSettings,
    getAlertStats,
    exportData,
    importData,
  } = useAlertStorage()

  const handleAlertTriggered = async (alert: any, currentRate: number) => {
    console.log(`[v0] Processing triggered alert: ${alert.currency} ${alert.condition} ₦${alert.threshold}`)

    let emailSent = false
    let pushSent = false

    // Send email notification
    try {
      const response = await fetch("/api/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: alert.email,
          currency: alert.currency,
          condition: alert.condition,
          threshold: alert.threshold,
          currentRate: currentRate,
          rateType: alert.rateType,
        }),
      })
      const result = await response.json()
      emailSent = result.success
    } catch (error) {
      console.error("[v0] Error sending alert email:", error)
    }

    // Send push notification if enabled
    if (alert.pushEnabled && isSubscribed) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
          const response = await fetch("/api/send-push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscription,
              currency: alert.currency,
              condition: alert.condition,
              threshold: alert.threshold,
              currentRate: currentRate,
              rateType: alert.rateType,
            }),
          })
          const result = await response.json()
          pushSent = result.success
        }
      } catch (error) {
        console.error("[v0] Error sending push notification:", error)
      }
    }

    // Add to alert history
    addAlertHistory(alert.id, alert.currency, alert.condition, alert.threshold, currentRate, alert.rateType, {
      email: emailSent,
      push: pushSent,
    })
  }

  const { isMonitoring, forceCheck, getMonitoringStats, emailQuotaUsed, lastEmailSent } = useRateMonitor(
    rates,
    alerts,
    handleAlertTriggered,
    alertSettings.checkInterval,
  )

  const getNextEmailDate = () => {
    if (!lastEmailSent) return null
    const next = new Date(lastEmailSent)
    next.setMonth(next.getMonth() + 1)
    return next
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

  const createAlert = () => {
    // Check if user already has an alert
    if (alerts.length >= 1) {
      error("You can only create one rate alert. Delete your existing alert to create a new one.")
      return
    }

    if (!newAlert.threshold || !newAlert.email) {
      error("Please fill in all required fields")
      return
    }

    if (!newAlert.email.includes("@")) {
      error("Please enter a valid email address")
      return
    }

    addAlert({
      currency: newAlert.currency,
      rateType: newAlert.rateType,
      condition: newAlert.condition,
      threshold: Number.parseFloat(newAlert.threshold),
      email: newAlert.email,
      pushEnabled: newAlert.pushEnabled && isSubscribed,
      isActive: true,
    })

    success(`Alert created: ${newAlert.currency} ${newAlert.condition} ₦${newAlert.threshold}`)

    setNewAlert({
      currency: "USD",
      rateType: "blackMarket",
      condition: "above",
      threshold: "",
      email: "",
      pushEnabled: false,
    })
  }

  const toggleAlert = (id: string) => {
    const alert = alerts.find((a) => a.id === id)
    if (alert) {
      updateAlert(id, { isActive: !alert.isActive })
      info(`Alert ${!alert.isActive ? "activated" : "deactivated"}`)
    }
  }

  const deleteAlert = (id: string) => {
    deleteAlertHook(id)
    success("Alert deleted successfully")
  }

  const checkAlertTrigger = (alert: any) => {
    const rate = rates.find((r) => r.currency === alert.currency)
    if (!rate) {
      console.warn(`[Alerts] No rate found for currency: ${alert.currency}`)
      return false
    }

    const currentRate = rate[alert.rateType as keyof ExchangeRate] as number
    
    if (!currentRate || currentRate === 0) {
      console.warn(`[Alerts] Invalid rate for ${alert.currency} ${alert.rateType}: ${currentRate}`)
      return false
    }

    const isTriggered = alert.condition === "above" 
      ? currentRate > alert.threshold 
      : currentRate < alert.threshold

    if (isTriggered) {
      console.log(`[Alerts] Alert triggered: ${alert.currency} ${alert.rateType} is ${alert.condition} ₦${alert.threshold} (current: ₦${currentRate})`)
    }

    return isTriggered
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Monthly Email Quota Banner */}
        <Card className={emailQuotaUsed ? "border-red-200 bg-red-50 dark:bg-red-950/20" : "border-green-200 bg-green-50 dark:bg-green-950/20"}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className={emailQuotaUsed ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                {emailQuotaUsed ? "📧" : "✅"}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${emailQuotaUsed ? "text-red-900 dark:text-red-100" : "text-green-900 dark:text-green-100"}`}>
                  {emailQuotaUsed ? "Monthly Email Quota Used" : "Email Quota Available"}
                </h3>
                <p className={`text-sm mb-2 ${emailQuotaUsed ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}`}>
                  {emailQuotaUsed 
                    ? `You've used your 1 email alert for this month. Your next email will be available on ${formatDate(getNextEmailDate())}.`
                    : "You have 1 email alert available this month. Your alert will send an email when triggered."}
                </p>
                {lastEmailSent && (
                  <p className={`text-xs ${emailQuotaUsed ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}>
                    Last email sent: {formatDate(lastEmailSent)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rate Alerts</h1>
            <p className="text-muted-foreground">Get notified when exchange rates hit your targets</p>
            {isLoadingRates && (
              <p className="text-xs text-muted-foreground mt-1">Fetching latest rates...</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              {isMonitoring ? "Monitoring active" : "Monitoring inactive"}
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Rates
            </Button>
          </div>
        </div>

        {/* Push Notifications Setup */}
        {isSupported && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Push Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">Get instant notifications on your device</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${isSubscribed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                  >
                    {isSubscribed ? <SmartphoneNfc className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isSubscribed ? "Push notifications enabled" : "Enable push notifications"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isSubscribed
                        ? "You will receive instant alerts when rates change"
                        : "Get notified instantly when your rate alerts trigger"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isSubscribed ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleTestNotification} className="bg-transparent">
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUnsubscribe}
                        disabled={isLoading}
                        className="bg-transparent"
                      >
                        {isLoading ? "Loading..." : "Disable"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleSubscribe} disabled={isLoading} size="sm">
                      {isLoading ? "Loading..." : "Enable"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rate Alerts section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Manage Alerts
              </div>
              <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                {alerts.length}/1 Alert Used
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {alerts.length >= 1 
                ? "You have reached your alert limit. Delete your existing alert to create a new one." 
                : "Create one rate alert to get notified when rates hit your target"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New Alert */}
            {alerts.length < 1 ? (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Create Your Alert</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Currency</label>
                  <Select
                    value={newAlert.currency}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rates.map((rate) => {
                        const config = CURRENCY_CONFIG.find(c => c.code === rate.currency)
                        return (
                          <SelectItem key={rate.currency} value={rate.currency}>
                            <div className="flex items-center gap-2">
                              <img
                                src={getFlagUrl(rate.currency)}
                                alt={rate.currency}
                                className="w-5 h-4 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <span>{rate.currency} - {config?.name || rate.currency}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rate Type</label>
                  <select
                    value={newAlert.rateType}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, rateType: e.target.value as any }))}
                    className="w-full p-2 rounded-md border bg-background"
                  >
                    <option value="blackMarket">Black Market</option>
                    <option value="cbn">CBN Official</option>
                    <option value="remittance">Remittance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, condition: e.target.value as any }))}
                    className="w-full p-2 rounded-md border bg-background"
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Threshold (₦)</label>
                  <Input
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, threshold: e.target.value }))}
                    placeholder="1600"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    value={newAlert.email}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>
              </div>

              {/* Notification method toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Notification Methods</label>
                
                {/* Email notification (always enabled) */}
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-0.5 rounded"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Email Notifications
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Always enabled • 1 email per month per alert
                    </p>
                  </div>
                </div>

                {/* Push notification (optional) */}
                {isSupported && (
                  <div className={`flex items-start gap-3 p-3 border rounded-lg ${
                    isSubscribed 
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-muted/50 border-border'
                  }`}>
                    <input
                      type="checkbox"
                      id="pushNotificationsEnabled"
                      checked={newAlert.pushEnabled}
                      onChange={(e) => setNewAlert((prev) => ({ ...prev, pushEnabled: e.target.checked }))}
                      disabled={!isSubscribed}
                      className="mt-0.5 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="pushNotificationsEnabled" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                        <Bell className="w-4 h-4" />
                        Push Notifications
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isSubscribed 
                          ? "Instant browser notifications • Unlimited" 
                          : "Enable push notifications above to use this feature"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>💡 Tip:</strong> {isSupported && isSubscribed 
                      ? "Enable both for maximum coverage - email for records, push for instant alerts!"
                      : "Email notifications are always sent. Enable push notifications above for instant alerts."}
                  </p>
                </div>
              </div>

              <Button onClick={createAlert} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </div>
            ) : (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <div className="text-amber-600 dark:text-amber-400 text-2xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Alert Limit Reached
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                      You can only have one active rate alert at a time. To create a new alert, please delete your existing alert below.
                    </p>
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      💡 <strong>Tip:</strong> You can modify your existing alert by deleting it and creating a new one with different settings.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Alert</h3>
                  <div className="text-xs text-muted-foreground">
                    💡 Alerts send once per trigger
                  </div>
                </div>
                <div className="space-y-2">
                  {alerts.map((alert) => {
                    const isTriggered = checkAlertTrigger(alert)
                    const rate = rates.find((r) => r.currency === alert.currency)
                    const currentRate = rate?.[alert.rateType] || 0
                    const hasBeenTriggered = alertHistory.some(
                      (h) => h.alertId === alert.id && h.notificationsSent?.email
                    )

                    return (
                      <div
                        key={alert.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isTriggered && alert.isActive 
                            ? hasBeenTriggered 
                              ? "bg-amber-50 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800" 
                              : "bg-destructive/10 border-destructive"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" onClick={() => toggleAlert(alert.id)} className="p-1">
                            {alert.isActive ? (
                              <Bell className="w-4 h-4 text-primary" />
                            ) : (
                              <BellOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <div>
                            <p className="font-medium">
                              {alert.currency} {alert.condition} ₦{alert.threshold.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getRateTypeLabel(alert.rateType)} • {alert.email}
                              {alert.pushEnabled && " • Push enabled"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isTriggered && alert.isActive && (
                            <Badge 
                              variant={hasBeenTriggered ? "secondary" : "destructive"} 
                              className="text-xs"
                            >
                              {hasBeenTriggered ? "SENT" : "TRIGGERED"}
                            </Badge>
                          )}
                          <div className="text-right">
                            <p className="font-mono text-sm">₦{currentRate.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Current</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                            className="p-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>How alerts work:</strong> You can create one rate alert that sends notifications when triggered. 
                    You'll receive both email and push notifications (if enabled). Email notifications are limited to 1 per month per alert, 
                    while push notifications have no limit. The alert resets when the rate moves away from your threshold and can trigger again.
                  </p>
                </div>
              </div>
            )}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No alerts set up yet</p>
                <p className="text-sm">Create your first alert above to get notified of rate changes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        {alerts.length === 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Getting Started with Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">📈 For Traders</h4>
                  <p className="text-sm text-muted-foreground">
                    Set alerts above and below current rates to catch both buying and selling opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">💼 For Business</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor remittance rates to know the best time to pay international suppliers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">✈️ For Travelers</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when CBN rates drop to exchange currency at better rates.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">🔔 Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable push notifications above to receive instant alerts on your device, in addition to email notifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monitoring Dashboard */}
        <MonitoringDashboard
          alertStats={getAlertStats()}
          monitoringStats={getMonitoringStats()}
          alertHistory={alertHistory}
          onExportData={exportData}
          onImportData={importData}
          onClearHistory={clearAlertHistory}
          onForceCheck={forceCheck}
          onToggleMonitoring={() => {}} // Monitoring is automatic based on active alerts
        />
      </div>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <AlertsPageContent />
    </ProtectedRoute>
  )
}
