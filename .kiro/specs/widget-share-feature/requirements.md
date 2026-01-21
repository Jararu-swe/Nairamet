# Requirements Document

## Introduction

This document outlines the requirements for adding a share functionality to the NairaMet currency widgets. The feature will enable users to share current exchange rate information across various platforms including social media, messaging apps, and via direct links. The share feature will be integrated into all three existing widget types (rates, converter, and chart) and will generate shareable content that includes the current rate, currency pair, and a link back to NairaMet.

## Glossary

- **Widget System**: The embeddable iframe components that display currency exchange rates (rates, converter, and chart types)
- **Share Button**: A clickable UI element that triggers the share functionality
- **Share Modal**: A dialog interface that presents sharing options to the user
- **Share Content**: The formatted text and data that is shared, including rate information and NairaMet branding
- **Native Share API**: The browser's built-in Web Share API for mobile and supported desktop browsers
- **Fallback Share Options**: Manual sharing methods (copy link, social media buttons) when Native Share API is unavailable
- **Share URL**: A unique URL that includes currency and rate information for sharing
- **Rate Snapshot**: The current exchange rate data at the moment of sharing

## Requirements

### Requirement 1

**User Story:** As a website visitor viewing a NairaMet widget, I want to share the current exchange rate with others, so that I can inform friends, colleagues, or social media followers about currency rates.

#### Acceptance Criteria

1. WHEN the Widget System loads, THE Widget System SHALL display a share button on all three widget types (rates, converter, chart)
2. WHEN a user clicks the share button, THE Widget System SHALL detect browser capabilities and present appropriate sharing options
3. THE Widget System SHALL format Share Content to include the currency pair, current black market rate, and a link to NairaMet
4. WHERE Native Share API is supported, THE Widget System SHALL trigger the native share dialog with pre-populated Share Content
5. IF Native Share API is not available, THEN THE Widget System SHALL display a Share Modal with manual sharing options

### Requirement 2

**User Story:** As a mobile user, I want to use my device's native share functionality, so that I can quickly share rates through my preferred apps without extra steps.

#### Acceptance Criteria

1. WHEN a user clicks the share button on a mobile device, THE Widget System SHALL invoke the Native Share API
2. THE Native Share API SHALL include the Share URL, formatted rate text, and currency information
3. THE Widget System SHALL handle Native Share API errors gracefully and fall back to the Share Modal
4. WHEN the native share completes successfully, THE Widget System SHALL close the share interface without additional user action

### Requirement 3

**User Story:** As a desktop user without native share support, I want multiple sharing options in a modal, so that I can choose my preferred method to share exchange rates.

#### Acceptance Criteria

1. WHEN the Share Modal opens, THE Share Modal SHALL display buttons for Twitter, Facebook, WhatsApp, and Telegram
2. WHEN a user clicks a social media button, THE Widget System SHALL open a new window with the platform's share URL pre-populated with Share Content
3. THE Share Modal SHALL include a "Copy Link" button that copies the Share URL to the clipboard
4. WHEN the user clicks "Copy Link", THE Widget System SHALL provide visual feedback confirming the copy action
5. THE Share Modal SHALL include a close button that dismisses the modal without sharing

### Requirement 4

**User Story:** As a user sharing a rate, I want the shared content to be informative and branded, so that recipients understand the context and source of the information.

#### Acceptance Criteria

1. THE Share Content SHALL include the currency pair in the format "USD/NGN" or equivalent
2. THE Share Content SHALL include the current black market rate formatted with the Naira symbol and thousand separators
3. THE Share Content SHALL include the text "via NairaMet" or equivalent branding
4. THE Share URL SHALL direct recipients to the NairaMet main site or a dedicated landing page
5. WHERE the widget type is "chart", THE Share Content SHALL include the 7-day trend direction (up, down, or stable)

### Requirement 5

**User Story:** As a widget embedder, I want the share feature to work seamlessly within iframes, so that my website visitors can share rates without technical issues.

#### Acceptance Criteria

1. THE Widget System SHALL handle iframe security restrictions when accessing the Native Share API
2. WHERE iframe restrictions prevent native sharing, THE Widget System SHALL automatically use the Share Modal fallback
3. THE Widget System SHALL open social media share windows with appropriate target attributes to avoid iframe navigation issues
4. THE Widget System SHALL ensure the Share Button does not interfere with existing widget layout or functionality
5. THE Share Button SHALL be visually consistent with the existing widget design system

### Requirement 6

**User Story:** As a user, I want the share button to be easily discoverable but not intrusive, so that I can access it when needed without it cluttering the widget interface.

#### Acceptance Criteria

1. THE Share Button SHALL be positioned in the widget footer area alongside the "Powered by NairaMet" branding
2. THE Share Button SHALL use an icon (share/arrow icon) that is universally recognizable
3. WHEN a user hovers over the Share Button, THE Widget System SHALL display a tooltip with the text "Share rate"
4. THE Share Button SHALL have a minimum touch target size of 44x44 pixels for mobile accessibility
5. THE Share Button SHALL maintain visibility in both light and dark mode themes

### Requirement 7

**User Story:** As a developer, I want share analytics to be tracked, so that I can understand how users engage with the share feature.

#### Acceptance Criteria

1. WHEN a user clicks the Share Button, THE Widget System SHALL log a share initiation event
2. WHEN a user completes a share action (native or social media), THE Widget System SHALL log a share completion event with the platform type
3. WHEN a user copies the Share URL, THE Widget System SHALL log a copy link event
4. THE Widget System SHALL include the widget type (rates, converter, chart) and currency in share event data
5. THE Widget System SHALL send analytics events to the existing tracking endpoint without blocking the share action
