"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";

interface MonetagAdProps {
  zoneId: string;
  type?: "banner" | "native" | "vignette" | "push" | "popunder";
  className?: string;
}

export function MonetagAd({ zoneId, type = "banner", className = "" }: MonetagAdProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";

      // Blacklist routes where ads should not show
      const blacklistedPrefixes = [
        "/auth",
        "/alerts",
        "/forgot-password",
        "/reset-password",
        "/admin",
        "/api",
        "/widget",
      ];

      for (const p of blacklistedPrefixes) {
        if (pathname.startsWith(p)) {
          setAllowed(false);
          return;
        }
      }

      // Check content quality
      const checkContent = () => {
        const contentSelectors = [
          "article",
          "main",
          "[role='main']",
          "[data-publisher-content]",
          ".prose",
          ".content",
        ];

        let contentElement = null;
        for (const selector of contentSelectors) {
          contentElement = document.querySelector(selector);
          if (contentElement) break;
        }

        let text = "";
        if (contentElement) {
          text = contentElement.textContent || "";
        } else {
          const body = document.body.cloneNode(true) as HTMLElement;
          const excludeSelectors = ["nav", "header", "footer", "[role='navigation']", ".ad", "[data-ad]"];
          excludeSelectors.forEach(sel => {
            body.querySelectorAll(sel).forEach(el => el.remove());
          });
          text = body.textContent || "";
        }

        const words = text
          .trim()
          .split(/\s+/)
          .filter(word => word.length > 2 && !/^\d+$/.test(word));
        
        const MIN_WORDS = 300;

        if (words.length < MIN_WORDS) {
          console.log(`Monetag: Insufficient content (${words.length} words, need ${MIN_WORDS})`);
          setAllowed(false);
          return false;
        }

        const hasHeadings = document.querySelectorAll("h1, h2, h3").length >= 2;
        const hasParagraphs = document.querySelectorAll("p").length >= 3;
        
        if (!hasHeadings || !hasParagraphs) {
          console.log("Monetag: Insufficient content structure");
          setAllowed(false);
          return false;
        }

        setAllowed(true);
        return true;
      };

      if (document.readyState === "complete") {
        checkContent();
      } else {
        window.addEventListener("load", checkContent);
        return () => window.removeEventListener("load", checkContent);
      }
    } catch (err) {
      console.error("Monetag gating error:", err);
      setAllowed(false);
    }
  }, []);

  if (allowed === null) return null;
  if (!allowed) return null;
  if (!zoneId) return null;

  return (
    <div ref={containerRef} className={`monetag-container ${className}`}>
      <Script
        id={`monetag-${zoneId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '${zoneId}',
              'format' : 'iframe',
              'height' : ${type === "banner" ? 90 : 250},
              'width' : ${type === "banner" ? 728 : 300},
              'params' : {}
            };
          `,
        }}
      />
      <Script
        src={`//www.topcreativeformat.com/${zoneId}/invoke.js`}
        strategy="afterInteractive"
      />
    </div>
  );
}

// Predefined ad positions
export function TopBannerAd() {
  return (
    <MonetagAd
      zoneId={process.env.NEXT_PUBLIC_MONETAG_TOP_BANNER || ""}
      type="banner"
      className="my-4 max-w-7xl mx-auto"
    />
  );
}

export function SidebarAd() {
  return (
    <MonetagAd
      zoneId={process.env.NEXT_PUBLIC_MONETAG_SIDEBAR || ""}
      type="native"
      className="sticky top-4"
    />
  );
}

export function InContentAd() {
  return (
    <MonetagAd
      zoneId={process.env.NEXT_PUBLIC_MONETAG_IN_CONTENT || ""}
      type="native"
      className="my-6"
    />
  );
}

export function BottomBannerAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("nairamet:ad_dismissed") === "1";
      if (dismissed) return;

      const adsPersonalization = document.documentElement.getAttribute("data-ads-personalization");
      if (adsPersonalization === "false") return;

      const timer = setTimeout(() => {
        setVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
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
      className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-white/98 dark:bg-gray-900/98 border-t border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              Ad
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <MonetagAd
              zoneId={process.env.NEXT_PUBLIC_MONETAG_BOTTOM_BANNER || ""}
              type="banner"
              className="w-full"
            />
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss advertisement"
            className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground transition-colors"
            title="Close ad"
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
    </div>
  );
}

export function InFeedAd() {
  return (
    <div className="my-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground">Sponsored</span>
      </div>
      <MonetagAd
        zoneId={process.env.NEXT_PUBLIC_MONETAG_IN_FEED || ""}
        type="native"
        className="min-h-[100px]"
      />
    </div>
  );
}

export function SidebarAdCard() {
  return (
    <div className="sticky top-20 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground">Sponsored</span>
      </div>
      <MonetagAd
        zoneId={process.env.NEXT_PUBLIC_MONETAG_SIDEBAR_CARD || ""}
        type="native"
        className="min-h-[250px]"
      />
    </div>
  );
}
