# Smart Alerts Setup Guide

## Overview

The Smart Alerts system monitors exchange rates in real-time and sends notifications via email and push notifications when rates hit your target thresholds.

## Features

✅ **Real-time Rate Monitoring** - Checks rates every 5 minutes
✅ **Email Notifications** - Get alerts via email when rates trigger
✅ **Push Notifications** - Instant browser notifications
✅ **Multiple Alert Types** - Set alerts for CBN, Black Market, or Remittance rates
✅ **Alert History** - Track all triggered alerts
✅ **Data Export/Import** - Backup and restore your alerts
✅ **Monitoring Dashboard** - View statistics and performance

## Quick Start

### 1. Create an Alert

1. Navigate to `/alerts` page
2. Fill in the alert form:
   - **Currency**: Choose USD, GBP, EUR, or CNY
   - **Rate Type**: CBN Official, Black Market, or Remittance
   - **Condition**: Above or Below
   - **Threshold**: Target rate in Naira (₦)
   - **Email**: Your email address for notifications
3. Click "Create Alert"

### 2. Enable Push Notifications (Optional)

1. Click "Enable" in the Push Notifications card
2. Allow browser notification permissions when prompted
3. Test notifications with the "Test" button
4. Check "Also send push notifications" when creating alerts

## Email Setup (For Production)

The system supports email notifications via [Resend](https://resend.com) - a modern email API.

### Setup Steps:

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account (100 emails/day free tier)

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Configure Environment Variables**
   
   Create or update `.env.local`:
   ```env
   # Email Configuration
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=alerts@yourdomain.com
   
   # App URL (for email links)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Verify Domain (Optional but Recommended)**
   - In Resend dashboard, add your domain
   - Add DNS records as instructed
   - Use your verified domain in `EMAIL_FROM`

### Alternative Email Services

You can also integrate other email services by modifying `app/api/send-alert/route.ts`:

- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://mailgun.com
- **AWS SES**: https://aws.amazon.com/ses/
- **Postmark**: https://postmarkapp.com

## Push Notifications Setup

Push notifications work out of the box in modern browsers. The service worker is already configured.

### Browser Support:
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (macOS 16.4+, iOS 16.4+)
- ❌ iOS Safari (older versions)

### VAPID Keys (Optional - For Production)

For production, generate your own VAPID keys:

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

Update `hooks/use-push-notifications.ts` with your public key:
```typescript
const vapidPublicKey = "YOUR_PUBLIC_KEY_HERE"
```

Update `app/api/send-push/route.ts` to use web-push library with your private key.

## Currency API Setup

The alerts system fetches real-time rates from CurrencyLayer API.

### Setup Steps:

1. **Sign up for CurrencyLayer**
   - Go to https://currencylayer.com
   - Create a free account (100 requests/month free tier)

2. **Get API Key**
   - Copy your API key from the dashboard

3. **Configure Environment Variable**
   
   Add to `.env.local`:
   ```env
   CURRENCYLAYER_API_KEY=your_api_key_here
   ```

### Alternative Currency APIs

You can modify `app/api/currency/route.ts` to use:
- **ExchangeRate-API**: https://exchangerate-api.com
- **Fixer.io**: https://fixer.io
- **Open Exchange Rates**: https://openexchangerates.org

## How It Works

### 1. Rate Monitoring
- The `useRateMonitor` hook checks rates every 5 minutes
- Compares current rates against alert thresholds
- Triggers notifications when conditions are met

### 2. Alert Triggering
- Prevents duplicate alerts within the same hour
- Sends both email and push notifications (if enabled)
- Records alert in history

### 3. Data Storage
- Alerts stored in browser localStorage
- Persists across sessions
- Export/import functionality for backup

## Monitoring Dashboard

Access comprehensive statistics:
- **Overview**: Total alerts, triggers, notifications sent
- **History**: View all triggered alerts with timestamps
- **Monitoring**: System status, check intervals, performance
- **Data**: Export/import alerts and settings

## Troubleshooting

### Emails Not Sending

1. Check if `RESEND_API_KEY` is set in `.env.local`
2. Verify email address is valid
3. Check Resend dashboard for delivery status
4. Look for errors in browser console and server logs

### Push Notifications Not Working

1. Ensure browser supports push notifications
2. Check notification permissions in browser settings
3. Verify service worker is registered (check DevTools > Application > Service Workers)
4. Try unsubscribing and re-subscribing

### Alerts Not Triggering

1. Verify alert is active (bell icon should be filled)
2. Check current rate vs threshold
3. Force a check using "Check Now" button
4. Ensure monitoring is active (green dot in header)

### Rates Not Updating

1. Check if `CURRENCYLAYER_API_KEY` is configured
2. Verify API key is valid and has remaining quota
3. Check browser console for API errors
4. Try refreshing the page

## Demo Mode

Without API keys configured, the system runs in demo mode:
- ✅ All UI features work
- ✅ Alerts can be created and managed
- ✅ Monitoring system functions
- ⚠️ Emails are logged to console (not sent)
- ⚠️ Push notifications use demo data
- ⚠️ Rates use fallback/mock data

## Production Checklist

Before deploying to production:

- [ ] Configure `RESEND_API_KEY` for email notifications
- [ ] Configure `CURRENCYLAYER_API_KEY` for real-time rates
- [ ] Set `EMAIL_FROM` to your verified domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production URL
- [ ] Generate and configure VAPID keys for push notifications
- [ ] Test email delivery
- [ ] Test push notifications on multiple browsers
- [ ] Verify rate monitoring is working
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

## API Endpoints

### POST /api/send-alert
Sends email notification for triggered alert.

**Request:**
```json
{
  "email": "user@example.com",
  "currency": "USD",
  "condition": "above",
  "threshold": 1600,
  "currentRate": 1650,
  "rateType": "blackMarket"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert email sent successfully",
  "emailId": "abc123"
}
```

### POST /api/send-push
Sends push notification for triggered alert.

**Request:**
```json
{
  "subscription": { /* PushSubscription object */ },
  "currency": "USD",
  "condition": "above",
  "threshold": 1600,
  "currentRate": 1650,
  "rateType": "blackMarket"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Push notification sent successfully"
}
```

### GET /api/currency
Fetches current exchange rates.

**Response:**
```json
{
  "success": true,
  "timestamp": 1699564800,
  "source": "currencylayer",
  "quotes": {
    "USDNGN": 1650.5,
    "GBPNGN": 2050.25,
    "EURNGN": 1750.75,
    "CNYNGN": 228.3
  },
  "changes": {
    "USDNGN": 2.5,
    "GBPNGN": -1.2
  }
}
```

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify environment variables are set correctly
4. Test in incognito/private mode to rule out extension conflicts

## License

This feature is part of NairaMet - Nigeria's #1 FX Platform.
