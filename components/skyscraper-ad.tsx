"use client";

import { useEffect, useRef } from "react";

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
              console.log(`[Adcash Skyscraper] Zone ${zoneId} initialized`);
              scriptLoadedRef.current = true;
            }
          };

          document.head.appendChild(aclibScript);
        } else {
          // aclib already loaded, just run the banner
          if ((window as any).aclib.runBanner) {
            (window as any).aclib.runBanner({ zoneId });
            console.log(`[Adcash Skyscraper] Zone ${zoneId} initialized`);
            scriptLoadedRef.current = true;
          }
        }
      }
    } catch (error) {
      console.error("[Skyscraper Ad] Error:", error);
    }

    return () => {
      // Cleanup if needed
    };
  }, [zoneId, network, publisherId]);

  return (
    <div className={`skyscraper-ad-wrapper ${className}`}>
      {/* Ad Label */}
      <div className="text-center mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Advertisement
        </span>
      </div>

      {/* Ad Container - 160x600 Skyscraper */}
      <div className="flex justify-center">
        <div
          className="w-[160px] h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden"
          style={{
            minHeight: "600px",
            maxWidth: "160px",
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
          <div className="text-xs text-gray-400 text-center px-2">
            Loading ad...
          </div>
        </div>
      </div>
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
