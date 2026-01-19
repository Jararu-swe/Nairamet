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
      {/* Monetag verification script - Add your site verification key */}
      {process.env.NEXT_PUBLIC_MONETAG_SITE_KEY && (
        <Script
          id="monetag-verification"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,z,s){
                s.src='https://'+d+'/401/'+z;
                try{(document.body||document.documentElement).appendChild(s)}catch(e){}
              })('${process.env.NEXT_PUBLIC_MONETAG_DOMAIN || 'alwingulla.com'}', ${process.env.NEXT_PUBLIC_MONETAG_SITE_KEY}, document.createElement('script'))
            `,
          }}
        />
      )}
    </>
  );
}
