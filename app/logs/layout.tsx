import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate Logs & Archive - Historical Exchange Rate Data | NairaMet",
  description:
    "Search and download historical exchange rate data. Access complete archives of USD/NGN, GBP/NGN, EUR/NGN rates from CBN, black market, and parallel sources.",
  keywords: [
    "rate logs",
    "historical rates",
    "exchange rate archive",
    "rate data export",
    "historical data",
    "rate history",
    "forex data",
  ],
  openGraph: {
    title: "Rate Logs & Historical Data Archive",
    description:
      "Search historical rates and export exchange rate data for analysis.",
    type: "website",
    url: "/logs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exchange Rate Logs",
    description: "Search and download historical rate data",
  },
};

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
