"use client";

import { useEffect, useRef } from "react";

/**
 * AdcashScript Component
 * Handles the global initialization of AdCash AutoTag.
 * This should be included once in the root layout.
 */
export default function AdcashScript() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const zoneId = process.env.NEXT_PUBLIC_ADCASH_AUTO_TAG_ZONE;
    if (!zoneId) return;

    const initAutoTag = () => {
      if ((window as any).aclib && typeof (window as any).aclib.runAutoTag === 'function') {
        try {
          (window as any).aclib.runAutoTag({
            zoneId: zoneId,
          });
          console.log(`[Adcash] AutoTag initialized for zone: ${zoneId}`);
          initialized.current = true;
        } catch (error) {
          console.error("[Adcash] Error initializing AutoTag:", error);
        }
      } else {
        // Retry if aclib is not yet loaded (it's loaded async in layout.tsx)
        setTimeout(initAutoTag, 500);
      }
    };

    // Small delay to ensure aclib has a chance to load
    setTimeout(initAutoTag, 2000);

    return () => {
      initialized.current = true; // Prevent re-init on unmount/remount in dev
    };
  }, []);

  return null;
}
