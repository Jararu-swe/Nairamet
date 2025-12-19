# Ad Placement Strategy for NairaMet

## Overview
This document outlines the comprehensive ad placement strategy that balances user experience with revenue generation across all pages.

## Ad Types & Components

### 1. InFeedAd
- **Purpose**: Subtle, content-integrated advertising
- **Appearance**: Blends with content, clearly marked as "Sponsored"
- **Placement**: Between content sections
- **User Impact**: Minimal disruption

### 2. SidebarAdCard
- **Purpose**: Desktop sidebar advertising
- **Appearance**: Card-style, sticky positioning
- **Placement**: Right sidebar on desktop layouts
- **User Impact**: Non-intrusive, doesn't block content

### 3. BottomBannerAd (Improved)
- **Purpose**: Fixed bottom banner with dismiss option
- **Appearance**: Sleek, dismissible, delayed appearance
- **Placement**: Fixed bottom of viewport
- **User Impact**: Can be dismissed, appears after 2 seconds

## Page-by-Page Placement

### Home Page (/)
- **InFeedAd**: After hero section, before features
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Non-intrusive placement that doesn't interfere with key conversion areas

### Tracker Page (/tracker)
- **InFeedAd**: After main currency table
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Ads appear after users have seen the main functionality

### Alerts Page (/alerts)
- **SidebarAdCard**: Right sidebar (desktop only)
- **BottomBannerAd**: Fixed bottom banner
- **Layout**: 3/4 main content, 1/4 sidebar with ad
- **Rationale**: Sidebar doesn't interfere with alert management

### Tools Page (/tools)
- **InFeedAd**: After converter and widget tools
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Users see tools first, then ads

### Blog Articles (/blog/[id])
- **InFeedAd**: After article content, before comments
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Ads appear after users have consumed the content

### Pricing Page (/pricing)
- **InFeedAd**: After FAQ section
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Ads appear after users have reviewed pricing information

### Charts Page (/charts)
- **SidebarAdCard**: Right sidebar (desktop only)
- **BottomBannerAd**: Fixed bottom banner
- **Layout**: 3/4 main content, 1/4 sidebar with ad
- **Rationale**: Sidebar doesn't interfere with chart viewing

### Rates Pages (/rates/[pair])
- **InFeedAd**: After rate information and details
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Users see rates first, then ads after consuming content

### Convert Pages (/convert/[slug])
- **InFeedAd**: After conversion results and details
- **BottomBannerAd**: Fixed bottom banner
- **Rationale**: Ads appear after users get their conversion results

### Legal Pages (/privacy, /terms, /cookies)
- **BottomBannerAd**: Only the dismissible bottom banner
- **Rationale**: Minimal ad presence on legal/utility pages to maintain professionalism

### Other Pages (/disclaimer, /forgot-password, /reset-password, etc.)
- **BottomBannerAd**: Only the dismissible bottom banner
- **Rationale**: Minimal ad presence on utility pages

## Ad Behavior & UX Improvements

### Dismissible Ads
- All ads can be dismissed by users
- Dismissal preference stored in localStorage
- Respects cookie consent settings

### Delayed Loading
- Bottom banner appears after 2-second delay
- Prevents immediate disruption of user experience
- Allows users to engage with content first

### Responsive Design
- Sidebar ads only show on desktop (lg+ breakpoints)
- Mobile users see only in-feed and bottom banner ads
- Ads adapt to screen size and orientation

### Accessibility
- All ads have proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Clear visual indicators ("Sponsored", "Ad" labels)

## Cookie Consent Integration

### Personalized Ads
- Respects `data-ads-personalization="false"` attribute
- Shows non-personalized ads when consent is denied
- Fully compliant with GDPR/privacy regulations

### Ad Blocking
- Graceful degradation when ad blockers are present
- No broken layouts or error messages
- Content remains fully functional

## Performance Considerations

### Lazy Loading
- Ads load only when needed
- Doesn't impact initial page load performance
- Uses intersection observer for optimal timing

### Core Web Vitals
- Ad placement doesn't affect LCP (Largest Contentful Paint)
- No layout shift (CLS) from ad loading
- Minimal impact on FID (First Input Delay)

## Revenue Optimization

### Strategic Placement
- Ads placed after users engage with core functionality
- Higher viewability rates due to content integration
- Better user tolerance due to non-intrusive design

### Ad Formats
- Responsive ad units for better fill rates
- Multiple ad sizes supported
- Optimized for both desktop and mobile

## Monitoring & Analytics

### Key Metrics
- Ad viewability rates
- Click-through rates (CTR)
- User engagement after ad exposure
- Bounce rate impact
- Revenue per visitor (RPV)

### A/B Testing
- Test different ad placements
- Measure impact on user behavior
- Optimize based on data

## Implementation Details

### Ad Slot Configuration
```typescript
// Example ad slot IDs (replace with actual)
const AD_SLOTS = {
  IN_FEED: '1234567894',
  SIDEBAR: '1234567895', 
  BOTTOM_BANNER: '1234567893'
};
```

### CSS Classes
```css
/* Ensure ads don't break layout */
.ad-container {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive ad behavior */
@media (max-width: 1024px) {
  .sidebar-ad {
    display: none;
  }
}
```

## Best Practices

### Do's
- ✅ Place ads after valuable content
- ✅ Make ads clearly identifiable
- ✅ Provide dismiss options
- ✅ Respect user preferences
- ✅ Test on multiple devices
- ✅ Monitor performance impact

### Don'ts
- ❌ Place ads before main content
- ❌ Use intrusive pop-ups
- ❌ Block navigation elements
- ❌ Ignore mobile experience
- ❌ Overload pages with ads
- ❌ Ignore accessibility

## Coverage Summary

### Pages with Ads (15 total)
1. ✅ Home (/)
2. ✅ Tracker (/tracker)
3. ✅ Alerts (/alerts)
4. ✅ Tools (/tools)
5. ✅ Blog listing (/blog)
6. ✅ Blog articles (/blog/[id])
7. ✅ Pricing (/pricing)
8. ✅ Charts (/charts)
9. ✅ Rates pages (/rates/[pair])
10. ✅ Convert pages (/convert/[slug])
11. ✅ Privacy (/privacy)
12. ✅ Terms (/terms)
13. ✅ Cookies (/cookies)
14. ✅ Disclaimer (/disclaimer)
15. ✅ Other utility pages

### Ad Distribution
- **InFeedAd**: 7 pages (Home, Tracker, Tools, Blog articles, Pricing, Rates, Convert)
- **SidebarAdCard**: 2 pages (Alerts, Charts)
- **BottomBannerAd**: All 15 pages

## Future Enhancements

### Planned Improvements
1. **Smart Ad Placement**: AI-driven optimal placement
2. **User Behavior Tracking**: Personalized ad timing
3. **Premium Ad-Free**: Option for paid users
4. **Native Advertising**: Content-style sponsored posts
5. **Video Ads**: Strategic video ad integration

### Revenue Diversification
1. **Affiliate Marketing**: Currency exchange partnerships
2. **Sponsored Content**: FX-related sponsored articles
3. **Premium Features**: Ad-free premium subscriptions
4. **API Monetization**: Paid API access with higher limits

---

**Last Updated**: December 2025
**Next Review**: January 2026
