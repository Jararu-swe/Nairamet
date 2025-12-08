"use client";

import { useEffect } from "react";

interface AdSenseProps {
  /**
   * Your AdSense client ID (e.g., "ca-pub-1234567890123456")
   */
  client?: string;
  /**
   * Ad slot ID from AdSense dashboard
   */
  slot?: string;
  /**
   * Ad format: "auto", "rectangle", "vertical", "horizontal"
   */
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  /**
   * Enable responsive ads
   */
  responsive?: boolean;
  /**
   * Custom style for the ad container
   */
  style?: React.CSSProperties;
  /**
   * Custom className for the ad container
   */
  className?: string;
}

/**
 * Google AdSense Component
 * 
 * Usage:
 * <AdSense 
 *   client="ca-pub-1234567890123456"
 *   slot="1234567890"
 *   format="auto"
 *   responsive={true}
 * />
 */
export function AdSense({
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  slot = "",
  format = "auto",
  responsive = true,
  style = {},
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // Don't render if no client ID is provided
  if (!client || !slot) {
    return (
      <div className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">
          Ad Space - Configure AdSense
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Add NEXT_PUBLIC_ADSENSE_CLIENT_ID to .env.local
        </p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

/**
 * In-Feed Ad Component (for blog/article lists)
 */
export function AdSenseInFeed({
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  slot = "",
  className = "",
}: Omit<AdSenseProps, "format" | "responsive">) {
  return (
    <AdSense
      client={client}
      slot={slot}
      format="auto"
      responsive={true}
      className={className}
    />
  );
}

/**
 * In-Article Ad Component (for within blog content)
 */
export function AdSenseInArticle({
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  slot = "",
  className = "",
}: Omit<AdSenseProps, "format" | "responsive">) {
  return (
    <AdSense
      client={client}
      slot={slot}
      format="auto"
      responsive={true}
      className={className}
      style={{ textAlign: "center" }}
    />
  );
}

/**
 * Display Ad Component (standard banner)
 */
export function AdSenseDisplay({
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  slot = "",
  className = "",
  width = 728,
  height = 90,
}: Omit<AdSenseProps, "format" | "responsive"> & { width?: number; height?: number }) {
  return (
    <AdSense
      client={client}
      slot={slot}
      format="auto"
      responsive={false}
      className={className}
      style={{ width, height }}
    />
  );
}
