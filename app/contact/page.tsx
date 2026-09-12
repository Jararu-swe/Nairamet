import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with NairaMet",
  description:
    "Have questions about NairaMet? Contact our team for support, feedback, partnership inquiries, or advertising opportunities. We're here to help.",
  keywords: [
    "contact nairamet",
    "nairamet support",
    "nairamet email",
    "nairamet feedback",
    "contact us",
    "nairamet help",
  ],
  openGraph: {
    title: "Contact Us | NairaMet",
    description:
      "Have questions about NairaMet? Contact our team for support, feedback, or partnership inquiries.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com";

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
        name: "Contact Us",
        item: `${baseUrl}/contact`,
      },
    ],
  };

  const contactChannels = [
    {
      icon: Mail,
      title: "General Support",
      description: "For questions, bug reports, and general inquiries.",
      action: "support@nairamet.com",
      href: "mailto:support@nairamet.com",
      badge: "Responds within 24 hours",
    },
    {
      icon: MessageSquare,
      title: "Feedback & Suggestions",
      description:
        "Have an idea for a new feature or improvement? We'd love to hear it.",
      action: "feedback@nairamet.com",
      href: "mailto:feedback@nairamet.com?subject=Feature%20Suggestion%20for%20NairaMet",
      badge: "We read every message",
    },
    {
      icon: ExternalLink,
      title: "Partnerships & Advertising",
      description:
        "Interested in advertising on NairaMet or exploring a partnership?",
      action: "partnerships@nairamet.com",
      href: "mailto:partnerships@nairamet.com?subject=Partnership%20Inquiry",
      badge: "Business inquiries",
    },
  ];

  const faqItems = [
    {
      q: "Is NairaMet free to use?",
      a: "Yes, 100%. All features — live rates, charts, converters, rate logs, and widgets — are completely free with no sign-up required.",
    },
    {
      q: "Where do you get your exchange rates?",
      a: "We aggregate rates from the Central Bank of Nigeria (CBN), licensed Bureau de Change operators, and verified parallel market sources. Read more on our About page.",
    },
    {
      q: "Can I use NairaMet data on my website?",
      a: "Yes! We offer free embeddable widgets on our FX Tools page that you can add to your website or blog.",
    },
    {
      q: "How do I report an incorrect rate?",
      a: "Please email support@nairamet.com with the details (currency pair, rate shown, expected rate, and timestamp) and we'll investigate promptly.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/5 via-background to-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              Contact{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                NairaMet
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a question, found a bug, or want to partner with us? We&apos;re
              here to help. Choose the best channel below and we&apos;ll get back to
              you as quickly as possible.
            </p>
          </div>
        </section>

        {/* Contact Channels */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {contactChannels.map((channel, i) => (
                <a
                  key={i}
                  href={channel.href}
                  className="group p-6 rounded-3xl bg-card border border-border/70 hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:bg-emerald-500/20 transition-colors">
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{channel.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {channel.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:underline">
                      {channel.action}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {channel.badge}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>

            {/* Location & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <Card className="rounded-3xl border border-border/70 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Our Location</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Lagos, Nigeria
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      NairaMet is a digital-first platform serving users across
                      Nigeria and the diaspora.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border border-border/70 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">
                      Response Times
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      General support: within 24 hours
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Urgent rate issues: within 4 hours
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Monday – Saturday, 8:00 AM – 8:00 PM WAT
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick FAQ */}
        <section className="py-16 bg-muted/20 border-y border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Before You Contact Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-sm">
                You might find your answer here before reaching out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {faqItems.map((item, i) => (
                <Card
                  key={i}
                  className="rounded-2xl border border-border/60 p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-2">{item.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Links */}
        <div className="py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground space-y-2">
            <p>
              <Link
                href="/about"
                className="hover:text-emerald-600 transition-colors"
              >
                About Us
              </Link>
              {" · "}
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
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
