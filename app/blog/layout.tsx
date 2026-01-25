import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Blog - Exchange Rate News & Insights | NairaMet",
  description:
    "Latest news, articles, and insights on Nigerian Naira exchange rates. Learn about currency trends, forex trading tips, and economic analysis.",
  keywords: [
    "currency blog",
    "forex news",
    "exchange rate news",
    "naira news",
    "fx insights",
    "economic analysis",
    "currency trends",
  ],
  openGraph: {
    title: "FX Blog & Currency News",
    description:
      "Latest articles on exchange rates, forex trends, and economic insights.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency & FX News Blog",
    description: "Latest insights on Nigerian Naira and exchange rates",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
