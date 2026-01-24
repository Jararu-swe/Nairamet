# Widget Ad Protection Guide

## Overview
This document explains how the NairaMet widget is protected from blog ads interfering with its functionality when embedded via iframe.

## Protection Layers

### 1. **JavaScript Script Blocking**
The widget layout includes JavaScript that:
- Detects if running in an iframe
- Blocks common ad script domains (Google Ads, Monetag, PropellerAds, etc.)
- Overrides `document.write()` and `document.writeln()` to prevent ad injection
- Intercepts script/iframe creation to block ad sources

**Blocked Domains:**
- googlesyndication.com
- doubleclick.net
- monetag.com
- propellerads.com
- popads.net
- adsterra.com
- exoclick.com
- And more...

### 2. **CSS Ad Container Blocking**
CSS rules hide any ad-related elements:
```css
[class*="ad-"], [id*="ad-"],
[class*="ads-"], [id*="ads-"],
[class*="banner"], [id*="banner"],
ins.adsbygoogle {
  display: none !important;
  visibility: hidden !important;
}
```

### 3. **Content Security Policy (CSP)**
Meta tag restricts what can load:
```html
<meta 
  httpEquiv="Content-Security-Policy" 
  content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'none'; object-src 'none';" 
/>
```

This prevents:
- External scripts from loading
- Nested iframes
- Flash/Java objects

## How It Works

### When Widget Loads in Iframe:
1. ✅ Detects iframe context (`window.self !== window.top`)
2. ✅ Blocks ad script domains before they load
3. ✅ Hides any ad containers via CSS
4. ✅ Enforces CSP to prevent external resources

### When Widget Loads Standalone:
- Protection is minimal (only CSP)
- Widget functions normally
- No performance impact

## Testing

### Test Ad Blocking:
1. Embed widget in a page with ads:
```html
<iframe 
  src="https://nairamet.com/widget/rates?currency=USD" 
  width="320" 
  height="220">
</iframe>
```

2. Check browser console for blocked scripts:
```
[Widget] Blocked ad script: https://googlesyndication.com/...
```

3. Verify widget loads without ad interference

## Benefits

✅ **Clean Widget Experience**
- No ads overlay the widget
- No popups triggered from widget
- Fast loading without ad scripts

✅ **Performance**
- Blocks heavy ad scripts
- Reduces bandwidth usage
- Faster widget rendering

✅ **User Trust**
- Professional appearance
- No unexpected popups
- Consistent functionality

## Limitations

⚠️ **What This DOESN'T Protect Against:**
- Ads on the parent page (outside iframe)
- Server-side ad injection
- Ads loaded before iframe creation

⚠️ **CSP Considerations:**
- May need adjustment if adding external APIs
- `unsafe-inline` and `unsafe-eval` needed for React/Next.js
- Test thoroughly after any changes

## Maintenance

### Adding New Blocked Domains:
Edit `app/widget/[type]/layout.tsx`:
```javascript
const blockedDomains = [
  'googlesyndication.com',
  'your-new-domain.com', // Add here
  // ...
];
```

### Updating CSP:
Modify the meta tag in the same file:
```html
<meta 
  httpEquiv="Content-Security-Policy" 
  content="script-src 'self' 'unsafe-inline'; ..." 
/>
```

## Best Practices

1. **Keep Widget Isolated**
   - Use separate layout for widgets
   - Don't load ad scripts in widget routes
   - Maintain clean widget-specific styles

2. **Monitor Console**
   - Check for blocked scripts
   - Verify no errors from blocking
   - Test in different browsers

3. **Test Regularly**
   - Embed in pages with various ad networks
   - Test on mobile and desktop
   - Verify functionality isn't broken

4. **Document Changes**
   - Update this guide when adding protections
   - Note any new blocked domains
   - Document CSP changes

## Troubleshooting

### Widget Not Loading?
- Check CSP isn't blocking required scripts
- Verify iframe src is correct
- Check browser console for errors

### Ads Still Showing?
- Add domain to blocked list
- Check CSS selectors are correct
- Verify script blocking is active

### Widget Broken?
- Check if legitimate scripts are blocked
- Review CSP restrictions
- Test without ad blocking first

## Related Files

- `app/widget/[type]/layout.tsx` - Main protection logic
- `app/widget/[type]/page.tsx` - Widget components
- `components/share-button.tsx` - Share functionality
- `components/share-modal.tsx` - Share modal

## Support

For issues or questions:
1. Check browser console for errors
2. Test widget in isolation
3. Review this guide
4. Check Next.js documentation for CSP

---

**Last Updated:** January 2025
**Version:** 1.0
