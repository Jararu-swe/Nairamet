import { ReactNode } from "react"
import { InContentAd, BottomBannerAd } from "./adsense-ad"

interface PageWithAdsProps {
  children: ReactNode
  showTopAd?: boolean
  showBottomAd?: boolean
  className?: string
}

/**
 * Wrapper component that adds ads to pages in optimal positions
 * - Top ad: After header/title section
 * - Bottom ad: Before footer
 */
export function PageWithAds({
  children,
  showTopAd = true,
  showBottomAd = true,
  className = "",
}: PageWithAdsProps) {
  return (
    <div className={className}>
      {/* Top Ad - After page header */}
      {showTopAd && (
        <div className="w-full flex justify-center mb-6">
          <InContentAd />
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Bottom Ad - Before footer */}
      {showBottomAd && (
        <div className="w-full flex justify-center mt-8 mb-4">
          <BottomBannerAd />
        </div>
      )}
    </div>
  )
}
