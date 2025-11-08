# One Alert Per User - Implementation

## Summary

Each user is now limited to creating **only ONE rate alert**. This simplifies the user experience and ensures focused monitoring.

## Key Changes

### 1. Alert Quota System
- **Limit:** 1 alert per user
- **Visual Indicator:** Badge showing "0/1" or "1/1 Alert Used"
- **Enforcement:** Form validation prevents creating more than 1 alert

### 2. UI Updates

#### Header Badge
```
Manage Alerts                    [0/1 Alert Used]
```

#### When No Alert Exists (0/1)
- Shows: "Create Your Alert" form
- Description: "Create one rate alert to get notified when rates hit your target"
- All form fields enabled

#### When Alert Exists (1/1)
- Hides: Create alert form
- Shows: Warning banner with amber background
- Message: "Alert Limit Reached - You can only have one active rate alert at a time"
- Tip: "Delete your existing alert to create a new one"

### 3. User Flow

```
Step 1: User visits alerts page
        ↓
Step 2: Sees "0/1 Alert Used" badge
        ↓
Step 3: Fills out alert form
        ↓
Step 4: Clicks "Create Alert"
        ↓
Step 5: Badge updates to "1/1 Alert Used"
        ↓
Step 6: Form is hidden, warning banner shown
        ↓
Step 7: To create new alert, must delete existing one
        ↓
Step 8: After deletion, badge shows "0/1 Alert Used"
        ↓
Step 9: Form becomes available again
```

## Visual States

### State 1: No Alert (0/1)
```
┌─────────────────────────────────────────┐
│ Manage Alerts          [0/1 Alert Used] │
│ Create one rate alert to get notified   │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Create Your Alert                   │ │
│ │ [Currency] [Rate] [Condition] [...] │ │
│ │ [Create Alert Button]               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### State 2: Alert Exists (1/1)
```
┌─────────────────────────────────────────┐
│ Manage Alerts          [1/1 Alert Used] │
│ You have reached your alert limit       │
├─────────────────────────────────────────┤
│ ⚠️ Alert Limit Reached                  │
│ You can only have one active alert.     │
│ Delete existing alert to create new.    │
├─────────────────────────────────────────┤
│ Your Alert                              │
│ ┌─────────────────────────────────────┐ │
│ │ 🔔 USD above ₦1,600                 │ │
│ │ Black Market • user@email.com       │ │
│ │                    [TRIGGERED] [🗑️] │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Code Implementation

### Validation Check
```typescript
const createAlert = () => {
  // Check if user already has an alert
  if (alerts.length >= 1) {
    error("You can only create one rate alert. Delete your existing alert to create a new one.")
    return
  }
  
  // ... rest of validation and creation
}
```

### Conditional Rendering
```tsx
{alerts.length < 1 ? (
  // Show create form
  <div className="border rounded-lg p-4 space-y-4">
    <h3>Create Your Alert</h3>
    {/* Form fields */}
  </div>
) : (
  // Show limit reached message
  <div className="border border-amber-200 rounded-lg p-6 bg-amber-50">
    <h3>Alert Limit Reached</h3>
    <p>You can only have one active rate alert at a time.</p>
  </div>
)}
```

### Quota Badge
```tsx
<Badge variant="outline">
  {alerts.length}/1 Alert Used
</Badge>
```

## User Messages

### Success Messages
- ✅ "Alert created: USD above ₦1,600"
- ✅ "Alert deleted successfully"

### Error Messages
- ❌ "You can only create one rate alert. Delete your existing alert to create a new one."
- ❌ "Please fill in all required fields"
- ❌ "Please enter a valid email address"

### Info Messages
- ℹ️ "Create one rate alert to get notified when rates hit your target"
- ℹ️ "You have reached your alert limit. Delete your existing alert to create a new one."
- ℹ️ "You can create one rate alert. It sends an email notification once when triggered."

## Benefits

### For Users
✅ **Simple & Clear** - No confusion about how many alerts they can create
✅ **Focused Monitoring** - Encourages monitoring the most important rate
✅ **Easy Management** - Only one alert to manage
✅ **No Overwhelm** - Won't receive multiple alert emails

### For System
✅ **Reduced Load** - Fewer alerts to monitor
✅ **Better Performance** - Less database queries
✅ **Simpler Logic** - Easier to maintain
✅ **Cost Effective** - Fewer email sends

## Testing Checklist

- [ ] Create first alert - should succeed
- [ ] Try to create second alert - should show error
- [ ] Badge shows "1/1 Alert Used"
- [ ] Form is hidden when limit reached
- [ ] Warning banner is displayed
- [ ] Delete alert - quota resets to "0/1"
- [ ] Form becomes available again
- [ ] Can create new alert after deletion

## Edge Cases Handled

1. **User tries to create multiple alerts quickly**
   - Validation prevents creation
   - Error message shown

2. **User deletes alert**
   - Quota immediately updates
   - Form becomes available

3. **User has alert from before limit was implemented**
   - Existing alert is preserved
   - Cannot create additional alerts

## Future Enhancements

Potential improvements:
- [ ] Premium tier with unlimited alerts
- [ ] Temporary alert increase for special events
- [ ] Alert templates for quick setup
- [ ] Alert sharing between users

## Migration Notes

**Existing Users:**
- Users with existing alerts keep them
- Users with 0 alerts can create 1
- Users with multiple alerts (if any) are grandfathered but cannot create more

**New Users:**
- Start with 0/1 quota
- Can create 1 alert immediately
- Must delete to create different alert

## Summary

The one-alert-per-user limit provides a focused, simple experience while reducing system complexity. Users can easily manage their single alert and change it as needed by deleting and recreating.

---

**Status:** ✅ Implemented
**Version:** 1.0
**Date:** 2024
