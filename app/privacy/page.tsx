import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { BottomBannerAd } from "@/components/monetag-ad";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description:
    "Learn how NairaMet collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "nairamet privacy",
    "data security",
    "GDPR compliance",
    "cookie policy",
  ],
  openGraph: {
    title: "Privacy Policy | NairaMet",
    description:
      "Learn how NairaMet collects, uses, and protects your personal information.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
              Privacy Policy
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
            <Calendar className="w-4 h-4" />
            <span>Effective Date: January 1, 2026</span>
          </div>
          <p className="text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            At Nairamet, your privacy is important to us. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our website and services.
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              By using Nairamet, you agree to the practices described in this
              policy.
            </p>
          </CardContent>
        </Card>

        {/* 1. Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                1
              </Badge>
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may collect the following types of information from you:
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Personal Information:</h4>
                <p className="text-sm text-muted-foreground">
                  Name, email address, phone number, and account details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Transactional Information:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Details of currency exchanges, deposits, or withdrawals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Usage Information:</h4>
                <p className="text-sm text-muted-foreground">
                  IP address, browser type, device information, pages visited,
                  and interaction with our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cookies & Tracking Data:</h4>
                <p className="text-sm text-muted-foreground">
                  To enhance user experience, track usage, and deliver
                  personalized content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                2
              </Badge>
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Your information is used to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Provide and improve our services.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  Send you important updates, alerts, and push notifications.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Personalize your experience on Nairamet.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  Prevent fraud and ensure the security of transactions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Comply with legal obligations.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                3
              </Badge>
              Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nairamet uses cookies and similar technologies to improve your
              browsing experience. Cookies help us:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Remember your preferences.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Analyze website traffic and usage patterns.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Deliver targeted notifications and promotions.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              You can manage or disable cookies via your browser settings, but
              some features may not function properly if cookies are disabled.
            </p>

            <h4 className="font-semibold">Manage your cookie preferences</h4>
            <p className="text-sm text-muted-foreground">
              To change cookie preferences at any time, visit the{" "}
              <Link
                href="/cookies"
                className="text-emerald-600 hover:underline"
              >
                Cookie Settings
              </Link>{" "}
              page. Your selection is saved locally in your browser under the
              key{" "}
              <code className="bg-muted px-1 rounded">
                nairamet:cookie_consent
              </code>
              . When you reject personalized ads, we set a flag on the page (
              <code className="bg-muted px-1 rounded">
                data-ads-personalization="false"
              </code>
              ) so ad components and banners will avoid personalized
              advertising. To fully clear your choice, remove the key from your
              browser's localStorage or use the Cookie Settings page.
            </p>
          </CardContent>
        </Card>

        {/* 4. Sharing Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                4
              </Badge>
              Sharing Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share data with:
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Service providers:</h4>
                <p className="text-sm text-muted-foreground">
                  Payment processors, cloud hosting, and analytics providers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Legal authorities:</h4>
                <p className="text-sm text-muted-foreground">
                  If required by law or to protect our rights.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              All third parties are required to handle your data securely and
              only for the purposes we specify.
            </p>
          </CardContent>
        </Card>

        {/* 5. Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                5
              </Badge>
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to
              protect your data, including:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Secure servers and encryption protocols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Regular security audits and updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Restricted access to sensitive information.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
              While we strive to protect your information, no method of
              transmission over the internet is 100% secure.
            </p>
          </CardContent>
        </Card>

        {/* 6. Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                6
              </Badge>
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Access the personal information we hold about you.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Request correction or deletion of your data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  Opt-out of marketing communications and push notifications.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              To exercise your rights, please contact us at{" "}
              <a
                href="mailto:support@nairamet.com"
                className="text-emerald-600 hover:underline"
              >
                support@nairamet.com
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* 7. Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                7
              </Badge>
              Children's Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nairamet is not intended for children under 18 years. We do not
              knowingly collect personal data from children.
            </p>
          </CardContent>
        </Card>

        {/* 8. Changes to This Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600"
              >
                8
              </Badge>
              Changes to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will
              notify users of significant changes via our website or email.
              Continued use of Nairamet after changes constitutes acceptance of
              the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* 9. Contact Us */}
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
              <Mail className="w-5 h-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-emerald-700 dark:text-emerald-300">
              For questions or concerns about your privacy, please contact:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-emerald-600 dark:text-emerald-400">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@nairamet.com"
                  className="hover:underline"
                >
                  support@nairamet.com
                </a>
              </p>
              <p className="text-emerald-600 dark:text-emerald-400">
                <strong>Address:</strong> Lagos, Nigeria
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Bottom banner ad */}
      <BottomBannerAd />
    </div>
  );
}
