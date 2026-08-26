"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  BarChart3,
  Search,
  BookOpen,
  Wrench,
  ArrowRight,
  ArrowUpDown,
  Star,
  Users,
  Shield,
  Zap,
  Check,
  Percent,
  Sparkles,
  HelpCircle,
  Globe,
  Briefcase,
  GraduationCap,
  LineChart,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { LiveCurrencyRates } from "@/components/live-currency-rates";
import { UserCountBadge } from "@/components/user-count-badge";
import { InFeedAd, BottomBannerAd } from "@/components/monetag-ad";
import { LazyLeaderboardAdWrapper } from "@/components/lazy-ad-wrappers";

interface LandingPageContentProps {
  initialRates?: any[];
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "https://flagcdn.com/w40/us.png", rate: 1640, parallel: 1690, change: "+0.45%" },
  { code: "GBP", name: "British Pound", flag: "https://flagcdn.com/w40/gb.png", rate: 2060, parallel: 2140, change: "+0.32%" },
  { code: "EUR", name: "Euro", flag: "https://flagcdn.com/w40/eu.png", rate: 1750, parallel: 1820, change: "-0.15%" },
  { code: "CAD", name: "Canadian Dollar", flag: "https://flagcdn.com/w40/ca.png", rate: 1180, parallel: 1230, change: "+0.28%" },
  { code: "CNY", name: "Chinese Yuan", flag: "https://flagcdn.com/w40/cn.png", rate: 228, parallel: 238, change: "+0.10%" },
  { code: "AED", name: "UAE Dirham", flag: "https://flagcdn.com/w40/ae.png", rate: 446, parallel: 460, change: "+0.05%" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "https://flagcdn.com/w40/gh.png", rate: 110, parallel: 118, change: "-0.20%" },
  { code: "ZAR", name: "South African Rand", flag: "https://flagcdn.com/w40/za.png", rate: 92, parallel: 98, change: "+0.60%" },
];

const POPULAR_CONVERSIONS = [
  { label: "$100 USD to NGN", href: "/convert/100-usd-to-ngn" },
  { label: "$500 USD to NGN", href: "/convert/500-usd-to-ngn" },
  { label: "$1,000 USD to NGN", href: "/convert/1000-usd-to-ngn" },
  { label: "£100 GBP to NGN", href: "/convert/100-gbp-to-ngn" },
  { label: "£500 GBP to NGN", href: "/convert/500-gbp-to-ngn" },
  { label: "€100 EUR to NGN", href: "/convert/100-eur-to-ngn" },
  { label: "$100 CAD to NGN", href: "/convert/100-cad-to-ngn" },
  { label: "¥1,000 CNY to NGN", href: "/convert/1000-cny-to-ngn" },
  { label: "100 AED to NGN", href: "/convert/100-aed-to-ngn" },
  { label: "500 GHS to NGN", href: "/convert/500-ghs-to-ngn" },
  { label: "USD / NGN Rates", href: "/rates/usd-ngn" },
  { label: "GBP / NGN Rates", href: "/rates/gbp-ngn" },
  { label: "EUR / NGN Rates", href: "/rates/eur-ngn" },
  { label: "CAD / NGN Rates", href: "/rates/cad-ngn" },
  { label: "Historical FX Logs", href: "/logs" },
  { label: "Interactive FX Charts", href: "/charts" },
];

const FAQ_ITEMS = [
  {
    q: "What is NairaMet and how does it source rates?",
    a: "NairaMet is an open, transparent foreign exchange intelligence platform for Nigeria. We continuously aggregate and verify rates from the Central Bank of Nigeria (CBN official window), verified Bureau de Change (BDC) operators, and active parallel market exchanges to provide unbiased FX insights.",
  },
  {
    q: "What is the difference between CBN and Parallel market rates?",
    a: "The CBN rate is the official window rate managed by the Central Bank of Nigeria for registered institutional transactions and official allocations. The Parallel (or Black Market) rate reflects real-time street liquidity and supply-demand forces where most retail, business remittance, and private FX exchanges occur.",
  },
  {
    q: "Is NairaMet 100% free to use?",
    a: "Yes! NairaMet is completely free with no paywalls or subscription tiers. You get instant access to live exchange rates, historical interactive charts, conversion tools, and searchable rate archives without having to sign up or pay.",
  },
  {
    q: "How frequently are exchange rates updated?",
    a: "Our rate feeds refresh continuously throughout the day during active trading hours to capture rapid intraday shifts across parallel and interbank markets.",
  },
  {
    q: "Can I embed NairaMet rates on my own website or blog?",
    a: "Yes! We provide clean, embeddable currency widgets on our Tools page that webmasters, bloggers, and e-commerce platforms can add to their websites for free.",
  },
];

function LandingPageInner({ initialRates }: LandingPageContentProps) {
  // Hero converter state
  const [sendAmount, setSendAmount] = useState<string>("1000");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [rateSource, setRateSource] = useState<"parallel" | "cbn">("parallel");

  // Rotating header currency
  const [rotatingCurrency, setRotatingCurrency] = useState("USD");
  const [fade, setFade] = useState(true);

  const currencies = ["USD", "GBP", "EUR", "CAD", "CNY", "AED", "GHS", "ZAR"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRotatingCurrency((prev) => {
          const next = currencies.filter((c) => c !== prev);
          return next[Math.floor(Math.random() * next.length)];
        });
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Compute conversion
  const currentCurrencyData =
    SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency) || SUPPORTED_CURRENCIES[0];
  const activeRate =
    rateSource === "parallel" ? currentCurrencyData.parallel : currentCurrencyData.rate;
  const numAmount = parseFloat(sendAmount) || 0;
  const calculatedNgn = Math.round(numAmount * activeRate);



  const stats = [
    { label: "Data Points Processed", value: "1M+", subtitle: "Live Daily FX Quotes", icon: Zap },
    { label: "Update Frequency", value: "24/7", subtitle: "Real-Time Tracking", icon: Shield },
    { label: "Data Sources", value: "3+", subtitle: "CBN, BDC & Parallel", icon: Users },
    { label: "Conversion Speed", value: "<10ms", subtitle: "Instant Calculation", icon: Star },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Select Currency & Market Source",
      description:
        "Pick between the Parallel Black Market or Central Bank (CBN) official rates across 8+ major world currencies.",
      icon: Layers,
    },
    {
      step: "02",
      title: "Inspect the Real Mid-Market Spread",
      description:
        "Compare official CBN benchmarks against street rates with zero hidden markups or inflated fees.",
      icon: Percent,
    },
    {
      step: "03",
      title: "Execute & Plan with Confidence",
      description:
        "Calculate exact sums, study interactive historical trend charts, or embed live widgets onto your site.",
      icon: CheckCircle2,
    },
  ];

  const userPersonas = [
    {
      icon: Globe,
      title: "Diaspora Remitters",
      description: "Send money home to family in Nigeria knowing the exact street rate so you get maximum value for every dollar, pound, or euro.",
    },
    {
      icon: Briefcase,
      title: "Importers & Businesses",
      description: "Budget container shipments, overseas software subscriptions, and international supplier invoices with transparent rate benchmarks.",
    },
    {
      icon: GraduationCap,
      title: "International Students",
      description: "Plan tuition payments and living expenses in the UK, US, Canada, and Europe without surprise exchange rate fees.",
    },
    {
      icon: LineChart,
      title: "FX Traders & Analysts",
      description: "Monitor daily CBN monetary policy developments, track black market volatility, and inspect multi-year rate historical logs.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── 1. HERO SECTION (Wise-Inspired Dual Converter Layout) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/5 via-background to-background pt-10 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Nigeria's Transparent FX Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
                The transparent{" "}
                <span
                  className={`inline-block text-emerald-600 dark:text-emerald-400 transition-all duration-300 ${
                    fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  {rotatingCurrency}
                </span>{" "}
                to Naira rate.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Compare real-time rates from the Central Bank, Bureau de Change, and parallel market. No markups, no hidden costs.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-13 px-8 text-base shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <Link href="/tracker">
                    <span>Explore Live Rates</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border/80 hover:bg-muted font-bold h-13 px-8 text-base"
                >
                  <Link href="/charts">
                    <BarChart3 className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>View FX Charts</span>
                  </Link>
                </Button>
              </div>

              {/* User Trust Counter Badge */}
              <div className="pt-4 flex justify-center lg:justify-start">
                <UserCountBadge />
              </div>
            </div>

            {/* Right Column: Signature Wise-Style Dual Stacked Converter */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 relative">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm">Instant FX Calculator</span>
                  </div>

                  {/* Rate Source Selector */}
                  <div className="flex rounded-full bg-muted p-0.5 border border-border/50 text-xs font-semibold">
                    <button
                      onClick={() => setRateSource("parallel")}
                      className={`px-3 py-1 rounded-full transition-all ${
                        rateSource === "parallel"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Parallel
                    </button>
                    <button
                      onClick={() => setRateSource("cbn")}
                      className={`px-3 py-1 rounded-full transition-all ${
                        rateSource === "cbn"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      CBN
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {/* Top Layer: "You Send" */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 focus-within:border-emerald-500 transition-colors">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    </label>
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="bg-transparent border-0 text-2xl sm:text-3xl font-black text-foreground p-0 h-auto focus-visible:ring-0 shadow-none"
                        placeholder="1000"
                      />
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="w-36 rounded-full bg-background border border-border/80 font-bold text-sm h-11 px-3 shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/80">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code} className="font-semibold py-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={c.flag}
                                  alt={c.code}
                                  className="w-4 h-3 rounded object-cover"
                                />
                                <span>{c.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Middle Step: Transparent Rate Breakdown Indicator */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>1 {selectedCurrency} = ₦{activeRate.toLocaleString()} ({rateSource.toUpperCase()})</span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">

                    </div>
                  </div>

                  {/* Bottom Layer: "Recipient Gets" */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                       (NGN)
                    </label>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 truncate">
                        ₦{calculatedNgn.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-background border border-border/80 font-bold text-sm h-11 shadow-sm">
                        <img
                          src="https://flagcdn.com/w40/ng.png"
                          alt="Nigeria"
                          className="w-4 h-3 rounded object-cover"
                        />
                        <span>NGN</span>
                      </div>
                    </div>
                  </div>

                  {/* Link to Full Tracker */}
                  <Button
                    asChild
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-sm shadow-md shadow-emerald-600/10"
                  >
                    <Link href="/tracker">
                      <span>View Detailed FX Breakdown</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Rate Preview Strip */}
          <div className="mt-14">
            <LiveCurrencyRates initialRates={initialRates} />
          </div>
        </div>
      </section>

      {/* ── 2. STATS SECTION ── */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-card border border-border/60 text-center hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="font-bold text-sm text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. LIVE CBN VS PARALLEL MARKET SPREAD MATRIX ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Live Spread Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-3">
                CBN Official vs Parallel Market Rates.
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Real-time rate spreads across major currencies in Nigeria.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full font-bold border-border/80 self-start md:self-auto">
              <Link href="/tracker">
                <span>View Full Market Tracker</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUPPORTED_CURRENCIES.map((item) => {
              const spread = item.parallel - item.rate;
              const spreadPercent = ((spread / item.rate) * 100).toFixed(1);
              return (
                <div
                  key={item.code}
                  className="p-5 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <img src={item.flag} alt={item.name} className="w-7 h-5 rounded object-cover shadow-sm" />
                        <div>
                          <div className="font-black text-base">{item.code} / NGN</div>
                          <div className="text-xs text-muted-foreground">{item.name}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                        {item.change}
                      </Badge>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-border/50 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs font-medium">Parallel Market:</span>
                        <span className="font-extrabold text-foreground">₦{item.parallel.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs font-medium">CBN Official:</span>
                        <span className="font-bold text-muted-foreground">₦{item.rate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed border-border/60">
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Spread:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          +₦{spread} ({spreadPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/50 grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="w-full rounded-xl text-xs font-bold h-9 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-neutral-950 transition-all shadow-sm"
                    >
                      <Link
                        href={`/convert/100-${item.code.toLowerCase()}-to-ngn`}
                        className="flex items-center justify-center text-center w-full"
                      >
                        Convert
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl text-xs font-bold h-9 border-border/90 bg-card text-foreground hover:bg-neutral-100 hover:text-foreground dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-emerald-500/50 transition-all shadow-sm"
                    >
                      <Link
                        href={`/rates/${item.code.toLowerCase()}-ngn`}
                        className="flex items-center justify-center text-center w-full"
                      >
                        History
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. HOW NAIRAMET WORKS (3-Step Interactive Process) ── */}
      <section className="py-20 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Simple &amp; Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              How NairaMet powers smart currency decisions.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Get the full picture of Nigeria&apos;s foreign exchange landscape in three straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-emerald-600/30 dark:text-emerald-400/30">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHO NAIRAMET IS BUILT FOR (Use-case Audience Cards) ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Built For Everyone
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Designed for Nigeria&apos;s FX ecosystem.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Whether sending tuition, trading commodities, or managing remittances, NairaMet provides clear clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userPersonas.map((persona, idx) => (
              <Card
                key={idx}
                className="rounded-3xl border border-border/70 hover:border-emerald-500/40 hover:shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                    <persona.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{persona.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD AD (Google AdSense) ── */}
      <LazyLeaderboardAdWrapper />

      {/* ── 6. THE NAIRAMET ADVANTAGE (Why Transparency Matters) ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              The NairaMet Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Why smart Nigerians choose NairaMet over traditional channels.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              See how our transparent, real-time approach compares against opaque bank spreads and street exchangers.
            </p>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="overflow-x-auto mb-16">
            <div className="min-w-[640px] rounded-3xl border border-border/80 bg-card overflow-hidden shadow-lg">
              <div className="grid grid-cols-12 bg-muted/40 p-4 font-bold text-sm border-b border-border/60">
                <div className="col-span-4 text-foreground">Feature / Benefit</div>
                <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> NairaMet
                </div>
                <div className="col-span-3 text-muted-foreground">Commercial Banks</div>
                <div className="col-span-2 text-muted-foreground">Street Hawkers</div>
              </div>

              <div className="divide-y divide-border/50 text-sm">
                <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 font-semibold text-foreground">Rate Transparency</div>
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Real Mid-Market &amp; Parallel
                  </div>
                  <div className="col-span-3 text-muted-foreground">Opaque markups (3-7%)</div>
                  <div className="col-span-2 text-muted-foreground">Unregulated spreads</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 font-semibold text-foreground">Update Frequency</div>
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Live Intraday Feeds
                  </div>
                  <div className="col-span-3 text-muted-foreground">Once daily or delayed</div>
                  <div className="col-span-2 text-muted-foreground">Inconsistent / Verbal</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 font-semibold text-foreground">Access &amp; Pricing</div>
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> 100% Free, No Sign-Up
                  </div>
                  <div className="col-span-3 text-muted-foreground">Requires Bank Account</div>
                  <div className="col-span-2 text-muted-foreground">Cash &amp; Physical Risk</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 font-semibold text-foreground">Historical Trend Charts</div>
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Multi-Year Interactive
                  </div>
                  <div className="col-span-3 text-muted-foreground">None available</div>
                  <div className="col-span-2 text-muted-foreground">None available</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 font-semibold text-foreground">Multi-Source Verification</div>
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> CBN + BDC + Parallel
                  </div>
                  <div className="col-span-3 text-muted-foreground">Single closed rate</div>
                  <div className="col-span-2 text-muted-foreground">Single dealer quote</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Trust Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Zero Hidden Markups</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We do not sell currency or take spreads on conversions. Our sole mission is to provide unfiltered, accurate rate visibility so you never overpay.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Multi-Source Triangulation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We continuously aggregate data from official CBN bulletins, Bureau de Change desks, and street parallel markets to display the real spread.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Frictionless &amp; Instant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No accounts to register, no emails to provide, and zero paywalls. Jump right into live rate tracking, historical charts, and conversion calculators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. POPULAR CURRENCY CONVERSIONS & QUICK LINKS (SEO Matrix) ── */}
      <section className="py-16 bg-muted/20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-foreground">
              Popular Nigerian Currency Conversions
            </h3>
            <p className="text-sm text-muted-foreground">
              Quick access to popular rate calculations, currency pairs, and historical archive tools.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
            {POPULAR_CONVERSIONS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-4 py-2 rounded-full bg-card border border-border/70 hover:border-emerald-500 hover:text-emerald-600 text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN-FEED VIEW-BASED AD ── */}
      <div className="max-w-7xl mx-auto px-4 my-6">
        <InFeedAd />
      </div>

      {/* ── 8. FREQUENTLY ASKED QUESTIONS (FAQ Accordion) ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Frequently Asked Questions.
            </h2>
            <p className="text-muted-foreground text-base">
              Learn more about how Nigerian FX rates, spreads, and market data work.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="rounded-2xl border border-border/70 bg-card px-6 py-1 data-[state=open]:border-emerald-500/50 transition-all shadow-sm"
              >
                <AccordionTrigger className="text-left font-bold text-base hover:text-emerald-600 hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 9. TRANSPARENCY PROMISE (Wise-Style Callout) ── */}
      <section className="py-16 bg-emerald-600 text-white rounded-3xl mx-4 sm:mx-8 my-10 overflow-hidden relative shadow-2xl shadow-emerald-600/20">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur">
            100% Free &amp; Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-balance">
            Real market rates without the guesswork.
          </h2>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            We aggregate multiple verified sources so you know the exact CBN and Parallel spread before exchanging currency.
          </p>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white hover:bg-white/90 text-emerald-900 font-bold h-13 px-8 text-base shadow-lg"
            >
              <Link href="/tracker">
                <span>Start Tracking Rates Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="border-t border-border/60 bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Image src="/Nairamet.svg" alt="NairaMet Logo" width={22} height={22} />
                </div>
                <span className="font-extrabold text-xl tracking-tight">
                  Naira<span className="text-emerald-600">Met</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Nigeria&apos;s FX Platform, Simplified. Real-time rates from CBN, BDC, and the parallel market.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Badge className="rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950 border-0 font-bold px-3 py-1 text-xs shadow-sm">
                  100% Free
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/50 font-bold px-3.5 py-1 text-xs shadow-sm inline-flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
                >
                  <span>Made in Nigeria</span>
                  <span className="text-sm leading-none">🇳🇬</span>
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-foreground">Tools</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/tracker" className="hover:text-emerald-600 transition-colors">Live Rates Tracker</Link></li>
                <li><Link href="/charts" className="hover:text-emerald-600 transition-colors">Historical FX Charts</Link></li>
                <li><Link href="/logs" className="hover:text-emerald-600 transition-colors">Searchable Rate Logs</Link></li>
                <li><Link href="/tools" className="hover:text-emerald-600 transition-colors">Embeddable Widgets</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-foreground">Resources &amp; Legal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-emerald-600 transition-colors">Naira Watch Blog</Link></li>
                <li><Link href="/guides" className="hover:text-emerald-600 transition-colors">FX Guides</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-emerald-600 transition-colors">Financial Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>&copy; {new Date().getFullYear()} NairaMet. All rights reserved.</div>
            <div>Rates are for informational purposes only.</div>
          </div>
        </div>
      </footer>

      {/* Bottom Sticky Ad Bar */}
      <BottomBannerAd />
    </div>
  );
}

export default function LandingPageContent({ initialRates }: LandingPageContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LandingPageInner initialRates={initialRates} />
    </Suspense>
  );
}
