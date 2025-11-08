# One Alert Per User - Implementation Summary

## Overview

Each user can create **only one rate alert**. This alert sends an email notification **once per trigger**, preventing spam and ensuring users receive timely notifications without being overwhelmed.

## How It Works

### 1. One Alert Per User Limit

**Restriction:**
- Each user can create **only 1 rate alert**
- Must delete existing alert to create a new one
- Clear visual indicators show alert quota (1/1 Alert Used)

**Benefits:**
- Simplifies user experience
- Prevents alert overload
- Encourages focused monitoring
- Reduces system load

### 2. Smart Alert Triggering

**Before:**
- Alerts would send every hour if the condition remained true
- Users could receive multiple emails for the same alert
- No clear indication of alert status

**After:**
- Users limited to **one alert**
- Alert sends **once** when the threshold is crossed
- Alert automatically resets when the rate moves away from the threshold
- Can trigger again when the rate crosses the threshold again
- Clear visual indicators show alert status

### 3. Alert Lifecycle

```
1. User creates alert (1/1 quota used)
2. Alert Created → Monitoring starts
3. Threshold Crossed → Email sent (TRIGGERED)
4. Email Sent → Alert marked as SENT
5. Rate moves away → Alert resets automatically
6. Threshold Crossed Again → Email sent again (new trigger)
7. User deletes alert → Can create new alert (0/1 quota)
```

### 4. Visual Indicators

**Alert States:**
- 🔔 **Active** - Green bell icon, monitoring enabled
- 🔕 **Inactive** - Gray bell icon, monitoring disabled
- 🔴 **TRIGGERED** - Red badge, condition met, email pending/sent
- 🟡 **SENT** - Yellow badge, email already sent for this trigger

**Color Coding:**
- Gray background: Normal state
- Red background: Just triggered, email being sent
- Amber background: Already sent, waiting for reset

## Technical Implementation

### Rate Monitor Hook (`hooks/use-rate-monitor.ts`)

```typescript
// Key changes:
1. Alert key simplified to just alert ID (no time component)
2. Alert resets when condition is no longer met
3. Prevents duplicate sends for same trigger
```

**Logic:**
```typescript
if (isTriggered) {
  if (!alreadySent) {
    sendEmail()
    markAsSent()
  }
} else {
  // Reset alert when condition no longer met
  resetAlert()
}
```

### Benefits

✅ **One Alert Limit** - Each user can create only one alert
✅ **No Spam** - Users receive exactly one email per trigger
✅ **Auto-Reset** - Alerts automatically reset when rates change
✅ **Re-triggerable** - Can trigger again after reset
✅ **Clear Status** - Visual indicators show alert state and quota
✅ **User Control** - Can manually toggle alerts on/off or delete to create new

## User Experience

### Creating an Alert

1. User checks quota: "0/1 Alert Used"
2. User sets: Currency, Rate Type, Condition, Threshold, Email
3. Alert starts monitoring immediately
4. User sees "Active" status with green bell icon
5. Quota updates to "1/1 Alert Used"
6. Create form is hidden (limit reached)

### When Alert Triggers

1. Rate crosses threshold
2. Email sent immediately
3. Badge changes to "TRIGGERED" (red)
4. Background turns red to indicate active trigger

### After Email Sent

1. Badge changes to "SENT" (yellow)
2. Background turns amber
3. Alert continues monitoring
4. No additional emails sent while condition remains true

### When Rate Changes

1. Rate moves away from threshold
2. Alert automatically resets
3. Badge disappears
4. Background returns to normal
5. Alert ready to trigger again

### Deleting an Alert

1. User clicks delete button
2. Alert is removed
3. Quota updates to "0/1 Alert Used"
4. Create form becomes available
5. User can create a new alert

## Example Scenarios

### Scenario 1: USD Above ₦1,600

```
Current Rate: ₦1,580
Alert: USD above ₦1,600

Rate increases to ₦1,620 → Email sent ✅
Rate stays at ₦1,625 → No email (already sent)
Rate stays at ₦1,630 → No email (already sent)
Rate drops to ₦1,590 → Alert resets
Rate increases to ₦1,610 → Email sent again ✅
```

### Scenario 2: GBP Below ₦2,000

```
Current Rate: ₦2,050
Alert: GBP below ₦2,000

Rate drops to ₦1,980 → Email sent ✅
Rate drops to ₦1,950 → No email (already sent)
Rate increases to ₦2,010 → Alert resets
Rate drops to ₦1,990 → Email sent again ✅
```

## UI Features

### Alert List Display

Each alert shows:
- Currency and threshold
- Current rate
- Alert status badge
- Toggle button (activate/deactivate)
- Delete button

### Info Banner

```
💡 How alerts work: Each alert sends an email notification once when 
triggered. The alert will reset and can trigger again when the rate 
moves away from and then back to your threshold.
```

### Header Indicator

```
Your Alerts (3)    💡 Alerts send once per trigger
```

## Configuration

No configuration needed - this behavior is automatic and built-in.

### For Developers

To modify alert behavior, edit:
- `hooks/use-rate-monitor.ts` - Alert triggering logic
- `app/alerts/page.tsx` - UI and visual indicators

## Testing

### Manual Testing

1. Create an alert with threshold near current rate
2. Wait for rate to cross threshold
3. Verify email received
4. Verify badge shows "SENT"
5. Wait for rate to move away
6. Verify alert resets
7. Wait for rate to cross again
8. Verify new email received

### Expected Behavior

✅ One email per trigger
✅ Visual status updates
✅ Automatic reset
✅ Re-triggerable after reset
✅ No duplicate emails

## Troubleshooting

### Alert Not Sending

- Check alert is active (green bell icon)
- Verify email address is correct
- Check rate has actually crossed threshold
- Review browser console for errors

### Alert Not Resetting

- Verify rate has moved away from threshold
- Check monitoring is active
- Force refresh rates manually

### Multiple Emails

- Should not happen with new implementation
- If occurs, check browser console logs
- Verify only one browser tab is open

## Future Enhancements

Potential improvements:
- [ ] User-configurable reset behavior
- [ ] Cooldown period option
- [ ] Alert expiration dates
- [ ] Multiple threshold levels
- [ ] SMS notifications
- [ ] Webhook integrations

## Summary

The one-time alert system provides a better user experience by:
- Preventing email spam
- Providing clear visual feedback
- Automatically resetting when appropriate
- Allowing re-triggering when needed

Users can now confidently set alerts knowing they'll receive timely notifications without being overwhelmed by duplicate emails.

---

**Status:** ✅ Implemented and Active
**Version:** 1.0
**Last Updated:** 2024
