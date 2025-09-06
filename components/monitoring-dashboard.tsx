"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Clock,
  TrendingUp,
  Mail,
  Smartphone,
  Download,
  Upload,
  Trash2,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react"

interface MonitoringDashboardProps {
  alertStats: {
    totalAlerts: number
    activeAlerts: number
    triggeredToday: number
    triggeredThisWeek: number
    emailsSentToday: number
    pushSentToday: number
    mostTriggeredCurrency: { currency: string; count: number } | null
    averageTriggersPerDay: number
  }
  monitoringStats: {
    isMonitoring: boolean
    lastCheck: Date | null
    checksPerformed: number
    activeAlerts: number
    totalAlerts: number
    checkInterval: number
    nextCheck: Date | null
  }
  alertHistory: Array<{
    id: string
    alertId: string
    currency: string
    condition: "above" | "below"
    threshold: number
    triggeredRate: number
    rateType: string
    triggeredAt: Date
    notificationsSent: {
      email: boolean
      push: boolean
    }
  }>
  onExportData: () => string
  onImportData: (data: string) => boolean
  onClearHistory: () => void
  onForceCheck: () => void
  onToggleMonitoring: () => void
}

export function MonitoringDashboard({
  alertStats,
  monitoringStats,
  alertHistory,
  onExportData,
  onImportData,
  onClearHistory,
  onForceCheck,
  onToggleMonitoring,
}: MonitoringDashboardProps) {
  const [importData, setImportData] = useState("")

  const handleExport = () => {
    const data = onExportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fx-tracker-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (!importData.trim()) return

    const success = onImportData(importData)
    if (success) {
      setImportData("")
      alert("Data imported successfully!")
    } else {
      alert("Failed to import data. Please check the format.")
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Monitoring Dashboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">Track alert performance and system status</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{alertStats.totalAlerts}</p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{alertStats.activeAlerts}</p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{alertStats.triggeredToday}</p>
                <p className="text-sm text-muted-foreground">Triggered Today</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{alertStats.triggeredThisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Email Notifications</span>
                </div>
                <p className="text-2xl font-bold">{alertStats.emailsSentToday}</p>
                <p className="text-sm text-muted-foreground">Sent today</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Push Notifications</span>
                </div>
                <p className="text-2xl font-bold">{alertStats.pushSentToday}</p>
                <p className="text-sm text-muted-foreground">Sent today</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Most Active</span>
                </div>
                <p className="text-2xl font-bold">{alertStats.mostTriggeredCurrency?.currency || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  {alertStats.mostTriggeredCurrency?.count || 0} triggers this week
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Recent Alert History</h3>
              <Button variant="outline" size="sm" onClick={onClearHistory} className="bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </div>

            {alertHistory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alertHistory
                  .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
                  .slice(0, 50)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {item.currency} {item.condition} ₦{item.threshold.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getRateTypeLabel(item.rateType)} • Triggered at ₦{item.triggeredRate.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.triggeredAt)}</p>
                      </div>
                      <div className="flex gap-1">
                        {item.notificationsSent.email && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Badge>
                        )}
                        {item.notificationsSent.push && (
                          <Badge variant="outline" className="text-xs">
                            <Smartphone className="w-3 h-3 mr-1" />
                            Push
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No alert history yet</p>
                <p className="text-sm">Triggered alerts will appear here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Monitoring Status: {monitoringStats.isMonitoring ? "Active" : "Inactive"}</p>
                <p className="text-sm text-muted-foreground">
                  {monitoringStats.isMonitoring
                    ? `Checking every ${monitoringStats.checkInterval} minutes`
                    : "No active alerts to monitor"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onForceCheck} className="bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Now
                </Button>
                <Button
                  variant={monitoringStats.isMonitoring ? "destructive" : "default"}
                  size="sm"
                  onClick={onToggleMonitoring}
                >
                  {monitoringStats.isMonitoring ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{monitoringStats.checksPerformed}</p>
                <p className="text-sm text-muted-foreground">Checks Performed</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{formatTime(monitoringStats.lastCheck)}</p>
                <p className="text-sm text-muted-foreground">Last Check</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{formatTime(monitoringStats.nextCheck)}</p>
                <p className="text-sm text-muted-foreground">Next Check</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{monitoringStats.checkInterval}m</p>
                <p className="text-sm text-muted-foreground">Check Interval</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download all your alerts, history, and settings as a JSON file
                </p>
                <Button onClick={handleExport} variant="outline" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Restore your alerts and settings from a previously exported JSON file
                </p>
                <div className="space-y-2">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your exported JSON data here..."
                    className="w-full h-32 p-3 border rounded-md resize-none"
                  />
                  <Button
                    onClick={handleImport}
                    disabled={!importData.trim()}
                    variant="outline"
                    className="bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
