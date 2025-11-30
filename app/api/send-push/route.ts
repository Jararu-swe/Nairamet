import { type NextRequest, NextResponse } from "next/server"
import { generatePushNotification } from "@/lib/push-notification-template"

interface PushNotificationData {
  userId: string
  currency: string
  condition: "above" | "below"
  threshold: number
  currentRate: number
  rateType: "cbn" | "blackMarket" | "remittance"
}

export async function POST(request: NextRequest) {
  try {
    const { userId, currency, condition, threshold, currentRate, rateType }: PushNotificationData =
      await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No user ID provided" },
        { status: 400 }
      )
    }

    const appId = process.env.ONESIGNAL_APP_ID
    const apiKey = process.env.ONESIGNAL_REST_API_KEY

    // Generate optimized push notification content
    const notification = generatePushNotification({
      currency,
      condition,
      threshold,
      currentRate,
      rateType,
    })

    if (!appId || !apiKey) {
      console.error("OneSignal credentials not configured")
      // For development, log the notification
      console.log("[OneSignal] Would send notification:", {
        userId,
        title: notification.title,
        message: notification.message,
      })
      return NextResponse.json({
        success: true,
        message: "Push notification logged (OneSignal not configured)",
        preview: notification,
      })
    }

    // Send notification via OneSignal REST API
    const response = await fetch(`https://onesignal.com/api/v1/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_player_ids: [userId],
        headings: { en: notification.title },
        subtitle: { en: notification.subtitle },
        contents: { en: notification.message },
        data: notification.data,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}${notification.data.url}`,
        web_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}${notification.data.url}`,
        chrome_web_icon: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/Nairamet.svg`,
        chrome_web_badge: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/Nairamet.svg`,
        priority: 10, // High priority for rate alerts
        ttl: 86400, // 24 hours time-to-live
      }),
    })

    const result = await response.json()

    if (result.errors) {
      console.error("OneSignal API error:", result.errors)
      return NextResponse.json({ success: false, error: result.errors }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
