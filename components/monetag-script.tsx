"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const STORAGE_KEY = "nairamet:cookie_consent";

function getConsentAllowsAds() {
  try {
    if (typeof window === "undefined") return false;
    
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && parsed.ads !== false;
    }
    
    const attr = document.documentElement.getAttribute("data-ads-personalization");
    if (attr === "false") return false;
    
    return true;
  } catch (e) {
    return false;
  }
}

export default function MonetagScript() {
  const consentChecked = useRef(false);

  useEffect(() => {
    if (consentChecked.current) return;
    
    function checkConsent() {
      if (getConsentAllowsAds()) {
        consentChecked.current = true;
      }
    }

    checkConsent();

    window.addEventListener("storage", checkConsent);
    
    const observer = new MutationObserver(() => {
      checkConsent();
    });
    
    try {
      observer.observe(document.documentElement, { attributes: true });
    } catch (e) {
      // ignore
    }

    return () => {
      window.removeEventListener("storage", checkConsent);
      observer.disconnect();
    };
  }, []);

  if (!getConsentAllowsAds()) return null;

  return (
    <>
      {/* Monetag Popunder - Highest earning format */}
      {process.env.NEXT_PUBLIC_MONETAG_POPUNDER && (
        <Script
          id="monetag-popunder"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='${process.env.NEXT_PUBLIC_MONETAG_POPUNDER}';
                s.src='https://${process.env.NEXT_PUBLIC_MONETAG_POPUNDER_DOMAIN || 'al5sm.com'}/tag.min.js';
              })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />
      )}

      {/* Monetag Push Notifications - Passive income */}
      {process.env.NEXT_PUBLIC_MONETAG_PUSH && (
        <Script
          id="monetag-push"
          src={`https://${process.env.NEXT_PUBLIC_MONETAG_PUSH_DOMAIN || '3nbf4.com'}/act/files/tag.min.js?z=${process.env.NEXT_PUBLIC_MONETAG_PUSH}`}
          data-cfasync="false"
          strategy="afterInteractive"
          async
        />
      )}
    </>
  );
}
