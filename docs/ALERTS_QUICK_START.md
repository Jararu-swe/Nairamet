# Smart Alerts - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Create Your First Alert

1. Go to the **Alerts** page (`/alerts`)
2. Fill in the form:
   ```
   Currency: USD
   Rate Type: Black Market
   Condition: Above
   Threshold: 1700
   Email: your@email.com
   ```
3. Click **Create Alert**

That's it! You'll now get notified when USD/NGN black market rate goes above ₦1,700.

### Step 2: Enable Push Notifications (Optional)

1. Click **Enable** in the "Push Notifications" card
2. Allow notifications when your browser asks
3. Click **Test** to verify it works

### Step 3: Monitor Your Alerts

Your alerts are now active! The system checks rates every 5 minutes and will:
- ✅ Send you an email when the rate hits your threshold
- ✅ Send a push notification (if enabled)
- ✅ Record the alert in your history

## 📊 Example Use Cases

### For Forex Traders
```
Alert 1: USD above ₦1,700 (Black Market) - Sell signal
Alert 2: USD below ₦1,600 (Black Market) - Buy signal
```

### For Business Owners
```
Alert: GBP above ₦2,100 (Remittance) - Time to pay suppliers
```

### For Travelers
```
Alert: EUR below ₦1,700 (CBN) - Good time to exchange
```

## 🎯 Pro Tips

1. **Set Multiple Alerts**: Create alerts for different currencies and thresholds
2. **Use Both Conditions**: Set "above" and "below" alerts to catch both rises and falls
3. **Enable Push**: Get instant notifications on your phone/desktop
4. **Check History**: Review past triggers to analyze trends
5. **Export Data**: Backup your alerts regularly

## 🔧 Current Status

The alerts system is **fully functional** with:
- ✅ Real-time rate monitoring (every 5 minutes)
- ✅ Email notifications (demo mode - logged to console)
- ✅ Push notifications (browser-based)
- ✅ Alert history tracking
- ✅ Data export/import

### To Enable Real Emails:

1. Get a free API key from [Resend](https://resend.com)
2. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=alerts@yourdomain.com
   ```
3. Restart the app

See [ALERTS_SETUP.md](../ALERTS_SETUP.md) for detailed setup instructions.

## 📱 Browser Support

### Push Notifications:
- ✅ Chrome (Desktop & Android)
- ✅ Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (macOS 16.4+)
- ⚠️ iOS Safari (limited support)

### Email Notifications:
- ✅ Works on all browsers
- ✅ Works on all devices

## ❓ FAQ

**Q: How often are rates checked?**
A: Every 5 minutes when you have active alerts.

**Q: Can I have multiple alerts?**
A: Yes! Create as many as you need.

**Q: Will I get duplicate notifications?**
A: No. The system prevents duplicate alerts within the same hour.

**Q: Do alerts work when I close the browser?**
A: Email alerts work 24/7. Push notifications require the browser to be open.

**Q: Can I pause an alert without deleting it?**
A: Yes! Click the bell icon to toggle alerts on/off.

**Q: How do I backup my alerts?**
A: Go to Monitoring Dashboard > Data tab > Export Data.

## 🆘 Need Help?

- Check the [Full Setup Guide](../ALERTS_SETUP.md)
- Review browser console for errors
- Verify your email address is correct
- Test with a simple alert first (e.g., USD above current rate)

## 🎉 You're All Set!

Your smart alerts are now monitoring exchange rates. Sit back and let the system notify you when rates hit your targets!
