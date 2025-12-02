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

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data for currency exchange rates
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NairaMet Live Exchange Rates",
    applicationCategory: "FinanceApplication",
    description:
      "Real-time currency exchange rate tracker for Nigerian Naira (NGN) against major currencies including USD, GBP, EUR, and CNY.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/tracker`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    featureList: [
      "Real-time exchange rates",
      "Currency converter",
      "CBN official rates",
      "Black market rates",
      "Parallel market rates",
      "Historical rate comparison",
    ],
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Live Exchange Rates",
        item: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/tracker`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {children}
    </>
  );
}
