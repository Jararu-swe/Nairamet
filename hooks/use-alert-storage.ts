"use client"

import { useState, useEffect } from "react"

interface Alert {
  id: string
  currency: string
  rateType: "cbn" | "blackMarket" | "remittance"
  condition: "above" | "below"
  threshold: number
  email: string
  pushEnabled: boolean
  isActive: boolean
  createdAt: Date
  // Optional arbitrary data payload for additional metadata
  data?: Record<string, any>
}

interface AlertHistory {
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
}

const ALERTS_STORAGE_KEY = "fx-tracker-alerts"
const ALERT_HISTORY_STORAGE_KEY = "fx-tracker-alert-history"
const ALERT_SETTINGS_STORAGE_KEY = "fx-tracker-alert-settings"

interface AlertSettings {
  checkInterval: number // minutes
  maxAlertsPerHour: number
  enableSounds: boolean
  lastRateUpdate: Date | null
}

export function useAlertStorage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([])
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    checkInterval: 5,
    maxAlertsPerHour: 10,
    enableSounds: true,
    lastRateUpdate: null,
  })

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))
    }
  }, [alerts])

  useEffect(() => {
    if (alertHistory.length > 0) {
      localStorage.setItem(ALERT_HISTORY_STORAGE_KEY, JSON.stringify(alertHistory))
    }
  }, [alertHistory])

  useEffect(() => {
    localStorage.setItem(ALERT_SETTINGS_STORAGE_KEY, JSON.stringify(alertSettings))
  }, [alertSettings])

  const loadFromStorage = () => {
    try {
      // Load alerts
      const savedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY)
      if (savedAlerts) {
        const parsedAlerts = JSON.parse(savedAlerts).map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
        }))
        setAlerts(parsedAlerts)
      }

      // Load alert history
      const savedHistory = localStorage.getItem(ALERT_HISTORY_STORAGE_KEY)
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          triggeredAt: new Date(item.triggeredAt),
        }))
        setAlertHistory(parsedHistory)
      }

      // Load settings
      const savedSettings = localStorage.getItem(ALERT_SETTINGS_STORAGE_KEY)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setAlertSettings({
          ...parsedSettings,
          lastRateUpdate: parsedSettings.lastRateUpdate ? new Date(parsedSettings.lastRateUpdate) : null,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading from storage:", error)
    }
  }

  const addAlert = (alert: Omit<Alert, "id" | "createdAt">) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setAlerts((prev) => [...prev, newAlert])
    return newAlert
  }

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, ...updates } : alert)))
  }

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const addAlertHistory = (
    alertId: string,
    currency: string,
    condition: "above" | "below",
    threshold: number,
    triggeredRate: number,
    rateType: string,
    notificationsSent: { email: boolean; push: boolean },
  ) => {
    const historyItem: AlertHistory = {
      id: Date.now().toString(),
      alertId,
      currency,
      condition,
      threshold,
      triggeredRate,
      rateType,
      triggeredAt: new Date(),
      notificationsSent,
    }
    setAlertHistory((prev) => [...prev, historyItem])
    return historyItem
  }

  const clearAlertHistory = () => {
    setAlertHistory([])
    localStorage.removeItem(ALERT_HISTORY_STORAGE_KEY)
  }

  const updateSettings = (updates: Partial<AlertSettings>) => {
    setAlertSettings((prev) => ({ ...prev, ...updates }))
  }

  const getAlertStats = () => {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentHistory = alertHistory.filter((item) => item.triggeredAt > last24Hours)
    const weeklyHistory = alertHistory.filter((item) => item.triggeredAt > last7Days)

    return {
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter((a) => a.isActive).length,
      triggeredToday: recentHistory.length,
      triggeredThisWeek: weeklyHistory.length,
      emailsSentToday: recentHistory.filter((h) => h.notificationsSent.email).length,
      pushSentToday: recentHistory.filter((h) => h.notificationsSent.push).length,
      mostTriggeredCurrency: getMostTriggeredCurrency(weeklyHistory),
      averageTriggersPerDay: weeklyHistory.length / 7,
    }
  }

  const getMostTriggeredCurrency = (history: AlertHistory[]) => {
    const counts = history.reduce(
      (acc, item) => {
        acc[item.currency] = (acc[item.currency] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const entries = Object.entries(counts)
    if (entries.length === 0) return null

    return entries.reduce((max, [currency, count]) => (count > max.count ? { currency, count } : max), {
      currency: entries[0][0],
      count: entries[0][1],
    })
  }

  const exportData = () => {
    const data = {
      alerts,
      alertHistory,
      alertSettings,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData)

      if (data.alerts) {
        const importedAlerts = data.alerts.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
        }))
        setAlerts(importedAlerts)
      }

      if (data.alertHistory) {
        const importedHistory = data.alertHistory.map((item: any) => ({
          ...item,
          triggeredAt: new Date(item.triggeredAt),
        }))
        setAlertHistory(importedHistory)
      }

      if (data.alertSettings) {
        setAlertSettings({
          ...data.alertSettings,
          lastRateUpdate: data.alertSettings.lastRateUpdate ? new Date(data.alertSettings.lastRateUpdate) : null,
        })
      }

      return true
    } catch (error) {
      console.error("[v0] Error importing data:", error)
      return false
    }
  }

  return {
    alerts,
    alertHistory,
    alertSettings,
    addAlert,
    updateAlert,
    deleteAlert,
    addAlertHistory,
    clearAlertHistory,
    updateSettings,
    getAlertStats,
    exportData,
    importData,
    loadFromStorage,
  }
}
