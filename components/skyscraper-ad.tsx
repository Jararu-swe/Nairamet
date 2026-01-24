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
        // Load AdCash AutoTag script directly
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `//acscdn.com/script/${zoneId}.js`;
        script.async = true;
        script.setAttribute("data-cfasync", "false");

        script.onload = () => {
          console.log(`[Adcash Skyscraper] Zone ${zoneId} loaded successfully`);
          scriptLoadedRef.current = true;
        };

        script.onerror = () => {
          console.error(`[Adcash Skyscraper] Failed to load zone ${zoneId}`);
        };

        if (adContainerRef.current) {
          adContainerRef.current.appendChild(script);
        }
      }
    } catch (error) {
      console.error("[Skyscraper Ad] Error:", error);
    }

    return () => {
      if (adContainerRef.current) {
        const scripts = adContainerRef.current.getElementsByTagName("script");
        while (scripts.length > 0) {
          scripts[0].parentNode?.removeChild(scripts[0]);
        }
      }
    };
  }, [zoneId, network]);

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
          {/* Adcash AutoTag Container */}
          <div
            ref={adContainerRef}
            className="w-full h-full flex items-center justify-center"
          />
          {/* Placeholder while ad loads */}
          <div className="text-xs text-gray-400 text-center px-2 absolute">
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
