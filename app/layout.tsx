import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/auth-context"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nairamet.com'),
  title: {
    default: "NairaMet - Real-time Naira Exchange Rates & FX Tools",
    template: "%s | NairaMet"
  },
  description:
    "Track USD/NGN, GBP/NGN, EUR/NGN, CNY/NGN exchange rates with alerts, charts, and comprehensive FX tools for Nigerian currency markets. Get real-time CBN, black market, and parallel market rates.",
  keywords: [
    "naira exchange rate",
    "USD to NGN",
    "GBP to NGN",
    "EUR to NGN",
    "dollar to naira",
    "black market rate",
    "CBN rate",
    "cbn exchange rate dollar to naira today",
    "parallel market",
    "forex Nigeria",
    "currency converter",
    "naira rate today",
    "FX rates Nigeria",
    "exchange rate alerts",
    "naira charts",
    "Nigerian currency"
  ],
  authors: [{ name: "NairaMet" }],
  creator: "NairaMet",
  publisher: "NairaMet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "NairaMet - Nigeria's FX Platform, Simplified",
    description: "Real-time Naira exchange rates, alerts, charts, and comprehensive FX tools for Nigerian currency markets.",
    siteName: "NairaMet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NairaMet - Real-time Naira Exchange Rates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NairaMet - Real-time Naira Exchange Rates",
    description: "Track USD/NGN, GBP/NGN, EUR/NGN rates with alerts and charts. Nigeria's FX Platform, Simplified.",
    images: ["/og-image.png"],
    creator: "@nairamet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/Nairamet.svg", type: "image/svg+xml" },
      { url: "/Nairamet.png", type: "image/png" }
    ],
    shortcut: "/Nairamet.png",
    apple: "/Nairamet.png",
  },
  manifest: "/site.webmanifest",
  generator: 'v0.app'
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NairaMet",
    "alternateName": "Naira Met",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com",
    "description": "Real-time Naira exchange rates, alerts, charts, and comprehensive FX tools for Nigerian currency markets",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NairaMet",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com",
    "logo": [
      {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/Nairamet.svg`,
        "width": "512",
        "height": "512",
        "encodingFormat": "image/svg+xml"
      },
      {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/Nairamet.png`,
        "width": "512",
        "height": "512",
        "encodingFormat": "image/png"
      }
    ],
    "description": "Nigeria's FX Platform, Simplified - Real-time exchange rates and currency tools",
    "sameAs": [
      "https://twitter.com/nairamet",
      "https://facebook.com/nairamet",
      "https://linkedin.com/company/nairamet"
    ]
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Cookiebot CMP - Google Certified Consent Management Platform */}
        {process.env.NEXT_PUBLIC_COOKIEBOT_ID && (
          <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID}
            data-blockingmode="auto"
            type="text/javascript"
            async
          />
        )}
        {/* OneSignal SDK - async for better performance */}
        <script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          defer
          async
        />
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://flagcdn.com" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
