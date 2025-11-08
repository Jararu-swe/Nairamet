# Widget Documentation - Nairamet

## Overview

Nairamet provides embeddable widgets that display live Nigerian exchange rates on your website. All widgets are fully functional, auto-updating, and easy to integrate.

## ✅ Widget Status: FULLY FUNCTIONAL

All three widget types are working and ready for production use:
- ✅ Live Rates Display Widget
- ✅ Currency Converter Widget  
- ✅ Rate Chart Widget

## Widget Types

### 1. Live Rates Display Widget

Shows official, black market, and parallel rates for a specific currency.

**Features:**
- Real-time exchange rates
- Trend indicators (up/down/stable)
- Auto-refresh every 60 seconds
- Dark mode support

**Embed Code:**
```html
<iframe 
  src="https://yoursite.com/widget/rates?currency=USD" 
  width="320" 
  height="220" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
</iframe>
```

**Preview:**
- Displays: Official Rate, Black Market Rate, Parallel Rate
- Size: 320px × 220px (recommended)
- Updates: Every 60 seconds

---

### 2. Currency Converter Widget

Interactive converter with bidirectional conversion (NGN ↔ Foreign Currency).

**Features:**
- Input field for custom amounts
- Real-time conversion calculations
- Shows both directions (NGN → Currency and Currency → NGN)
- Based on black market rates

**Embed Code:**
```html
<iframe 
  src="https://yoursite.com/widget/converter?currency=GBP" 
  width="320" 
  height="220" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
</iframe>
```

**Preview:**
- Interactive input field
- Instant conversion results
- Size: 320px × 220px (recommended)
- Updates: Every 60 seconds

---

### 3. Rate Chart Widget

Visual comparison of all three rate types with progress bars.

**Features:**
- Color-coded rate cards (Official, Black Market, Parallel)
- Visual progress bars showing relative differences
- Percentage comparisons
- Spread calculation

**Embed Code:**
```html
<iframe 
  src="https://yoursite.com/widget/chart?currency=EUR" 
  width="320" 
  height="300" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
</iframe>
```

**Preview:**
- Three rate cards with visual bars
- Spread percentage display
- Size: 320px × 300px (recommended)
- Updates: Every 60 seconds

---

## Supported Currencies

All widgets support the following currency codes:

| Code | Currency | Flag |
|------|----------|------|
| USD | US Dollar | 🇺🇸 |
| GBP | British Pound | 🇬🇧 |
| EUR | Euro | 🇪🇺 |
| CNY | Chinese Yuan | 🇨🇳 |
| JPY | Japanese Yen | 🇯🇵 |
| CAD | Canadian Dollar | 🇨🇦 |
| AUD | Australian Dollar | 🇦🇺 |
| CHF | Swiss Franc | 🇨🇭 |
| ZAR | South African Rand | 🇿🇦 |
| INR | Indian Rupee | 🇮🇳 |
| AED | UAE Dirham | 🇦🇪 |
| SAR | Saudi Riyal | 🇸🇦 |
| KES | Kenyan Shilling | 🇰🇪 |
| GHS | Ghanaian Cedi | 🇬🇭 |
| EGP | Egyptian Pound | 🇪🇬 |

---

## Usage Instructions

### Step 1: Choose Widget Type
Select from:
- `rates` - Live rates display
- `converter` - Currency converter
- `chart` - Rate comparison chart

### Step 2: Select Currency
Add the currency parameter to the URL:
```
?currency=USD
```

### Step 3: Copy Embed Code
Use the iframe code with your domain:
```html
<iframe src="https://yoursite.com/widget/rates?currency=USD" width="320" height="220"></iframe>
```

### Step 4: Customize (Optional)
Adjust dimensions, add styling, or wrap in a container:
```html
<div style="max-width: 320px; margin: 20px auto;">
  <iframe src="https://yoursite.com/widget/rates?currency=USD" width="100%" height="220"></iframe>
</div>
```

---

## Widget Generator Tool

Visit `/tools` page to use the interactive widget generator:
1. Select widget type
2. Choose currency
3. Generate embed code
4. Preview live widget
5. Copy code to clipboard

---

## Technical Details

### Auto-Refresh
- All widgets automatically refresh every 60 seconds
- No manual refresh needed
- Shows last update timestamp

### Data Source
- Fetches from `/api/tracker` endpoint
- Real-time exchange rates
- Multiple rate sources (Official, Black Market, Parallel)

### Performance
- Lightweight iframes
- Minimal JavaScript
- Fast loading times
- Responsive design

### Browser Support
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+
- Mobile browsers

---

## Styling & Customization

### Responsive Width
```html
<div style="max-width: 320px; width: 100%;">
  <iframe src="/widget/rates?currency=USD" width="100%" height="220"></iframe>
</div>
```

### Custom Shadow
```html
<iframe 
  src="/widget/rates?currency=USD" 
  width="320" 
  height="220"
  style="box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-radius: 12px;">
</iframe>
```

### Dark Background
Widgets automatically adapt to dark mode when embedded in dark-themed sites.

---

## Examples

### Blog Sidebar
```html
<aside class="sidebar">
  <h3>Live Exchange Rates</h3>
  <iframe src="/widget/rates?currency=USD" width="100%" height="220"></iframe>
</aside>
```

### News Article
```html
<article>
  <p>Current exchange rates show...</p>
  <iframe src="/widget/chart?currency=GBP" width="320" height="300"></iframe>
  <p>The spread between official and black market...</p>
</article>
```

### Financial Dashboard
```html
<div class="dashboard-grid">
  <iframe src="/widget/rates?currency=USD" width="320" height="220"></iframe>
  <iframe src="/widget/rates?currency=GBP" width="320" height="220"></iframe>
  <iframe src="/widget/rates?currency=EUR" width="320" height="220"></iframe>
</div>
```

---

## Testing

### Live Demo Page
Visit `/tools/test-embed.html` to see all widgets in action with:
- Multiple currency examples
- All three widget types
- Copy-paste embed codes
- Usage instructions

### Local Testing
1. Start your development server
2. Navigate to `/widget/rates?currency=USD`
3. Test different currencies and widget types
4. Verify auto-refresh functionality

---

## API Integration

Widgets fetch data from your tracker API:

**Endpoint:** `/api/tracker`

**Expected Response:**
```json
{
  "rates": [
    {
      "currency": "USD",
      "official": 1580,
      "blackMarket": 1620,
      "remittance": 1595
    }
  ]
}
```

---

## Troubleshooting

### Widget Not Loading
- Check if `/api/tracker` endpoint is accessible
- Verify currency code is supported
- Check browser console for errors

### Rates Not Updating
- Ensure API is returning valid data
- Check network tab for failed requests
- Verify auto-refresh interval (60 seconds)

### Styling Issues
- Use inline styles for iframe
- Ensure parent container has proper width
- Check for CSS conflicts

---

## Support

For issues or questions:
1. Check the live demo at `/tools/test-embed.html`
2. Use the widget generator at `/tools`
3. Review API documentation
4. Check browser console for errors

---

## Changelog

### v1.0.0 (Current)
- ✅ Live Rates Display Widget
- ✅ Currency Converter Widget
- ✅ Rate Chart Widget
- ✅ Auto-refresh every 60 seconds
- ✅ Dark mode support
- ✅ 15+ supported currencies
- ✅ Interactive widget generator
- ✅ Live demo page

---

**Status:** Production Ready 🚀

All widgets are fully functional and ready for embedding on any website!
