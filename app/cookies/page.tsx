import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/cookie-settings-button";


export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how NairaMet uses cookies and how you can manage your cookie preferences.",
};

export default function CookiesPage() {
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last updated: December 8, 2025
          </p>
        </div>

        <div className="flex gap-4">
          <CookieSettingsButton />
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you
            visit our website. They help us provide you with a better experience
            by remembering your preferences and understanding how you use our
            site.
          </p>

          <h2>How we use cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li>
              <strong>Necessary cookies:</strong> Essential for the website to
              function properly, including security and authentication.
            </li>
            <li>
              <strong>Preference cookies:</strong> Remember your settings and
              preferences, such as language and theme choices.
            </li>
            <li>
              <strong>Statistics cookies:</strong> Help us understand how
              visitors interact with our website by collecting anonymous
              information.
            </li>
            <li>
              <strong>Marketing cookies:</strong> Used to deliver personalized
              advertisements and measure the effectiveness of advertising
              campaigns.
            </li>
          </ul>

          <h2>Third-party cookies</h2>
          <p>
            We use third-party services that may set cookies on your device,
            including:
          </p>
          <ul>
            <li>
              <strong>Google AdSense:</strong> To display relevant
              advertisements (if enabled)
            </li>
            <li>
              <strong>Google Analytics:</strong> To analyze website traffic and
              usage (if applicable)
            </li>
          </ul>

          <h2>Managing your cookies</h2>
          <p>
            You can manage your cookie preferences at any time by clicking the
            "Cookie Settings" button above. You can choose to accept all
            cookies, reject non-essential cookies, or customize your preferences
            by category.
          </p>
          <p>
            You can also control cookies through your browser settings. However,
            please note that disabling certain cookies may affect the
            functionality of our website.
          </p>

          <h2>Consent for EEA, UK, and Switzerland users</h2>
          <p>
            For users in the European Economic Area (EEA), United Kingdom, and
            Switzerland, we collect explicit consent before setting
            non-essential cookies. You will see a consent banner on your first
            visit, where you can choose to accept, decline, or customize your
            cookie preferences.
          </p>

          <h2>Cookie declaration</h2>
          <p>
            Below is a detailed list of all cookies used on our website,
            automatically updated by our consent management platform:
          </p>
        </div>

        {/* Cookiebot Cookie Declaration */}
        {cookiebotId ? (
          <div className="border rounded-lg p-6 bg-card">
            <script
              id="CookieDeclaration"
              src={`https://consent.cookiebot.com/${cookiebotId}/cd.js`}
              type="text/javascript"
              async
            />
          </div>
        ) : (
          <div className="border rounded-lg p-6 bg-muted">
            <p className="text-sm text-muted-foreground">
              Cookie declaration will appear here once Cookiebot is configured.
              Please add your NEXT_PUBLIC_COOKIEBOT_ID to your environment
              variables.
            </p>
          </div>
        )}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Contact us</h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us through our website or email us at privacy@nairamet.com.
          </p>
        </div>
      </div>
    </div>
  );
}
