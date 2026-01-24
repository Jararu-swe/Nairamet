"use client";

import { useEffect, useRef, useState } from "react";
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

    const attr = document.documentElement.getAttribute(
      "data-ads-personalization",
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
