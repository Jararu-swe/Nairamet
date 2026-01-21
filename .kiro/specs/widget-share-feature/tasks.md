# Implementation Plan

- [x] 1. Create share utility functions
  - Create `lib/share-utils.ts` with share content generation functions
  - Implement `generateShareContent()` to format share text for each widget type
  - Implement `generateShareUrl()` to create shareable URLs with currency and rate parameters
  - Implement `getSocialShareUrl()` to generate platform-specific share URLs for Twitter, Facebook, WhatsApp, and Telegram
  - Implement `canShare()` to detect Native Share API support
  - Add URL encoding for all user-generated content
  - _Requirements: 1.3, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Create ShareModal component
  - [x] 2.1 Build modal UI structure
    - Create `components/share-modal.tsx` with modal overlay and content container
    - Implement modal backdrop with click-to-close functionality
    - Add close button with icon in modal header
    - Style modal with rounded corners, shadow, and responsive width (320px)
    - Ensure modal centers on screen and handles overflow
    - _Requirements: 3.1, 3.5, 5.3_

  - [x] 2.2 Add social media share buttons
    - Create grid layout (2x2) for social platform buttons
    - Add Twitter share button with icon and label
    - Add Facebook share button with icon and label
    - Add WhatsApp share button with icon and label
    - Add Telegram share button with icon and label
    - Implement click handlers that open share URLs in new windows with appropriate target attributes
    - _Requirements: 3.1, 3.2, 5.3_

  - [x] 2.3 Implement copy to clipboard functionality
    - Add "Copy Link" button at bottom of modal
    - Implement `copyToClipboard()` function with Clipboard API
    - Add fallback copy method using textarea selection for older browsers
    - Show success toast/feedback when copy succeeds
    - Handle copy errors gracefully with user feedback
    - _Requirements: 3.3, 3.4_

  - [x] 2.4 Add modal animations and accessibility
    - Implement fade-in/out transitions for modal appearance
    - Add focus trap to keep keyboard navigation within modal
    - Implement Escape key handler to close modal
    - Add aria-labelledby and aria-describedby attributes
    - Ensure all buttons have descriptive aria-labels
    - Test keyboard navigation through all interactive elements
    - _Requirements: 3.5, 6.3_

- [x] 3. Create ShareButton component
  - [x] 3.1 Build share button UI
    - Create `components/share-button.tsx` with button and icon
    - Use Share icon from lucide-react library
    - Style button to match widget theme (32x32px with 44x44px touch target)
    - Add hover state with tooltip showing "Share rate"
    - Ensure button works in both light and dark modes
    - _Requirements: 1.1, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.2 Implement share logic
    - Accept props: currency, rate, widgetType, and optional trend
    - Detect Native Share API support on component mount
    - Generate share content using utility functions
    - Implement click handler that triggers native share or opens modal
    - Handle native share errors and fall back to modal
    - Manage ShareModal visibility state
    - _Requirements: 1.2, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

  - [x] 3.3 Handle iframe restrictions
    - Detect if component is running inside an iframe
    - Skip native share API in restricted iframe contexts
    - Always use modal fallback when iframe restrictions detected
    - Ensure social media windows open correctly from iframes
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Integrate ShareButton into widget components
  - [x] 4.1 Add to rates widget
    - Import ShareButton component in `app/widget/[type]/page.tsx`
    - Add ShareButton to footer section of rates widget
    - Pass currency and blackMarket rate as props
    - Position button on right side of footer next to branding
    - Verify layout doesn't break with new button
    - _Requirements: 1.1, 5.4, 5.5, 6.1_

  - [x] 4.2 Add to converter widget
    - Add ShareButton to footer section of converter widget
    - Pass currency and blackMarket rate as props
    - Use widgetType="converter" prop
    - Ensure button doesn't interfere with converter input/output
    - _Requirements: 1.1, 5.4, 5.5, 6.1_

  - [x] 4.3 Add to chart widget
    - Add ShareButton to footer section of chart widget
    - Pass currency, blackMarket rate, and trend direction as props
    - Use widgetType="chart" prop
    - Verify trend data is included in share content
    - _Requirements: 1.1, 4.5, 5.4, 5.5, 6.1_

- [x] 5. Implement analytics tracking
  - [x] 5.1 Create analytics API endpoint
    - Create `app/api/analytics/share/route.ts` for share event tracking
    - Accept POST requests with ShareEvent data
    - Validate event data structure
    - Store events in database or logging service
    - Return success response without blocking
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Add analytics to ShareButton
    - Log 'share_initiated' event when share button is clicked
    - Log 'share_completed' event when native share succeeds
    - Log 'share_completed' event when social media button is clicked
    - Log 'link_copied' event when copy link succeeds
    - Include widgetType, currency, rate, and platform in all events
    - Use fire-and-forget pattern to avoid blocking user actions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Add error handling and edge cases
  - Handle Native Share API AbortError (user cancellation) silently
  - Handle clipboard API failures with user-friendly error messages
  - Validate currency codes before generating share content
  - Handle missing or invalid rate data gracefully
  - Test and handle network failures for analytics endpoint
  - Ensure share feature works when JavaScript is disabled (graceful degradation)
  - _Requirements: 1.3, 2.3, 3.4, 5.1, 5.2_

- [x] 7. Style and theme integration
  - Ensure ShareButton matches existing widget design system
  - Verify dark mode support for all share components
  - Test button and modal appearance in both light and dark themes
  - Ensure proper contrast ratios for accessibility
  - Verify responsive behavior on mobile devices
  - Test touch targets meet 44x44px minimum size
  - _Requirements: 5.5, 6.4, 6.5_

- [x] 8. Testing and validation
  - [x] 8.1 Write component tests
    - Write unit tests for share utility functions
    - Write tests for ShareButton component rendering and behavior
    - Write tests for ShareModal component interactions
    - Test Native Share API detection logic
    - Test clipboard copy functionality with mocks
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

  - [x] 8.2 Perform cross-browser testing
    - Test native share on iOS Safari
    - Test native share on Android Chrome
    - Test modal fallback on desktop Chrome, Firefox, and Safari
    - Verify social media share URLs open correctly
    - Test copy to clipboard on all browsers
    - Verify iframe behavior and restrictions
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3_

  - [x] 8.3 Validate accessibility
    - Test keyboard navigation through share button and modal
    - Verify screen reader announcements for all interactive elements
    - Test focus trap in modal
    - Verify Escape key closes modal
    - Test touch targets on mobile devices
    - Validate ARIA attributes and labels
    - _Requirements: 6.3, 6.4_

  - [x] 8.4 Test analytics tracking


    - [x] Created comprehensive test suite for analytics API endpoint (`app/api/analytics/share/route.test.ts`)
      - Tests for all valid event types (share_initiated, share_completed, link_copied)
      - Tests for all valid widget types and platforms
      - Validation tests for invalid data, missing fields, and malformed JSON
      - Platform data accuracy tests
      - Error handling and response format validation
      - Non-blocking behavior verification
    - [x] Created tests for ShareButton analytics (`components/share-button.test.tsx`)
      - Verify share_initiated events fire on button click
      - Verify share_completed events with native platform data
      - Test AbortError handling (user cancellation)
      - Verify analytics don't block user actions or modal display
      - Test network failures and timeouts
      - Test fire-and-forget pattern with 5 second timeout
      - Track events for different widget types, currencies, and rates
      - Test rapid consecutive clicks
    - [x] Created tests for ShareModal analytics (`components/share-modal.test.tsx`)
      - Verify share_completed events for each social platform (Twitter, Facebook, WhatsApp, Telegram)
      - Verify link_copied events on copy button click
      - Platform data accuracy across different currencies and rates
      - Test both Clipboard API and fallback methods
      - Verify analytics don't block user actions
      - Network failure and timeout handling
      - Multiple event tracking in same session
      - Edge cases: popup blocked, rapid clicks, ISO timestamp format
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
