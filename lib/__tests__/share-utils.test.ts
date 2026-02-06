import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateShareContent,
  generateShareUrl,
  getSocialShareUrl,
  canShare,
  isValidCurrencyCode,
  isValidRate,
  type ShareContent,
} from '../share-utils'

describe('share-utils', () => {
  describe('isValidCurrencyCode', () => {
    it('should return true for valid 3-letter uppercase currency codes', () => {
      expect(isValidCurrencyCode('USD')).toBe(true)
      expect(isValidCurrencyCode('EUR')).toBe(true)
      expect(isValidCurrencyCode('GBP')).toBe(true)
    })

    it('should return false for invalid currency codes', () => {
      expect(isValidCurrencyCode('US')).toBe(false)
      expect(isValidCurrencyCode('USDD')).toBe(false)
      expect(isValidCurrencyCode('usd')).toBe(false)
      expect(isValidCurrencyCode('123')).toBe(false)
      expect(isValidCurrencyCode('')).toBe(false)
    })

    it('should handle null and undefined', () => {
      expect(isValidCurrencyCode(null as any)).toBe(false)
      expect(isValidCurrencyCode(undefined as any)).toBe(false)
    })
  })

  describe('isValidRate', () => {
    it('should return true for valid positive numbers', () => {
      expect(isValidRate(1620)).toBe(true)
      expect(isValidRate(0.5)).toBe(true)
      expect(isValidRate(1000000)).toBe(true)
    })

    it('should return false for invalid rates', () => {
      expect(isValidRate(0)).toBe(false)
      expect(isValidRate(-100)).toBe(false)
      expect(isValidRate(NaN)).toBe(false)
      expect(isValidRate(Infinity)).toBe(false)
      expect(isValidRate(-Infinity)).toBe(false)
    })

    it('should handle non-number types', () => {
      expect(isValidRate('1620' as any)).toBe(false)
      expect(isValidRate(null as any)).toBe(false)
      expect(isValidRate(undefined as any)).toBe(false)
    })
  })

  describe('generateShareContent', () => {
    it('should generate correct content for rates widget', () => {
      const result = generateShareContent('USD', 1620, 'rates')
      
      expect(result.text).toBe('USD/NGN: ₦1,620 (Black Market) via NairaMet')
      expect(result.title).toBe('USD to NGN Exchange Rate')
      expect(result.url).toContain('nairamet.com')
      expect(result.url).toContain('currency=USD')
      expect(result.url).toContain('rate=1620')
    })

    it('should generate correct content for converter widget', () => {
      const result = generateShareContent('EUR', 1750.5, 'converter')
      
      expect(result.text).toBe('Convert between NGN and EUR at ₦1,750.5 via NairaMet')
      expect(result.title).toBe('Currency Converter - EUR/NGN')
      expect(result.url).toContain('currency=EUR')
    })

    it('should generate correct content for chart widget with trend', () => {
      const result = generateShareContent('GBP', 2100, 'chart', 'up')
      
      expect(result.text).toBe('GBP/NGN: ₦2,100 (↑ up) via NairaMet')
      expect(result.title).toBe('GBP to NGN Rate Chart')
    })

    it('should handle chart widget with down trend', () => {
      const result = generateShareContent('USD', 1620, 'chart', 'down')
      
      expect(result.text).toContain('↓ down')
    })

    it('should handle chart widget with stable trend', () => {
      const result = generateShareContent('USD', 1620, 'chart', 'stable')
      
      expect(result.text).toContain('→ stable')
    })

    it('should handle chart widget without trend', () => {
      const result = generateShareContent('USD', 1620, 'chart')
      
      expect(result.text).toBe('USD/NGN: ₦1,620 via NairaMet')
    })

    it('should sanitize and uppercase currency codes', () => {
      const result = generateShareContent('usd', 1620, 'rates')
      
      expect(result.text).toContain('USD/NGN')
      expect(result.url).toContain('currency=USD')
    })

    it('should handle invalid currency codes with fallback', () => {
      const result = generateShareContent('INVALID', 1620, 'rates')
      
      expect(result.text).toContain('USD/NGN')
      expect(result.url).toContain('currency=USD')
    })

    it('should handle invalid rate with fallback content', () => {
      const result = generateShareContent('USD', -100, 'rates')
      
      expect(result.text).toBe('Check current USD/NGN exchange rate on NairaMet')
      expect(result.title).toBe('USD to NGN Exchange Rate')
    })

    it('should format rates with thousand separators', () => {
      const result = generateShareContent('USD', 1620000, 'rates')
      
      expect(result.text).toContain('₦1,620,000')
    })

    it('should format decimal rates correctly', () => {
      const result = generateShareContent('USD', 1620.75, 'rates')
      
      expect(result.text).toContain('₦1,620.75')
    })
  })

  describe('generateShareUrl', () => {
    it('should generate valid URL with currency and rate parameters', () => {
      const url = generateShareUrl('USD', 1620)
      
      expect(url).toBe('https://nairamet.com?ref=widget&currency=USD&rate=1620')
    })

    it('should handle different currencies', () => {
      const url = generateShareUrl('EUR', 1750)
      
      expect(url).toContain('currency=EUR')
      expect(url).toContain('rate=1750')
    })

    it('should handle decimal rates', () => {
      const url = generateShareUrl('GBP', 2100.5)
      
      expect(url).toContain('rate=2100.5')
    })

    it('should sanitize currency codes', () => {
      const url = generateShareUrl('usd', 1620)
      
      expect(url).toContain('currency=USD')
    })

    it('should handle invalid currency with fallback', () => {
      const url = generateShareUrl('INVALID', 1620)
      
      expect(url).toContain('currency=USD')
    })

    it('should handle invalid rate with fallback', () => {
      const url = generateShareUrl('USD', -100)
      
      expect(url).toContain('rate=0')
    })

    it('should return base URL on error', () => {
      const url = generateShareUrl(null as any, NaN)
      
      expect(url).toBe('https://nairamet.com?ref=widget&currency=USD&rate=0')
    })
  })

  describe('getSocialShareUrl', () => {
    const shareContent: ShareContent = {
      text: 'USD/NGN: ₦1,620 (Black Market) via NairaMet',
      url: 'https://nairamet.com?ref=widget&currency=USD&rate=1620',
      title: 'USD to NGN Exchange Rate',
    }

    it('should generate Twitter share URL', () => {
      const url = getSocialShareUrl('twitter', shareContent)
      
      expect(url).toContain('twitter.com/intent/tweet')
      expect(url).toContain('text=')
      expect(url).toContain('url=')
    })

    it('should generate Facebook share URL', () => {
      const url = getSocialShareUrl('facebook', shareContent)
      
      expect(url).toContain('facebook.com/sharer/sharer.php')
      expect(url).toContain('u=')
      expect(url).toContain('quote=')
    })

    it('should generate WhatsApp share URL', () => {
      const url = getSocialShareUrl('whatsapp', shareContent)
      
      expect(url).toContain('wa.me')
      expect(url).toContain('text=')
    })

    it('should generate Telegram share URL', () => {
      const url = getSocialShareUrl('telegram', shareContent)
      
      expect(url).toContain('t.me/share/url')
      expect(url).toContain('url=')
      expect(url).toContain('text=')
    })

    it('should URL encode special characters', () => {
      const specialContent: ShareContent = {
        text: 'Test & Share #currency',
        url: 'https://nairamet.com?test=1&value=2',
        title: 'Test Title',
      }
      
      const url = getSocialShareUrl('twitter', specialContent)
      
      expect(url).toContain('%26') // & encoded
      expect(url).toContain('%23') // # encoded
    })

    it('should handle invalid share content gracefully', () => {
      const invalidContent = {
        text: '',
        url: '',
        title: '',
      }
      
      const url = getSocialShareUrl('twitter', invalidContent)
      
      expect(url).toBe('https://nairamet.com')
    })

    it('should handle null share content', () => {
      const url = getSocialShareUrl('twitter', null as any)
      
      expect(url).toBe('https://nairamet.com')
    })

    it('should return fallback URL for unsupported platform', () => {
      const url = getSocialShareUrl('invalid' as any, shareContent)
      
      expect(url).toBe(shareContent.url)
    })
  })

  describe('canShare', () => {
    beforeEach(() => {
      // Reset navigator mock before each test
      vi.unstubAllGlobals()
    })

    it('should return true when navigator.share is available', () => {
      vi.stubGlobal('navigator', {
        share: vi.fn(),
      })
      
      expect(canShare()).toBe(true)
    })

    it('should return false when navigator.share is not available', () => {
      vi.stubGlobal('navigator', {})
      
      expect(canShare()).toBe(false)
    })

    it('should return false when navigator is undefined', () => {
      vi.stubGlobal('navigator', undefined)
      
      expect(canShare()).toBe(false)
    })

    it('should return false when navigator.share is not a function', () => {
      vi.stubGlobal('navigator', {
        share: 'not a function',
      })
      
      expect(canShare()).toBe(false)
    })
  })
})
