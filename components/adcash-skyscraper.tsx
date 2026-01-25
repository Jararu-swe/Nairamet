"use client";

import { useEffect, useRef } from "react";

interface AdcashSkyscraperProps {
  zoneId: string;
  title?: string;
}

export function AdcashSkyscraper({
  zoneId,
  title = "Advertisement",
}: AdcashSkyscraperProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for aclib to fully load
    const checkAndLoadAd = () => {
      if (
        (window as any).aclib &&
        typeof (window as any).aclib.runBanner === "function"
      ) {
        try {
          (window as any).aclib.runBanner({
            zoneId: zoneId,
          });
          console.log(`[Adcash] Skyscraper ad loaded for zone: ${zoneId}`);
        } catch (error) {
          console.error("[Adcash] Error loading banner:", error);
        }
      } else {
        // Try again if aclib not ready
        setTimeout(checkAndLoadAd, 500);
      }
    };

    // Give the page a moment to fully render
    setTimeout(checkAndLoadAd, 100);
  }, [zoneId]);

  return (
    <div className="adcash-skyscraper-container">
      <div className="text-xs text-gray-400 text-center mb-1">{title}</div>
      <div
        ref={adContainerRef}
        className="flex justify-center items-center w-[300px] min-h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
        id={`adcash-zone-${zoneId}`}
      />
    </div>
  );
}
