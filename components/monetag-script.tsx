"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "nairamet:cookie_consent";
const POPUNDER_COOKIE = "nairamet_popunder";

function getConsentAllowsAds() {
  try {
    if (typeof window === "undefined") return false;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && parsed.ads !== false;
    }

    const attr = document.documentElement.getAttribute(
      "data-ads-personalization"
    );
    if (attr === "false") return false;

    return true;
  } catch (e) {
    return false;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, hours: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function shouldShowPopunder(): boolean {
  try {
    if (typeof window === "undefined") return false;
    
    // Check if popunder was shown in this session (cookie-based)
    const shown = getCookie(POPUNDER_COOKIE);
    return !shown;
  } catch (e) {
    return true;
  }
}

function markPopunderShown() {
  try {
    // Set cookie for 8 hours (covers typical browsing session)
    setCookie(POPUNDER_COOKIE, "1", 1);
  } catch (e) {
    // ignore
  }
}

export default function MonetagScript() {
  const consentChecked = useRef(false);
  const [showPopunder, setShowPopunder] = useState(false);

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

  // Check if we should show popunder
  useEffect(() => {
    if (shouldShowPopunder()) {
      setShowPopunder(true);
      markPopunderShown();
    }
  }, []);

  if (!getConsentAllowsAds()) return null;

  return (
    <>
      {/* Monetag Popunder - Once per 8 hours (session-based) */}
      {process.env.NEXT_PUBLIC_MONETAG_POPUNDER && showPopunder && (
        <Script
          id="monetag-popunder"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='${process.env.NEXT_PUBLIC_MONETAG_POPUNDER}';
                s.src='https://${process.env.NEXT_PUBLIC_MONETAG_POPUNDER_DOMAIN || "al5sm.com"}/tag.min.js';
              })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />
      )}

      {/* Monetag Push Notifications - Passive income */}
      {process.env.NEXT_PUBLIC_MONETAG_PUSH && (
        <Script
          id="monetag-push"
          src={`https://${process.env.NEXT_PUBLIC_MONETAG_PUSH_DOMAIN || "3nbf4.com"}/act/files/tag.min.js?z=${process.env.NEXT_PUBLIC_MONETAG_PUSH}`}
          data-cfasync="false"
          strategy="afterInteractive"
          async
        />
      )}

      {/* Monetag In-Page Push Banner - Visible notification-style ad */}
      {process.env.NEXT_PUBLIC_MONETAG_IN_PAGE_PUSH && (
        <Script
          id="monetag-in-page-push"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='${process.env.NEXT_PUBLIC_MONETAG_IN_PAGE_PUSH}';
                s.src='https://${process.env.NEXT_PUBLIC_MONETAG_IN_PAGE_DOMAIN || "nap5k.com"}/tag.min.js';
              })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />
      )}
    </>
  );
}
