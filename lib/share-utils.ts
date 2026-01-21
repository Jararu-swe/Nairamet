/**
 * Share utility functions for NairaMet widget share feature
 */

export interface ShareContent {
  text: string;
  url: string;
  title: string;
}

export type WidgetType = 'rates' | 'converter' | 'chart';
export type SocialPlatform = 'twitter' | 'facebook' | 'whatsapp' | 'telegram';
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Validates if a currency code is valid (3 uppercase letters)
 */
export function isValidCurrencyCode(currency: string): boolean {
  if (!currency || typeof currency !== 'string') {
    return false;
  }
  // Currency codes should be 3 uppercase letters (ISO 4217 standard)
  return /^[A-Z]{3}$/.test(currency.trim());
}

/**
 * Validates if a rate is valid (positive number)
 */
export function isValidRate(rate: number): boolean {
  return typeof rate === 'number' && 
         !isNaN(rate) && 
         isFinite(rate) && 
         rate > 0;
}

/**
 * Formats a rate with Naira symbol and thousand separators
 * Returns a fallback string if rate is invalid
 */
function formatRate(rate: number): string {
  if (!isValidRate(rate)) {
    return '₦--';
  }
  return `₦${rate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Generates share content based on widget type, currency, and rate
 * Validates input data and provides fallback content for invalid data
 */
export function generateShareContent(
  currency: string,
  rate: number,
  widgetType: WidgetType,
  trend?: TrendDirection
): ShareContent {
  // Validate and sanitize currency code
  const sanitizedCurrency = currency?.trim().toUpperCase() || 'USD';
  const validCurrency = isValidCurrencyCode(sanitizedCurrency) ? sanitizedCurrency : 'USD';
  
  // Validate rate
  const validRate = isValidRate(rate) ? rate : 0;
  const formattedRate = formatRate(validRate);
  const shareUrl = generateShareUrl(validCurrency, validRate);
  
  let text: string;
  let title: string;

  // Handle invalid rate case
  if (!isValidRate(rate)) {
    text = `Check current ${validCurrency}/NGN exchange rate on NairaMet`;
    title = `${validCurrency} to NGN Exchange Rate`;
    return { text, url: shareUrl, title };
  }

  switch (widgetType) {
    case 'rates':
      text = `${validCurrency}/NGN: ${formattedRate} (Black Market) via NairaMet`;
      title = `${validCurrency} to NGN Exchange Rate`;
      break;
    
    case 'converter':
      text = `Convert NGN to ${validCurrency} at ${formattedRate} via NairaMet`;
      title = `Currency Converter - ${validCurrency}/NGN`;
      break;
    
    case 'chart':
      const trendEmoji = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
      const trendText = trend ? ` (${trendEmoji} ${trend})` : '';
      text = `${validCurrency}/NGN: ${formattedRate}${trendText} via NairaMet`;
      title = `${validCurrency} to NGN Rate Chart`;
      break;
    
    default:
      text = `${validCurrency}/NGN: ${formattedRate} via NairaMet`;
      title = `${validCurrency} Exchange Rate`;
  }

  return {
    text,
    url: shareUrl,
    title,
  };
}

/**
 * Generates a shareable URL with currency and rate parameters
 * Validates and sanitizes input data
 */
export function generateShareUrl(currency: string, rate: number): string {
  const baseUrl = 'https://nairamet.com';
  
  // Validate and sanitize inputs
  const sanitizedCurrency = currency?.trim().toUpperCase() || 'USD';
  const validCurrency = isValidCurrencyCode(sanitizedCurrency) ? sanitizedCurrency : 'USD';
  const validRate = isValidRate(rate) ? rate : 0;
  
  try {
    const params = new URLSearchParams({
      ref: 'widget',
      currency: validCurrency, // Already validated, no need for extra encoding
      rate: validRate.toString(),
    });
    
    return `${baseUrl}?${params.toString()}`;
  } catch (error) {
    // Fallback to base URL if URL construction fails
    console.error('Failed to generate share URL:', error);
    return baseUrl;
  }
}

/**
 * Generates platform-specific share URLs for social media
 * Handles encoding errors gracefully
 */
export function getSocialShareUrl(
  platform: SocialPlatform,
  shareContent: ShareContent
): string {
  try {
    // Validate share content
    if (!shareContent || !shareContent.text || !shareContent.url) {
      throw new Error('Invalid share content');
    }

    const encodedText = encodeURIComponent(shareContent.text);
    const encodedUrl = encodeURIComponent(shareContent.url);
    const encodedTitle = encodeURIComponent(shareContent.title || '');

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      
      case 'whatsapp':
        const whatsappText = encodeURIComponent(`${shareContent.text} ${shareContent.url}`);
        return `https://wa.me/?text=${whatsappText}`;
      
      case 'telegram':
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Failed to generate ${platform} share URL:`, error);
    // Return a safe fallback URL
    return shareContent?.url || 'https://nairamet.com';
  }
}

/**
 * Detects if the Native Share API is supported in the current browser
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function';
}
