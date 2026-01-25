"use client";

import { useEffect } from "react";

const STORAGE_KEY = "nairamet:popunder_last_shown";
const INTERVAL_MS = 20 * 60 * 1000; // 20 minutes

export function PopunderLimiter() {
  useEffect(() => {
    // Check if we should show popunder
    const now = Date.now();
    const lastShown = localStorage.getItem(STORAGE_KEY);

    const shouldShow = !lastShown || now - parseInt(lastShown) >= INTERVAL_MS;

    if (shouldShow && process.env.NEXT_PUBLIC_MONETAG_POPUNDER) {
      // Update the timestamp immediately to prevent rapid re-triggers
      localStorage.setItem(STORAGE_KEY, now.toString());

      // Load the popunder script
      setTimeout(() => {
        try {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.innerHTML = `
            (function(s){
              s.dataset.zone='${process.env.NEXT_PUBLIC_MONETAG_POPUNDER}';
              s.src='https://${process.env.NEXT_PUBLIC_MONETAG_POPUNDER_DOMAIN || "al5sm.com"}/tag.min.js';
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
          `;
          document.body.appendChild(script);
        } catch (error) {
          console.error("[Popunder] Error loading:", error);
        }
      }, 500);
    }
  }, []);

  return null;
}
