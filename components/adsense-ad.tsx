"use client"

import { useEffect } from "react"

interface AdSenseAdProps {
  adSlot: string
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  fullWidthResponsive?: boolean
  className?: string
}

export function AdSenseAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  // Don't show ads if no client ID is configured
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}

// Predefined ad positions for consistency
export function TopBannerAd() {
  return (
    <AdSenseAd
      adSlot="1234567890" // Replace with your actual ad slot
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  )
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="1234567891" // Replace with your actual ad slot
      adFormat="vertical"
      fullWidthResponsive={false}
      className="sticky top-4"
    />
  )
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="1234567892" // Replace with your actual ad slot
      adFormat="fluid"
      className="my-6"
    />
  )
}

export function BottomBannerAd() {
  return (
    <AdSenseAd
      adSlot="1234567893" // Replace with your actual ad slot
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  )
}
