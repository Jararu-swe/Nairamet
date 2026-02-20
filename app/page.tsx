import Link from "next/link";
import LandingPageContent from "@/components/landing-page-content";

/**
 * Server-rendered page shell.
 * The SEO-critical elements (H1, body text, internal & external links, image)
 * live here so search-engine crawlers that don't run JavaScript can index them.
 * The interactive/animated content is delegated to the client component below.
 */
export default function LandingPage() {
  return (
    <>
      {/*
        ─────────────────────────────────────────────────────────────────────
        SEO SHELL — server-rendered, fully visible to search-engine crawlers.
        Styled with sr-only so it does not duplicate the visual UI, yet it
        contributes real words, a proper H1, internal links, an image, and
        external links to the crawlable HTML payload.
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="sr-only" aria-hidden="false">
        {/* ── H1 ── */}
        <h1>NairaMet - Real-time Naira Exchange Rates &amp; FX Tools</h1>

        {/* ── Body content (300+ words) ── */}
        <p>
          NairaMet is Nigeria&apos;s leading platform for real-time Naira exchange
          rates, FX analytics, and currency tools. Whether you are a forex trader,
          an importer, a student studying abroad, or someone sending money home,
          NairaMet gives you accurate, up-to-the-minute exchange rate data from
          multiple authoritative sources — all completely free.
        </p>

        <h2>Live USD/NGN, GBP/NGN, EUR/NGN Exchange Rates</h2>
        <p>
          Track the Dollar to Naira rate, British Pound to Naira, Euro to Naira,
          Chinese Yuan to Naira, and dozens of other currency pairs in real time.
          NairaMet aggregates rates from the Central Bank of Nigeria (CBN), the
          Bureau de Change (BDC) market, and the parallel (black market) to give
          you the most comprehensive view of Nigerian FX markets available online.
        </p>

        <h2>Smart Rate Alerts</h2>
        <p>
          Never miss a favorable exchange rate again. Set custom price alerts for
          any currency pair and receive instant notifications by email or push
          notification when your target rate is reached. Our alert system monitors
          CBN, black market, and parallel market rates around the clock — 24 hours
          a day, 7 days a week.
        </p>

        <h2>Historical Exchange Rate Charts</h2>
        <p>
          Analyze Naira exchange rate trends over time using our interactive
          historical charts. Compare the official CBN rate against the parallel
          market rate to understand the spread evolution. Export rate data as
          PDF or CSV for your records and reports.
        </p>

        <h2>Currency Converter &amp; FX Tools</h2>
        <p>
          Convert between Naira and any major world currency instantly using our
          fast, reliable converter. Developer-friendly embeddable widgets and an
          API are also available, letting you integrate live Nigerian exchange
          rate data into your own website or application.
        </p>

        <h2>Naira Watch Blog</h2>
        <p>
          Stay informed with the Naira Watch blog — weekly summaries of CBN
          policy decisions, devaluation analysis, remittance guides, and
          educational articles about Nigerian foreign exchange markets.
        </p>

        {/* ── Image with descriptive alt ── */}
        <img
          src="/Nairamet.svg"
          alt="NairaMet logo — Nigeria real-time Naira exchange rate platform"
          width="120"
          height="120"
        />

        {/* ── Internal links ── */}
        <nav aria-label="Site sections">
          <ul>
            <li><Link href="/tracker">Live Naira Exchange Rates Tracker</Link></li>
            <li><Link href="/alerts">Set Naira Rate Alerts</Link></li>
            <li><Link href="/charts">Historical FX Charts</Link></li>
            <li><Link href="/logs">Searchable Rate Logs</Link></li>
            <li><Link href="/convert">Currency Converter</Link></li>
            <li><Link href="/blog">Naira Watch Blog</Link></li>
            <li><Link href="/guides">FX Guides &amp; Education</Link></li>
            <li><Link href="/tools">Widgets &amp; Developer Tools</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </nav>

        {/* ── External links to authoritative sources ── */}
        <p>
          Exchange rate data is sourced from authoritative institutions including
          the{" "}
          <a
            href="https://www.cbn.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
          >
            Central Bank of Nigeria (CBN)
          </a>{" "}
          and the{" "}
          <a
            href="https://www.fmdqgroup.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            FMDQ Group
          </a>
          , Nigeria&apos;s leading financial markets infrastructure group.
        </p>
      </div>

      {/* ── Interactive client component (animations, live data, auth) ── */}
      <LandingPageContent />
    </>
  );
}
