import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { getArticles } from "@/lib/blog";
// import NewsletterForm from "@/components/newsletter-form";
import { getCachedArticlesFiltered } from "@/lib/scraper";
import Wire from "@/components/wire";
import { LiveCurrencyRates } from "@/components/live-currency-rates";
import { MarketSnapshot } from "@/components/market-snapshot";
// import { LikeButton } from "@/components/like-button";
import { BlogSidebar } from "@/components/blog-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naira Watch - FX News, Analysis & Insights",
  description: "Stay informed with weekly summaries, policy analysis, and educational insights about Nigerian foreign exchange markets. Latest Naira news and FX trends.",
  keywords: ["naira news", "fx analysis", "nigeria currency", "exchange rate news", "cbn policy", "forex insights"],
  openGraph: {
    title: "Naira Watch - FX News & Analysis | NairaMet",
    description: "Latest news, analysis, and insights about Nigerian foreign exchange markets and Naira rates.",
    type: "website",
  },
};

export default async function BlogPage() {
  const featuredArticles = getArticles();
  // Filter scraped RSS items for naira/exchange related keywords
  const nairaKeywords = [
    "naira",
    "ngn",
    "naira to",
    "exchange rate",
    "exchange",
    "fx",
    "forex",
    "parallel",
    "black market",
    "cbn",
    "central bank",
    "dollar",
    "usd",
  ];

  const scraped = getCachedArticlesFiltered(nairaKeywords);

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
          <h1 className="text-4xl font-bold text-emerald-900">Naira Watch</h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Stay informed with weekly summaries, policy analysis, and
            educational insights about Nigerian foreign exchange markets.
          </p>
        </div>

        {/* Live Currency Rates */}
        <LiveCurrencyRates />

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
                    <CardTitle className="text-2xl text-emerald-900">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-emerald-700 text-base">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-emerald-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{article.readTime} min read</span>
                        </div>
                        {/* Removed LikeButton */}
                        {/* <LikeButton articleId={article.id} /> */}
                      </div>
                      <Link href={`/blog/${encodeURIComponent(article.id)}`} className="w-full sm:w-auto">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Recent Articles */}
            <Card id="recent-articles" className="border-emerald-200 dark:border-emerald-800 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Latest insights and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {featuredArticles
                  .filter((article) => !article.featured)
                  .map((article) => (
                    <div
                      key={article.id}
                      className="group border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:scale-[1.02] bg-white dark:bg-gray-800/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                              {article.category}
                            </Badge>
                          </div>
                          <Link href={`/blog/${encodeURIComponent(article.id)}`}>
                            <h3 className="font-bold text-base sm:text-lg text-emerald-900 dark:text-emerald-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
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
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <BlogSidebar categories={categories} />
        </div>
      </div>
    </div>
  );
}
