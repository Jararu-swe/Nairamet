import React from "react";

export const SITE_NAME = "NairaMet";
export const DEFAULT_DESCRIPTION =
  "Real-time Naira exchange rates, alerts, charts, and comprehensive FX tools for Nigerian currency markets.";
export const DEFAULT_KEYWORDS = [
  "naira exchange rate",
  "USD to NGN",
  "black market rate",
  "CBN rate",
  "parallel market",
  "forex Nigeria",
  "currency converter",
];

export function MetaTags({
  title,
  description,
  keywords,
  url,
  image,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
}) {
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaKeywords = (keywords || DEFAULT_KEYWORDS).join(", ");
  const metaUrl =
    url || process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com";
  const metaImage = image || `${metaUrl}/og-image.png`;

  return (
    <>
      <title>
        {title} | {SITE_NAME}
      </title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | ${SITE_NAME}`} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${SITE_NAME}`} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical */}
      <link rel="canonical" href={metaUrl} />
    </>
  );
}
