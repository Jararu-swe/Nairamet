import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange Rate Charts - Historical Analysis | NairaMet",
  description:
    "Interactive charts and historical analysis of USD/NGN, GBP/NGN, EUR/NGN exchange rates. Track trends, volatility, and rate movements over time.",
  keywords: [
    "exchange rate charts",
    "currency charts",
    "historical rates",
    "rate analysis",
    "naira trends",
    "forex charts",
    "rate movements",
  ],
  openGraph: {
    title: "Exchange Rate Charts & Historical Analysis",
    description:
      "Visualize currency trends with interactive charts. Analyze historical rate movements.",
    type: "website",
    url: "/charts",
  },
  twitter: {
    card: "summary_large_image",
    title: "View Exchange Rate Charts",
    description: "Track historical trends of USD, GBP, EUR to Naira",
  },
};

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
