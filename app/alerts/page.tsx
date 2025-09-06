"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Plus, Trash2, Smartphone, SmartphoneNfc } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useAlertStorage } from "@/hooks/use-alert-storage"
import { useRateMonitor } from "@/hooks/use-rate-monitor"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
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

function AlertsPageContent() {
  const [rates] = useState<ExchangeRate[]>([
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

  const [newAlert, setNewAlert] = useState({
    currency: "USD",
    rateType: "blackMarket" as const,
    condition: "above" as const,
    threshold: "",
    email: "",
    pushEnabled: false,
  })

  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe, sendTestNotification } = usePushNotifications()

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

  const { isMonitoring, forceCheck, getMonitoringStats } = useRateMonitor(
    rates,
    alerts,
    handleAlertTriggered,
    alertSettings.checkInterval,
  )

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
    if (!newAlert.threshold || !newAlert.email) return

    addAlert({
      currency: newAlert.currency,
      rateType: newAlert.rateType,
      condition: newAlert.condition,
      threshold: Number.parseFloat(newAlert.threshold),
      email: newAlert.email,
      pushEnabled: newAlert.pushEnabled && isSubscribed,
      isActive: true,
    })

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
    }
  }

  const checkAlertTrigger = (alert: any) => {
    const rate = rates.find((r) => r.currency === alert.currency)
    if (!rate) return false

    const currentRate = rate[alert.rateType]
    return alert.condition === "above" ? currentRate > alert.threshold : currentRate < alert.threshold
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rate Alerts</h1>
            <p className="text-muted-foreground">Get notified when exchange rates hit your targets</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-500" : "bg-gray-400"}`} />
            {isMonitoring ? "Monitoring active" : "Monitoring inactive"}
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
                      <Button variant="outline" size="sm" onClick={sendTestNotification} className="bg-transparent">
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={unsubscribe}
                        disabled={isLoading}
                        className="bg-transparent"
                      >
                        {isLoading ? "Loading..." : "Disable"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={subscribe} disabled={isLoading} size="sm">
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
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Manage Alerts
            </CardTitle>
            <p className="text-sm text-muted-foreground">Set up notifications for when rates hit your target</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New Alert */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Create New Alert</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Currency</label>
                  <select
                    value={newAlert.currency}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-2 rounded-md border bg-background"
                  >
                    {rates.map((rate) => (
                      <option key={rate.currency} value={rate.currency}>
                        {rate.flag} {rate.currency}
                      </option>
                    ))}
                  </select>
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

              {/* Push notification toggle */}
              {isSupported && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pushEnabled"
                    checked={newAlert.pushEnabled}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, pushEnabled: e.target.checked }))}
                    disabled={!isSubscribed}
                    className="rounded"
                  />
                  <label htmlFor="pushEnabled" className="text-sm">
                    Also send push notifications {!isSubscribed && "(enable push notifications first)"}
                  </label>
                </div>
              )}

              <Button onClick={createAlert} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </div>

            {/* Active Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Your Alerts ({alerts.length})</h3>
                <div className="space-y-2">
                  {alerts.map((alert) => {
                    const isTriggered = checkAlertTrigger(alert)
                    const rate = rates.find((r) => r.currency === alert.currency)
                    const currentRate = rate?.[alert.rateType] || 0

                    return (
                      <div
                        key={alert.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isTriggered && alert.isActive ? "bg-destructive/10 border-destructive" : "bg-muted/50"
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
                            <Badge variant="destructive" className="text-xs">
                              TRIGGERED
                            </Badge>
                          )}
                          <div className="text-right">
                            <p className="font-mono text-sm">₦{currentRate.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Current</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlertHook(alert.id)}
                            className="p-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
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
