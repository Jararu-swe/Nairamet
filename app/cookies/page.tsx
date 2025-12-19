"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "nairamet:cookie_consent";

function applyConsentToDocument(consentObj: any) {
  try {
    if (!consentObj) return;
    if (consentObj.ads === false) {
      document.documentElement.setAttribute(
        "data-ads-personalization",
        "false"
      );
    } else {
      document.documentElement.removeAttribute("data-ads-personalization");
    }
  } catch (e) {
    // ignore
  }
}

export default function CookieSettingsPage() {
  const [consent, setConsent] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConsent(parsed);
        applyConsentToDocument(parsed);
      } else {
        setConsent(null);
      }
    } catch (e) {
      setConsent(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  function save(consentObj: any) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentObj));
      setConsent(consentObj);
      applyConsentToDocument(consentObj);
    } catch (e) {
      // ignore
    }
  }

  function clearConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setConsent(null);
    // remove flag
    try {
      document.documentElement.removeAttribute("data-ads-personalization");
    } catch (e) {}
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Cookie Settings</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your cookie preferences for NairaMet. Your choices are stored
          locally in your browser under the key{" "}
          <code className="bg-muted px-1 rounded">{STORAGE_KEY}</code>.
        </p>

        {!loaded ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-semibold">Current consent</h3>
              <pre className="mt-2 text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-auto">
                {consent
                  ? JSON.stringify(consent, null, 2)
                  : "No consent saved"}
              </pre>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white"
                onClick={() => save({ ads: true, analytics: true })}
              >
                Accept all
              </button>
              <button
                className="px-4 py-2 rounded border"
                onClick={() => save({ ads: false, analytics: false })}
              >
                Reject non-essential
              </button>
              <button
                className="px-4 py-2 rounded bg-red-50 text-red-600 border"
                onClick={clearConsent}
              >
                Clear consent
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                When you reject personalized ads, a page-level flag is set:{" "}
                <code className="bg-muted px-1 rounded">
                  data-ads-personalization="false"
                </code>
                . Ad components and banners check this flag and avoid showing
                personalized ads when present.
              </p>
              <p className="mt-2">
                Return to the{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
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
              advertisements
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
