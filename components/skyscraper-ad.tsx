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
 *
 * Note: Banner renders inside the parent div of the script that calls runBanner
 * According to AdCash documentation
 */
export function SkyscraperAd({
  zoneId,
  network = "adcash",
  publisherId,
  className = "",
}: SkyscraperAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (network !== "adcash") return;
    if (!containerRef.current) return;

    // Wait a bit for aclib to load, then add the banner script
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create script element inside the container (AdCash exact format)
        // Banner renders inside the parent div of this script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `aclib.runBanner({\n    zoneId: '${zoneId}',\n});`;

        // Clear previous content
        containerRef.current.innerHTML = "";

        // Append script to container - AdCash will render inside this div
        containerRef.current.appendChild(script);

        console.log(`[Adcash Skyscraper] Zone ${zoneId} banner initialized`);
      } catch (error) {
        console.error("[Skyscraper Ad] Error:", error);
      }
    }, 500); // Wait 500ms for aclib to load

    return () => clearTimeout(timeout);
  }, [zoneId, network]);

  return (
    <div className={`skyscraper-ad-wrapper ${className}`}>
      {/* Ad Label */}
      <div className="text-center mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Advertisement
        </span>
      </div>

      {/* Ad Container - Banner will render inside this div */}
      <div
        ref={containerRef}
        className="w-[160px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
        style={{
          minHeight: "600px",
          width: "160px",
        }}
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
