import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100">
              Disclaimer
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 dark:text-amber-300">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: November 10, 2025</span>
          </div>
          <p className="text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
            Please read this disclaimer carefully before using Nairamet services.
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              The information provided by Nairamet is for general informational purposes only. 
              All information on the site is provided in good faith, however we make no representation 
              or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, 
              reliability, availability, or completeness of any information on the site.
            </p>
          </CardContent>
        </Card>

        {/* 1. No Financial Advice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">1</Badge>
              No Financial Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              The information provided on Nairamet does not constitute financial, investment, trading, 
              or other types of advice. You should not treat any of the website's content as such.
            </p>
            <p className="text-muted-foreground">
              Nairamet does not recommend that any cryptocurrency or currency exchange should be bought, 
              sold, or held by you. Do conduct your own due diligence and consult your financial advisor 
              before making any investment decisions.
            </p>
          </CardContent>
        </Card>

        {/* 2. Exchange Rate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">2</Badge>
              Exchange Rate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              All exchange rates displayed on Nairamet are for informational purposes only and may not 
              reflect real-time market rates. Rates are subject to change without notice.
            </p>
            <p className="text-muted-foreground">
              We aggregate data from various sources, but we do not guarantee the accuracy, completeness, 
              or timeliness of the information provided. Actual transaction rates may vary.
            </p>
          </CardContent>
        </Card>

        {/* 3. Third-Party Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">3</Badge>
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Nairamet may contain links to third-party websites or services that are not owned or 
              controlled by us. We have no control over, and assume no responsibility for, the content, 
              privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-muted-foreground">
              You acknowledge and agree that Nairamet shall not be responsible or liable, directly or 
              indirectly, for any damage or loss caused or alleged to be caused by or in connection with 
              the use of any such content, goods, or services available on or through any such websites or services.
            </p>
          </CardContent>
        </Card>

        {/* 4. No Guarantees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">4</Badge>
              No Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Nairamet makes no guarantees regarding:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>The availability or uptime of our services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>The accuracy of exchange rates or market data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>The success of any transactions or exchanges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>The security of data transmission over the internet</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 5. Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">5</Badge>
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Under no circumstance shall Nairamet have any liability to you for any loss or damage of 
              any kind incurred as a result of the use of the site or reliance on any information provided 
              on the site.
            </p>
            <p className="text-muted-foreground">
              Your use of the site and your reliance on any information on the site is solely at your own risk.
            </p>
          </CardContent>
        </Card>

        {/* 6. Market Volatility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">6</Badge>
              Market Volatility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Currency and cryptocurrency markets are highly volatile and can fluctuate significantly. 
              Past performance is not indicative of future results.
            </p>
            <p className="text-muted-foreground">
              You should be aware of the risks associated with currency exchange and only invest what 
              you can afford to lose.
            </p>
          </CardContent>
        </Card>

        {/* 7. Regulatory Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">7</Badge>
              Regulatory Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              It is your responsibility to ensure that your use of Nairamet complies with all applicable 
              laws and regulations in your jurisdiction.
            </p>
            <p className="text-muted-foreground">
              Nairamet does not provide legal or tax advice. Please consult with appropriate professionals 
              regarding your specific situation.
            </p>
          </CardContent>
        </Card>

        {/* 8. Changes to Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600">8</Badge>
              Changes to This Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify this disclaimer at any time. Changes will be effective 
              immediately upon posting to the website. Your continued use of Nairamet following any 
              changes constitutes acceptance of those changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <Mail className="w-5 h-5" />
              Questions?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-amber-700 dark:text-amber-300">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-amber-600 dark:text-amber-400">
                <strong>Email:</strong>{" "}
                <a href="mailto:support@nairamet.com" className="hover:underline">
                  support@nairamet.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="text-amber-600 dark:text-amber-400 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
