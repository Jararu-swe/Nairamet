"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nairamet:cookie_consent";

function applyConsentToDocument(consentObj: any) {
  try {
    if (!consentObj) return;
    if (consentObj.ads === false) {
      document.documentElement.setAttribute(
        "data-ads-personalization",
        "false"
      );
    } else {
      document.documentElement.removeAttribute("data-ads-personalization");
    }
  } catch (e) {
    // ignore
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConsent(parsed);
        // Apply saved preference immediately so ad gating respects it on load
        applyConsentToDocument(parsed);
        setVisible(false);
      } else {
        // If Cookiebot is present we let it handle consent
        if ((window as any).Cookiebot) {
          setVisible(false);
          setConsent({ cookiebot: true });
          return;
        }
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  function save(consentObj: any) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentObj));
      setConsent(consentObj);
      // Apply immediately so ad gating components respect the selection
      applyConsentToDocument(consentObj);
      setVisible(false);
    } catch (e) {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-50">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border rounded-lg p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">We use cookies</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience, show relevant content,
            and for analytics. You can accept all cookies or reject
            non-essential cookies.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-md bg-emerald-600 text-white"
            onClick={() => save({ ads: true, analytics: true })}
          >
            Accept all
          </button>
          <button
            className="px-3 py-2 rounded-md border"
            onClick={() => save({ ads: false, analytics: false })}
          >
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  );
}
