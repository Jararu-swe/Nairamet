import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Exchange Rates - USD, GBP, EUR to Naira",
  description:
    "Real-time USD/NGN, GBP/NGN, EUR/NGN exchange rates. Track CBN official, black market, and parallel market rates with live updates. Free currency converter included.",
  keywords: [
    "USD to NGN",
    "GBP to NGN",
    "EUR to NGN",
    "dollar to naira today",
    "pound to naira",
    "euro to naira",
    "live exchange rates",
    "naira exchange rate today",
    "black market rate",
    "CBN rate today",
    "parallel market rate",
    "currency converter",
    "forex rates Nigeria",
  ],
  openGraph: {
    title: "Live Exchange Rates - Real-time Naira FX Tracker",
    description:
      "Track USD/NGN, GBP/NGN, EUR/NGN rates in real-time. Compare CBN, black market, and parallel rates. Free currency converter.",
    type: "website",
    url: "/tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Naira Exchange Rates",
    description:
      "Real-time USD/NGN, GBP/NGN, EUR/NGN rates. Track CBN, black market & parallel rates.",
  },
  alternates: {
    canonical: "/tracker",
  },
};
