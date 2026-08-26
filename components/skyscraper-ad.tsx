"use client";

import { AdSenseAd } from "./adsense-ad";

interface SkyscraperAdProps {
  slot?: string;
  className?: string;
}

/**
 * 160x600 Skyscraper Ad Component (Google AdSense)
 * Returns null when not configured (zero placeholder footprint).
 */
export function SkyscraperAd({ slot, className = "" }: SkyscraperAdProps) {
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_SKYSCRAPER_SLOT;
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !slotId) return null;

  return (
    <div className={`skyscraper-ad-wrapper my-4 flex justify-center ${className}`}>
      <AdSenseAd slot={slotId} format="vertical" />
    </div>
  );
}

export function StickySkyscraperAd({ slot }: { slot?: string }) {
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_SKYSCRAPER_SLOT;
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !slotId) return null;

  return (
    <div className="hidden xl:block sticky top-24">
      <SkyscraperAd slot={slotId} />
    </div>
  );
}
