import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Trading & Currency Guides | NairaMet",
  description: "Master currency trading, exchange rates, alerts, and remittances with comprehensive guides on Nigerian FX markets. Learn from beginner to advanced strategies.",
  keywords: [
    "fx trading guide",
    "currency exchange guide",
    "naira exchange rate guide",
    "rate alerts guide",
    "remittance guide",
    "nigeria fx trading",
    "exchange rate tutorial",
    "currency trading basics",
    "fx market guide",
    "naira trading guide"
  ],
  openGraph: {
    title: "FX Trading & Currency Guides | NairaMet",
    description: "Comprehensive guides on currency trading, exchange rates, and FX strategies for Nigerian markets",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/guides`,
  },
  twitter: {
    card: "summary_large_image",
    title: "FX Trading & Currency Guides | NairaMet",
    description: "Master currency trading and exchange rates with our comprehensive guides",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/guides`,
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}