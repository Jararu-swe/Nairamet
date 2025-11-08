# Smart Alerts System - Visual Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                      (/alerts page)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Alert Form   │  │ Alert List   │  │ Dashboard    │          │
│  │              │  │              │  │              │          │
│  │ • Currency   │  │ • Active     │  │ • Overview   │          │
│  │ • Rate Type  │  │ • Inactive   │  │ • History    │          │
│  │ • Condition  │  │ • Triggered  │  │ • Monitoring │          │
│  │ • Threshold  │  │ • Toggle     │  │ • Data       │          │
│  │ • Email      │  │ • Delete     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Push Setup   │  │ Toast        │  │ Demo Banner  │          │
│  │              │  │ Notifications│  │              │          │
│  │ • Enable     │  │              │  │ • Info       │          │
│  │ • Test       │  │ • Success    │  │ • Setup Link │          │
│  │ • Disable    │  │ • Error      │  │              │          │
│  └──────────────┘  │ • Info       │  └──────────────┘          │
│                     │ • Warning    │                             │
│                     └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ useAlertStorage  │  │ usePushNotif     │  │ useRateMonitor│ │
│  │                  │  │                  │  │               │ │
│  │ • alerts[]       │  │ • isSubscribed   │  │ • isMonitoring│ │
│  │ • history[]      │  │ • subscribe()    │  │ • lastCheck   │ │
│  │ • settings       │  │ • unsubscribe()  │  │ • forceCheck()│ │
│  │ • addAlert()     │  │ • sendTest()     │  │ • checkAlerts│ │
│  │ • updateAlert()  │  │                  │  │               │ │
│  │ • deleteAlert()  │  │                  │  │               │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│                                                                   │
│  ┌──────────────────┐                                            │
│  │ useToast         │                                            │
│  │                  │                                            │
│  │ • toasts[]       │                                            │
│  │ • addToast()     │                                            │
│  │ • removeToast()  │                                            │
│  │ • success()      │                                            │
│  │ • error()        │                                            │
│  └──────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    LocalStorage                           │   │
│  │                                                           │   │
│  │  • fx-tracker-alerts          (Alert configurations)     │   │
│  │  • fx-tracker-alert-history   (Triggered alerts log)     │   │
│  │  • fx-tracker-alert-settings  (User preferences)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND APIs                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ /api/send-alert  │  │ /api/send-push   │  │ /api/currency │ │
│  │                  │  │                  │  │               │ │
│  │ POST             │  │ POST             │  │ GET           │ │
│  │                  │  │                  │  │               │ │
│  │ Sends email      │  │ Sends push       │  │ Fetches rates │ │
│  │ notification     │  │ notification     │  │ from API      │ │
│  │                  │  │                  │  │               │ │
│  │ Uses: Resend     │  │ Uses: Web Push   │  │ Uses:         │ │
│  │                  │  │                  │  │ CurrencyLayer │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Resend API       │  │ Service Worker   │  │ CurrencyLayer │ │
│  │                  │  │                  │  │ API           │ │
│  │ • Email delivery │  │ • Push handling  │  │               │ │
│  │ • HTML templates │  │ • Notifications  │  │ • Live rates  │ │
│  │ • 100/day free   │  │ • Background     │  │ • 100/mo free │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Alert Creation Flow
```
User fills form
    ↓
Validation (email, threshold)
    ↓
Add to alerts array
    ↓
Save to LocalStorage
    ↓
Update UI
    ↓
Show success toast
```

### Monitoring Flow
```
Timer triggers (every 5 min)
    ↓
Fetch current rates from /api/currency
    ↓
Compare rates with alert thresholds
    ↓
Alert triggered? → Yes
    ↓
Send email via /api/send-alert
    ↓
Send push via /api/send-push
    ↓
Add to alert history
    ↓
Update dashboard stats
    ↓
Show notification
```

### Push Notification Flow
```
User clicks "Enable"
    ↓
Request browser permission
    ↓
Register service worker
    ↓
Create push subscription
    ↓
Store subscription
    ↓
Show success toast
    ↓
When alert triggers:
    ↓
Send to /api/send-push
    ↓
Service worker receives
    ↓
Show browser notification
    ↓
User clicks notification
    ↓
Open app
```

## 📦 Component Hierarchy

```
AlertsPage
├── ToastContainer
│   └── Toast (multiple)
├── DemoBanner (conditional)
├── Header
│   ├── Title
│   ├── Monitoring Status
│   └── Refresh Button
├── PushNotificationsCard
│   ├── Status Display
│   └── Action Buttons
├── AlertManagementCard
│   ├── CreateAlertForm
│   │   ├── Currency Select
│   │   ├── Rate Type Select
│   │   ├── Condition Select
│   │   ├── Threshold Input
│   │   ├── Email Input
│   │   ├── Push Checkbox
│   │   └── Create Button
│   └── AlertsList
│       └── AlertItem (multiple)
│           ├── Alert Info
│           ├── Current Rate
│           ├── Toggle Button
│           └── Delete Button
├── QuickTipsCard (conditional)
└── MonitoringDashboard
    ├── Tabs
    │   ├── Overview Tab
    │   │   ├── Stats Grid
    │   │   └── Metrics Cards
    │   ├── History Tab
    │   │   ├── History List
    │   │   └── Clear Button
    │   ├── Monitoring Tab
    │   │   ├── Status Display
    │   │   ├── Stats Grid
    │   │   └── Control Buttons
    │   └── Data Tab
    │       ├── Export Section
    │       └── Import Section
    └── Tab Content
```

## 🗂️ File Structure

```
app/
├── alerts/
│   └── page.tsx                    # Main alerts page
├── api/
│   ├── send-alert/
│   │   └── route.ts                # Email API
│   ├── send-push/
│   │   └── route.ts                # Push API
│   └── currency/
│       └── route.ts                # Currency API
└── blog/
    └── [id]/
        └── page.tsx                # Blog (comments disabled)

components/
├── ui/
│   └── toast.tsx                   # Toast system (NEW)
├── monitoring-dashboard.tsx        # Dashboard
└── protected-route.tsx             # Auth wrapper

hooks/
├── use-alert-storage.ts            # Alert data
├── use-push-notifications.ts       # Push handling
└── use-rate-monitor.ts             # Monitoring logic

public/
└── sw.js                           # Service worker

docs/
├── ALERTS_QUICK_START.md           # Quick start (NEW)
├── ALERTS_TESTING.md               # Testing guide (NEW)
├── ALERTS_FEATURE_SUMMARY.md       # Tech docs (NEW)
└── SYSTEM_DIAGRAM.md               # This file (NEW)

Root files:
├── .env.example                    # Env template (NEW)
├── README_ALERTS.md                # Main docs (NEW)
├── ALERTS_SETUP.md                 # Setup guide (NEW)
├── QUICK_REFERENCE.md              # Quick ref (NEW)
└── IMPLEMENTATION_SUMMARY.md       # Summary (NEW)
```

## 🔐 Security Flow

```
User Input
    ↓
Client-side Validation
    ↓
Sanitization
    ↓
API Request
    ↓
Server-side Validation
    ↓
Environment Variable Check
    ↓
External API Call (with API key)
    ↓
Response Validation
    ↓
Return to Client
```

## 📊 State Management

```
┌─────────────────────────────────────┐
│         Component State             │
│                                     │
│  • rates (ExchangeRate[])          │
│  • isLoadingRates (boolean)        │
│  • newAlert (AlertForm)            │
├─────────────────────────────────────┤
│         Custom Hooks                │
│                                     │
│  useAlertStorage()                 │
│  ├── alerts                        │
│  ├── alertHistory                  │
│  ├── alertSettings                 │
│  └── methods                       │
│                                     │
│  usePushNotifications()            │
│  ├── isSupported                   │
│  ├── isSubscribed                  │
│  └── methods                       │
│                                     │
│  useRateMonitor()                  │
│  ├── isMonitoring                  │
│  ├── lastCheck                     │
│  └── methods                       │
│                                     │
│  useToast()                        │
│  ├── toasts                        │
│  └── methods                       │
├─────────────────────────────────────┤
│         LocalStorage                │
│                                     │
│  • fx-tracker-alerts               │
│  • fx-tracker-alert-history        │
│  • fx-tracker-alert-settings       │
└─────────────────────────────────────┘
```

## 🎯 User Journey

### First-Time User
```
1. Land on /alerts page
   ↓
2. See demo banner (if no API keys)
   ↓
3. See quick tips card
   ↓
4. Fill alert form
   ↓
5. Click "Create Alert"
   ↓
6. See success toast
   ↓
7. Alert appears in list
   ↓
8. (Optional) Enable push notifications
   ↓
9. Wait for alert to trigger
   ↓
10. Receive notification
```

### Returning User
```
1. Land on /alerts page
   ↓
2. See existing alerts (from LocalStorage)
   ↓
3. Check monitoring status
   ↓
4. View dashboard stats
   ↓
5. Check alert history
   ↓
6. Create new alerts or manage existing
```

## 🔄 Monitoring Cycle

```
┌─────────────────────────────────────┐
│     Start Monitoring                │
│     (when alerts exist)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Wait 5 minutes                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Fetch current rates             │
│     (from /api/currency)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     For each active alert:          │
│     Compare rate vs threshold       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Alert triggered?                │
└──────┬──────────────────┬───────────┘
       │ Yes              │ No
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│ Send email   │   │ Continue     │
│ Send push    │   │ monitoring   │
│ Log history  │   └──────┬───────┘
└──────┬───────┘          │
       │                  │
       └──────────┬───────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Update last check time          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Repeat cycle                    │
│     (back to wait 5 minutes)        │
└─────────────────────────────────────┘
```

## 📱 Responsive Layout

### Mobile (< 768px)
```
┌─────────────────┐
│     Header      │
├─────────────────┤
│   Demo Banner   │
├─────────────────┤
│  Push Card      │
├─────────────────┤
│  Alert Form     │
│  (stacked)      │
├─────────────────┤
│  Alerts List    │
├─────────────────┤
│  Dashboard      │
│  (tabs)         │
└─────────────────┘
```

### Desktop (> 1024px)
```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────────────────────────┤
│         Demo Banner                 │
├─────────────────────────────────────┤
│         Push Card                   │
├─────────────────────────────────────┤
│  Alert Form (5 columns)             │
├─────────────────────────────────────┤
│  Alerts List (grid)                 │
├─────────────────────────────────────┤
│  Dashboard (wide tabs)              │
└─────────────────────────────────────┘
```

---

**This diagram shows the complete Smart Alerts system architecture, data flow, and component structure.**
