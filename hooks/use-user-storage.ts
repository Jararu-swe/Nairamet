"use client"

import { useState, useEffect } from "react"
import { UserStorage } from "@/lib/user-storage"
import { useAuth } from "@/contexts/auth-context"

export function useUserStorage() {
  const { user, isAuthenticated } = useAuth()
  const [preferences, setPreferences] = useState(UserStorage.getPreferences())
  const [alerts, setAlerts] = useState(UserStorage.getUserAlerts())
  const [stats, setStats] = useState(UserStorage.getUserStats())

  useEffect(() => {
    if (isAuthenticated) {
      setPreferences(UserStorage.getPreferences())
      setAlerts(UserStorage.getUserAlerts())
      setStats(UserStorage.getUserStats())
    } else {
      setAlerts([])
      setStats(null)
    }
  }, [isAuthenticated])

  const updatePreferences = (updates: Partial<typeof preferences>) => {
    const newPrefs = UserStorage.updatePreferences(updates)
    setPreferences(newPrefs)
  }

  const addAlert = (alert: Parameters<typeof UserStorage.saveAlert>[0]) => {
    if (!isAuthenticated) throw new Error("Must be logged in to add alerts")

    const newAlert = UserStorage.saveAlert(alert)
    setAlerts((prev) => [...prev, newAlert])
    setStats(UserStorage.getUserStats())
    return newAlert
  }

  const updateAlert = (alertId: string, updates: Parameters<typeof UserStorage.updateAlert>[1]) => {
    const updatedAlert = UserStorage.updateAlert(alertId, updates)
    if (updatedAlert) {
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? updatedAlert : alert)))
      setStats(UserStorage.getUserStats())
    }
    return updatedAlert
  }

  const deleteAlert = (alertId: string) => {
    const success = UserStorage.deleteAlert(alertId)
    if (success) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
      setStats(UserStorage.getUserStats())
    }
    return success
  }

  const exportData = () => {
    return UserStorage.exportUserData()
  }

  const importData = (jsonData: string) => {
    const success = UserStorage.importUserData(jsonData)
    if (success) {
      setPreferences(UserStorage.getPreferences())
      setAlerts(UserStorage.getUserAlerts())
      setStats(UserStorage.getUserStats())
    }
    return success
  }

  return {
    preferences,
    alerts,
    stats,
    updatePreferences,
    addAlert,
    updateAlert,
    deleteAlert,
    exportData,
    importData,
  }
}
