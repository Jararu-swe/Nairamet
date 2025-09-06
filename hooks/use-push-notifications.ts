"use client"

import { useState, useEffect } from "react"

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()

      if (existingSubscription) {
        setSubscription(existingSubscription as any)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error("[v0] Error checking subscription:", error)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) return false

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  const subscribe = async () => {
    if (!isSupported) return false

    setIsLoading(true)
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      // Request notification permission
      const hasPermission = await requestPermission()
      if (!hasPermission) {
        throw new Error("Notification permission denied")
      }

      // Create push subscription
      // In production, you would use your own VAPID public key
      const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnVJyWAcJEXADiNXwqNDtHm_GWN6kOSr_7VJjHPS9mQUXEEkU"

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      setSubscription(pushSubscription as any)
      setIsSubscribed(true)

      console.log("[v0] Push subscription created:", pushSubscription)
      return true
    } catch (error) {
      console.error("[v0] Error subscribing to push notifications:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return false

    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const pushSubscription = await registration.pushManager.getSubscription()

      if (pushSubscription) {
        await pushSubscription.unsubscribe()
        setSubscription(null)
        setIsSubscribed(false)
        console.log("[v0] Push subscription removed")
        return true
      }
    } catch (error) {
      console.error("[v0] Error unsubscribing from push notifications:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    if (!subscription) return false

    try {
      const response = await fetch("/api/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          currency: "USD",
          condition: "above",
          threshold: 1600,
          currentRate: 1650,
          rateType: "blackMarket",
        }),
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("[v0] Error sending test notification:", error)
      return false
    }
  }

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
