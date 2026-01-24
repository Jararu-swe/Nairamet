"use client";

import { useEffect, useRef } from "react";

export function AdcashFooterBanner({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      // Initialize aclib if not already present
      if (!(window as any).aclib) {
        (window as any).aclib = {
          runBanner: function (config: any) {
            console.log(
              `[Adcash] runBanner called with zone: ${config.zoneId}`,
            );
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
        console.log(`[Adcash] Banner script loaded for zone: ${zoneId}`);

        // Run Banner after script loads
        if ((window as any).aclib && (window as any).aclib.runBanner) {
          (window as any).aclib.runBanner({ zoneId });
          console.log(`[Adcash] Footer banner initialized`);
          scriptLoadedRef.current = true;
        }
      };

      script.onerror = () => {
        console.error(`[Adcash] Failed to load footer banner`);
      };

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }
    } catch (error) {
      console.error("[Adcash] Error loading footer banner:", error);
    }

    return () => {
      if (containerRef.current) {
        const scripts = containerRef.current.getElementsByTagName("script");
        while (scripts.length > 0) {
          scripts[0].parentNode?.removeChild(scripts[0]);
        }
      }
    };
  }, [zoneId]);

  return (
    <div className="w-full flex justify-center py-2">
      <div
        ref={containerRef}
        className="flex justify-center items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
        style={{ minHeight: "60px", maxWidth: "600px" }}
      />
    </div>
  );
}
