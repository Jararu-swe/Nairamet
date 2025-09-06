import { type NextRequest, NextResponse } from "next/server"

interface PushNotificationData {
  subscription: PushSubscription
  currency: string
  condition: "above" | "below"
  threshold: number
  currentRate: number
  rateType: string
}

export async function POST(request: NextRequest) {
  try {
    const { subscription, currency, condition, threshold, currentRate, rateType }: PushNotificationData =
      await request.json()

    const payload = JSON.stringify({
      title: `🚨 FX Alert: ${currency} Rate ${condition.toUpperCase()} ₦${threshold.toLocaleString()}`,
      body: `${currency}/NGN is now ₦${currentRate.toLocaleString()} (${rateType === "blackMarket" ? "Black Market" : rateType === "cbn" ? "CBN Official" : "Remittance"})`,
      icon: "/icon-192x192.png",
      url: "/",
      primaryKey: `${currency}-${Date.now()}`,
    })

    // In a real application, you would use a push service like:
    // - web-push library with VAPID keys
    // - Firebase Cloud Messaging (FCM)
    // - OneSignal
    // - Pusher Beams

    // For demo purposes, we'll simulate sending the push notification
    console.log("[v0] Push notification would be sent:", {
      subscription: subscription.endpoint,
      payload: JSON.parse(payload),
    })

    // Simulate push notification delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In production, you would do something like:
    // const webpush = require('web-push')
    // webpush.setVapidDetails('mailto:your@email.com', publicVapidKey, privateVapidKey)
    // const result = await webpush.sendNotification(subscription, payload)
    // return NextResponse.json({ success: true, result })

    return NextResponse.json({
      success: true,
      message: "Push notification sent successfully",
      preview: JSON.parse(payload), // For demo purposes
    })
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send push notification" }, { status: 500 })
  }
}
