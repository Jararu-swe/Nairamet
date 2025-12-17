# Google AdSense Setup Guide

## ✅ What's Been Implemented

Your site now has Google AdSense ads strategically placed on every page in non-intrusive positions.

---

## 📍 Ad Placements (2 Ads Per Page)

### **Position Strategy:**
1. **Top Ad**: After page header/title - Users have seen the main content
2. **Bottom Ad**: Before footer - Natural stopping point

### **Pages with Ads:**
- ✅ Home Page (`/`)
- ✅ Tracker Page (`/tracker`)
- ✅ Blog Pages (`/blog`, `/blog/[id]`)
- ✅ Charts Page (`/charts`)
- ✅ Alerts Page (`/alerts`)
- ✅ Tools Page (`/tools`)
- ✅ All other pages (via layout)

---

## 🔧 Setup Instructions

### 1. Get Your AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign up or log in
3. Add your site: `nairamet.com`
4. Wait for approval (usually 1-2 weeks)

### 2. Get Your Ad Slots
Once approved:
1. Go to **Ads** → **By ad unit**
2. Create **4 ad units**:
   - **Top Banner** - Display ad (Horizontal)
   - **In-Content** - Display ad (Responsive)
   - **Sidebar** - Display ad (Vertical) 
   - **Bottom Banner** - Display ad (Horizontal)
3. Copy the **data-ad-slot** IDs for each

### 3. Update Ad Slot IDs
Edit `components/adsense-ad.tsx` and replace the placeholder slot IDs:

```typescript
export function TopBannerAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_TOP_BANNER_SLOT_ID" // Replace this
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  )
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_IN_CONTENT_SLOT_ID" // Replace this
      adFormat="fluid"
      className="my-6"
    />
  )
}

export function BottomBannerAd() {
  return (
    <AdSenseAd
      adSlot="YOUR_BOTTOM_BANNER_SLOT_ID" // Replace this
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  )
}
```

### 4. Verify Environment Variable
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-YOUR_PUBLISHER_ID
```

---

## 📊 Ad Positions Explained

### **Home Page:**
1. **After Hero Section** - Users have seen the main value proposition
2. **Before Footer** - Natural end of page

### **Tracker Page:**
1. **After Header** - Before the main rates table
2. **Before Footer** - After all content

### **Blog Pages:**
1. **After Title** - Before article content
2. **After Article** - Before comments/related posts

### **Other Pages:**
1. **After Page Header** - Below title/description
2. **Before Footer** - End of content

---

## 🎯 Why These Positions?

### **Non-Intrusive:**
- ✅ Doesn't block main content
- ✅ Doesn't interrupt user flow
- ✅ Natural reading breaks
- ✅ Mobile-friendly spacing

### **High Viewability:**
- ✅ Above the fold (top ad)
- ✅ Natural scroll points
- ✅ End of content (bottom ad)
- ✅ Good engagement zones

### **User Experience:**
- ✅ Clear separation from content
- ✅ Responsive design
- ✅ Doesn't slow page load
- ✅ Respects user consent (Cookiebot)

---

## 💰 Expected Revenue

### **Conservative Estimates:**
Based on 1,000 daily visitors:

| Metric | Value |
|--------|-------|
| **Page Views/Day** | 3,000 (3 pages/visitor) |
| **Ad Impressions/Day** | 6,000 (2 ads/page) |
| **CTR** | 0.5% - 2% |
| **CPC** | $0.10 - $0.50 |
| **Daily Revenue** | $3 - $60 |
| **Monthly Revenue** | $90 - $1,800 |

### **Factors Affecting Revenue:**
- Traffic volume
- User location (Nigeria vs international)
- Content niche (finance = higher CPC)
- Ad placement quality
- User engagement

---

## 🚀 Optimization Tips

### **1. Test Ad Formats**
- Try different ad sizes
- Test responsive vs fixed
- A/B test positions

### **2. Monitor Performance**
- Check AdSense dashboard daily
- Track CTR and CPC
- Identify best-performing pages

### **3. Increase Traffic**
- SEO optimization (already done!)
- Social media promotion
- Content marketing
- Email newsletters

### **4. Improve User Experience**
- Fast page loads (already optimized!)
- Mobile-friendly (already done!)
- Quality content
- Easy navigation

---

## 📱 Mobile Optimization

All ads are **fully responsive**:
- Automatically adjust to screen size
- No horizontal scrolling
- Proper spacing on mobile
- Touch-friendly

---

## 🔒 Privacy Compliance

### **Cookiebot Integration:**
- ✅ Ads respect user consent
- ✅ No personalized ads without consent
- ✅ GDPR compliant
- ✅ Automatic blocking before consent

### **How It Works:**
1. User visits site
2. Cookiebot shows consent banner
3. If user accepts: Personalized ads
4. If user declines: Non-personalized ads
5. Revenue maintained either way!

---

## 📈 Tracking & Analytics

### **Google AdSense Dashboard:**
- Daily earnings
- Page RPM (Revenue Per Mille)
- CTR (Click-Through Rate)
- Top-performing pages

### **Google Analytics:**
- Page views per ad unit
- User behavior around ads
- Bounce rate impact
- Conversion tracking

---

## 🛠️ Troubleshooting

### **Ads Not Showing?**
1. Check `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set
2. Verify ad slot IDs are correct
3. Wait 24-48 hours after setup
4. Check AdSense account status
5. Clear browser cache

### **Low Revenue?**
1. Increase traffic (SEO, marketing)
2. Improve content quality
3. Test different ad positions
4. Check for policy violations
5. Optimize for higher CPC keywords

### **Policy Violations?**
1. Check AdSense policy center
2. Remove any prohibited content
3. Ensure ads don't cover content
4. Verify proper spacing
5. Request review after fixes

---

## ✅ Checklist

- [ ] AdSense account approved
- [ ] Site added to AdSense
- [ ] Ad units created (4 units)
- [ ] Ad slot IDs copied
- [ ] `components/adsense-ad.tsx` updated with real slot IDs
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` set in `.env.local`
- [ ] Deployed to production
- [ ] Ads visible on site
- [ ] Cookiebot consent working
- [ ] AdSense dashboard showing impressions

---

## 📞 Support

### **AdSense Issues:**
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Community](https://support.google.com/adsense/community)

### **Implementation Issues:**
- Check browser console for errors
- Verify all imports are correct
- Test in incognito mode
- Check network tab for ad requests

---

**Status**: ✅ Ads Implemented - Ready for AdSense Approval  
**Next Step**: Get AdSense approval and add real ad slot IDs  
**Expected Setup Time**: 5 minutes (after approval)  
**Expected Revenue**: $90-$1,800/month (with 1,000 daily visitors)
