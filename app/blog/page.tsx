import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getArticles, Article } from "@/lib/blog";
import { MarketSnapshot } from "@/components/market-snapshot";
import { BlogSidebar } from "@/components/blog-sidebar";
import { Metadata } from "next";
import { SidebarAd } from "@/components/adsense-ad";

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticles();
  const latestArticle = articles.find((a) => a.featured) || articles[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com";

  return {
    title: "Naira Watch - FX News, Analysis & Insights | NairaMet",
    description: `Stay informed with the latest Nigerian FX news and analysis. ${articles.length}+ articles covering exchange rates, CBN policy, and market insights.`,
    keywords: [
      "naira news",
      "fx analysis",
      "nigeria currency",
      "exchange rate news",
      "cbn policy",
      "forex insights",
      "naira exchange rate",
      "black market rate",
      "parallel market",
      "fx market nigeria",
    ],
    authors: [{ name: "NairaMet Editorial Team" }],
    creator: "NairaMet",
    publisher: "NairaMet",
    openGraph: {
      title: "Naira Watch - FX News & Analysis | NairaMet",
      description:
        "Latest news, analysis, and insights about Nigerian foreign exchange markets and Naira rates.",
      type: "website",
      url: `${baseUrl}/blog`,
      siteName: "NairaMet",
      locale: "en_NG",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "NairaMet - Naira Watch FX News",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Naira Watch - FX News & Analysis",
      description:
        "Latest Nigerian FX news, exchange rate analysis, and market insights.",
      creator: "@nairamet",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPage() {
  let featuredArticles: Article[] = [];
  let error: string | null = null;

  try {
    featuredArticles = await getArticles();
  } catch (e) {
    console.error("Failed to load articles:", e);
    error = "Failed to load articles. Please try again later.";
    // Provide fallback content
    featuredArticles = [
      {
        id: "fallback-1",
        title: "Welcome to NairaMet - Naira Watch",
        excerpt: "Weekly summaries, policy analysis and market insights on the naira.",
        content: "Stay tuned for the latest updates on Nigerian foreign exchange markets.",
        author: "NairaMet Editorial Team",
        date: new Date().toISOString(),
        readTime: "2",
        category: "Weekly Summary",
        trend: null,
        featured: true,
      }
    ];
  }
  // Strict FX-related keywords for better filtering
  const nairaKeywords = [
    // Currency codes
    "naira",
    "ngn",
    "usd/ngn",
    "gbp/ngn",
    "eur/ngn",

    // Exchange rate terms (more specific)
    "exchange rate",
    "forex",
    "fx rate",
    "currency rate",
    "black market rate",
    "parallel market",
    "cbn rate",

    // Institutions
    "cbn",
    "central bank of nigeria",
    "fmdq",

    // Specific phrases
    "dollar to naira",
    "pound to naira",
    "euro to naira",
    "naira devaluation",
    "naira appreciation",
    "naira depreciation",
    "fx market",
    "currency market",
    "foreign exchange",
    "fx policy",
    "fx liquidity",
    "fx allocation",

    // Avoid generic terms that match too much
  ];

  // scraped wire removed — content will be the curated articles only

  const categories = [
    { name: "Weekly Summary", count: 12, color: "bg-blue-100 text-blue-800" },
    { name: "Policy Analysis", count: 8, color: "bg-green-100 text-green-800" },
    { name: "Education", count: 15, color: "bg-purple-100 text-purple-800" },
    {
      name: "Market Insights",
      count: 6,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100">Naira Watch</h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Stay informed with weekly summaries, policy analysis, and
            educational insights about Nigerian foreign exchange markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guides">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <BookOpen className="w-4 h-4 mr-2" />
                View Trading Guides
              </Button>
            </Link>
            <Link href="/tracker">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Live Rates
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <span className="text-lg">⚠️</span>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Snapshot - Dynamic data */}
        <MarketSnapshot />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Article */}
            {featuredArticles
              .filter((article) => article.featured)
              .map((article) => (
                <Card
                  key={article.id}
                  className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-600 text-white">
                        Featured
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          article.trend === "up"
                            ? "border-green-500 text-green-700"
                            : ""
                        }
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-emerald-700 dark:text-emerald-300 text-base text-justify leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {article.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {article.readTime} min read
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${encodeURIComponent(article.id)}`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Recent Articles */}
            <Card
              id="recent-articles"
              className="border-emerald-200 dark:border-emerald-800 shadow-lg"
            >
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Latest FX insights and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {featuredArticles.filter((article) => !article.featured).length > 0 ? (
                  featuredArticles
                    .filter((article) => !article.featured)
                    .map((article) => (
                      <div
                        key={article.id}
                        className="group border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:scale-[1.02] bg-white dark:bg-gray-800/50"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                              >
                                {article.category}
                              </Badge>
                            </div>
                            <Link
                              href={`/blog/${encodeURIComponent(article.id)}`}
                            >
                              <h3 className="font-bold text-base sm:text-lg text-emerald-900 dark:text-emerald-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-justify">
                              {article.excerpt}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(article.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{article.readTime} min</span>
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/blog/${encodeURIComponent(article.id)}`}
                            className="w-full sm:w-auto sm:shrink-0"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 group-hover:shadow-sm transition-all"
                            >
                              Read <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-emerald-600 dark:text-emerald-400 mb-2">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                      More Articles Coming Soon
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We're working on bringing you the latest FX market insights and analysis.
                    </p>
                    <Link href="/tracker">
                      <Button variant="outline" className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                        View Live Rates <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* News Wire removed */}
          </div>

          {/* Sidebar with Ad */}
          <div className="space-y-6">
            <BlogSidebar categories={categories} />

            {/* Sidebar Ad - Right Sidebar (AdSense) */}
            <div className="hidden lg:block">
              <SidebarAd />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}