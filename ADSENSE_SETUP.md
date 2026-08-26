# Google AdSense Setup Guide for NairaMet

## Quick Start

Your app is **fully ready for Google AdSense** and follows all Google policies. Just follow these steps:

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

## Step 2: Add Your Publisher ID

Once approved, Google will give you a **Publisher ID** like `ca-pub-1234567890123456`.

### Update Environment Variables

Add the following to your `.env.local` file:

```bash
# Google AdSense Publisher ID (required)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

That's it! The AdSense script loads automatically in `app/layout.tsx` when this variable is set.

---

## Step 3: Create Ad Units & Set Slot IDs

Create ad units in your [AdSense Dashboard](https://www.google.com/adsense) and add their slot IDs to `.env.local`:

```bash
# Optional — Ad unit slot IDs for specific placements
NEXT_PUBLIC_ADSENSE_SLOT_ID=1234567890            # Default ad slot
NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT=1234567891   # 728x90 leaderboard (landing page, blog post, tools)
NEXT_PUBLIC_ADSENSE_INFEED_SLOT=1234567892        # In-feed ads (between content sections)
NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT=1234567893      # In-content ads (inside articles)
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=1234567894     # Top banner
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=1234567895  # Bottom banner
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567896        # Sidebar (blog listing)
NEXT_PUBLIC_ADSENSE_SKYSCRAPER_SLOT=1234567897     # 160x600 skyscraper
```

> **Note**: When no slot IDs are configured, ad components render `null` — zero placeholder boxes, zero layout shift.

---

## Step 4: Update ads.txt

Open `public/ads.txt` and replace `YOUR_PUBLISHER_ID` with your actual publisher ID (just the numeric part, e.g. `pub-1234567890123456`):

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

---

## What's Already Done For You

### ✅ AdSense Policy Compliance
- **Privacy Policy** (`/privacy`) — Dedicated Section 4 "Advertising & Google AdSense" with full disclosure, Google Ads Settings opt-out link, DART cookie explanation, and aboutads.info link
- **Terms of Service** (`/terms`) — Complete terms covering advertising
- **Cookie Policy** (`/cookies`) — Lists Google AdSense as a third-party cookie provider
- **Children's Privacy** — States site is not intended for children under 18

### ✅ Technical Infrastructure
- **`ads.txt`** — Ready with Google template (just add your publisher ID)
- **`robots.txt`** — Allows `Mediapartners-Google` and `AdsBot-Google` full site access
- **AdSense Script** — Loads conditionally in `<head>` only when publisher ID is configured
- **Cookiebot CMP** — Google-certified Consent Management Platform integration
- **Zero-Placeholder Architecture** — All ad components render `null` when unconfigured

### ✅ Ad Placement Locations
| Page | Component | Format |
|------|-----------|--------|
| Home (`/`) | `LazyLeaderboardAdWrapper` | 728x90 horizontal |
| Home (`/`) | `InFeedAd` | Fluid in-feed |
| Home (`/`) | `BottomBannerAd` | Horizontal bottom |
| Tracker (`/tracker`) | `InFeedAd` | Fluid in-feed |
| Blog listing (`/blog`) | `SidebarAd` | Vertical sidebar |
| Blog post (`/blog/[id]`) | `LazyLeaderboardAdWrapper` | 728x90 after article |
| Tools (`/tools`) | `LazyLeaderboardAdWrapper` | 728x90 footer |

### ✅ Content Quality
- 36+ original blog articles on Nigerian FX markets
- Interactive tools: Currency converter, rate tracker, historical charts
- Comprehensive guides on FX trading and remittances
- Clear navigation with sitemap.xml
- SEO-optimized meta tags on every page

---

## Troubleshooting

### Ads not showing?
1. Verify `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set in `.env.local`
2. Restart the dev server after changing env variables
3. AdSense may take 24-48 hours to start serving ads on a new domain
4. Check browser console for errors

### AdSense application rejected?
- Ensure your domain has been live for at least 3-6 months
- Make sure you have substantial original content (NairaMet has 36+ articles)
- Verify your privacy policy mentions Google AdSense (✅ already done)
- Check that `robots.txt` allows Google crawlers (✅ already done)
