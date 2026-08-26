"use client";

import { useEffect, useRef } from "react";

interface AdSenseAdProps {
  slot?: string;
  client?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google AdSense Component
 * Renders official Google AdSense units when configured.
 * Renders NULL (no empty placeholder boxes or dummy text) when not configured.
 */
export function AdSenseAd({
  slot,
  client,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  const clientId = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (!clientId || !slotId || isLoaded.current) return;

    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.error("[AdSense] Push error:", e);
    }
  }, [clientId, slotId]);

  // If no AdSense credentials configured, render nothing (no placeholders)
  if (!clientId || !slotId) {
    return null;
  }

  return (
    <div className={`adsense-wrapper overflow-hidden flex justify-center my-4 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

// Convenience components that return null when not configured (zero placeholder footprint)
export function InFeedAd({ className = "", slot }: { className?: string; slot?: string }) {
  return (
    <AdSenseAd
      slot={slot || process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT}
      format="fluid"
      className={className}
    />
  );
}

export function InContentAd({ className = "", slot }: { className?: string; slot?: string }) {
  return (
    <AdSenseAd
      slot={slot || process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT}
      format="rectangle"
      className={className}
    />
  );
}

export function TopBannerAd({ className = "", slot }: { className?: string; slot?: string }) {
  return (
    <AdSenseAd
      slot={slot || process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT}
      format="horizontal"
      className={className}
    />
  );
}

export function BottomBannerAd({ className = "", slot }: { className?: string; slot?: string }) {
  return (
    <AdSenseAd
      slot={slot || process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT}
      format="horizontal"
      className={className}
    />
  );
}

export function SidebarAd({ className = "", slot }: { className?: string; slot?: string }) {
  return (
    <AdSenseAd
      slot={slot || process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT}
      format="vertical"
      className={className}
    />
  );
}

export function SidebarAdCard({ className = "", slot }: { className?: string; slot?: string }) {
  return <SidebarAd className={className} slot={slot} />;
}
