/**
 * NairaMet Push Notification Templates
 * Optimized messages for OneSignal push notifications
 */

interface PushNotificationData {
  currency: string;
  condition: 'above' | 'below';
  threshold: number;
  currentRate: number;
  rateType: 'cbn' | 'blackMarket' | 'remittance';
}

/**
 * Generate push notification title and message
 */
export function generatePushNotification(data: PushNotificationData) {
  const { currency, condition, threshold, currentRate, rateType } = data;
  
  const emoji = condition === 'above' ? '📈' : '📉';
  const conditionText = condition === 'above' ? 'Above' : 'Below';
  
  const rateTypeLabel = {
    cbn: 'CBN',
    blackMarket: 'Black Market',
    remittance: 'Remittance'
  }[rateType];

  const difference = Math.abs(currentRate - threshold);
  const percentChange = ((difference / threshold) * 100).toFixed(1);

  // Title: Short and attention-grabbing
  const title = `${emoji} ${currency}/NGN ${conditionText} ₦${threshold.toLocaleString()}`;

  // Message: Concise with key info
  const message = `${rateTypeLabel} rate now at ₦${currentRate.toLocaleString()} (${condition === 'above' ? '+' : '-'}${percentChange}%)`;

  // Subtitle: Additional context (for platforms that support it)
  const subtitle = `Your rate alert has been triggered`;

  return {
    title,
    message,
    subtitle,
    data: {
      currency,
      threshold,
      currentRate,
      rateType,
      condition,
      url: '/alerts',
    }
  };
}

/**
 * Generate test notification
 */
export function generateTestNotification() {
  return {
    title: '🔔 Test Notification - NairaMet',
    message: 'Push notifications are working! You\'ll receive alerts when your rate thresholds are reached.',
    subtitle: 'Test successful',
    data: {
      type: 'test',
      url: '/alerts',
    }
  };
}

/**
 * Generate welcome notification (when user first subscribes)
 */
export function generateWelcomeNotification() {
  return {
    title: '✅ Notifications Enabled - NairaMet',
    message: 'You\'ll now receive instant alerts when exchange rates hit your targets.',
    subtitle: 'Welcome to NairaMet Alerts',
    data: {
      type: 'welcome',
      url: '/alerts',
    }
  };
}
