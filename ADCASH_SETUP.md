# Adcash Setup & Verification Guide

## ✅ What's Been Done

Your Adcash ad with zone ID `YOUR_ZONE_ID` has been integrated into your homepage!

**Location:** Below the hero section, after the "Live Rate Preview"

## 🧪 How to Verify It's Working

### 1. Start Your Dev Server

```bash
npm run dev
```

### 2. Open Homepage

Navigate to: `http://localhost:3000`

### 3. Check Browser Console (F12)

Open DevTools and look for:

```
[Adcash] Script loaded for zone: YOUR_ZONE_ID
[Adcash] Ad initialized: Advertisement
```

### 4. Check Network Tab

1. Open DevTools → **Network** tab
2. Filter by "adcash" or "acscdn"
3. You should see requests to:
   - `acscdn.com/script/YOUR_ZONE_ID.js`
   - Other Adcash tracking URLs

### 5. Visual Check

1. Scroll down past the hero section
2. Look for "Advertisement" label
3. You should see a gray box with ad content

### 6. Inspect HTML

Right-click on the ad area → "Inspect Element"

Look for:

```html
<div class="adcash-ad-container">
  <div class="text-xs text-gray-400">Advertisement</div>
  <div class="flex justify-center">
    <script src="//acscdn.com/script/YOUR_ZONE_ID.js"></script>
    <!-- Adcash ad content -->
  </div>
</div>
```

## 🔍 Troubleshooting

### Ad Not Showing?

**1. Ad Blockers**

- Disable uBlock Origin, AdBlock Plus, etc.
- Try in Incognito/Private mode
- Whitelist localhost in ad blocker

**2. Account Status**

- Check Adcash dashboard
- New accounts may need 24-48 hours for approval
- Verify zone ID is active

**3. Console Errors**
Look for:

```
[Adcash] Failed to load ad: Advertisement
```

If you see this, check:

- Internet connection
- Firewall settings
- Adcash service status

**4. Clear Cache**

```bash
# Stop dev server (Ctrl+C)
# Clear browser cache (Ctrl+Shift+Delete)
# Restart dev server
npm run dev
```

### Script Not Loading?

**Check Content Security Policy:**

If you have strict CSP, add Adcash domains:

```tsx
// In app/layout.tsx
<meta
  httpEquiv="Content-Security-Policy"
  content="script-src 'self' 'unsafe-inline' 'unsafe-eval' acscdn.com *.adcash.com;"
/>
```

### Still Not Working?

1. **Verify zone ID:** `YOUR_ZONE_ID` (check Adcash dashboard)
2. **Check account status:** Must be approved
3. **Wait 24 hours:** New zones need activation
4. **Contact Adcash support:** support@adcash.com

## 📊 Tracking Performance

### In Adcash Dashboard:

1. Login to https://www.adcash.com/
2. Go to **Statistics** → **Zones**
3. Find zone: `YOUR_ZONE_ID`
4. Check metrics:
   - **Impressions** - Ad views
   - **Clicks** - User clicks
   - **CTR** - Click-through rate
   - **eCPM** - Effective cost per thousand
   - **Revenue** - Your earnings

### Expected Timeline:

- **First 24 hours:** Test ads or pending approval
- **After approval:** Real ads start showing
- **First week:** Low revenue (learning phase)
- **After 2 weeks:** Revenue stabilizes

## 💰 Revenue Expectations

### Typical Adcash CPM:

- **Nigeria traffic:** $0.80 - $3.00 CPM
- **US/UK traffic:** $2.00 - $6.00 CPM
- **Mixed traffic:** $1.50 - $4.00 CPM

### Example Calculation:

```
10,000 monthly visitors
× 2 page views per visit = 20,000 impressions
× $2.00 CPM = $40/month
```

## 🎯 Adding More Ad Units

Once this ad is working, you can add more:

### Blog Posts:

```tsx
import { AdcashBlogAd } from "@/components/adcash-ad";

// In your blog post component
<AdcashBlogAd zoneId="YOUR_NEW_ZONE_ID" />;
```

### Sidebar:

```tsx
import { AdcashSidebar } from "@/components/adcash-ad";

<AdcashSidebar zoneId="YOUR_SIDEBAR_ZONE_ID" />;
```

### In-Content:

```tsx
import { AdcashInContent } from "@/components/adcash-ad";

<AdcashInContent zoneId="YOUR_CONTENT_ZONE_ID" />;
```

## 📱 Mobile Optimization

The component is already mobile-responsive:

- Adapts to screen size
- Centered on all devices
- Touch-friendly

## 🚀 Optimization Tips

### 1. Ad Placement

- **Current:** Below hero (good visibility)
- **Alternative:** Above fold for higher CTR
- **Test:** Different positions to find best performer

### 2. Multiple Zones

Create different zones for:

- Homepage top
- Homepage sidebar
- Blog posts
- Tools page
- Tracker page

### 3. A/B Testing

Test different:

- Positions (top vs middle vs bottom)
- Sizes (banner vs rectangle vs skyscraper)
- Pages (homepage vs blog vs tools)

### 4. Monitor & Optimize

- Check dashboard weekly
- Remove low-performing zones
- Focus on high-CTR placements
- Test new positions

## 🔒 Widget Protection

Your widgets are already protected from ads! The widget layout blocks Adcash from loading in iframes.

See: `WIDGET_AD_PROTECTION.md` for details

## 📈 Performance Monitoring

### Week 1:

- ✅ Verify ad loads
- ✅ Check impressions > 0
- ✅ Monitor console for errors

### Week 2:

- 📊 Check CTR (aim for > 0.5%)
- 💰 Verify revenue is tracking
- 🎯 Identify best-performing times

### Week 3+:

- 🚀 Add more ad units
- 📊 Compare performance across zones
- 💡 Optimize based on data

## 🆚 Adcash vs Other Networks

### Adcash Advantages:

- ✅ Higher CPM than Monetag
- ✅ Better for international traffic
- ✅ Good fill rate
- ✅ Fast payments ($25 minimum)

### Comparison:

| Network | CPM (Nigeria) | Min Payout | Payment |
| ------- | ------------- | ---------- | ------- |
| Adcash  | $0.80-$3.00   | $25        | Net-30  |
| Monetag | $0.50-$2.00   | $5         | Net-30  |
| AdSense | $1.00-$4.00   | $100       | Monthly |

## 📞 Support

### Adcash Support:

- **Email:** support@adcash.com
- **Dashboard:** https://www.adcash.com/
- **Help Center:** https://help.adcash.com/

### Common Questions:

**Q: How long until I see real ads?**
A: 24-48 hours after account/zone approval

**Q: Why blank space?**
A: Account pending approval, ad blocker, or zone not active

**Q: Can I use with other ad networks?**
A: Yes! Adcash works with Google AdSense, Monetag, BidVertiser

**Q: What's the minimum payout?**
A: $25 via PayPal, Wire, or other methods

**Q: How often are payments?**
A: Net-30 (paid monthly, 30 days after month end)

## ✅ Checklist

- [x] Adcash component created
- [x] Ad added to homepage
- [ ] Zone ID configured: `YOUR_ZONE_ID`
- [ ] Verify ad loads in browser
- [ ] Check console for success message
- [ ] Check network tab for script
- [ ] Wait for account approval (24-48h)
- [ ] Monitor dashboard for impressions
- [ ] Check revenue after 1 week

## 🎉 Next Steps

1. **Verify:** Open homepage and check console
2. **Wait:** 24-48 hours for approval
3. **Monitor:** Check Adcash dashboard daily
4. **Optimize:** Add more zones once working
5. **Scale:** Test different placements

---

**Created:** January 2025
**Zone ID:** YOUR_ZONE_ID
**Location:** Homepage (below hero)
**Status:** Ready for verification
