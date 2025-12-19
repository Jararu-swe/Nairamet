import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Currency Tracker - Real-time Naira Exchange Rates",
  description:
    "Track live USD/NGN, GBP/NGN, EUR/NGN, and other currency pairs in real-time. Compare CBN official, black market, and parallel market rates with 24-hour changes and historical data.",
  keywords: [
    "currency tracker",
    "live exchange rates",
    "naira tracker",
    "USD to NGN live",
    "GBP to NGN live",
    "EUR to NGN live",
    "real-time forex",
    "currency monitor",
    "FX tracker Nigeria",
    "black market rate live",
    "CBN rate today",
    "parallel market rate",
  ],
  openGraph: {
    title: "Live Currency Tracker | NairaMet",
    description:
      "Track live Naira exchange rates across multiple currencies. Real-time updates every 5 minutes with CBN, black market, and parallel rates.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NairaMet Currency Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Currency Tracker | NairaMet",
    description:
      "Track live Naira exchange rates across multiple currencies with real-time updates.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/tracker",
  },
};
