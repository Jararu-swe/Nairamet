import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange Rate Alerts - Price Notifications | NairaMet",
  description:
    "Get instant push notifications when USD/NGN, GBP/NGN, EUR/NGN rates hit your target prices. Set multiple alerts and monitor rates 24/7.",
  keywords: [
    "rate alerts",
    "exchange rate notifications",
    "price alerts NGN",
    "currency alerts",
    "naira rate alerts",
    "push notifications",
    "real-time alerts",
  ],
  openGraph: {
    title: "Exchange Rate Alerts",
    description:
      "Get notified when exchange rates hit your target prices. Real-time push notifications.",
    type: "website",
    url: "/alerts",
  },
  twitter: {
    card: "summary_large_image",
    title: "Set Exchange Rate Alerts",
    description: "Get notified when rates hit your target prices",
  },
};

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
