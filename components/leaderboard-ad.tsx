"use client";

import { useEffect, useRef } from "react";

interface LeaderboardAdProps {
  zoneId: string;
  network?: "adcash" | "bidvertiser" | "adsense";
  publisherId?: string;
  className?: string;
}

/**
 * 728x90 Leaderboard Banner Ad Component
 * Standard desktop banner ad format
 * Banner renders inside the parent div of the script that calls runBanner
 * According to AdCash documentation
 */
export function LeaderboardAd({
  zoneId,
  network = "adcash",
  publisherId,
  className = "",
}: LeaderboardAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (network !== "adcash") return;
    if (!adContainerRef.current) return;

    // Wait a bit for aclib to load, then add the banner script
    const timeout = setTimeout(() => {
      if (!adContainerRef.current) return;

      try {
        // Create script element inside the container (AdCash exact format)
        // Banner renders inside the parent div of this script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `aclib.runBanner({\n    zoneId: '${zoneId}',\n});`;

        // Clear previous content
        adContainerRef.current.innerHTML = "";

        // Append script to container - AdCash will render inside this div
        adContainerRef.current.appendChild(script);

        console.log(`[Adcash Leaderboard] Zone ${zoneId} banner initialized`);
      } catch (error) {
        console.error("[Leaderboard Ad] Error:", error);
      }
    }, 500); // Wait 500ms for aclib to load

    return () => clearTimeout(timeout);
  }, [zoneId, network]);

  if (network !== "adcash") return null;

  return (
    <div className={`leaderboard-ad-wrapper w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Ad Label */}
        <div className="text-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Advertisement
          </span>
        </div>

        {/* Ad Container - 728x90 Leaderboard */}
        <div className="flex justify-center">
          <div
            ref={adContainerRef}
            className="w-full max-w-[728px] h-[90px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden"
            style={{
              minHeight: "90px",
              maxWidth: "728px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
