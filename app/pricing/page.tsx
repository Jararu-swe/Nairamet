import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  Gift,
  ArrowRight,
  Shield,
  CreditCard,
  Smartphone,
  Clock,
  Star,
  Users,
  Zap,
} from "lucide-react";

export default function PricingPage() {
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
      "WhatsApp & Telegram alerts",
    ],
  };

  const paymentMethods = [
    {
      name: "Debit/Credit Card",
      description: "Visa, Mastercard, Verve",
      icon: CreditCard,
      popular: true,
    },
    {
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: Smartphone,
      popular: false,
    },
    {
      name: "USSD Payment",
      description: "*737# and other codes",
      icon: Smartphone,
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. No questions asked.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Premium comes with a 7-day free trial. No credit card required to start.",
    },
    {
      question: "What happens to my data if I downgrade?",
      answer:
        "Your data is preserved. You'll just lose access to premium features until you upgrade again.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all premium subscriptions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="text-emerald-700 border-emerald-200 bg-emerald-50 mb-4"
          >
            💳 Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Choose Your <span className="text-emerald-600">NairaMet</span> Plan
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            All features are free — support development to keep the service
            running
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <Badge className="w-fit mx-auto mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                  MOST POPULAR
                </Badge>
                <CardTitle className="text-2xl mb-2">Free Forever</CardTitle>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  ₦0
                </div>
                <p className="text-muted-foreground">
                  Perfect for casual users
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pricingFeatures.free.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/tracker">
                    <Gift className="w-4 h-4 mr-2" />
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No credit card required
                </p>
              </CardContent>
            </Card>

            {/* Removed donation/support card - features are free */}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Secure Payment Options
            </h2>
            <p className="text-muted-foreground">
              Choose your preferred payment method
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <Card
                key={index}
                className={`text-center ${
                  method.popular ? "border-emerald-200" : ""
                }`}
              >
                {method.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-white">
                    Popular
                  </Badge>
                )}
                <CardContent className="pt-6">
                  <method.icon className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <h3 className="font-semibold mb-2">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL encryption • PCI DSS compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50K+", icon: Users },
              { label: "Uptime", value: "99.9%", icon: Zap },
              { label: "User Rating", value: "4.9/5", icon: Star },
              { label: "Countries", value: "15+", icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Upgrade Your FX Trading?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 text-pretty">
            Join thousands of traders who trust NairaMet for accurate, real-time
            exchange rates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Link href="/tracker">
                <Gift className="w-4 h-4 mr-2" />
                Start Free Forever
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/tracker">
                <Crown className="w-4 h-4 mr-2" />
                Support Us
              </Link>
            </Button>
          </div>
          <p className="text-sm text-emerald-200 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
