/**
 * SEO Configuration for NairaMet
 * Centralized SEO settings and structured data
 */

export const siteConfig = {
  name: "NairaMet",
  description:
    "Real-time Naira exchange rates, FX alerts, and comprehensive currency tools for Nigerian markets",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/nairamet",
    github: "https://github.com/nairamet",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NairaMet",
  url: siteConfig.url,
  logo: `${siteConfig.url}/Nairamet.png`,
  description: siteConfig.description,
  sameAs: [siteConfig.links.twitter],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@nairamet.com",
    contactType: "Customer Support",
    areaServed: "NG",
    availableLanguage: ["en"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NairaMet",
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/tracker?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteConfig.url}${item.url}`,
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "NairaMet Premium",
  description:
    "Premium FX tracking service with unlimited alerts, API access, and advanced analytics",
  brand: {
    "@type": "Brand",
    name: "NairaMet",
  },
  offers: {
    "@type": "Offer",
    price: "2500",
    priceCurrency: "NGN",
    availability: "https://schema.org/InStock",
    url: `${siteConfig.url}/pricing`,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
  },
};
