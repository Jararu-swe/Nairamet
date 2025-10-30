"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Bell,
  BarChart3,
  Search,
  BookOpen,
  Wrench,
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap,
  Check,
  Crown,
  Gift,
} from "lucide-react";
import { useState } from "react";
import RequireAuthButton from "@/components/require-auth-button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LiveCurrencyRates } from "@/components/live-currency-rates";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuth();

  const handleStartFreeClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Live Exchange Rates",
      description:
        "Real-time USD/NGN, GBP/NGN, EUR/NGN, CNY/NGN rates from CBN, black market, and remittance sources",
      href: "/tracker",
      color: "text-emerald-600",
      isFree: true,
    },
    {
      icon: BookOpen,
      title: "Naira Watch Blog",
      description:
        "Weekly summaries, policy analysis, and educational content about Nigerian FX markets",
      href: "/blog",
      color: "text-red-600",
      isFree: true,
    },
    {
      icon: Bell,
      title: "Smart Rate Alerts",
      description:
        "Get notified via email and push notifications when rates hit your target thresholds",
      href: "/alerts",
      color: "text-blue-600",
      isFree: true,
    },
    {
      icon: BarChart3,
      title: "Historical Charts",
      description:
        "Visualize rate trends over time with interactive charts and compare official vs black market rates",
      href: "/charts",
      color: "text-purple-600",
      isFree: true,
    },
    {
      icon: Search,
      title: "Searchable Rate Logs",
      description:
        "Find historical rates for any date, calculate averages, and export data as PDF/CSV",
      href: "/logs",
      color: "text-orange-600",
      isFree: true,
    },
    {
      icon: Wrench,
      title: "Advanced Widgets & Tools",
      description:
        "Embeddable widgets, advanced calculators, and currency strength maps for developers",
      href: "/tools",
      color: "text-teal-600",
      isFree: true,
    },
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Rate Updates Daily", value: "1M+", icon: Zap },
    { label: "Accuracy Rate", value: "99.9%", icon: Shield },
    { label: "User Rating", value: "4.9/5", icon: Star },
  ];

  const pricingFeatures = {
    free: [
      "Real-time exchange rates",
      "Naira Watch blog access",
      "Basic widgets & tools",
      "1 rate alert",
      "7-day historical charts",
      "Email support",
    ],
    premium: [
      "Everything in Free",
      "Unlimited rate alerts",
      "Full historical data (1+ years)",
      "Advanced charts & analytics",
      "Searchable rate logs",
      "PDF/CSV exports",
      "Custom branded widgets",
      "Priority support",
      "API access",
    ],
  };

  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      role: "Forex Trader",
      content:
        "NairaMet's alerts saved me thousands when the naira dropped. The accuracy is unmatched!",
      rating: 5,
    },
    {
      name: "Sarah Ikechukwu",
      role: "Business Owner",
      content:
        "I use NairaMet daily for my import business. The historical data helps me plan better.",
      rating: 5,
    },
    {
      name: "Michael Adeyemi",
      role: "Financial Analyst",
      content:
        "The most comprehensive FX platform for Nigerian markets. Premium features are worth every kobo.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* AuthModal is rendered globally by AuthProvider */}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="text-emerald-700 border-emerald-200 bg-emerald-50"
              >
                🇳🇬 Nigeria's #1 FX Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
                Track Naira Exchange Rates
                <span className="text-emerald-600"> Like a Pro</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Get real-time USD/NGN, GBP/NGN, EUR/NGN rates from CBN, black
                market, and parallel sources. Set alerts, analyze trends, and
                make informed currency decisions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/tracker">
                  <Gift className="w-4 h-4 mr-2" />
                  Start Free Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Live Rate Preview */}
            <LiveCurrencyRates />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-emerald-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for FX Trading
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All features are available for free — no upgrade required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
              >
                <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-white">
                  FREE
                </Badge>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${feature.color}`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.isFree ? (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-between group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20"
                    >
                      <Link href={feature.href}>
                        <>
                          Use Free
                          <ArrowRight className="w-4 h-4" />
                        </>
                      </Link>
                    </Button>
                  ) : (
                    <RequireAuthButton
                      href={feature.href}
                      variant="ghost"
                      className="w-full justify-between group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20"
                    >
                      <>
                        Use Free
                        <ArrowRight className="w-4 h-4" />
                      </>
                    </RequireAuthButton>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need advanced features
            </p>
          </div>

          <div className="flex justify-center max-w-5xl mx-auto">
            {/* Free Plan (improved) */}
            <div className="w-full sm:w-3/4 lg:w-1/2">
              <Card className="relative border-emerald-100">
                <CardHeader className="text-center pb-6">
                  <Badge className="w-fit mx-auto mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                    MOST POPULAR
                  </Badge>
                  <CardTitle className="text-2xl mb-1">Free</CardTitle>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    Completely free
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Full access to live rates, alerts, tools and 7-day
                    historical data.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-sm text-muted-foreground font-medium mb-2">
                    Included
                  </div>
                  <ul className="space-y-3">
                    {pricingFeatures.free.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href="/tracker" onClick={handleStartFreeClick}>
                      Use Live Rates — Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    No credit card required • Free for personal & small business
                    use
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Nigerian Traders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users say about NairaMet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Master Naira Exchange Rates?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 text-pretty">
            All features are free — get started now. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              <Link href="/tracker" onClick={handleStartFreeClick}>
                <Gift className="w-4 h-4 mr-2" />
                Start Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-emerald-200 mt-4">
            Join 50,000+ users who trust NairaMet
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">NairaMet</h3>
              <p className="text-sm">
                Nigeria's most trusted platform for real-time exchange rates and
                FX market insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/tracker" className="hover:text-white">
                    Live Rates
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="hover:text-white">
                    Rate Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/charts" className="hover:text-white">
                    Charts
                  </Link>
                </li>
                <li>
                  <Link href="/logs" className="hover:text-white">
                    Rate Logs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Naira Watch
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white">
                    Widgets
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; 2024 NairaMet. All rights reserved. Rates are for
              informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
