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
  const [lastEmailSent, setLastEmailSent] = useState<Date | null>(null)
  const [emailQuotaUsed, setEmailQuotaUsed] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const alertHistoryRef = useRef<Set<string>>(new Set())

  // Load last email sent date from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('nairamet_last_email_sent')
    if (stored) {
      const lastSent = new Date(stored)
      setLastEmailSent(lastSent)
      
      // Check if it's been a month since last email
      const now = new Date()
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      setEmailQuotaUsed(lastSent > monthAgo)
    }
  }, [])

  // Check monthly quota on interval
  useEffect(() => {
    const checkQuota = () => {
      if (lastEmailSent) {
        const now = new Date()
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        setEmailQuotaUsed(lastEmailSent > monthAgo)
      }
    }
    
    // Check quota every hour
    const quotaInterval = setInterval(checkQuota, 60 * 60 * 1000)
    return () => clearInterval(quotaInterval)
  }, [lastEmailSent])

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
        // Prevent duplicate alerts - only send once per alert until condition is no longer met
        const alertKey = `${alert.id}`

        if (!alertHistoryRef.current.has(alertKey)) {
          // Check monthly email quota
          if (emailQuotaUsed) {
            console.log(`[v0] Alert triggered but monthly email quota used: ${alert.currency} ${alert.condition} ₦${alert.threshold}`)
            // Still mark as triggered to prevent repeated checks, but don't send email
            alertHistoryRef.current.add(alertKey)
          } else {
            console.log(`[v0] Alert triggered: ${alert.currency} ${alert.condition} ₦${alert.threshold}`)
            onAlertTriggered(alert, currentRate)
            alertHistoryRef.current.add(alertKey)
            
            // Record email sent
            const now = new Date()
            setLastEmailSent(now)
            setEmailQuotaUsed(true)
            localStorage.setItem('nairamet_last_email_sent', now.toISOString())
          }
        }
      } else {
        // Reset alert when condition is no longer met (allows re-triggering)
        const alertKey = `${alert.id}`
        if (alertHistoryRef.current.has(alertKey)) {
          alertHistoryRef.current.delete(alertKey)
          console.log(`[v0] Alert reset: ${alert.currency} ${alert.condition} ₦${alert.threshold} - condition no longer met`)
        }
      }
    }
  }

  const forceCheck = () => {
    checkAlerts()
    setChecksPerformed((prev) => prev + 1)
  }

  const getMonitoringStats = () => {
    const nextEmailDate = lastEmailSent 
      ? new Date(lastEmailSent.getFullYear(), lastEmailSent.getMonth() + 1, lastEmailSent.getDate())
      : null

    return {
      isMonitoring,
      lastCheck,
      checksPerformed,
      activeAlerts: alerts.filter((a) => a.isActive).length,
      totalAlerts: alerts.length,
      checkInterval,
      nextCheck: lastCheck && isMonitoring ? new Date(lastCheck.getTime() + checkInterval * 60 * 1000) : null,
      emailQuotaUsed,
      lastEmailSent,
      nextEmailDate,
    }
  }

  return {
    isMonitoring,
    lastCheck,
    checksPerformed,
    emailQuotaUsed,
    lastEmailSent,
    startMonitoring,
    stopMonitoring,
    forceCheck,
    getMonitoringStats,
  }
}
