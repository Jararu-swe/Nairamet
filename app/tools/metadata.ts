import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Tools - Currency Converter & Widgets for Your Website",
  description:
    "Free bidirectional currency converter, embeddable widgets, and FX tools for Nigerian Naira. Convert USD, GBP, EUR to/from NGN instantly. Add live exchange rate widgets to your website.",
  keywords: [
    "currency converter",
    "naira converter",
    "USD to NGN converter",
    "GBP to NGN converter",
    "EUR to NGN converter",
    "FX calculator",
    "exchange rate widget",
    "embeddable currency widget",
    "forex tools Nigeria",
    "currency tools",
    "naira calculator",
    "exchange rate calculator",
  ],
  openGraph: {
    title: "FX Tools & Currency Converter | NairaMet",
    description:
      "Free bidirectional currency converter and embeddable widgets for Nigerian Naira. Convert currencies both ways and add live rates to your website.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NairaMet FX Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FX Tools & Currency Converter | NairaMet",
    description:
      "Free bidirectional currency converter and embeddable widgets for Nigerian Naira.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/tools",
  },
};
