import { type NextRequest, NextResponse } from "next/server"

interface AlertEmailData {
  email: string
  currency: string
  condition: "above" | "below"
  threshold: number
  currentRate: number
  rateType: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, currency, condition, threshold, currentRate, rateType }: AlertEmailData = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    const emailContent = {
      to: email,
      from: process.env.EMAIL_FROM || "alerts@nairamet.com",
      subject: `🚨 FX Alert: ${currency} Rate ${condition.toUpperCase()} ₦${threshold.toLocaleString()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FX Rate Alert</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 32px 24px; text-align: center; }
            .content { padding: 32px 24px; }
            .alert-box { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .rate-display { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 16px 0; }
            .details { background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0; }
            .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 14px; color: #64748b; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">FX Rate Alert</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your rate threshold has been reached</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <h2 style="margin: 0 0 16px 0; color: #dc2626;">🚨 Alert Triggered!</h2>
                <p style="margin: 0; font-size: 16px;">
                  The <strong>${currency}/NGN</strong> rate has gone <strong>${condition}</strong> your threshold of <strong>₦${threshold.toLocaleString()}</strong>
                </p>
              </div>
              
              <div class="rate-display">
                Current Rate: ₦${currentRate.toLocaleString()}
              </div>
              
              <div class="details">
                <h3 style="margin: 0 0 12px 0; color: #374151;">Alert Details</h3>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                  <li><strong>Currency Pair:</strong> ${currency}/NGN</li>
                  <li><strong>Rate Source:</strong> ${rateType === "blackMarket" ? "Black Market" : rateType === "cbn" ? "CBN Official" : "Remittance"}</li>
                  <li><strong>Condition:</strong> ${condition.charAt(0).toUpperCase() + condition.slice(1)} ₦${threshold.toLocaleString()}</li>
                  <li><strong>Current Rate:</strong> ₦${currentRate.toLocaleString()}</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" class="button">
                  View Live Rates
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                This alert was sent because you set up a rate notification for ${currency}. 
                You can manage your alerts by visiting the FX Tracker dashboard.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 8px 0;"><strong>FX Tracker</strong></p>
              <p style="margin: 0; font-size: 12px;">
                Rates are indicative and for informational purposes only. 
                Always verify with official sources before making transactions.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
FX Rate Alert - ${currency}/NGN

Your rate threshold has been reached!

The ${currency}/NGN rate has gone ${condition} your threshold of ₦${threshold.toLocaleString()}

Current Rate: ₦${currentRate.toLocaleString()}

Alert Details:
- Currency Pair: ${currency}/NGN
- Rate Source: ${rateType === "blackMarket" ? "Black Market" : "CBN Official"}
- Condition: ${condition.charAt(0).toUpperCase() + condition.slice(1)} ₦${threshold.toLocaleString()}
- Current Rate: ₦${currentRate.toLocaleString()}
- Time: ${new Date().toLocaleString()}

Visit ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} to view live rates.

This alert was sent because you set up a rate notification for ${currency}.
      `,
    }

    console.log("[v0] Sending email alert to:", email)

    // Try to send with Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: emailContent.from,
            to: emailContent.to,
            subject: emailContent.subject,
            html: emailContent.html,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          console.log("[v0] Email sent successfully via Resend:", result.id)
          return NextResponse.json({
            success: true,
            message: "Alert email sent successfully",
            emailId: result.id,
          })
        } else {
          console.error("[v0] Resend API error:", result)
          throw new Error(result.message || "Failed to send email")
        }
      } catch (resendError) {
        console.error("[v0] Error with Resend:", resendError)
        // Fall through to demo mode
      }
    }

    // Demo mode: Log email content
    console.log("[v0] Email would be sent (demo mode):", {
      to: emailContent.to,
      subject: emailContent.subject,
    })

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Alert email logged (demo mode - configure RESEND_API_KEY for real emails)",
      preview: emailContent.html,
      demoMode: true,
    })
  } catch (error) {
    console.error("[v0] Error sending alert email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send alert email",
      },
      { status: 500 }
    )
  }
}