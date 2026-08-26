"use client";

import { AdSenseAd } from "./adsense-ad";

interface LeaderboardAdProps {
  slot?: string;
  className?: string;
}

/**
 * 728x90 Leaderboard Ad Component (Google AdSense)
 * Returns null when not configured (zero placeholder footprint).
 */
export function LeaderboardAd({ slot, className = "" }: LeaderboardAdProps) {
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT;
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !slotId) return null;

  return (
    <div className={`leaderboard-ad-wrapper w-full flex justify-center my-6 ${className}`}>
      <AdSenseAd slot={slotId} format="horizontal" />
    </div>
  );
}
