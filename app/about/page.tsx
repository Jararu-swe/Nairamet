import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Shield,
  BarChart3,
  Zap,
  Users,
  Mail,
  Target,
  Eye,
  Database,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Nigeria's Transparent FX Platform",
  description:
    "Learn about NairaMet — Nigeria's transparent foreign exchange platform. Discover our mission, how we source real-time Naira rates, and our commitment to FX transparency.",
  keywords: [
    "about nairamet",
    "nairamet team",
    "nigeria fx platform",
    "exchange rate platform",
    "naira exchange rate source",
    "transparent fx rates",
    "about us",
  ],
  openGraph: {
    title: "About NairaMet | Nigeria's Transparent FX Platform",
    description:
      "Learn about NairaMet — our mission, how we source real-time Naira rates, and our commitment to FX transparency.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NairaMet",
    url: baseUrl,
    logo: `${baseUrl}/Nairamet.png`,
    description:
      "Nigeria's transparent foreign exchange intelligence platform providing real-time Naira rates from CBN, BDC, and parallel markets.",
    foundingDate: "2025",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@nairamet.com",
      contactType: "customer support",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    sameAs: [
      "https://twitter.com/nairamet",
      "https://facebook.com/nairamet",
      "https://linkedin.com/company/nairamet",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: `${baseUrl}/about`,
      },
    ],
  };

  const dataSources = [
    {
      icon: Shield,
      title: "Central Bank of Nigeria (CBN)",
      description:
        "Official interbank rates published through the CBN's Investors & Exporters (I&E) foreign exchange window, updated throughout each business day.",
    },
    {
      icon: Users,
      title: "Bureau de Change (BDC)",
      description:
        "Rates from licensed Bureau de Change operators across Lagos, Abuja, and other major Nigerian cities, verified against multiple dealer quotes.",
    },
    {
      icon: Globe,
      title: "Parallel Market Sources",
      description:
        "Real-time street-level parallel (black market) rates aggregated from verified exchange networks in Lagos, Abuja, Port Harcourt, and Kano.",
    },
  ];

  const values = [
    {
      icon: Eye,
      title: "Radical Transparency",
      description:
        "We believe every Nigerian deserves to see the real exchange rate — not a rate inflated by hidden bank markups or opaque spreads. We show you the raw data.",
    },
    {
      icon: Database,
      title: "Data Integrity",
      description:
        "Every rate we display is cross-referenced against multiple independent sources. We never fabricate rates, and we clearly label each data source.",
    },
    {
      icon: Zap,
      title: "Accessibility First",
      description:
        "NairaMet is 100% free, requires no sign-up, and works on any device. We believe financial literacy tools should be available to everyone, not locked behind paywalls.",
    },
    {
      icon: Target,
      title: "Nigerian-First Design",
      description:
        "Built by Nigerians, for Nigerians. Every feature — from the currency pairs we track to the market terminology we use — is designed for the Nigerian FX ecosystem.",
    },
  ];

  const stats = [
    { label: "Currency Pairs Tracked", value: "13+" },
    { label: "Data Sources", value: "3+" },
    { label: "Update Frequency", value: "24/7" },
    { label: "Cost to Users", value: "₦0" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/5 via-background to-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>About NairaMet</span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                  <Image
                    src="/Nairamet.svg"
                    alt="NairaMet Logo"
                    width={40}
                    height={40}
                  />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Nigeria&apos;s FX Platform,{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Simplified.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                NairaMet is a free, transparent foreign exchange intelligence
                platform that provides real-time Naira exchange rates from
                multiple verified sources — the Central Bank, Bureau de Change
                operators, and the parallel market — so you can make informed
                currency decisions without hidden markups.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-12 bg-muted/30 border-y border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Making Nigerian FX rates transparent and accessible to everyone.
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                For too long, Nigerians have had to rely on word-of-mouth,
                opaque bank spreads, and inconsistent street quotes to understand
                what their Naira is actually worth. NairaMet was built to change
                that.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                We aggregate exchange rates from the Central Bank of Nigeria
                (CBN), verified Bureau de Change operators, and parallel market
                networks — then present them clearly, side by side, with
                interactive charts, historical data, and conversion tools. No
                markups. No hidden fees. No sign-up required.
              </p>
            </div>
          </div>
        </section>

        {/* How We Source Data */}
        <section className="py-16 bg-muted/20 border-y border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Data Methodology
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                How we source and verify exchange rates.
              </h2>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                NairaMet aggregates rates from three independent categories of
                sources, then cross-references them to ensure accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dataSources.map((source, i) => (
                <Card
                  key={i}
                  className="rounded-3xl border border-border/70 hover:border-emerald-500/40 transition-all p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    <source.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{source.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {source.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-10 bg-card border border-border/60 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <strong className="text-foreground">Important:</strong> NairaMet
                is a data aggregation and informational platform. We do{" "}
                <strong>not</strong> buy, sell, or exchange currency. All rates
                are for informational purposes only and may differ from actual
                transaction rates. Please read our{" "}
                <Link
                  href="/disclaimer"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  Financial Disclaimer
                </Link>{" "}
                for full details.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                What drives every decision we make.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-2xl border border-border/60 hover:border-emerald-500/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 bg-muted/20 border-y border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Platform Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Everything you need for Nigerian FX.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: "Live Rate Tracker",
                  description:
                    "Real-time CBN, BDC, and parallel market rates for 13+ currency pairs, updated continuously throughout the day.",
                  link: "/tracker",
                },
                {
                  icon: Globe,
                  title: "Interactive Charts",
                  description:
                    "Multi-timeframe historical charts showing rate trends, spreads, and volatility patterns over weeks, months, and years.",
                  link: "/charts",
                },
                {
                  icon: Zap,
                  title: "Instant Converter",
                  description:
                    "Convert any amount between Naira and major world currencies using real-time parallel or CBN rates.",
                  link: "/convert/100-usd-to-ngn",
                },
                {
                  icon: Database,
                  title: "Searchable Rate Logs",
                  description:
                    "Searchable archive of historical exchange rate data, filterable by date, currency pair, and market source.",
                  link: "/logs",
                },
                {
                  icon: Target,
                  title: "Embeddable Widgets",
                  description:
                    "Free currency widgets that bloggers, businesses, and webmasters can embed on their own websites.",
                  link: "/tools",
                },
                {
                  icon: CheckCircle2,
                  title: "NairaWatch Blog",
                  description:
                    "Daily FX news, CBN policy updates, and market analysis curated for the Nigerian audience.",
                  link: "/blog",
                },
              ].map((feature, i) => (
                <Link
                  key={i}
                  href={feature.link}
                  className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-emerald-500/40 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have questions or feedback?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              We&apos;d love to hear from you. Whether you have a question about
              our data, a feature request, or partnership inquiry — reach out
              anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/80 hover:bg-muted font-bold text-sm transition-all"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>

        {/* Legal Footer Note */}
        <div className="border-t border-border/50 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground space-y-2">
            <p>
              © {new Date().getFullYear()} NairaMet. All rights reserved.
              NairaMet is a product of Lagos, Nigeria.
            </p>
            <p>
              <Link
                href="/privacy"
                className="hover:text-emerald-600 transition-colors"
              >
                Privacy Policy
              </Link>
              {" · "}
              <Link
                href="/terms"
                className="hover:text-emerald-600 transition-colors"
              >
                Terms of Service
              </Link>
              {" · "}
              <Link
                href="/disclaimer"
                className="hover:text-emerald-600 transition-colors"
              >
                Disclaimer
              </Link>
              {" · "}
              <Link
                href="/contact"
                className="hover:text-emerald-600 transition-colors"
              >
                Contact
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
