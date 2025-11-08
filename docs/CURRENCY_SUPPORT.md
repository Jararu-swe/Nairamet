# Currency Support - NairaMet

## Supported Currencies

NairaMet now supports **15 major currencies** for exchange rate tracking and alerts:

### Major Currencies
| Currency | Code | Symbol | Flag | Region |
|----------|------|--------|------|--------|
| US Dollar | USD | $ | 🇺🇸 | Americas |
| British Pound | GBP | £ | 🇬🇧 | Europe |
| Euro | EUR | € | 🇪🇺 | Europe |
| Chinese Yuan | CNY | ¥ | 🇨🇳 | Asia |
| Japanese Yen | JPY | ¥ | 🇯🇵 | Asia |
| Canadian Dollar | CAD | $ | 🇨🇦 | Americas |
| Australian Dollar | AUD | $ | 🇦🇺 | Oceania |
| Swiss Franc | CHF | Fr | 🇨🇭 | Europe |

### African & Middle East Currencies
| Currency | Code | Symbol | Flag | Region |
|----------|------|--------|------|--------|
| South African Rand | ZAR | R | 🇿🇦 | Africa |
| Kenyan Shilling | KES | KSh | 🇰🇪 | Africa |
| Ghanaian Cedi | GHS | ₵ | 🇬🇭 | Africa |
| Egyptian Pound | EGP | £ | 🇪🇬 | Africa |
| UAE Dirham | AED | د.إ | 🇦🇪 | Middle East |
| Saudi Riyal | SAR | ﷼ | 🇸🇦 | Middle East |
| Indian Rupee | INR | ₹ | 🇮🇳 | Asia |

## Rate Types

For each currency, we provide three rate types:

### 1. CBN Official Rate
- Official rate from Central Bank of Nigeria
- Used for official transactions
- Most stable and regulated

### 2. Black Market Rate
- Parallel market rate
- Typically 5-10% above CBN rate
- More volatile, reflects real market demand

### 3. Remittance Rate
- Rate used by money transfer services
- Usually 2-5% above CBN rate
- Best for international transfers

## Where Currencies Are Used

### 1. Live Currency Rates Widget
**Location**: Home page, Blog page

**Display**: Shows 4 main currencies in a responsive grid
- Desktop: 4 columns
- Tablet: 4 columns
- Mobile: 2 columns

**Currencies Shown**: USD, GBP, EUR, CNY

**Features**:
- Real-time rates
- 24-hour change percentage
- Parallel market rates
- Auto-refresh every 5 minutes

### 2. Smart Alerts
**Location**: `/alerts` page

**Features**:
- Create alerts for any supported currency
- Choose rate type (CBN, Black Market, Remittance)
- Set above/below thresholds
- Email and push notifications

**Display**: All currencies with valid rates appear in dropdown

### 3. Rate Tracker
**Location**: `/tracker` page

**Features**:
- Detailed rate information
- Historical charts
- Rate comparison tools

## Data Source

All currency rates are fetched from **CurrencyLayer API**:
- Real-time exchange rates
- 24-hour change data
- High accuracy and reliability
- Updates every 5 minutes

### API Configuration

The API supports many more currencies. To add more:

1. Edit `app/alerts/page.tsx`:
```typescript
const CURRENCY_CONFIG = [
  // Add new currency
  { code: "NZD", symbol: "$", flag: "🇳🇿", name: "New Zealand Dollar" },
  // ... existing currencies
]
```

2. Edit `components/live-currency-rates.tsx`:
```typescript
const DISPLAY_CURRENCIES = [
  // Add new currency
  { code: "NZD", flag: "🇳🇿", name: "New Zealand Dollar" },
  // ... existing currencies
]
```

3. The API automatically fetches rates for all currencies

## Rate Calculation

### CBN Rate
Direct from CurrencyLayer API:
```
USDNGN = 1650.50
```

### Black Market Rate
Estimated at 5% premium:
```
Black Market = CBN Rate × 1.05
= 1650.50 × 1.05
= 1733.03
```

### Remittance Rate
Estimated at 2% premium:
```
Remittance = CBN Rate × 1.02
= 1650.50 × 1.02
= 1683.51
```

## Rate Precision

Different currencies use different precision:

- **Large rates** (> 100): No decimals
  - USD/NGN: ₦1,650
  - GBP/NGN: ₦2,050

- **Small rates** (< 100): 2 decimals
  - JPY/NGN: ₦11.23
  - INR/NGN: ₦19.87

## Update Frequency

- **Live rates**: Every 5 minutes
- **Historical data**: Daily
- **API cache**: 5 minutes (configurable)

## Fallback Behavior

If API fails or currency not available:
1. Uses cached rates from localStorage
2. Falls back to last known rates
3. Shows error message
4. Continues monitoring

## Currency Availability

Not all currencies may be available at all times:
- Depends on CurrencyLayer API data
- Some currencies may have limited data
- Rates filtered to show only valid data (> 0)

## Adding New Currencies

To add support for a new currency:

1. **Check API Support**
   - Verify currency is supported by CurrencyLayer
   - Check if `{CODE}NGN` pair exists

2. **Add to Configuration**
   ```typescript
   { code: "SEK", symbol: "kr", flag: "🇸🇪", name: "Swedish Krona" }
   ```

3. **Test**
   - Verify rate appears in live widget
   - Test alert creation
   - Check rate calculations

4. **Update Documentation**
   - Add to this file
   - Update user guides

## Best Practices

### For Users
- Use CBN rates for official transactions
- Use Black Market rates for realistic planning
- Use Remittance rates for money transfers
- Set alerts for multiple currencies
- Monitor trends over time

### For Developers
- Always check if rate > 0 before displaying
- Handle missing currencies gracefully
- Cache rates for offline access
- Show loading states
- Provide fallback data

## Future Enhancements

Planned currency features:
- [ ] More African currencies (XOF, XAF, TZS, UGX)
- [ ] Cryptocurrency support (BTC, ETH, USDT)
- [ ] Custom rate sources
- [ ] Historical rate comparison
- [ ] Rate prediction/forecasting
- [ ] Multi-currency converter
- [ ] Rate alerts for multiple pairs
- [ ] Custom rate calculations

## API Limits

CurrencyLayer Free Tier:
- 100 requests/month
- 1 request/hour recommended
- Current: 1 request/5 minutes
- ~8,640 requests/month (exceeds free tier)

**Recommendation**: Upgrade to paid plan or implement better caching for production.

## Support

For currency-related issues:
1. Check if currency is in configuration
2. Verify API key is configured
3. Check API quota hasn't been exceeded
4. Review browser console for errors
5. Test with different currencies

---

**Last Updated**: 2024
**Supported Currencies**: 15
**Rate Types**: 3 (CBN, Black Market, Remittance)
**Update Frequency**: 5 minutes
