"use client";

import { useEffect, useRef } from "react";

export function AdcashFooterBanner({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      // Load AdCash AutoTag script directly
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//acscdn.com/script/${zoneId}.js`;
      script.async = true;
      script.setAttribute("data-cfasync", "false");

      script.onload = () => {
        console.log(`[Adcash Footer] Zone ${zoneId} loaded successfully`);
        scriptLoadedRef.current = true;
      };

      script.onerror = () => {
        console.error(`[Adcash Footer] Failed to load zone ${zoneId}`);
      };

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }
    } catch (error) {
      console.error("[Adcash Footer] Error loading banner:", error);
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
