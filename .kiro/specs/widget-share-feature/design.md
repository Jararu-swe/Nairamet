# Design Document

## Overview

The widget share feature will add social sharing capabilities to all three NairaMet widget types. The design prioritizes a seamless user experience with progressive enhancement: native share API for mobile devices and a fallback modal for desktop browsers. The implementation will be lightweight to maintain fast widget load times and will integrate cleanly with the existing widget architecture.

## Architecture

### Component Structure

```
Widget Page Component (app/widget/[type]/page.tsx)
├── Existing Widget Content
└── ShareButton Component (new)
    ├── Share Icon + Tooltip
    └── ShareModal Component (conditional)
        ├── Native Share Handler
        └── Fallback Share Options
            ├── Social Media Buttons
            └── Copy Link Button
```

### Data Flow

1. User clicks Share Button
2. Component checks for Native Share API support
3. If supported → Trigger native share with formatted content
4. If not supported → Open ShareModal with manual options
5. User selects share method
6. Analytics event logged
7. Share action executed (open social window or copy to clipboard)

## Components and Interfaces

### 1. ShareButton Component

**Location:** `components/share-button.tsx`

**Props Interface:**
```typescript
interface ShareButtonProps {
  currency: string;
  rate: number;
  widgetType: 'rates' | 'converter' | 'chart';
  trend?: 'up' | 'down' | 'stable'; // Optional, for chart widget
}
```

**Responsibilities:**
- Render share icon button
- Detect Native Share API support
- Generate share content and URL
- Handle share button click
- Manage ShareModal visibility state
- Send analytics events

**Visual Design:**
- Icon: Share arrow icon (from lucide-react)
- Size: 32x32px button with 44x44px touch target
- Position: Widget footer, right side
- Tooltip: "Share rate" on hover
- Colors: Inherit from widget theme (light/dark mode)

### 2. ShareModal Component

**Location:** `components/share-modal.tsx`

**Props Interface:**
```typescript
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareText: string;
  currency: string;
  rate: number;
}
```

**Responsibilities:**
- Display modal overlay
- Render social media share buttons
- Handle copy to clipboard
- Provide visual feedback for actions
- Close on backdrop click or close button

**Visual Design:**
- Modal: Centered, 320px width, rounded corners
- Backdrop: Semi-transparent overlay
- Buttons: Grid layout (2x2) for social platforms
- Copy button: Full width at bottom
- Icons: Platform logos (Twitter, Facebook, WhatsApp, Telegram)
- Animation: Fade in/out transition

### 3. Share Content Generator

**Location:** `lib/share-utils.ts`

**Functions:**
```typescript
interface ShareContent {
  text: string;
  url: string;
  title: string;
}

function generateShareContent(
  currency: string,
  rate: number,
  widgetType: string,
  trend?: string
): ShareContent;

function generateShareUrl(
  currency: string,
  rate: number
): string;

function getSocialShareUrl(
  platform: 'twitter' | 'facebook' | 'whatsapp' | 'telegram',
  shareContent: ShareContent
): string;
```

**Share Text Format:**
```
Rates widget: "USD/NGN: ₦1,620 (Black Market) via NairaMet"
Converter widget: "Convert NGN to USD at ₦1,620 via NairaMet"
Chart widget: "USD/NGN: ₦1,620 (↑ Up 2.3%) via NairaMet"
```

**Share URL Format:**
```
https://nairamet.com/?ref=widget&currency=USD&rate=1620
```

## Data Models

### Share Event Analytics

```typescript
interface ShareEvent {
  eventType: 'share_initiated' | 'share_completed' | 'link_copied';
  widgetType: 'rates' | 'converter' | 'chart';
  currency: string;
  rate: number;
  platform?: 'native' | 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'copy';
  timestamp: Date;
}
```

### Native Share API Data

```typescript
interface NativeShareData {
  title: string;
  text: string;
  url: string;
}
```

## Implementation Details

### Native Share API Detection

```typescript
const canShare = () => {
  return typeof navigator !== 'undefined' && 
         navigator.share !== undefined;
};
```

### Social Media Share URLs

**Twitter:**
```
https://twitter.com/intent/tweet?text={encodedText}&url={encodedUrl}
```

**Facebook:**
```
https://www.facebook.com/sharer/sharer.php?u={encodedUrl}&quote={encodedText}
```

**WhatsApp:**
```
https://wa.me/?text={encodedTextWithUrl}
```

**Telegram:**
```
https://t.me/share/url?url={encodedUrl}&text={encodedText}
```

### Copy to Clipboard

```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}
```

### Widget Integration Points

**Rates Widget:**
- Add ShareButton in footer section
- Pass current black market rate
- No trend data needed

**Converter Widget:**
- Add ShareButton in footer section
- Pass current black market rate
- Share text mentions conversion capability

**Chart Widget:**
- Add ShareButton in footer section
- Pass current black market rate
- Include trend direction in share text

## Error Handling

### Native Share API Errors

```typescript
try {
  await navigator.share(shareData);
  logAnalytics('share_completed', { platform: 'native' });
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled, no action needed
    return;
  }
  // Fall back to modal
  setShowModal(true);
}
```

### Clipboard Errors

- Show error toast if copy fails
- Provide manual selection fallback
- Log error for debugging

### Iframe Restrictions

- Detect iframe context
- Skip native share in restricted iframes
- Always use modal fallback in iframes

### Network Errors

- Analytics failures should not block sharing
- Use fire-and-forget for analytics
- Queue events if endpoint unavailable

## Testing Strategy

### Unit Tests

**ShareButton Component:**
- Renders correctly with all props
- Detects Native Share API support
- Generates correct share content
- Handles click events
- Opens modal when native share unavailable

**ShareModal Component:**
- Renders with correct share options
- Generates correct social media URLs
- Copies to clipboard successfully
- Closes on backdrop click
- Provides visual feedback

**Share Utils:**
- Generates correct share text for each widget type
- Formats rates with proper symbols and separators
- Creates valid share URLs
- Encodes special characters correctly

### Integration Tests

**Widget Integration:**
- Share button appears in all widget types
- Share button positioned correctly
- Share content includes current rate data
- Modal opens and closes properly
- Social media windows open with correct URLs

**Cross-Browser:**
- Native share works on supported browsers
- Fallback modal works on all browsers
- Clipboard API works or falls back gracefully
- Iframe restrictions handled correctly

### Manual Testing Checklist

- [ ] Test on iOS Safari (native share)
- [ ] Test on Android Chrome (native share)
- [ ] Test on desktop Chrome (modal fallback)
- [ ] Test on desktop Firefox (modal fallback)
- [ ] Test on desktop Safari (modal fallback)
- [ ] Verify share text formatting
- [ ] Verify share URLs are valid
- [ ] Test copy to clipboard
- [ ] Test all social media platforms
- [ ] Verify analytics events fire
- [ ] Test in iframe context
- [ ] Test dark mode appearance
- [ ] Test mobile touch targets
- [ ] Test keyboard accessibility

## Performance Considerations

### Bundle Size

- Use existing lucide-react icons (no new dependencies)
- Share modal lazy loaded (only when needed)
- Total added bundle size: < 5KB

### Runtime Performance

- Share button renders with widget (no lazy load)
- Modal component conditionally rendered
- Analytics events fire asynchronously
- No impact on widget load time

### Network Requests

- No additional API calls for share feature
- Analytics events batched if possible
- Share URLs are client-side generated

## Accessibility

### Keyboard Navigation

- Share button focusable with Tab key
- Enter/Space activates share button
- Modal trappable focus
- Escape key closes modal
- Social buttons keyboard accessible

### Screen Readers

- Share button has aria-label: "Share exchange rate"
- Modal has aria-labelledby and aria-describedby
- Social buttons have descriptive labels
- Copy button announces success state

### Touch Targets

- Minimum 44x44px touch targets
- Adequate spacing between buttons
- Visual feedback on touch/click

## Security Considerations

### URL Encoding

- All user-generated content URL encoded
- Prevent XSS through share text
- Validate currency codes

### Iframe Security

- Respect iframe sandbox restrictions
- Handle postMessage if needed for analytics
- No sensitive data in share URLs

### Privacy

- No personal data in share content
- Analytics events anonymized
- Share URLs contain only public rate data

## Dark Mode Support

- Share button icon adapts to theme
- Modal background respects theme
- Social buttons maintain contrast
- Tooltip readable in both modes

## Mobile Responsiveness

- Share button scales appropriately
- Modal fits mobile screens
- Touch targets meet minimum size
- Native share preferred on mobile

## Analytics Implementation

### Events to Track

1. **share_initiated**
   - Triggered: Share button clicked
   - Data: widgetType, currency, rate

2. **share_completed**
   - Triggered: Share action completed
   - Data: widgetType, currency, rate, platform

3. **link_copied**
   - Triggered: Copy link button clicked
   - Data: widgetType, currency, rate

### Analytics Endpoint

```typescript
async function logShareEvent(event: ShareEvent): Promise<void> {
  try {
    await fetch('/api/analytics/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    // Silent fail, don't block user action
    console.error('Analytics error:', error);
  }
}
```

## Future Enhancements

- Email share option
- LinkedIn share option
- QR code generation for mobile sharing
- Share rate history (7-day chart)
- Customizable share text templates
- Share to clipboard as image
- Deep linking to specific widget types
