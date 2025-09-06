"use client"

import { useState, useEffect, useRef } from "react"

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
}

export function useRateMonitor(
  rates: ExchangeRate[],
  alerts: Alert[],
  onAlertTriggered: (alert: Alert, currentRate: number) => void,
  checkInterval = 5, // minutes
) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [checksPerformed, setChecksPerformed] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const alertHistoryRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const hasActiveAlerts = alerts.some((alert) => alert.isActive)

    if (hasActiveAlerts && !isMonitoring) {
      startMonitoring()
    } else if (!hasActiveAlerts && isMonitoring) {
      stopMonitoring()
    }

    return () => stopMonitoring()
  }, [alerts, checkInterval])

  useEffect(() => {
    if (isMonitoring && rates.length > 0) {
      checkAlerts()
    }
  }, [rates])

  const startMonitoring = () => {
    if (intervalRef.current) return

    console.log("[v0] Starting rate monitoring...")
    setIsMonitoring(true)

    // Set up periodic checks
    intervalRef.current = setInterval(
      () => {
        checkAlerts()
        setChecksPerformed((prev) => prev + 1)
      },
      checkInterval * 60 * 1000,
    ) // Convert minutes to milliseconds
  }

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsMonitoring(false)
    console.log("[v0] Stopped rate monitoring")
  }

  const checkAlerts = () => {
    if (!rates.length || !alerts.length) return

    setLastCheck(new Date())

    for (const alert of alerts) {
      if (!alert.isActive) continue

      const rate = rates.find((r) => r.currency === alert.currency)
      if (!rate) continue

      const currentRate = rate[alert.rateType]
      const isTriggered = alert.condition === "above" ? currentRate > alert.threshold : currentRate < alert.threshold

      if (isTriggered) {
        // Prevent duplicate alerts within the same hour
        const alertKey = `${alert.id}-${Math.floor(Date.now() / (1000 * 60 * 60))}`

        if (!alertHistoryRef.current.has(alertKey)) {
          console.log(`[v0] Alert triggered: ${alert.currency} ${alert.condition} ₦${alert.threshold}`)
          onAlertTriggered(alert, currentRate)
          alertHistoryRef.current.add(alertKey)

          // Clean up old alert keys (keep only last 24 hours)
          const currentHour = Math.floor(Date.now() / (1000 * 60 * 60))
          alertHistoryRef.current.forEach((key) => {
            const keyHour = Number.parseInt(key.split("-").pop() || "0")
            if (currentHour - keyHour > 24) {
              alertHistoryRef.current.delete(key)
            }
          })
        }
      }
    }
  }

  const forceCheck = () => {
    checkAlerts()
    setChecksPerformed((prev) => prev + 1)
  }

  const getMonitoringStats = () => {
    return {
      isMonitoring,
      lastCheck,
      checksPerformed,
      activeAlerts: alerts.filter((a) => a.isActive).length,
      totalAlerts: alerts.length,
      checkInterval,
      nextCheck: lastCheck && isMonitoring ? new Date(lastCheck.getTime() + checkInterval * 60 * 1000) : null,
    }
  }

  return {
    isMonitoring,
    lastCheck,
    checksPerformed,
    startMonitoring,
    stopMonitoring,
    forceCheck,
    getMonitoringStats,
  }
}
