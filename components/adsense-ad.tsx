"use client";

import { useEffect, useState } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
}

export function AdSenseAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdSenseAdProps) {
  // Gate ad rendering until we verify this page is appropriate for ads.
  // This helps avoid showing ads on low-content or sensitive pages
  // (e.g. auth flows, alerts, utility pages) which can violate AdSense policy.
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Don't show ads at all if no client ID is configured
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null;
  }

  useEffect(() => {
    try {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";

      // Blacklist some common low-value routes where ads should not show
      const blacklistedPrefixes = [
        "/auth",
        "/alerts",
        "/forgot-password",
        "/reset-password",
        "/terms",
        "/privacy",
        "/cookies",
        "/disclaimer",
        "/admin",
      ];

      for (const p of blacklistedPrefixes) {
        if (pathname.startsWith(p)) {
          setAllowed(false);
          return;
        }
      }

      // Heuristic: find the main content element and count words. Require a
      // minimum amount of publisher content before showing ads.
      const el =
        document.querySelector("article") ||
        document.querySelector("main") ||
        document.querySelector("[data-publisher-content]");
      const text = el ? el.textContent || "" : document.body.textContent || "";
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const MIN_WORDS = 150;

      if (words < MIN_WORDS) {
        setAllowed(false);
        return;
      }

      // If checks pass, allow render. The ad will wait for the AdSense
      // script to be present before requesting ads.
      setAllowed(true);
    } catch (err) {
      console.error("AdSense gating error:", err);
      setAllowed(false);
    }
  }, []);

  // Detect if the AdSense script is present (injected by AdScript)
  useEffect(() => {
    if (typeof window === "undefined") return;

    function check() {
      // window.adsbygoogle becomes available after the script loads
      // also check for our injected script id as a fallback
      // @ts-ignore
      if (typeof window.adsbygoogle !== "undefined") {
        setScriptLoaded(true);
        return true;
      }
      if (document.getElementById("nairamet-adsense-script")) {
        setScriptLoaded(true);
        return true;
      }
      return false;
    }

    if (check()) return;

    const headObserver = new MutationObserver(() => {
      if (check()) {
        headObserver.disconnect();
      }
    });
    try {
      headObserver.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch (e) {
      // ignore
    }

    // Poll as a fallback
    const interval = setInterval(() => {
      if (check()) clearInterval(interval);
    }, 500);

    return () => {
      headObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  // When both the page allows ads and the script is loaded, push slot
  useEffect(() => {
    try {
      if (allowed && scriptLoaded && typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore
    }
  }, [allowed, scriptLoaded]);

  // Still deciding on the client; don't render until we've decided.
  if (allowed === null) return null;
  if (!allowed) return null;

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Predefined ad positions for consistency
export function TopBannerAd() {
  return (
    <AdSenseAd
      adSlot="1234567890" // Replace with your actual ad slot
      adFormat="horizontal"
      className="my-4 max-w-7xl mx-auto"
    />
  );
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="1234567891" // Replace with your actual ad slot
      adFormat="vertical"
      fullWidthResponsive={false}
      className="sticky top-4"
    />
  );
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="1234567892" // Replace with your actual ad slot
      adFormat="fluid"
      className="my-6"
    />
  );
}

export function BottomBannerAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // Respect explicit dismissal
      const dismissed = localStorage.getItem("nairamet:ad_dismissed") === "1";
      if (dismissed) return;

      // Respect cookie consent for ads
      const adsPersonalization = document.documentElement.getAttribute(
        "data-ads-personalization"
      );
      if (adsPersonalization === "false") return;

      // Show banner (AdSenseAd will still gate rendering according to page rules)
      setVisible(true);
    } catch (err) {
      console.warn("BottomBannerAd init error", err);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem("nairamet:ad_dismissed", "1");
    } catch (e) {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Sponsored content"
      className="fixed bottom-4 left-4 right-4 z-50 flex justify-center px-4"
    >
      <div className="w-full max-w-7xl bg-white/95 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg flex items-center gap-4 p-3 transition-transform transform hover:scale-[1.01]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-800">
            Sponsored
          </span>
        </div>

        <div className="flex-1">
          <AdSenseAd
            adSlot="1234567893" /* Replace with your actual ad slot */
            adFormat="horizontal"
            className="w-full"
          />
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss advertisement"
          className="ml-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
