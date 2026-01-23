"use client"

import * as React from "react"
import { X, Twitter, Facebook, MessageCircle, Send, Link2, Check } from "lucide-react"
import { getSocialShareUrl, type ShareContent, type SocialPlatform } from "@/lib/share-utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  shareText: string
  shareTitle: string
  currency: string
  rate: number
  widgetType: 'rates' | 'converter' | 'chart'
}

/**
 * ShareModal component provides social media sharing options and copy-to-clipboard functionality
 * when the Native Share API is not available or fails.
 */
export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  shareText,
  shareTitle,
  currency,
  rate,
  widgetType,
}: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  // Reset copied state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCopied(false)
      setIsClosing(false)
    }
  }, [isOpen])

  // Focus trap and escape key handler
  React.useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const shareContent: ShareContent = {
    text: shareText,
    url: shareUrl,
    title: shareTitle,
  }

  /**
   * Logs share analytics events
   * Handles network failures gracefully without blocking user actions
   */
  const logShareEvent = (
    eventType: 'share_completed' | 'link_copied',
    platform?: 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'copy'
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

  const handleClose = () => {
    setIsClosing(true)
    onClose()
  }

  /**
   * Opens a social media share window with the appropriate URL
   * Includes comprehensive error handling for popup blockers and invalid URLs
   */
  const handleSocialShare = (platform: SocialPlatform) => {
    try {
      const url = getSocialShareUrl(platform, shareContent)
      
      // Validate URL before attempting to open
      if (!url || url === 'https://nairamet.com') {
        throw new Error('Invalid share URL generated')
      }
      
      // Open in new window with appropriate dimensions
      const width = 600
      const height = 400
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2
      
      const shareWindow = window.open(
        url,
        `share-${platform}`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      )

      // Check if popup was blocked
      if (!shareWindow || shareWindow.closed || typeof shareWindow.closed === 'undefined') {
        throw new Error('Popup blocked')
      }

      // Log analytics for social media share
      logShareEvent('share_completed', platform)
    } catch (error) {
      console.error(`Failed to open ${platform} share:`, error)
      
      // Provide user-friendly error message
      const errorMessage = error instanceof Error && error.message === 'Popup blocked'
        ? 'Please allow popups for this site to share on social media.'
        : `Could not open ${platform} share window. Please try again.`
      
      toast({
        title: "Share failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  /**
   * Copies the share URL to clipboard with fallback for older browsers
   * Includes comprehensive error handling and user-friendly feedback
   */
  const copyToClipboard = async () => {
    try {
      // Validate URL before copying
      if (!shareUrl || typeof shareUrl !== 'string') {
        throw new Error('Invalid share URL')
      }

      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        })
        
        // Log analytics for copy link
        logShareEvent('link_copied', 'copy')
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000)
        return
      }

      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = shareUrl
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      textarea.style.top = "0"
      textarea.style.opacity = "0"
      textarea.style.pointerEvents = "none"
      textarea.setAttribute('readonly', '')
      
      document.body.appendChild(textarea)
      
      // Select the text
      textarea.focus()
      textarea.select()
      
      // For iOS compatibility
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange()
        range.selectNodeContents(textarea)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
        textarea.setSelectionRange(0, 999999)
      }
      
      const success = document.execCommand("copy")
      document.body.removeChild(textarea)

      if (success) {
        setCopied(true)
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        })
        
        // Log analytics for copy link
        logShareEvent('link_copied', 'copy')
        
        setTimeout(() => setCopied(false), 2000)
      } else {
        throw new Error("Copy command failed")
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      
      // Provide user-friendly error message with actionable guidance
      const errorMessage = error instanceof Error && error.message === 'Invalid share URL'
        ? 'Unable to copy link. Please try refreshing the page.'
        : 'Could not copy link automatically. Please select and copy the link manually.'
      
      toast({
        title: "Copy failed",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Show the URL in the toast for manual copying as last resort
      if (shareUrl) {
        setTimeout(() => {
          toast({
            title: "Share URL",
            description: shareUrl,
            duration: 10000,
          })
        }, 500)
      }
    }
  }

  const socialButtons = [
    {
      platform: "twitter" as SocialPlatform,
      label: "Twitter",
      icon: Twitter,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] dark:hover:bg-[#1DA1F2]/30 dark:hover:text-[#1DA1F2]",
    },
    {
      platform: "facebook" as SocialPlatform,
      label: "Facebook",
      icon: Facebook,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] dark:hover:bg-[#1877F2]/30 dark:hover:text-[#1877F2]",
    },
    {
      platform: "whatsapp" as SocialPlatform,
      label: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366] dark:hover:bg-[#25D366]/30 dark:hover:text-[#25D366]",
    },
    {
      platform: "telegram" as SocialPlatform,
      label: "Telegram",
      icon: Send,
      color: "hover:bg-[#0088cc]/10 hover:text-[#0088cc] dark:hover:bg-[#0088cc]/30 dark:hover:text-[#0088cc]",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-[320px] p-0 gap-0",
          // Ensure proper background and text colors for both themes
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          // Proper border contrast
          "border-gray-200 dark:border-gray-700",
          // Fix centering in widget/iframe context
          "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
        )}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle 
            id="share-modal-title" 
            className="text-center text-gray-900 dark:text-gray-100"
          >
            Share Exchange Rate
          </DialogTitle>
          <DialogDescription 
            id="share-modal-description" 
            className="text-center text-gray-600 dark:text-gray-400"
          >
            {currency}/NGN: ₦{rate.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* Social Media Buttons Grid */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {socialButtons.map(({ platform, label, icon: Icon, color }) => (
              <Button
                key={platform}
                variant="outline"
                className={cn(
                  // Base styling with proper touch targets (min 44x44px)
                  "h-auto flex-col gap-2 py-4 min-h-[44px] transition-colors",
                  // Proper border and background for both themes
                  "border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-800",
                  "text-gray-700 dark:text-gray-300",
                  // Focus states for accessibility
                  "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  "dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-800",
                  color
                )}
                onClick={() => handleSocialShare(platform)}
                aria-label={`Share on ${label}`}
              >
                <Icon className="size-5" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 pt-4">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-center gap-2 min-h-[44px]",
              // Proper styling for both themes
              "border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              // Focus states
              "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
              "dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-800",
              // Success state styling
              copied && "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            )}
            onClick={copyToClipboard}
            aria-label="Copy share link to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="size-4" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
