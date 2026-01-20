# 🎯 Monetag Final Setup - Optimized for Currency Sites

## ✅ What's Already Configured

### 1. **Popunder** (Highest Revenue) 💰
- **Zone ID**: `10486489`
- **Frequency**: Once per session
- **Expected CPM**: $2-$10
- **Status**: ✅ Ready to deploy

### 2. **Push Notifications** (Passive Income) 🔔
- **Zone ID**: `10486535`
- **Type**: Browser notifications
- **Expected**: $0.10-$1 per subscriber/month
- **Status**: ✅ Ready to deploy

---

## 🆕 What You Need to Add

### 3. **In-Page Push Banner** (Visible Ad)

This is a small notification-style banner that appears on your page. It's **much better than Vignette** for your use case!

#### How to Set It Up:

1. **Go to Monetag Dashboard**
2. **Click "Add Zone"**
3. **Select "In-Page Push"** (NOT Vignette!)
4. **Configure**:
   - Name: "In-Page Push Banner"
   - Position: Choose (Top, Bottom, or Corner)
   - Frequency: Once per session (recommended)
5. **Copy the Zone ID**
6. **Add to `.env.local`**:
   ```bash
   NEXT_PUBLIC_MONETAG_IN_PAGE_PUSH=your_zone_id_here
   ```

---

## 📊 Your Complete Ad Strategy

| Ad Type | Visibility | CPM | User Impact | Status |
|---------|-----------|-----|-------------|--------|
| **Popunder** | Background | $2-$10 | Low (opens behind) | ✅ Ready |
| **Push Notifications** | Permission prompt | Passive | Low (one-time ask) | ✅ Ready |
| **In-Page Push** | Small banner | $0.50-$3 | Low (dismissible) | ⏳ Need zone ID |

---

## 🚀 Deployment Steps

### 1. Create In-Page Push Zone
- Go to Monetag → Add Zone → In-Page Push
- Copy the zone ID

### 2. Update Environment Variables

**Local (`.env.local`):**
```bash
NEXT_PUBLIC_MONETAG_POPUNDER_DOMAIN=al5sm.com
NEXT_PUBLIC_MONETAG_PUSH_DOMAIN=3nbf4.com
NEXT_PUBLIC_MONETAG_POPUNDER=10486489
NEXT_PUBLIC_MONETAG_PUSH=10486535
NEXT_PUBLIC_MONETAG_IN_PAGE_PUSH=your_zone_id_here  # ← Add this
```

**Vercel Dashboard:**
Add all 5 variables above to:
`Project Settings → Environment Variables`

### 3. Deploy
```bash
git add -A
git commit -m "Add Monetag In-Page Push Banner"
git push
```

---

## 💡 Why This Setup is Optimal

### ✅ Maximum Revenue
- **Popunder**: Highest CPM format
- **Push**: Passive recurring income
- **In-Page Push**: Visible ad without being annoying

### ✅ Best User Experience
- **No Vignette**: Doesn't block content
- **Once per session**: Not spammy
- **Dismissible**: Users have control

### ✅ Perfect for Currency Sites
- **Quick access**: Users can check rates fast
- **Frequent visitors**: Won't annoy repeat users
- **Professional**: Maintains trust

---

## 📈 Expected Revenue (10,000 daily visitors)

```
Popunder (once per session):
- 3 sessions/day average = 30,000 impressions
- $5 CPM average = $150/day

Push Notifications:
- 1,000 subscribers = $10-$100/month

In-Page Push:
- 30,000 impressions
- $1.50 CPM average = $45/day

Total: ~$195/day or $5,850/month
```

*Actual earnings vary by traffic quality and geography*

---

## ✅ Final Checklist

- [x] Popunder configured (Zone: 10486489)
- [x] Push Notifications configured (Zone: 10486535)
- [x] Once-per-session frequency set
- [x] Cookie consent integration
- [x] Old AdSense files removed
- [ ] Create In-Page Push zone in Monetag
- [ ] Add In-Page Push zone ID to `.env.local`
- [ ] Update Vercel environment variables
- [ ] Deploy to production
- [ ] Test on live site
- [ ] Monitor earnings in Monetag dashboard

---

## 🎉 You're Almost Done!

Just create the In-Page Push zone, add the zone ID, and deploy. Your site will have the perfect balance of revenue and user experience!

**Questions?** Check Monetag dashboard or their support.
