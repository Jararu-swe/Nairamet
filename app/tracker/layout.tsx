import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Exchange Rates - USD, GBP, EUR to Naira",
  description:
    "Real-time USD/NGN, GBP/NGN, EUR/NGN exchange rates. Track CBN official, black market, and parallel market rates with live updates. Free bidirectional currency converter included.",
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
      "Track USD/NGN, GBP/NGN, EUR/NGN rates in real-time. Compare CBN, black market, and parallel rates. Free bidirectional currency converter.",
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

  // Currency Converter Tool Schema
  const currencyConverterSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Currency Converter - NGN Exchange Rates",
    description: "Free online currency converter for Nigerian Naira",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/tracker`,
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "NGN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
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

  // FAQ Schema for Tracker Page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the current USD to NGN exchange rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The USD to NGN exchange rate varies across CBN official, black market, and parallel market sources. Use our real-time tracker to get the most current rates updated every 5 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "How often are exchange rates updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our exchange rates are updated every 5 minutes with data from CBN official rates, black market sources, and parallel market rates.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between CBN, black market, and parallel market rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CBN official rate is set by the Central Bank of Nigeria for formal transactions. Black market rates are informal market rates, while parallel market rates reflect market-determined prices. Each has different uses and availability.",
        },
      },
      {
        "@type": "Question",
        name: "Can I set price alerts for exchange rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, NairaMet allows you to set price alerts that notify you when exchange rates hit your target prices. You can manage multiple alerts across different currency pairs.",
        },
      },
      {
        "@type": "Question",
        name: "How do I convert currency amounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter the amount, select your currencies (from and to), choose your preferred rate type (CBN, black market, or parallel), and our converter instantly calculates the converted amount with live rates. You can convert both from NGN to foreign currencies and from foreign currencies to NGN.",
        },
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(currencyConverterSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
