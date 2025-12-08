# Cookiebot CMP Setup Guide (Google Certified)

## Overview
This guide helps you set up Cookiebot, a Google-certified Consent Management Platform, to comply with GDPR, ePrivacy Directive, and other privacy regulations for users in the EEA, UK, and Switzerland.

## What's Been Implemented

The site now includes Cookiebot, a Google-certified CMP with support for:
- ✅ Customizable consent banner (2 or 3 choice options)
- ✅ Automatic cookie scanning and categorization
- ✅ Automatic detection of EEA/UK/Switzerland users
- ✅ GDPR, CCPA, and LGPD compliance
- ✅ Integration with Google AdSense and other ad platforms
- ✅ Consent state management and reporting
- ✅ Multi-language support (automatic translation)
- ✅ Cookie declaration page generation

## Setup Steps

### 1. Create a Cookiebot Account

1. Go to [Cookiebot.com](https://www.cookiebot.com)
2. Click **"Try for free"** or **"Sign up"**
3. Choose a plan:
   - **Free**: Up to 100 subpages (perfect for small sites)
   - **Paid**: Starts at ~$9/month for larger sites
4. Complete registration with your email

### 2. Add Your Domain

1. After logging in, click **"Add domain"**
2. Enter your domain: `nairamet.com`
3. Select your region: **"Global"** or **"EU"**
4. Click **"Create domain"**

### 3. Get Your Cookiebot ID

1. In the Cookiebot dashboard, go to **"Your domains"**
2. Click on your domain (nairamet.com)
3. Go to **"Settings"** → **"Your scripts"**
4. Copy the Domain Group ID (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 4. Add to Your Environment Variables

Add to your `.env.local` file:
```env
NEXT_PUBLIC_COOKIEBOT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Replace with your actual Cookiebot Domain Group ID.

### 5. Configure Consent Banner

1. In Cookiebot dashboard, go to **"Dialog"** settings
2. Choose banner style:
   - **Overlay**: Full-screen modal (recommended for GDPR)
   - **Banner**: Bottom/top bar
   - **Popup**: Small popup window

3. Select consent mode:
   - **Opt-in** (Recommended): Users must accept before cookies load
   - **Opt-out**: Cookies load unless user rejects

4. Choose button configuration:
   - **3 buttons**: Accept, Decline, Customize (Recommended)
   - **2 buttons**: Accept, Customize
   - **1 button**: Accept only (not GDPR compliant)

5. Customize text and colors to match your brand

### 6. Configure Cookie Categories

Cookiebot automatically scans your site and categorizes cookies:

1. **Necessary**: Essential cookies (always allowed)
2. **Preferences**: Remember user settings
3. **Statistics**: Analytics cookies (Google Analytics, etc.)
4. **Marketing**: Advertising cookies (Google AdSense, etc.)

Review and adjust categories in **"Cookies"** section.

### 7. Set Up Google AdSense Integration

1. In Cookiebot dashboard, go to **"Cookies"**
2. Find Google AdSense cookies
3. Ensure they're categorized as **"Marketing"**
4. Cookiebot will automatically block them until consent is given

### 8. Configure Geographic Targeting

1. Go to **"Settings"** → **"Geolocation"**
2. Enable **"Automatic geolocation"**
3. Select regions to show consent:
   - ✅ European Union (EU/EEA)
   - ✅ United Kingdom
   - ✅ Switzerland
   - Optional: California (CCPA), Brazil (LGPD)

### 9. Enable Auto-Blocking

1. Go to **"Settings"** → **"Cookie blocking"**
2. Enable **"Automatic cookie blocking"**
3. This ensures cookies don't load before consent

### 10. Deploy and Test

1. Deploy your changes to production
2. Wait 5-10 minutes for Cookiebot to scan your site
3. Test the consent banner:
   - Use a VPN to connect from an EEA country (e.g., Germany, France)
   - Visit your site - you should see the consent banner
   - Test all options: Accept, Decline, and Customize
4. Check the Cookiebot dashboard for scan results

## How It Works

### User Flow
1. **First Visit**: User from EEA/UK/Switzerland sees consent banner
2. **User Choice**:
   - **Accept All**: All cookies enabled, personalized ads shown
   - **Decline**: Only necessary cookies, non-personalized ads
   - **Customize**: User selects specific cookie categories
3. **Subsequent Visits**: Choice is remembered (stored in cookies)
4. **Change Consent**: Users can reopen banner anytime

### Technical Implementation
- Cookiebot automatically scans and blocks cookies before consent
- Consent state stored in `CookieConsent` cookie
- Google AdSense respects consent via IAB TCF 2.0 framework
- Cookie declaration page auto-generated at `/cookie-declaration`
- Consent logs stored for compliance proof

### Automatic Cookie Blocking
Cookiebot uses intelligent blocking:
- Blocks `<script>` tags with marketing/statistics cookies
- Blocks third-party iframes (YouTube, Google Maps, etc.)
- Allows necessary cookies (session, security, etc.)
- Unblocks after user consent

## Cookie Categories

Cookiebot organizes cookies into 4 categories:

### 1. Necessary (Always Allowed)
- Session cookies
- Security tokens
- Load balancing
- User authentication

### 2. Preferences (Optional)
- Language settings
- Theme preferences
- User interface customization

### 3. Statistics (Optional)
- Google Analytics
- Page view tracking
- User behavior analysis
- Performance monitoring

### 4. Marketing (Optional)
- Google AdSense
- Retargeting pixels
- Social media tracking
- Personalized advertising

## Privacy Policy Requirements

Ensure your privacy policy includes:
1. Link to cookie declaration page
2. Types of cookies used
3. How users can manage consent
4. Data retention periods
5. Third-party services (Google AdSense, Analytics, etc.)

### Add Cookie Declaration Page

Cookiebot auto-generates a cookie declaration. Add this to your privacy policy or footer:

```html
<script id="CookieDeclaration" src="https://consent.cookiebot.com/YOUR_COOKIEBOT_ID/cd.js" type="text/javascript" async></script>
```

### Example Privacy Policy Text:
```
We use cookies to enhance your browsing experience and serve personalized 
advertisements. By clicking "Accept All", you consent to our use of cookies.

You can customize your cookie preferences at any time by clicking the 
"Cookie Settings" button. For more information about the cookies we use, 
please see our Cookie Declaration.

We use Google AdSense to display advertisements. For users in the EEA, UK, 
and Switzerland, we collect explicit consent before serving personalized ads.
```

## Testing Checklist

- [ ] Cookiebot banner appears for EEA/UK/Switzerland users
- [ ] Banner does NOT appear for users outside these regions (if geotargeting enabled)
- [ ] "Accept All" button works and enables all cookies
- [ ] "Decline" button works and blocks non-necessary cookies
- [ ] "Customize" shows detailed cookie categories
- [ ] Consent choice persists across page loads
- [ ] Google AdSense loads only after consent
- [ ] Cookie declaration page is accessible
- [ ] Consent can be changed after initial choice
- [ ] Privacy policy is updated with cookie information
- [ ] Cookiebot dashboard shows scan results
- [ ] All cookies are properly categorized

## Troubleshooting

### Banner Not Appearing
1. Check `NEXT_PUBLIC_COOKIEBOT_ID` is set correctly in `.env.local`
2. Verify domain is added in Cookiebot dashboard
3. Clear browser cookies and cache
4. Check browser console for JavaScript errors
5. Verify you're testing from an EEA/UK/Switzerland IP (if geotargeting enabled)
6. Wait 5-10 minutes after adding domain for initial scan

### Cookies Not Being Blocked
1. Enable **"Automatic cookie blocking"** in Cookiebot settings
2. Ensure blocking mode is set to **"auto"** in the script tag
3. Check that cookies are properly categorized (not as "Necessary")
4. Review Cookiebot scan results for undetected cookies
5. Manually add cookies if auto-scan missed them

### Ads Not Showing After Consent
1. Verify AdSense account is active and approved
2. Check `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is correct
3. Ensure AdSense cookies are categorized as "Marketing"
4. Wait 24-48 hours for AdSense to recognize consent
5. Check AdSense dashboard for policy violations
6. Verify IAB TCF 2.0 is enabled in Cookiebot

### Consent Not Persisting
1. Check browser allows cookies
2. Verify `CookieConsent` cookie is being set
3. Check domain matches exactly (www vs non-www)
4. Ensure no other scripts are clearing cookies
5. Check cookie expiration settings in Cookiebot

### Scan Not Finding All Cookies
1. Manually trigger a rescan in Cookiebot dashboard
2. Navigate through all pages of your site
3. Manually add missing cookies in "Cookies" section
4. Check if cookies are set by JavaScript (harder to detect)
5. Use browser DevTools to identify all cookies

## Advanced Features

### 1. Cookie Declaration Widget
Add to your privacy/cookie policy page:
```tsx
// app/privacy/page.tsx or app/cookies/page.tsx
export default function CookiesPage() {
  return (
    <div>
      <h1>Cookie Policy</h1>
      <script 
        id="CookieDeclaration" 
        src={`https://consent.cookiebot.com/${process.env.NEXT_PUBLIC_COOKIEBOT_ID}/cd.js`}
        type="text/javascript" 
        async
      />
    </div>
  )
}
```

### 2. Reopen Consent Banner
Add a "Cookie Settings" button anywhere on your site:
```tsx
<button onClick={() => window.Cookiebot?.show()}>
  Cookie Settings
</button>
```

### 3. Check Consent Status
Access consent programmatically:
```typescript
// Check if user has consented to marketing cookies
if (window.Cookiebot?.consent?.marketing) {
  // Load marketing scripts
  console.log('Marketing cookies allowed')
}

// Listen for consent changes
window.addEventListener('CookiebotOnAccept', () => {
  console.log('User accepted cookies')
})

window.addEventListener('CookiebotOnDecline', () => {
  console.log('User declined cookies')
})
```

### 4. Bulk Consent Management
For multiple domains, use Cookiebot's bulk management:
1. Go to **"Bulk"** in dashboard
2. Add all your domains
3. Apply same settings across all domains

### 5. Consent Statistics
View detailed analytics in Cookiebot dashboard:
- Consent rate by country
- Most common choices
- Cookie usage statistics
- Compliance reports

## Additional Resources

- [Cookiebot Documentation](https://www.cookiebot.com/en/developer/)
- [Cookiebot Help Center](https://support.cookiebot.com/)
- [GDPR Compliance Guide](https://www.cookiebot.com/en/gdpr-cookies/)
- [IAB TCF 2.0 Framework](https://iabeurope.eu/tcf-2-0/)
- [Google AdSense & CMP](https://support.google.com/adsense/answer/9012903)

## Why Cookiebot?

### Advantages
✅ **Google Certified**: Official Google CMP partner
✅ **Easy Setup**: 5-minute implementation
✅ **Automatic Scanning**: Detects all cookies automatically
✅ **Auto-Blocking**: Blocks cookies before consent
✅ **Multi-Language**: 40+ languages supported
✅ **Free Tier**: Up to 100 subpages free
✅ **IAB TCF 2.0**: Full compliance with industry standard
✅ **Great Support**: Responsive customer service
✅ **Regular Updates**: Stays current with regulations

### Pricing
- **Free**: Up to 100 subpages (perfect for most sites)
- **Business**: $9-29/month for larger sites
- **Enterprise**: Custom pricing for high-traffic sites

### Alternatives
If Cookiebot doesn't fit your needs:
- **OneTrust**: Enterprise-grade, highly customizable (expensive)
- **Quantcast Choice**: Free, IAB TCF 2.0 compliant
- **Usercentrics**: European-based, GDPR-focused
- **Termly**: Budget-friendly, good for small sites
- **Google Funding Choices**: Free, but less flexible

## Compliance Notes

✅ **GDPR Compliant**: Collects explicit consent before processing personal data
✅ **ePrivacy Directive**: Manages cookie consent properly
✅ **CCPA Ready**: Supports California Consumer Privacy Act
✅ **LGPD Compatible**: Brazilian data protection law
✅ **IAB TCF 2.0**: Full compliance with industry standard
✅ **Google Certified**: Approved by Google for AdSense integration
✅ **Consent Logging**: Stores proof of consent for audits

## Cookiebot vs Google Funding Choices

| Feature | Cookiebot | Google FC |
|---------|-----------|-----------|
| **Setup Time** | 5 minutes | 15-30 minutes |
| **Cookie Scanning** | Automatic | Manual |
| **Cookie Blocking** | Automatic | Manual |
| **Customization** | High | Medium |
| **Multi-language** | 40+ languages | Limited |
| **Free Tier** | 100 subpages | Unlimited |
| **Support** | Excellent | Limited |
| **Dashboard** | Comprehensive | Basic |
| **Cookie Declaration** | Auto-generated | Manual |
| **Best For** | All sites | AdSense-only sites |

## Support

For issues with:
- **Cookiebot**: [support.cookiebot.com](https://support.cookiebot.com)
- **Implementation**: Check Next.js documentation
- **Privacy Law**: Consult with a legal professional
- **AdSense Integration**: Google AdSense support

---

**Last Updated**: December 8, 2025
**Status**: ✅ Cookiebot CMP Implemented and Ready for Configuration
**CMP Provider**: Cookiebot (Google Certified)
