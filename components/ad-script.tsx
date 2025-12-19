"use client";

import { useEffect, useRef } from "react";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const STORAGE_KEY = "nairamet:cookie_consent";
const SCRIPT_ID = "nairamet-adsense-script";

function getConsentAllowsAds() {
  try {
    // Check explicit stored consent first
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && parsed.ads !== false;
    }
    // Fallback to page-level attribute
    const attr = document.documentElement.getAttribute(
      "data-ads-personalization"
    );
    if (attr === "false") return false;
    return true;
  } catch (e) {
    return false;
  }
}

export default function AdScript() {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ID) return;

    function inject() {
      if (injectedRef.current) return;
      try {
        if (document.getElementById(SCRIPT_ID)) {
          injectedRef.current = true;
          return;
        }

        const s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.async = true;
        s.crossOrigin = "anonymous";
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
        document.head.appendChild(s);
        injectedRef.current = true;
      } catch (err) {
        // ignore
        console.warn("Failed to inject AdSense script", err);
      }
    }

    // If consent already allows ads, inject immediately
    if (getConsentAllowsAds()) {
      inject();
    }

    // Listen for storage events (consent changed in another tab)
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        if (getConsentAllowsAds()) inject();
      }
    }

    window.addEventListener("storage", onStorage);

    // Observe attribute changes to data-ads-personalization
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          (m as MutationRecord).attributeName === "data-ads-personalization"
        ) {
          if (getConsentAllowsAds()) inject();
        }
      }
    });
    try {
      observer.observe(document.documentElement, { attributes: true });
    } catch (e) {
      // ignore
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      observer.disconnect();
    };
  }, []);

  return null;
}
