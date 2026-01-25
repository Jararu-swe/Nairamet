import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency Tools & FX Calculators | NairaMet",
  description:
    "Use our free currency conversion tools, FX calculators, and Nigerian exchange rate utilities. Convert currencies instantly with live rates.",
  keywords: [
    "currency converter",
    "fx calculator",
    "currency calculator",
    "rate converter",
    "online converter",
    "currency tools",
  ],
  openGraph: {
    title: "Currency Tools & Calculators",
    description: "Free FX tools and currency converters for Nigerian Naira",
    type: "website",
    url: "/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Conversion Tools",
    description: "Free online currency converter and FX calculators",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
