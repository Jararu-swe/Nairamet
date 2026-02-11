"use client";

import { AdcashAd } from "./adcash-ad";

interface LeaderboardAdProps {
  zoneId: string;
  network?: "adcash" | "bidvertiser" | "adsense";
  publisherId?: string;
  className?: string;
}

/**
 * 728x90 Leaderboard Banner Ad Component
 * Standard desktop banner ad format
 */
export function LeaderboardAd({
  zoneId,
  network = "adcash",
  publisherId,
  className = "",
}: LeaderboardAdProps) {
  if (network !== "adcash") return null;

  return (
    <div className={`leaderboard-ad-wrapper w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <AdcashAd 
            zoneId={zoneId} 
            width={728} 
            height={90} 
          />
        </div>
      </div>
    </div>
  );
}
