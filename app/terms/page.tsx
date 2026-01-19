import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { BottomBannerAd } from "@/components/monetag-ad";

export const metadata: Metadata = {
  title: "Terms and Conditions - Service Agreement",
  description:
    "Terms and conditions for using NairaMet exchange rate services. Read our service agreement, user responsibilities, and terms of use.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "user agreement",
    "nairamet terms",
    "service terms",
    "legal terms",
  ],
  openGraph: {
    title: "Terms and Conditions | NairaMet",
    description:
      "Terms and conditions for using NairaMet exchange rate services.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">
              Terms and Conditions
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Calendar className="w-4 h-4" />
            <span>Effective Date: January 1, 2026</span>
          </div>
          <p className="text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
            Welcome to Nairamet. By accessing or using our services, you agree to be bound by these Terms and Conditions.
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Please read these Terms and Conditions carefully before using Nairamet. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </CardContent>
        </Card>

        {/* 1. Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">1</Badge>
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              By accessing and using Nairamet, you accept and agree to be bound by the terms and provision 
              of this agreement. Additionally, when using Nairamet's services, you shall be subject to any 
              posted guidelines or rules applicable to such services.
            </p>
            <p className="text-muted-foreground">
              Any participation in this service will constitute acceptance of this agreement. If you do not 
              agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* 2. Use of Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">2</Badge>
              Use of Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Nairamet provides currency exchange rate information and related services. You agree to use 
              our services only for lawful purposes and in accordance with these Terms.
            </p>
            <p className="text-muted-foreground font-semibold">You agree not to:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use the service in any way that violates any applicable law or regulation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Engage in any conduct that restricts or inhibits anyone's use of the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use any automated system to access the service in a manner that sends more requests than a human can reasonably produce</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Attempt to gain unauthorized access to any portion of the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use the service for any fraudulent or illegal purpose</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">3</Badge>
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              When you create an account with us, you must provide accurate, complete, and current information. 
              Failure to do so constitutes a breach of the Terms.
            </p>
            <p className="text-muted-foreground">
              You are responsible for safeguarding the password and for all activities that occur under your account. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        {/* 4. Exchange Rates and Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">4</Badge>
              Exchange Rates and Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              All exchange rates and market data provided on Nairamet are for informational purposes only. 
              We aggregate data from various sources but do not guarantee accuracy, completeness, or timeliness.
            </p>
            <p className="text-muted-foreground">
              Rates displayed may differ from actual transaction rates. We reserve the right to modify or 
              discontinue any data feeds without notice.
            </p>
          </CardContent>
        </Card>

        {/* 5. Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">5</Badge>
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              The service and its original content, features, and functionality are and will remain the 
              exclusive property of Nairamet and its licensors.
            </p>
            <p className="text-muted-foreground">
              Our trademarks and trade dress may not be used in connection with any product or service 
              without the prior written consent of Nairamet.
            </p>
          </CardContent>
        </Card>

        {/* 6. Termination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">6</Badge>
              Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the service immediately, without prior 
              notice or liability, for any reason, including breach of these Terms.
            </p>
            <p className="text-muted-foreground">
              Upon termination, your right to use the service will immediately cease. All provisions of the 
              Terms which by their nature should survive termination shall survive.
            </p>
          </CardContent>
        </Card>

        {/* 7. Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">7</Badge>
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              In no event shall Nairamet, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including loss of profits, data, use, or other intangible losses.
            </p>
            <p className="text-muted-foreground">
              This includes damages resulting from your access to or use of or inability to access or use 
              the service, any conduct or content of any third party on the service, or any unauthorized 
              access, use, or alteration of your transmissions or content.
            </p>
          </CardContent>
        </Card>

        {/* 8. Indemnification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">8</Badge>
              Indemnification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless Nairamet and its licensors from and against 
              any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising 
              out of or relating to your violation of these Terms or your use of the service.
            </p>
          </CardContent>
        </Card>

        {/* 9. Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">9</Badge>
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the laws of Nigeria, without 
              regard to its conflict of law provisions. Any disputes arising from these Terms will be 
              resolved in the courts of Nigeria.
            </p>
          </CardContent>
        </Card>

        {/* 10. Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">10</Badge>
              Changes to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. 
              We will provide notice of any material changes by posting the new Terms on this page.
            </p>
            <p className="text-muted-foreground">
              Your continued use of the service after any changes constitutes acceptance of the new Terms. 
              It is your responsibility to review these Terms periodically.
            </p>
          </CardContent>
        </Card>

        {/* 11. Severability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">11</Badge>
              Severability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will 
              be changed and interpreted to accomplish the objectives of such provision to the greatest 
              extent possible under applicable law, and the remaining provisions will continue in full force.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Mail className="w-5 h-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-blue-700 dark:text-blue-300">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-blue-600 dark:text-blue-400">
                <strong>Email:</strong>{" "}
                <a href="mailto:support@nairamet.com" className="hover:underline">
                  support@nairamet.com
                </a>
              </p>
              <p className="text-blue-600 dark:text-blue-400">
                <strong>Address:</strong> Lagos, Nigeria
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
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
