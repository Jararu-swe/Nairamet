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
 */
export function LeaderboardAd({
  zoneId,
  network = "adcash",
  publisherId,
  className = "",
}: LeaderboardAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      if (network === "adcash") {
        // Load aclib script first if not already loaded
        if (!(window as any).aclib) {
          const aclibScript = document.createElement("script");
          aclibScript.id = "aclib";
          aclibScript.type = "text/javascript";
          aclibScript.src = "//acscdn.com/script/aclib.js";
          aclibScript.async = true;

          aclibScript.onload = () => {
            console.log("[Adcash] aclib loaded");
            // Run banner after aclib is loaded
            if ((window as any).aclib && (window as any).aclib.runBanner) {
              (window as any).aclib.runBanner({ zoneId });
              console.log(`[Adcash Leaderboard] Zone ${zoneId} initialized`);
              scriptLoadedRef.current = true;
            }
          };

          document.head.appendChild(aclibScript);
        } else {
          // aclib already loaded, just run the banner
          if ((window as any).aclib.runBanner) {
            (window as any).aclib.runBanner({ zoneId });
            console.log(`[Adcash Leaderboard] Zone ${zoneId} initialized`);
            scriptLoadedRef.current = true;
          }
        }
      } else if (network === "bidvertiser" && publisherId) {
        // BidVertiser implementation
        (window as any).bv_id = publisherId;
        (window as any).bv_zone = zoneId;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//bdv.bidvertiser.com/BDV.js";
        script.async = true;

        script.onload = () => {
          console.log(`[BidVertiser Leaderboard] Loaded successfully`);
          scriptLoadedRef.current = true;
        };

        if (adContainerRef.current) {
          adContainerRef.current.appendChild(script);
        }
      }
    } catch (error) {
      console.error("[Leaderboard Ad] Error:", error);
    }

    return () => {
      if (adContainerRef.current) {
        const scripts = adContainerRef.current.getElementsByTagName("script");
        while (scripts.length > 0) {
          scripts[0].parentNode?.removeChild(scripts[0]);
        }
      }
    };
  }, [zoneId, network, publisherId]);

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
            className="w-full max-w-[728px] h-[90px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden"
            style={{
              minHeight: "90px",
              maxWidth: "728px",
            }}
          >
            {/* Adcash Banner Container */}
            <div ref={adContainerRef}>
              {network === "adcash" && (
                <div>
                  <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                      __html: `aclib.runBanner({zoneId: '${zoneId}'});`,
                    }}
                  />
                </div>
              )}
            </div>
            {/* Placeholder while ad loads */}
            <div className="text-xs text-gray-400">
              Loading ad...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive Leaderboard - Shows 728x90 on desktop, adapts on mobile
 */
export function ResponsiveLeaderboard({
  zoneId,
  network = "adcash",
  publisherId,
}: {
  zoneId: string;
  network?: "adcash" | "bidvertiser" | "adsense";
  publisherId?: string;
}) {
  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-700">
      <LeaderboardAd
        zoneId={zoneId}
        network={network}
        publisherId={publisherId}
        className="hidden md:block"
      />
      
      {/* Mobile: Show smaller ad or hide */}
      <div className="md:hidden py-4 px-4">
        <div className="text-center text-xs text-gray-400 mb-2">
          Advertisement
        </div>
        <div className="w-full h-[50px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <span className="text-xs text-gray-400">Mobile Ad</span>
        </div>
      </div>
    </div>
  );
}
