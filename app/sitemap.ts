import { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog";

// Currency pairs for programmatic SEO
const CURRENCY_PAIRS = [
  "usd-ngn", "gbp-ngn", "eur-ngn", "cny-ngn",
  "zar-ngn", "ghs-ngn", "kes-ngn", "aed-ngn", "sar-ngn", 
  "inr-ngn", "jpy-ngn", "cad-ngn", "aud-ngn",
];

// Popular amounts for converter pages
const POPULAR_AMOUNTS = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];

function generateCurrencyPairPages(baseUrl: string) {
  return CURRENCY_PAIRS.map((pair) => ({
    url: `${baseUrl}/rates/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: pair.startsWith('usd') || pair.startsWith('gbp') || pair.startsWith('eur') ? 0.9 : 0.8,
  }));
}

function generateConverterPages(baseUrl: string) {
  const pages = [];
  const converterCurrencies = ["usd", "gbp", "eur", "cny", "aed", "sar"];
  for (const currency of converterCurrencies) {
    for (const amount of POPULAR_AMOUNTS) {
      pages.push({
        url: `${baseUrl}/convert/${amount}-${currency}-to-ngn`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: amount >= 100 ? 0.7 : 0.6,
      });
    }
  }
  return pages;
}

function generateHistoricalPages(baseUrl: string) {
  return CURRENCY_PAIRS.map((pair) => ({
    url: `${baseUrl}/rates/${pair}/history`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com";

  // Static routes
  const blogPosts = articles.map((article) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(article.id)}`,
    lastModified: article.date ? new Date(article.date) : new Date(),
    changeFrequency: article.id.startsWith('scraped:') ? 'daily' as const : 'monthly' as const,
    priority: article.featured ? 0.8 : 0.6,
    images: article.featured ? [`${baseUrl}/og-image.png`] : [], // Default image if none exist
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/charts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/logs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Currency pair pages for SEO
    ...generateCurrencyPairPages(baseUrl),
    // Amount converter pages
    ...generateConverterPages(baseUrl),
    // Historical rate pages
    ...generateHistoricalPages(baseUrl),
    // Add all blog posts
    ...blogPosts,
  ]
}
