# Smart Alerts - Quick Reference Card

## 🎯 At a Glance

**Status**: ✅ Fully Functional
**Location**: `/alerts` page
**Demo Mode**: Works without API keys

## 🚀 Quick Start (3 Steps)

1. **Go to** `/alerts`
2. **Fill form**: Currency → Rate Type → Condition → Threshold → Email
3. **Click** "Create Alert"

Done! You'll get notified when rates hit your target.

## 🔑 API Keys (Optional)

```env
# .env.local
RESEND_API_KEY=re_xxx              # For real emails
CURRENCYLAYER_API_KEY=xxx          # For live rates
EMAIL_FROM=alerts@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get Keys:**
- Resend: https://resend.com (100 emails/day free)
- CurrencyLayer: https://currencylayer.com (100 requests/month free)

## 📋 Features Checklist

- ✅ Create/edit/delete alerts
- ✅ Email notifications
- ✅ Push notifications
- ✅ Real-time monitoring (5 min intervals)
- ✅ Alert history
- ✅ Statistics dashboard
- ✅ Data export/import
- ✅ Toast notifications
- ✅ Dark mode
- ✅ Responsive design

## 🎨 User Interface

### Main Components
1. **Demo Mode Banner** (if no API keys)
2. **Header** with monitoring status
3. **Push Notifications Card**
4. **Create Alert Form**
5. **Active Alerts List**
6. **Monitoring Dashboard** (4 tabs)

### Alert Form Fields
- **Currency**: USD, GBP, EUR, CNY
- **Rate Type**: Black Market, CBN Official, Remittance
- **Condition**: Above, Below
- **Threshold**: Number (in Naira)
- **Email**: Valid email address
- **Push**: Checkbox (if enabled)

## 🔔 Notification Types

### Email
- Sent when alert triggers
- Beautiful HTML template
- Shows rate details
- Link to view live rates

### Push
- Instant browser notification
- Works when browser is open
- Click to open app
- Requires permission

### Toast
- Success (green)
- Error (red)
- Info (blue)
- Warning (amber)

## 📊 Monitoring Dashboard

### Overview Tab
- Total alerts
- Active alerts
- Triggered today/week
- Email/push sent
- Most active currency

### History Tab
- All triggered alerts
- Timestamps
- Rates
- Notification status
- Clear history button

### Monitoring Tab
- System status
- Checks performed
- Last/next check time
- Check interval
- Force check button

### Data Tab
- Export alerts (JSON)
- Import alerts
- Backup/restore

## 🧪 Testing

### Quick Test
1. Create alert with threshold below current rate (condition: above)
2. Should show "TRIGGERED" badge
3. Check console for email log
4. Check history tab

### Push Test
1. Enable push notifications
2. Click "Test" button
3. Should see browser notification
4. Click notification → opens app

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Emails not sending | Add `RESEND_API_KEY` to `.env.local` |
| Rates not updating | Add `CURRENCYLAYER_API_KEY` |
| Push not working | Check browser permissions |
| Alert not triggering | Verify threshold vs current rate |
| Data not persisting | Check localStorage is enabled |

## 📱 Browser Support

| Browser | Alerts | Email | Push |
|---------|--------|-------|------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ⚠️* |
| Edge | ✅ | ✅ | ✅ |

*Safari: Requires macOS 16.4+ or iOS 16.4+

## 🎯 Use Cases

**Traders**: Set buy/sell signals
**Business**: Monitor payment rates
**Travelers**: Track exchange rates
**Analysts**: Study rate trends

## 📚 Documentation

- `README_ALERTS.md` - Main documentation
- `ALERTS_SETUP.md` - Setup guide
- `docs/ALERTS_QUICK_START.md` - Quick start
- `docs/ALERTS_TESTING.md` - Testing guide
- `docs/ALERTS_FEATURE_SUMMARY.md` - Technical docs

## 💡 Pro Tips

1. **Multiple Alerts**: Create both "above" and "below" alerts
2. **Push + Email**: Enable both for redundancy
3. **Export Data**: Backup alerts regularly
4. **Check History**: Review past triggers for patterns
5. **Demo Mode**: Test without API keys first

## 🚀 Deployment

### Vercel
```bash
vercel
# Add env vars in dashboard
```

### Environment Variables
```
RESEND_API_KEY=re_xxx
CURRENCYLAYER_API_KEY=xxx
EMAIL_FROM=alerts@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📞 Quick Help

**Problem**: Feature not working
**Solution**: 
1. Check browser console
2. Verify environment variables
3. Test in incognito mode
4. Review documentation

## ✅ Success Criteria

Feature is working when:
- ✅ Can create alerts
- ✅ Alerts appear in list
- ✅ Can toggle/delete alerts
- ✅ Push notifications work
- ✅ Dashboard shows data
- ✅ Export/import works

## 🎉 You're Ready!

The Smart Alerts feature is fully functional. Start creating alerts and get notified when rates hit your targets!

---

**Quick Links**:
- App: `/alerts`
- Docs: `README_ALERTS.md`
- Setup: `ALERTS_SETUP.md`
- Test: `docs/ALERTS_TESTING.md`
