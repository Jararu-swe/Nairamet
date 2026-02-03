# Currency API Status Check

## ✅ Current Setup

### API Key Found:
```
CURRENCYLAYER_API_KEY=e085554fb90af55604492440ffe143eb
```

### API Endpoint:
```
https://api.currencylayer.com/live?access_key=e085554fb90af55604492440ffe143eb&source=USD&format=1&change=1&currencies=...
```

---

## 🧪 Testing Your API

### Test 1: Direct API Call
```bash
curl "https://api.currencylayer.com/live?access_key=e085554fb90af55604492440ffe143eb&source=USD&currencies=NGN,GBP,EUR"
```

### Test 2: Your API Endpoint (Local)
```bash
curl http://localhost:3000/api/currency
```

### Test 3: Your API Endpoint (Production)
```bash
curl https://www.nairamet.com/api/currency
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid Access Key"
**Cause**: API key is wrong or expired
**Solution**: 
- Verify key in CurrencyLayer dashboard
- Make sure there are no extra spaces
- Check if key is activated

### Issue 2: "Rate Limit Exceeded"
**Cause**: Used more than 100 calls this month
**Solution**:
- Wait until next month
- Upgrade to paid plan
- Use 12-hour cache (already configured)

### Issue 3: "No API Key"
**Cause**: Environment variable not set
**Solution**:
- Check `.env.local` has the key
- Restart dev server: `npm run dev`
- For production: Update Vercel environment variables

### Issue 4: "HTTPS Required"
**Cause**: Free tier only supports HTTP
**Solution**:
- CurrencyLayer free tier uses HTTP (not HTTPS)
- This is normal and expected
- Upgrade to paid plan for HTTPS

### Issue 5: Cached/Stale Data
**Cause**: 12-hour cache is serving old data
**Solution**:
- This is intentional (saves API calls)
- Force refresh: `/api/admin/refresh-rates`
- Or wait for cache to expire

---

## ✅ Your API Configuration

### Cache Settings:
- **Duration**: 12 hours
- **Revalidation**: 24 hours (stale-while-revalidate)
- **Monthly Calls**: ~60 (well within 100 limit)

### Supported Currencies:
```
USD, NGN, GBP, EUR, CNY, JPY, CAD, AUD, NZD, ZAR,
CHF, SEK, NOK, DKK, GHS, KES, SAR, AED, INR, and more
```

### Fallback Behavior:
If API fails, returns mock data:
```json
{
  "USDNGN": 1650.5,
  "GBPNGN": 2050.25,
  "EURNGN": 1750.75,
  "CNYNGN": 228.3
}
```

---

## 🚀 Deployment Checklist

### Local Development:
- [x] API key in `.env.local`
- [ ] Test: `npm run dev` → visit `/api/currency`
- [ ] Verify real data (not mock)

### Production (Vercel):
- [ ] Add `CURRENCYLAYER_API_KEY` to Vercel environment variables
- [ ] Deploy: `git push`
- [ ] Test: `curl https://www.nairamet.com/api/currency`
- [ ] Verify `"source": "currencylayer"` (not "fallback")

---

## 📊 Expected Response

### Success:
```json
{
  "success": true,
  "timestamp": 1738569600,
  "source": "currencylayer",
  "quotes": {
    "USDNGN": 1650.5,
    "GBPNGN": 2050.25,
    "EURNGN": 1750.75,
    ...
  },
  "changes": {
    "USDNGN": 0.5,
    "GBPNGN": -0.2,
    ...
  }
}
```

### Fallback (if API fails):
```json
{
  "success": true,
  "timestamp": 1738569600,
  "source": "fallback",
  "quotes": {
    "USDNGN": 1650.5,
    "GBPNGN": 2050.25,
    "EURNGN": 1750.75,
    "CNYNGN": 228.3
  }
}
```

---

## 🔧 Troubleshooting Steps

### Step 1: Verify API Key
```bash
# Check if key is set
echo $CURRENCYLAYER_API_KEY

# Should output: e085554fb90af55604492440ffe143eb
```

### Step 2: Test Direct API Call
```bash
curl "https://api.currencylayer.com/live?access_key=e085554fb90af55604492440ffe143eb&source=USD&currencies=NGN"
```

### Step 3: Check Logs
```bash
# Local
npm run dev
# Check console for: [Currency API] Fetched fresh data...

# Production (Vercel)
# Go to Vercel Dashboard → Logs
# Filter by: /api/currency
```

### Step 4: Force Refresh
```bash
# Bypass cache
curl https://www.nairamet.com/api/admin/refresh-rates
```

---

## 💡 Next Steps

1. **Test locally**: `npm run dev` → visit `http://localhost:3000/api/currency`
2. **Check response**: Should see `"source": "currencylayer"` (not "fallback")
3. **Update Vercel**: Add environment variable
4. **Deploy**: `git push`
5. **Verify production**: `curl https://www.nairamet.com/api/currency`

---

## ✅ If Everything Works

You should see:
- ✅ Real-time currency rates
- ✅ `"source": "currencylayer"`
- ✅ Multiple currency pairs (USDNGN, GBPNGN, etc.)
- ✅ 24-hour change percentages

---

## ❌ If It Doesn't Work

Share the error message and I'll help debug:
- API response
- Console logs
- Error details

**Let me know what you see when you test!** 🚀
