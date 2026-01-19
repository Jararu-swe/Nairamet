# Monetag Setup Guide for NairaMet

## Quick Start

Your app has been migrated from Google AdSense to **Monetag** - a high-performing ad network with better CPM rates and easier approval process.

---

## Step 1: Sign Up for Monetag

1. Go to [https://monetag.com](https://monetag.com)
2. Click "Sign Up" or "Publisher Sign Up"
3. Fill in your website details:
   - Website URL: `https://nairamet.com`
   - Category: Finance/Currency
   - Traffic: Your monthly visitors
4. Complete the registration

---

## Step 2: Add Your Website

Once logged in:

1. Go to **"Websites"** in your dashboard
2. Click **"Add Website"**
3. Enter your domain: `nairamet.com`
4. Wait for approval (usually instant or within 24 hours)

---

## Step 3: Create Ad Zones

Create these 6 ad zones in your Monetag dashboard:

### 1. Top Banner Ad
- **Type**: Banner
- **Size**: 728x90 or Responsive
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_TOP_BANNER`

### 2. Sidebar Ad
- **Type**: Native Banner or Direct Link
- **Size**: 300x250 or 300x600
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_SIDEBAR`

### 3. In-Content Ad
- **Type**: Native Banner
- **Size**: Responsive
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_IN_CONTENT`

### 4. Bottom Banner Ad
- **Type**: Banner
- **Size**: 728x90 or Responsive
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_BOTTOM_BANNER`

### 5. In-Feed Ad
- **Type**: Native Banner
- **Size**: Responsive
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_IN_FEED`

### 6. Sidebar Card Ad
- **Type**: Native Banner or Direct Link
- **Size**: 300x250
- **Copy the Zone ID** → Add to `.env.local` as `NEXT_PUBLIC_MONETAG_SIDEBAR_CARD`

---

## Step 4: Update Environment Variables

Open `.env.local` and replace the placeholder values:

```bash
# Monetag Ad Network
NEXT_PUBLIC_MONETAG_SITE_KEY=1234567  # Your site verification key
NEXT_PUBLIC_MONETAG_DOMAIN=alwingulla.com  # Or your assigned domain
NEXT_PUBLIC_MONETAG_TOP_BANNER=8901234  # Zone ID from dashboard
NEXT_PUBLIC_MONETAG_SIDEBAR=8901235
NEXT_PUBLIC_MONETAG_IN_CONTENT=8901236
NEXT_PUBLIC_MONETAG_BOTTOM_BANNER=8901237
NEXT_PUBLIC_MONETAG_IN_FEED=8901238
NEXT_PUBLIC_MONETAG_SIDEBAR_CARD=8901239
```

**Where to find these:**
- **Site Key**: Monetag Dashboard → Websites → Your Site → Site Key
- **Domain**: Usually `alwingulla.com` (check your dashboard)
- **Zone IDs**: Monetag Dashboard → Ad Zones → Each zone has an ID

---

## Step 5: Deploy

1. **Commit your changes:**
   ```bash
   git add -A
   git commit -m "Migrate from AdSense to Monetag"
   git push
   ```

2. **Deploy to Vercel:**
   - Go to your Vercel dashboard
   - Add the environment variables from `.env.local`
   - Redeploy your site

3. **Verify ads are showing:**
   - Visit your site after deployment
   - Check different pages (home, blog, tools)
   - Ads should appear within 5-10 minutes

---

## Step 6: Verify Installation

### In Monetag Dashboard:
- Check "Statistics" for impressions
- Monitor click-through rate (CTR)
- Track earnings

### On Your Site:
- Open browser console (F12)
- Look for Monetag scripts loading
- Check for any errors

---

## Troubleshooting

### No Ads Showing?

1. **Check environment variables:**
   ```bash
   echo $NEXT_PUBLIC_MONETAG_SITE_KEY
   ```
   Make sure they're set in Vercel

2. **Clear browser cache** and reload

3. **Check browser console** for errors

4. **Wait 10-20 minutes** after deployment

5. **Check Monetag dashboard** for approval status

### Blank Ad Spaces?

- Verify zone IDs are correct
- Check that your site is approved in Monetag
- Ensure you have sufficient content (300+ words per page)
- Try different ad formats

### Low Earnings?

- Monetag typically has higher CPM than AdSense
- Earnings depend on traffic quality and geography
- Try different ad formats (popunders often perform well)
- Enable multiple ad types for better fill rate

---

## Ad Formats Available

Monetag offers several ad formats:

1. **Banner Ads** - Traditional display ads (implemented)
2. **Native Banners** - Blend with your content (implemented)
3. **Popunders** - High CPM, opens in background
4. **Push Notifications** - Browser notifications
5. **Direct Links** - Monetize text links
6. **Interstitials** - Full-page ads between pages

Currently implemented: Banner and Native ads. You can add more formats from your Monetag dashboard.

---

## Best Practices

### Do's ✅
- Place ads strategically (already done)
- Monitor performance regularly
- Test different ad formats
- Keep content quality high
- Respect user privacy
- Test on multiple devices

### Don'ts ❌
- Don't click your own ads
- Don't encourage clicks
- Don't place too many ads
- Don't hide ad labels
- Don't use misleading content

---

## Monetag vs AdSense

### Advantages of Monetag:
- ✅ Easier approval process
- ✅ Higher CPM rates (typically)
- ✅ More ad formats available
- ✅ Faster payment processing
- ✅ Less strict content policies
- ✅ Better for international traffic

### Considerations:
- ⚠️ Some ad formats may be more intrusive
- ⚠️ User experience varies by format
- ⚠️ May need to test different formats for best results

---

## Payment Information

- **Minimum Payout**: $5 (much lower than AdSense's $100)
- **Payment Methods**: PayPal, Wire Transfer, WebMoney, Bitcoin
- **Payment Schedule**: Weekly or monthly (your choice)
- **Payment Processing**: 3-5 business days

---

## Support & Resources

### Monetag Help
- [Monetag Help Center](https://monetag.com/help)
- [Publisher FAQ](https://monetag.com/faq)
- Email: support@monetag.com

### Your Documentation
- `components/monetag-ad.tsx` - Ad component implementation
- `components/monetag-script.tsx` - Script loader
- `.env.local` - Configuration file

---

## Summary

Your NairaMet app is now using **Monetag** instead of Google AdSense:

✅ All ad components migrated to Monetag
✅ Cookie consent integration maintained
✅ Content quality checks still in place
✅ User-friendly ad behavior preserved
✅ Same ad placements, different provider

**Just add your Monetag zone IDs and deploy!**

---

## Next Steps

1. **Sign up for Monetag** (if you haven't already)
2. **Create ad zones** in your dashboard
3. **Update `.env.local`** with your zone IDs
4. **Deploy to production**
5. **Monitor performance** in Monetag dashboard

**Questions?** Contact Monetag support or check their documentation.

**Good luck with your monetization!** 🚀
