"use client";

import { AdcashAd } from "./adcash-ad";

interface SkyscraperAdProps {
  zoneId: string;
  network?: "adcash" | "bidvertiser";
  publisherId?: string;
  className?: string;
}

/**
 * 160x600 Skyscraper Ad Component
 * Vertical banner ad format - typically placed on the right sidebar
 */
export function SkyscraperAd({
  zoneId,
  network = "adcash",
  publisherId,
  className = "",
}: SkyscraperAdProps) {
  if (network !== "adcash") return null;

  return (
    <div className={`skyscraper-ad-wrapper ${className}`}>
      <AdcashAd 
        zoneId={zoneId} 
        width={160} 
        height={600} 
      />
    </div>
  );
}

/**
 * Sticky Skyscraper - Stays visible on scroll (desktop only)
 */
export function StickySkyscraperAd({
  zoneId,
  network = "adcash",
  publisherId,
}: {
  zoneId: string;
  network?: "adcash" | "bidvertiser";
  publisherId?: string;
}) {
  return (
    <div className="hidden xl:block sticky top-20">
      <SkyscraperAd
        zoneId={zoneId}
        network={network}
        publisherId={publisherId}
      />
    </div>
  );
}
