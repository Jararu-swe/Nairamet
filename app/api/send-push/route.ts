import { type NextRequest, NextResponse } from "next/server"

interface PushNotificationData {
  userId: string
  currency: string
  condition: "above" | "below"
  threshold: number
  currentRate: number
  rateType: string
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

    if (!appId || !apiKey) {
      console.error("OneSignal credentials not configured")
      // For development, log the notification
      console.log("[OneSignal] Would send notification:", {
        userId,
        title: `${currency}/NGN Rate Alert`,
        message: `${currency}/NGN ${rateType} rate is ${condition} ₦${threshold.toLocaleString()}. Current: ₦${currentRate.toLocaleString()}`,
      })
      return NextResponse.json({
        success: true,
        message: "Push notification logged (OneSignal not configured)",
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
        headings: { en: `${currency}/NGN Rate Alert` },
        contents: {
          en: `${currency}/NGN ${rateType} rate is ${condition} ₦${threshold.toLocaleString()}. Current: ₦${currentRate.toLocaleString()}`,
        },
        data: {
          url: "/alerts",
          currency,
          threshold,
          currentRate,
        },
        web_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/alerts`,
        chrome_web_icon: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/Nairamet.svg`,
        chrome_web_badge: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/Nairamet.svg`,
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
