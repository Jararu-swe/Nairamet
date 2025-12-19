import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange Rate Alerts - Get Notified of Naira Rate Changes",
  description:
    "Set custom alerts for USD/NGN, GBP/NGN, EUR/NGN exchange rates. Get instant push notifications when rates hit your target. Never miss favorable exchange rates again.",
  keywords: [
    "exchange rate alerts",
    "naira rate alerts",
    "FX alerts Nigeria",
    "currency alerts",
    "USD to NGN alerts",
    "rate notifications",
    "forex alerts",
    "black market alerts",
    "CBN rate alerts",
    "push notifications forex",
    "currency monitoring",
    "rate tracker alerts",
  ],
  openGraph: {
    title: "Exchange Rate Alerts | NairaMet",
    description:
      "Set custom alerts and get instant notifications when Naira exchange rates hit your target. Monitor USD, GBP, EUR, and more.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NairaMet Exchange Rate Alerts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exchange Rate Alerts | NairaMet",
    description:
      "Set custom alerts and get instant notifications when Naira exchange rates hit your target.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/alerts",
  },
};
