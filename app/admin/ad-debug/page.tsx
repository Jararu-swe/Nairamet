"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nairamet:cookie_consent";
const SCRIPT_ID = "nairamet-adsense-script";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function AdminAdDebug() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [consent, setConsent] = useState<any | null>(null);

  useEffect(() => {
    const check = () => {
      if (
        typeof window !== "undefined" &&
        typeof (window as any).adsbygoogle !== "undefined"
      ) {
        setScriptLoaded(true);
        return;
      }
      if (document.getElementById(SCRIPT_ID)) {
        setScriptLoaded(true);
        return;
      }
      setScriptLoaded(false);
    };

    check();
    const interval = setInterval(check, 1000);
    window.addEventListener("storage", () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      setConsent(raw ? JSON.parse(raw) : null);
      check();
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    setConsent(raw ? JSON.parse(raw) : null);

    return () => clearInterval(interval);
  }, []);

  function forceInject() {
    if (!ADSENSE_ID) return alert("No ADSENSE ID configured");
    if (document.getElementById(SCRIPT_ID))
      return alert("Script already injected");
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
    document.head.appendChild(s);
    setTimeout(() => {
      // @ts-ignore
      if (
        typeof window !== "undefined" &&
        typeof (window as any).adsbygoogle !== "undefined"
      ) {
        setScriptLoaded(true);
      }
    }, 1000);
  }

  function acceptAll() {
    const c = { ads: true, analytics: true };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      document.documentElement.removeAttribute("data-ads-personalization");
    } catch (e) {}
    setConsent(c);
  }

  function rejectAll() {
    const c = { ads: false, analytics: false };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      document.documentElement.setAttribute(
        "data-ads-personalization",
        "false"
      );
    } catch (e) {}
    setConsent(c);
  }

  function clearConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.documentElement.removeAttribute("data-ads-personalization");
    } catch (e) {}
    setConsent(null);
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ad Debug</h1>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">AdSense script status</h3>
            <p className="mt-2">Script loaded: {scriptLoaded ? "Yes" : "No"}</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">Stored consent</h3>
            <pre className="mt-2 text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded">
              {consent ? JSON.stringify(consent, null, 2) : "No consent saved"}
            </pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={forceInject}
              className="px-3 py-2 rounded bg-emerald-600 text-white"
            >
              Force inject AdSense script
            </button>
            <button onClick={acceptAll} className="px-3 py-2 rounded border">
              Accept all
            </button>
            <button onClick={rejectAll} className="px-3 py-2 rounded border">
              Reject non-essential
            </button>
            <button
              onClick={clearConsent}
              className="px-3 py-2 rounded bg-red-50 text-red-600 border"
            >
              Clear consent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
