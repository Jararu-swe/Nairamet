# 🔄 Restart Instructions

## Why You Don't See Changes

The flags have been added to the code, but Next.js has cached the old version. You need to restart your development server.

## Steps to See the Flags

### 1. Stop Your Dev Server
In your terminal where the dev server is running:
- Press `Ctrl + C` to stop it

### 2. Clear Cache (Already Done ✅)
The `.next` folder has been cleared automatically.

### 3. Restart Dev Server
Run one of these commands:

```bash
npm run dev
```

Or if using pnpm:
```bash
pnpm dev
```

Or if using yarn:
```bash
yarn dev
```

### 4. Hard Refresh Your Browser
After the server restarts:
- Press `Ctrl + Shift + R` (Windows/Linux)
- Or `Cmd + Shift + R` (Mac)

## What You Should See

### ✅ Flags Added To:

1. **Tools Page** (`/tools`)
   - Currency selector dropdown (with flags)
   - Widget preview header (flag next to currency)
   - Rate calculator dropdown (with flags)

2. **Alerts Page** (`/alerts`)
   - Currency selector in alert form (with flags)

3. **Tracker Page** (`/tracker`)
   - Currency cards (with flags)
   - Comparison table (with flags)
   - Converter dropdown (with flags)

4. **Charts Page** (`/charts`)
   - Currency selector (with flags)
   - Chart title (with flags)

5. **Rate Logs Page** (`/logs`)
   - Statistics cards (with flags)
   - Historical data table (with flags)

6. **Live Currency Widget**
   - Home page widget (with flags)
   - Blog page widget (with flags)

7. **Embedded Widgets** (`/widget/*`)
   - All widget types show flags

## Verification

The code changes are confirmed in:
- ✅ `app/tools/page.tsx` - Helper functions and flag images added
- ✅ `app/alerts/page.tsx` - Select component with flags
- ✅ `app/widget/[type]/page.tsx` - Widget headers with flags
- ✅ `app/tracker/page.tsx` - Already had flags
- ✅ `app/charts/page.tsx` - Already had flags
- ✅ `app/logs/page.tsx` - Already had flags
- ✅ `components/live-currency-rates.tsx` - Already had flags

## Still Not Seeing Changes?

If you still don't see the flags after restarting:

1. **Check Browser Console** - Look for any errors
2. **Check Network Tab** - See if flag images are loading from `flagcdn.com`
3. **Try Incognito Mode** - Opens a fresh browser session
4. **Clear Browser Cache** - Settings → Clear browsing data

## Flag Source

All flags are loaded from: `https://flagcdn.com/w40/{country-code}.png`

Example:
- USD → `https://flagcdn.com/w40/us.png` 🇺🇸
- GBP → `https://flagcdn.com/w40/gb.png` 🇬🇧
- EUR → `https://flagcdn.com/w40/eu.png` 🇪🇺
