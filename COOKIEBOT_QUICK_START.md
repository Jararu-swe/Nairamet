# Cookiebot Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Sign Up
1. Go to [cookiebot.com](https://www.cookiebot.com)
2. Click "Try for free"
3. Create account with your email

### Step 2: Add Domain
1. Click "Add domain"
2. Enter: `www.nairamet.com`
3. Click "Create domain"

### Step 3: Get Your ID
1. Go to "Settings" → "Your scripts"
2. Copy the Domain Group ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 4: Add to Environment
Add to `.env.local`:
```env
NEXT_PUBLIC_COOKIEBOT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 5: Deploy
```bash
git add .
git commit -m "Add Cookiebot CMP"
git push
```

## ✅ That's It!

Your site now has:
- ✅ GDPR-compliant consent banner
- ✅ Automatic cookie blocking
- ✅ Cookie declaration page at `/cookies`
- ✅ Google AdSense integration

## 🎨 Customize (Optional)

### Change Banner Style
1. Go to Cookiebot dashboard
2. Click "Dialog"
3. Choose style: Overlay, Banner, or Popup
4. Customize colors and text
5. Save changes (updates automatically)

### Set Geographic Targeting
1. Go to "Settings" → "Geolocation"
2. Enable "Automatic geolocation"
3. Select: EU/EEA, UK, Switzerland

### Configure Buttons
Choose button layout:
- **3 buttons**: Accept, Decline, Customize (Recommended)
- **2 buttons**: Accept, Customize
- **1 button**: Accept only

## 🧪 Test Your Setup

### Test Consent Banner
1. Clear browser cookies
2. Visit your site
3. You should see the consent banner
4. Test all buttons: Accept, Decline, Customize

### Test Cookie Blocking
1. Open browser DevTools (F12)
2. Go to "Application" → "Cookies"
3. Before consent: Only necessary cookies
4. After consent: All cookies appear

### Test from EEA
1. Use VPN to connect from EU country
2. Visit your site
3. Banner should appear automatically

## 📊 Monitor Compliance

### View Statistics
1. Go to Cookiebot dashboard
2. Click "Statistics"
3. See consent rates by country

### Check Cookie Scan
1. Go to "Cookies"
2. Review all detected cookies
3. Verify correct categorization

### Download Reports
1. Go to "Consent log"
2. Export compliance reports
3. Keep for audit purposes

## 🔧 Add Cookie Settings Button

Already implemented! Use anywhere in your app:

```tsx
import { CookieSettingsButton } from "@/components/cookie-settings-button"

// In your component
<CookieSettingsButton />
```

Common places to add:
- Footer
- Privacy policy page
- Settings page
- Navigation menu

## 📄 Pages Created

1. **Cookie Policy**: `/cookies`
   - Full cookie declaration
   - Cookie settings button
   - Explanation of cookie usage

2. **Cookie Settings Button**: `components/cookie-settings-button.tsx`
   - Reusable component
   - Opens Cookiebot dialog
   - Customizable styling

## 🆘 Troubleshooting

### Banner not showing?
- Check `NEXT_PUBLIC_COOKIEBOT_ID` is set
- Clear browser cache
- Wait 5-10 minutes after adding domain

### Cookies not blocked?
- Enable "Automatic cookie blocking" in settings
- Check blocking mode is "auto"
- Verify cookies are categorized correctly

### Need help?
- [Cookiebot Support](https://support.cookiebot.com)
- [Documentation](https://www.cookiebot.com/en/developer/)

## 💰 Pricing

- **Free**: Up to 100 subpages (perfect for most sites)
- **Business**: $9-29/month for larger sites
- **Enterprise**: Custom pricing

Your site likely qualifies for the free tier!

## 🎯 Next Steps

1. ✅ Sign up for Cookiebot
2. ✅ Add your domain
3. ✅ Get your ID
4. ✅ Add to `.env.local`
5. ✅ Deploy
6. ⏳ Wait 5-10 minutes for scan
7. ✅ Test the banner
8. ✅ Customize appearance (optional)
9. ✅ Update privacy policy
10. ✅ Monitor compliance

---

**Questions?** Check the full guide in `CONSENT_MANAGEMENT_SETUP.md`
