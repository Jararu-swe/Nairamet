"use client";

import { useEffect, useRef } from "react";

interface AdcashAdProps {
  zoneId: string;
  title?: string;
  className?: string;
}

export function AdcashAd({
  zoneId,
  title = "Advertisement",
  className = "",
}: AdcashAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only load once
    if (scriptLoadedRef.current) return;

    // Check if we're in the browser
    if (typeof window === "undefined") return;

    try {
      // Initialize aclib if not already present
      if (!(window as any).aclib) {
        (window as any).aclib = {
          runAutoTag: function (config: any) {
            console.log(`[Adcash] AutoTag called with zone: ${config.zoneId}`);
          },
        };
      }

      // Load Adcash script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = `//acscdn.com/script/${zoneId}.js`;

      script.onload = () => {
        console.log(`[Adcash] Script loaded for zone: ${zoneId}`);
        
        // Run AutoTag after script loads
        if ((window as any).aclib && (window as any).aclib.runAutoTag) {
          (window as any).aclib.runAutoTag({ zoneId });
          console.log(`[Adcash] Ad initialized: ${title}`);
          scriptLoadedRef.current = true;
        }
      };

      script.onerror = () => {
        console.error(`[Adcash] Failed to load ad: ${title}`);
      };

      if (adContainerRef.current) {
        adContainerRef.current.appendChild(script);
      }
    } catch (error) {
      console.error("[Adcash] Error loading ad:", error);
    }

    // Cleanup
    return () => {
      if (adContainerRef.current) {
        const scripts = adContainerRef.current.getElementsByTagName("script");
        while (scripts.length > 0) {
          scripts[0].parentNode?.removeChild(scripts[0]);
        }
      }
    };
  }, [zoneId, title]);

  return (
    <div className={`adcash-ad-container ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">
        {title}
      </div>
      <div
        ref={adContainerRef}
        className="flex justify-center items-center min-h-[90px] bg-gray-50 dark:bg-gray-900 rounded-lg"
      />
    </div>
  );
}

// Homepage Top Banner
export function AdcashTopBanner({ zoneId }: { zoneId: string }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <AdcashAd
        zoneId={zoneId}
        title="Advertisement"
        className="flex justify-center"
      />
    </div>
  );
}

// Sidebar Ad
export function AdcashSidebar({ zoneId }: { zoneId: string }) {
  return (
    <div className="w-full">
      <AdcashAd
        zoneId={zoneId}
        title="Advertisement"
        className="sticky top-4"
      />
    </div>
  );
}

// In-Content Ad
export function AdcashInContent({ zoneId }: { zoneId: string }) {
  return (
    <div className="w-full my-8">
      <AdcashAd
        zoneId={zoneId}
        title="Advertisement"
        className="flex justify-center"
      />
    </div>
  );
}

// Blog Post Ad
export function AdcashBlogAd({ zoneId }: { zoneId: string }) {
  return (
    <div className="w-full my-6">
      <AdcashAd
        zoneId={zoneId}
        title="Sponsored"
        className="flex justify-center"
      />
    </div>
  );
}
