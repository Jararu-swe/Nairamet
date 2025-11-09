"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    OneSignal: any;
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize OneSignal
    initOneSignal()
  }, [])

  const initOneSignal = async () => {
    try {
      // Check if OneSignal is supported
      if (typeof window === 'undefined') return

      // Wait for OneSignal to load
      await waitForOneSignal()

      // Initialize OneSignal with your App ID
      window.OneSignal = window.OneSignal || []
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "YOUR_ONESIGNAL_APP_ID",
          notifyButton: {
            enable: false, // We'll use our own UI
          },
          allowLocalhostAsSecureOrigin: true, // For development
        })

        // Check if already subscribed
        window.OneSignal.isPushNotificationsEnabled(function(isEnabled: boolean) {
          setIsSubscribed(isEnabled)
          setIsSupported(true)
        })

        // Get user ID
        window.OneSignal.getUserId(function(id: string) {
          if (id) {
            setUserId(id)
          }
        })

        // Listen for subscription changes
        window.OneSignal.on('subscriptionChange', function(isSubscribed: boolean) {
          setIsSubscribed(isSubscribed)
          if (isSubscribed) {
            window.OneSignal.getUserId(function(id: string) {
              setUserId(id)
            })
          }
        })
      })
    } catch (error) {
      console.error("Error initializing OneSignal:", error)
    }
  }

  const waitForOneSignal = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.OneSignal) {
        resolve()
      } else {
        const checkInterval = setInterval(() => {
          if (window.OneSignal) {
            clearInterval(checkInterval)
            resolve()
          }
        }, 100)
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval)
          resolve()
        }, 10000)
      }
    })
  }

  const subscribe = async () => {
    if (!isSupported || !window.OneSignal) return false

    setIsLoading(true)
    try {
      await window.OneSignal.push(async function() {
        await window.OneSignal.showNativePrompt()
      })
      
      // Check if user subscribed
      const isEnabled = await new Promise<boolean>((resolve) => {
        window.OneSignal.isPushNotificationsEnabled(resolve)
      })
      
      if (isEnabled) {
        const id = await new Promise<string>((resolve) => {
          window.OneSignal.getUserId(resolve)
        })
        setUserId(id)
        setIsSubscribed(true)
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    if (!window.OneSignal) return false

    setIsLoading(true)
    try {
      await window.OneSignal.push(function() {
        window.OneSignal.setSubscription(false)
      })
      
      setIsSubscribed(false)
      setUserId(null)
      return true
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    if (!userId) return false

    try {
      const response = await fetch("/api/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
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
      console.error("Error sending test notification:", error)
      return false
    }
  }

  return {
    isSupported,
    isSubscribed,
    isLoading,
    userId,
    subscribe,
    unsubscribe,
    sendTestNotification,
  }
}
