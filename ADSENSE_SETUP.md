# AdSense Setup Guide for NairaMet

## Quick Start

Your app is **ready for AdSense** and follows all Google policies. Just follow these steps:

---

## Step 1: Apply for Google AdSense

1. Go to [https://www.google.com/adsense](https://www.google.com/adsense)
2. Click "Get Started"
3. Sign in with your Google account
4. Enter your website URL: `https://nairamet.com` (or your domain)
5. Select your country: Nigeria
6. Accept terms and conditions
7. Submit application

**Approval Time**: Typically 1-2 weeks

---

## Step 2: Add AdSense Code to Your Site

Once approved, Google will give you:
- **Publisher ID**: `ca-pub-XXXXXXXXXXXXXXXX`
- **Ad Unit IDs**: One for each ad placement

### Update Environment Variables

```bash
# In .env.local
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

---

## Step 3: Create Ad Units in AdSense Dashboard

Create these 6 ad units in your AdSense dashboard:

### 1. Top Banner Ad
- **Name**: NairaMet - Top Banner
- **Type**: Display ads
- **Size**: Responsive
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `TopBannerAd`

### 2. Sidebar Ad
- **Name**: NairaMet - Sidebar
- **Type**: Display ads
- **Size**: Vertical (300x600 or responsive)
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `SidebarAd`

### 3. In-Content Ad
- **Name**: NairaMet - In Content
- **Type**: In-article ads
- **Size**: Responsive
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `InContentAd`

### 4. Bottom Banner Ad
- **Name**: NairaMet - Bottom Banner
- **Type**: Display ads
- **Size**: Horizontal (728x90 or responsive)
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `BottomBannerAd`

### 5. In-Feed Ad
- **Name**: NairaMet - In Feed
- **Type**: In-feed ads
- **Size**: Responsive
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `InFeedAd`

### 6. Sidebar Card Ad
- **Name**: NairaMet - Sidebar Card
- **Type**: Display ads
- **Size**: Vertical (300x250 or 300x600)
- **Copy the Ad Unit ID** → Replace in `components/adsense-ad.tsx` line for `SidebarAdCard`

---

## Step 4: Update Ad Slot IDs

Open `components/adsense-ad.tsx` and replace the placeholder IDs:

```typescript
// Find and replace these lines:

export function TopBannerAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_TOP_BANNER_AD_SLOT_ID" // ← Replace this
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  );
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_SIDEBAR_AD_SLOT_ID" // ← Replace this
      adFormat="vertical"
      fullWidthResponsive={false}
      className="sticky top-4"
    />
  );
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_IN_CONTENT_AD_SLOT_ID" // ← Replace this
      adFormat="fluid"
      className="my-6"
    />
  );
}

export function BottomBannerAd() {
  // ... inside the component
  <AdSenseAd
    adSlot="YOUR_BOTTOM_BANNER_AD_SLOT_ID" // ← Replace this
    adFormat="horizontal"
    className="w-full"
  />
}

export function InFeedAd() {
  return (
    <div className="my-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground">Sponsored</span>
      </div>
      <AdSenseAd
        adSlot="YOUR_IN_FEED_AD_SLOT_ID" // ← Replace this
        adFormat="fluid"
        className="min-h-[100px]"
      />
    </div>
  );
}

export function SidebarAdCard() {
  return (
    <div className="sticky top-20 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground">Sponsored</span>
      </div>
      <AdSenseAd
        adSlot="YOUR_SIDEBAR_CARD_AD_SLOT_ID" // ← Replace this
        adFormat="vertical"
        fullWidthResponsive={false}
        className="min-h-[250px]"
      />
    </div>
  );
}
```

---

## Step 5: Deploy and Test

1. **Build the app**:
   ```bash
   pnpm run build
   ```

2. **Deploy to production** (Vercel):
   ```bash
   git add -A
   git commit -m "Add AdSense integration"
   git push
   ```

3. **Test on production**:
   - Visit your live site
   - Check that ads appear (may take 10-20 minutes after deployment)
   - Test on mobile and desktop
   - Verify cookie consent works

---

## Step 6: Monitor Performance

### In AdSense Dashboard:
- Check ad impressions
- Monitor click-through rate (CTR)
- Review earnings
- Check for policy violations

### In Your Analytics:
- Monitor page load times
- Check bounce rates
- Track user engagement
- Review Core Web Vitals

---

## Troubleshooting

### Ads Not Showing?

1. **Check environment variable**:
   ```bash
   echo $NEXT_PUBLIC_ADSENSE_CLIENT_ID
   ```

2. **Check browser console** for errors

3. **Verify ad slot IDs** are correct

4. **Wait 10-20 minutes** after deployment

5. **Check AdSense dashboard** for approval status

### Blank Ad Spaces?

- **Low content pages**: Ads won't show on pages with < 150 words
- **Blacklisted pages**: Ads disabled on auth, admin pages
- **Ad blockers**: Users with ad blockers won't see ads
- **Cookie consent**: Users who reject ads won't see personalized ads

### Policy Violations?

- Review `docs/ADSENSE_COMPLIANCE.md`
- Check AdSense dashboard for specific issues
- Ensure content meets quality guidelines
- Verify ad placement follows policies

---

## Best Practices

### Do's ✅
- Monitor performance regularly
- Keep content fresh and valuable
- Respect user privacy
- Test on multiple devices
- Follow AdSense policies

### Don'ts ❌
- Never click your own ads
- Don't ask users to click ads
- Don't modify ad code
- Don't place ads on empty pages
- Don't use misleading labels

---

## Revenue Optimization Tips

1. **Focus on Quality Content**: Better content = more traffic = more revenue
2. **Optimize Ad Placement**: Test different positions (A/B testing)
3. **Improve User Experience**: Lower bounce rate = more ad views
4. **Mobile Optimization**: 50%+ of traffic is mobile
5. **Page Speed**: Faster pages = better user experience = more engagement

---

## Support & Resources

### Google AdSense Help
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense Community](https://support.google.com/adsense/community)

### Your Documentation
- `docs/ADSENSE_COMPLIANCE.md` - Full compliance checklist
- `docs/AD_PLACEMENT_GUIDE.md` - Ad placement strategy
- `components/adsense-ad.tsx` - Ad component implementation

---

## Summary

Your NairaMet app is **100% ready** for AdSense:

✅ All pages have strategic ad placement
✅ Follows all Google AdSense policies
✅ Cookie consent integrated (GDPR compliant)
✅ User-friendly ad behavior (dismissible, delayed)
✅ Mobile optimized
✅ Minimum content checks in place
✅ Professional design and structure

**Just add your AdSense IDs and deploy!**

---

**Questions?** Check the documentation or contact Google AdSense support.

**Good luck with your monetization!** 🚀
