# Smart Alerts - Testing Guide

## Manual Testing Checklist

### ✅ Basic Alert Creation

1. **Navigate to Alerts Page**
   - Go to `/alerts`
   - Page should load without errors
   - Should see "Rate Alerts" heading

2. **Create Alert Form**
   - [ ] All form fields are visible
   - [ ] Currency dropdown shows USD, GBP, EUR, CNY
   - [ ] Rate Type dropdown shows Black Market, CBN Official, Remittance
   - [ ] Condition dropdown shows Above, Below
   - [ ] Threshold input accepts numbers
   - [ ] Email input accepts email addresses

3. **Form Validation**
   - [ ] Try submitting empty form - should show error toast
   - [ ] Try invalid email (no @) - should show error toast
   - [ ] Fill all fields correctly - should create alert successfully
   - [ ] Success toast should appear
   - [ ] Form should reset after creation

4. **Alert Display**
   - [ ] Created alert appears in "Your Alerts" section
   - [ ] Shows correct currency, condition, threshold
   - [ ] Shows email address
   - [ ] Bell icon is filled (active)
   - [ ] Current rate is displayed
   - [ ] Delete button is visible

### ✅ Alert Management

5. **Toggle Alert**
   - [ ] Click bell icon to deactivate
   - [ ] Bell icon becomes outlined (inactive)
   - [ ] Info toast appears
   - [ ] Click again to reactivate
   - [ ] Bell icon becomes filled again

6. **Delete Alert**
   - [ ] Click trash icon
   - [ ] Alert is removed from list
   - [ ] Success toast appears
   - [ ] Alert count updates

7. **Multiple Alerts**
   - [ ] Create 3-5 different alerts
   - [ ] All alerts display correctly
   - [ ] Each can be toggled independently
   - [ ] Each can be deleted independently

### ✅ Push Notifications

8. **Enable Push Notifications**
   - [ ] Push Notifications card is visible
   - [ ] Click "Enable" button
   - [ ] Browser asks for permission
   - [ ] Grant permission
   - [ ] Status changes to "enabled"
   - [ ] Success toast appears
   - [ ] "Test" and "Disable" buttons appear

9. **Test Push Notification**
   - [ ] Click "Test" button
   - [ ] Browser notification appears
   - [ ] Notification shows FX alert message
   - [ ] Success toast appears
   - [ ] Clicking notification opens app

10. **Disable Push Notifications**
    - [ ] Click "Disable" button
    - [ ] Status changes to "disabled"
    - [ ] Info toast appears
    - [ ] "Enable" button reappears

11. **Push-Enabled Alerts**
    - [ ] Enable push notifications
    - [ ] Check "Also send push notifications" when creating alert
    - [ ] Alert shows "Push enabled" label
    - [ ] Create alert without push checkbox
    - [ ] Alert doesn't show "Push enabled" label

### ✅ Rate Monitoring

12. **Monitoring Status**
    - [ ] With no alerts: "Monitoring inactive" shown
    - [ ] With active alerts: "Monitoring active" shown
    - [ ] Green dot appears when monitoring is active
    - [ ] Green dot animates (pulse effect)

13. **Current Rates Display**
    - [ ] Each alert shows current rate
    - [ ] Rates are formatted with commas (₦1,650)
    - [ ] Rates update when page refreshes

14. **Alert Triggering**
    - [ ] Create alert with threshold below current rate (condition: above)
    - [ ] Alert should show "TRIGGERED" badge
    - [ ] Badge is red/destructive color
    - [ ] Alert background changes color

15. **Force Check**
    - [ ] Click "Refresh Rates" button in header
    - [ ] Page reloads
    - [ ] Rates update
    - [ ] Or use "Check Now" in Monitoring Dashboard

### ✅ Monitoring Dashboard

16. **Overview Tab**
    - [ ] Shows total alerts count
    - [ ] Shows active alerts count
    - [ ] Shows triggered today count
    - [ ] Shows triggered this week count
    - [ ] Shows email notifications sent
    - [ ] Shows push notifications sent
    - [ ] Shows most active currency

17. **History Tab**
    - [ ] Shows list of triggered alerts
    - [ ] Each entry shows currency, condition, threshold
    - [ ] Shows triggered rate and timestamp
    - [ ] Shows notification badges (email/push)
    - [ ] Most recent alerts appear first
    - [ ] "Clear History" button works

18. **Monitoring Tab**
    - [ ] Shows monitoring status (Active/Inactive)
    - [ ] Shows checks performed count
    - [ ] Shows last check time
    - [ ] Shows next check time
    - [ ] Shows check interval (5m)
    - [ ] "Check Now" button works

19. **Data Tab**
    - [ ] "Export Data" button downloads JSON file
    - [ ] File contains alerts, history, settings
    - [ ] File name includes date
    - [ ] Import textarea accepts JSON
    - [ ] "Import Data" button restores data
    - [ ] Success alert appears after import

### ✅ Real-Time Features

20. **Rate Updates**
    - [ ] Rates fetch on page load
    - [ ] "Fetching latest rates..." message appears
    - [ ] Rates update every 5 minutes (wait and verify)
    - [ ] Last updated time changes

21. **Alert Monitoring**
    - [ ] Create alert that will trigger
    - [ ] Wait 5 minutes
    - [ ] Check browser console for monitoring logs
    - [ ] Check if alert appears in history
    - [ ] Verify email was logged (demo mode)

### ✅ Demo Mode Banner

22. **Banner Display**
    - [ ] Without RESEND_API_KEY: Banner appears
    - [ ] Banner is amber/yellow colored
    - [ ] Shows "Demo Mode Active" message
    - [ ] Explains email behavior
    - [ ] Has link to setup guide

### ✅ Responsive Design

23. **Mobile View** (< 768px)
    - [ ] All cards stack vertically
    - [ ] Form fields stack vertically
    - [ ] Buttons are full width
    - [ ] Text is readable
    - [ ] No horizontal scroll

24. **Tablet View** (768px - 1024px)
    - [ ] Form uses 2-column grid
    - [ ] Cards display properly
    - [ ] Navigation works

25. **Desktop View** (> 1024px)
    - [ ] Form uses 5-column grid
    - [ ] All features accessible
    - [ ] Optimal spacing

### ✅ Error Handling

26. **Network Errors**
    - [ ] Disconnect internet
    - [ ] Try creating alert
    - [ ] Error toast appears
    - [ ] Try refreshing rates
    - [ ] Graceful error handling

27. **Invalid Data**
    - [ ] Enter very large threshold (999999999)
    - [ ] Should handle gracefully
    - [ ] Enter negative threshold
    - [ ] Should handle gracefully

### ✅ Browser Compatibility

28. **Chrome/Edge**
    - [ ] All features work
    - [ ] Push notifications work
    - [ ] No console errors

29. **Firefox**
    - [ ] All features work
    - [ ] Push notifications work
    - [ ] No console errors

30. **Safari**
    - [ ] All features work
    - [ ] Push notifications work (macOS 16.4+)
    - [ ] No console errors

### ✅ Performance

31. **Page Load**
    - [ ] Page loads in < 2 seconds
    - [ ] No layout shift
    - [ ] Smooth animations

32. **With Many Alerts**
    - [ ] Create 20+ alerts
    - [ ] Page remains responsive
    - [ ] Scrolling is smooth
    - [ ] No lag when toggling alerts

### ✅ Data Persistence

33. **LocalStorage**
    - [ ] Create alerts
    - [ ] Refresh page
    - [ ] Alerts persist
    - [ ] Close browser
    - [ ] Reopen and check
    - [ ] Alerts still there

34. **Export/Import**
    - [ ] Create several alerts
    - [ ] Export data
    - [ ] Delete all alerts
    - [ ] Import data
    - [ ] All alerts restored

## Automated Testing

### Unit Tests (Future)

```typescript
// Example test structure
describe('Alert Creation', () => {
  it('should create alert with valid data', () => {})
  it('should validate email format', () => {})
  it('should prevent duplicate alerts', () => {})
})

describe('Alert Monitoring', () => {
  it('should trigger alert when condition met', () => {})
  it('should not trigger duplicate alerts', () => {})
  it('should send notifications', () => {})
})
```

### Integration Tests (Future)

```typescript
describe('Email Integration', () => {
  it('should send email via Resend API', () => {})
  it('should handle API errors gracefully', () => {})
})

describe('Currency API', () => {
  it('should fetch rates from CurrencyLayer', () => {})
  it('should use fallback data on error', () => {})
})
```

## Production Testing

Before deploying to production:

1. **Configure Environment Variables**
   ```bash
   RESEND_API_KEY=re_xxx
   CURRENCYLAYER_API_KEY=xxx
   EMAIL_FROM=alerts@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Test Real Email Delivery**
   - [ ] Create alert with your email
   - [ ] Trigger alert manually
   - [ ] Verify email received
   - [ ] Check email formatting
   - [ ] Test links in email

3. **Test Real Currency Data**
   - [ ] Verify rates are fetching from API
   - [ ] Check rate accuracy
   - [ ] Verify update frequency
   - [ ] Monitor API quota usage

4. **Load Testing**
   - [ ] Test with 100+ alerts
   - [ ] Monitor server performance
   - [ ] Check database queries (if applicable)
   - [ ] Verify no memory leaks

5. **Security Testing**
   - [ ] Test XSS prevention
   - [ ] Test CSRF protection
   - [ ] Verify API key security
   - [ ] Check rate limiting

## Bug Reporting

If you find issues:

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests
   - Review service worker logs

2. **Document the Issue**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser and version
   - Screenshots if applicable

3. **Check Known Issues**
   - Review GitHub issues
   - Check documentation
   - Search community forums

## Success Criteria

The alerts system is considered fully functional when:

- ✅ All 33 manual tests pass
- ✅ No console errors in any browser
- ✅ Email delivery works in production
- ✅ Push notifications work on all supported browsers
- ✅ Rate monitoring runs reliably
- ✅ Data persists correctly
- ✅ Performance is acceptable with 50+ alerts
- ✅ Mobile experience is smooth

## Next Steps

After testing:

1. Deploy to staging environment
2. Run full test suite again
3. Get user feedback
4. Fix any issues found
5. Deploy to production
6. Monitor error logs
7. Collect user feedback
8. Iterate and improve

---

**Happy Testing! 🎉**
