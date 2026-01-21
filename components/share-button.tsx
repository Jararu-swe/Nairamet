"use client"

import * as React from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ShareModal } from "@/components/share-modal"
import {
  generateShareContent,
  canShare,
  type WidgetType,
  type TrendDirection,
} from "@/lib/share-utils"
import { cn } from "@/lib/utils"

export interface ShareButtonProps {
  currency: string
  rate: number
  widgetType: WidgetType
  trend?: TrendDirection
  className?: string
}

/**
 * ShareButton component provides a share button for widget content.
 * It detects Native Share API support and falls back to a modal when unavailable.
 * Handles iframe restrictions automatically.
 */
export function ShareButton({
  currency,
  rate,
  widgetType,
  trend,
  className,
}: ShareButtonProps) {
  const [showModal, setShowModal] = React.useState(false)
  const [isInIframe, setIsInIframe] = React.useState(false)
  const [hasNativeShare, setHasNativeShare] = React.useState(false)

  // Detect iframe context and Native Share API support on mount
  React.useEffect(() => {
    // Check if running in iframe
    try {
      setIsInIframe(window.self !== window.top)
    } catch (e) {
      // If we can't access window.top due to cross-origin, we're in an iframe
      setIsInIframe(true)
    }

    // Check for Native Share API support
    // Skip native share in iframes due to potential restrictions
    if (!isInIframe) {
      setHasNativeShare(canShare())
    }
  }, [])

  /**
   * Handles the share button click
   * Tries native share first (if available and not in iframe), falls back to modal
   * Includes comprehensive error handling for all edge cases
   */
  const handleShare = async () => {
    // Validate input data before attempting to share
    const shareContent = generateShareContent(currency, rate, widgetType, trend)

    // Log share initiation
    logShareEvent('share_initiated')

    // Try native share if available and not in iframe
    if (hasNativeShare && !isInIframe) {
      try {
        await navigator.share({
          title: shareContent.title,
          text: shareContent.text,
          url: shareContent.url,
        })
        
        // Log analytics for successful native share
        logShareEvent('share_completed', 'native')
      } catch (error: any) {
        // User cancelled the share (AbortError) - handle silently
        if (error.name === 'AbortError') {
          // User intentionally cancelled, no action needed
          return
        }
        
        // NotAllowedError - permission denied
        if (error.name === 'NotAllowedError') {
          console.warn('Share permission denied by user')
          setShowModal(true)
          return
        }
        
        // Other errors - fall back to modal
        console.error('Native share failed:', error)
        setShowModal(true)
      }
    } else {
      // No native share or in iframe - use modal
      setShowModal(true)
    }
  }

  /**
   * Logs share analytics events
   * Handles network failures gracefully without blocking user actions
   */
  const logShareEvent = (
    eventType: 'share_initiated' | 'share_completed',
    platform?: string
  ) => {
    // Fire-and-forget analytics - don't block user action
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    fetch('/api/analytics/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        widgetType,
        currency,
        rate,
        platform,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    })
      .then(() => clearTimeout(timeoutId))
      .catch((error) => {
        clearTimeout(timeoutId)
        // Silent fail - analytics shouldn't block functionality
        // Only log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics error:', error)
        }
      })
  }

  const shareContent = generateShareContent(currency, rate, widgetType, trend)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className={cn(
              // Base styling matching widget design system
              "h-8 w-8 rounded-md transition-colors",
              // Light mode - subtle gray hover matching widget footer
              "hover:bg-gray-100 text-gray-600",
              // Dark mode - matching widget dark theme with proper contrast
              "dark:hover:bg-gray-700 dark:text-gray-400",
              // Ensure 44x44px touch target for mobile accessibility (WCAG 2.1 Level AAA)
              "touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]",
              // Focus visible state for keyboard navigation
              "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
              "dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-800",
              className
            )}
            aria-label="Share exchange rate"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          sideOffset={4}
          className="text-xs bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
        >
          <p>Share rate</p>
        </TooltipContent>
      </Tooltip>

      {/* Noscript fallback for graceful degradation when JavaScript is disabled */}
      <noscript>
        <a
          href={shareContent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="View exchange rate on NairaMet"
          title="View rate"
        >
          <Share2 className="h-4 w-4" />
        </a>
      </noscript>

      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        shareUrl={shareContent.url}
        shareText={shareContent.text}
        shareTitle={shareContent.title}
        currency={currency}
        rate={rate}
        widgetType={widgetType}
      />
    </>
  )
}
