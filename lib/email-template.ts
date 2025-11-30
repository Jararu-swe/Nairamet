/**
 * NairaMet Rate Alert Email Template
 * Professional, branded email template for exchange rate alerts
 */

interface AlertEmailData {
  currency: string;
  condition: 'above' | 'below';
  threshold: number;
  currentRate: number;
  rateType: 'cbn' | 'blackMarket' | 'remittance';
  recipientEmail: string;
}

export function generateAlertEmailHTML(data: AlertEmailData): string {
  const { currency, condition, threshold, currentRate, rateType } = data;
  
  const rateTypeLabel = {
    cbn: 'CBN Official',
    blackMarket: 'Black Market',
    remittance: 'Remittance'
  }[rateType];

  const conditionText = condition === 'above' ? 'risen above' : 'fallen below';
  const emoji = condition === 'above' ? '📈' : '📉';
  const colorClass = condition === 'above' ? '#10b981' : '#ef4444';
  
  const difference = Math.abs(currentRate - threshold);
  const percentChange = ((difference / threshold) * 100).toFixed(2);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rate Alert - NairaMet</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .tagline {
      color: #d1fae5;
      font-size: 14px;
      margin: 8px 0 0 0;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-badge {
      display: inline-block;
      background-color: ${colorClass};
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }
    .alert-title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .alert-message {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 30px 0;
      line-height: 1.6;
    }
    .rate-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
    }
    .rate-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #d1fae5;
    }
    .rate-row:last-child {
      border-bottom: none;
    }
    .rate-label {
      font-size: 14px;
      color: #059669;
      font-weight: 500;
    }
    .rate-value {
      font-size: 24px;
      font-weight: bold;
      color: #065f46;
      font-family: 'Courier New', monospace;
    }
    .rate-change {
      font-size: 12px;
      color: ${colorClass};
      font-weight: 600;
      margin-top: 4px;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #1e40af;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-links {
      margin: 20px 0;
    }
    .footer-link {
      color: #10b981;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    .footer-text {
      font-size: 12px;
      color: #9ca3af;
      margin: 8px 0;
      line-height: 1.5;
    }
    .social-icons {
      margin: 20px 0;
    }
    .social-icon {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin: 0 8px;
      background-color: #10b981;
      border-radius: 50%;
      text-align: center;
      line-height: 32px;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .alert-title {
        font-size: 20px;
      }
      .rate-value {
        font-size: 20px;
      }
      .cta-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">NairaMet</h1>
      <p class="tagline">Nigeria's FX Platform, Simplified</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="alert-badge">${emoji} RATE ALERT TRIGGERED</div>
      
      <h2 class="alert-title">
        ${currency}/NGN has ${conditionText} your target!
      </h2>
      
      <p class="alert-message">
        Great news! The ${rateTypeLabel} rate for ${currency} to Naira has ${conditionText} 
        your threshold of <strong>₦${threshold.toLocaleString()}</strong>.
      </p>

      <!-- Rate Card -->
      <div class="rate-card">
        <div class="rate-row">
          <div>
            <div class="rate-label">Current ${rateTypeLabel} Rate</div>
            <div class="rate-change">${condition === 'above' ? '▲' : '▼'} ${percentChange}% from threshold</div>
          </div>
          <div class="rate-value">₦${currentRate.toLocaleString()}</div>
        </div>
        <div class="rate-row">
          <div class="rate-label">Your Threshold</div>
          <div class="rate-value" style="font-size: 18px; color: #6b7280;">₦${threshold.toLocaleString()}</div>
        </div>
        <div class="rate-row">
          <div class="rate-label">Difference</div>
          <div class="rate-value" style="font-size: 18px; color: ${colorClass};">₦${difference.toLocaleString()}</div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <p>
          <strong>💡 What this means:</strong> The ${currency} exchange rate has moved ${condition === 'above' ? 'up' : 'down'} 
          by ₦${difference.toLocaleString()} (${percentChange}%). This might be a good time to 
          ${condition === 'above' ? 'sell' : 'buy'} ${currency} depending on your strategy.
        </p>
      </div>

      <!-- CTA Button -->
      <center>
        <a href="https://nairamet.com/tracker" class="cta-button">
          View Live Rates →
        </a>
      </center>

      <p style="font-size: 14px; color: #6b7280; margin-top: 30px; line-height: 1.6;">
        This alert was triggered based on your rate monitoring preferences. 
        You can manage your alerts anytime on the NairaMet platform.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social-icons">
        <a href="https://twitter.com/nairamet" class="social-icon">𝕏</a>
        <a href="https://facebook.com/nairamet" class="social-icon">f</a>
        <a href="https://linkedin.com/company/nairamet" class="social-icon">in</a>
      </div>
      
      <div class="footer-links">
        <a href="https://nairamet.com/tracker" class="footer-link">Live Rates</a>
        <a href="https://nairamet.com/alerts" class="footer-link">Manage Alerts</a>
        <a href="https://nairamet.com/blog" class="footer-link">FX News</a>
      </div>
      
      <p class="footer-text">
        <strong>NairaMet</strong> - Real-time Naira exchange rates and FX tools<br>
        Track USD/NGN, GBP/NGN, EUR/NGN and more currencies
      </p>
      
      <p class="footer-text">
        You're receiving this email because you set up a rate alert on NairaMet.<br>
        <a href="https://nairamet.com/alerts" style="color: #10b981;">Manage your alerts</a> | 
        <a href="https://nairamet.com/privacy" style="color: #10b981;">Privacy Policy</a>
      </p>
      
      <p class="footer-text" style="margin-top: 20px;">
        © ${new Date().getFullYear()} NairaMet. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of the email (for email clients that don't support HTML)
 */
export function generateAlertEmailText(data: AlertEmailData): string {
  const { currency, condition, threshold, currentRate, rateType } = data;
  
  const rateTypeLabel = {
    cbn: 'CBN Official',
    blackMarket: 'Black Market',
    remittance: 'Remittance'
  }[rateType];

  const conditionText = condition === 'above' ? 'risen above' : 'fallen below';
  const difference = Math.abs(currentRate - threshold);
  const percentChange = ((difference / threshold) * 100).toFixed(2);

  return `
RATE ALERT TRIGGERED - NairaMet

${currency}/NGN has ${conditionText} your target!

The ${rateTypeLabel} rate for ${currency} to Naira has ${conditionText} your threshold of ₦${threshold.toLocaleString()}.

CURRENT RATE: ₦${currentRate.toLocaleString()}
YOUR THRESHOLD: ₦${threshold.toLocaleString()}
DIFFERENCE: ₦${difference.toLocaleString()} (${percentChange}%)

What this means:
The ${currency} exchange rate has moved ${condition === 'above' ? 'up' : 'down'} by ₦${difference.toLocaleString()} (${percentChange}%). 
This might be a good time to ${condition === 'above' ? 'sell' : 'buy'} ${currency} depending on your strategy.

View live rates: https://nairamet.com/tracker
Manage your alerts: https://nairamet.com/alerts

---
NairaMet - Nigeria's FX Platform, Simplified
Real-time Naira exchange rates and FX tools

© ${new Date().getFullYear()} NairaMet. All rights reserved.
  `.trim();
}
