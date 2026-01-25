"use client";

import { useEffect, useRef } from "react";

/**
 * AdCash Footer Banner (468x60)
 * Banner renders inside the parent div of the script that calls runBanner
 * According to AdCash documentation
 */
export function AdcashFooterBanner({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
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

        console.log(`[Adcash Footer] Zone ${zoneId} banner initialized`);
      } catch (error) {
        console.error("[Adcash Footer] Error:", error);
      }
    }, 500); // Wait 500ms for aclib to load

    return () => clearTimeout(timeout);
  }, [zoneId]);

  return (
    <div className="w-full flex justify-center py-2">
      <div
        ref={containerRef}
        className="flex justify-center items-center bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
        style={{ minHeight: "60px", maxWidth: "600px", width: "100%" }}
      />
    </div>
  );
}
