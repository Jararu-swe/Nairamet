import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Calendar, Clock, User, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const featuredArticles = [
    {
      id: 1,
      title: "Weekly Rate Summary: Naira Strengthens Against Dollar",
      excerpt:
        "The naira gained 2.3% against the USD this week, closing at ₦1,545 on the official market. Black market rates also improved to ₦1,580.",
      author: "FX Analysis Team",
      date: "2024-01-15",
      readTime: "3 min read",
      category: "Weekly Summary",
      trend: "up",
      featured: true,
    },
    {
      id: 2,
      title: "Understanding Black Market FX Rates: A Complete Guide",
      excerpt:
        "Learn how parallel market rates are determined, why they differ from official rates, and what factors influence the spread.",
      author: "Education Team",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "Education",
      trend: null,
      featured: false,
    },
    {
      id: 3,
      title: "CBN's New FX Policy: What It Means for You",
      excerpt:
        "Central Bank announces new foreign exchange guidelines. We break down the key changes and their impact on exchange rates.",
      author: "Policy Analysis",
      date: "2024-01-10",
      readTime: "5 min read",
      category: "Policy",
      trend: null,
      featured: false,
    },
  ]

  const categories = [
    { name: "Weekly Summary", count: 12, color: "bg-blue-100 text-blue-800" },
    { name: "Policy Analysis", count: 8, color: "bg-green-100 text-green-800" },
    { name: "Education", count: 15, color: "bg-purple-100 text-purple-800" },
    { name: "Market Insights", count: 6, color: "bg-orange-100 text-orange-800" },
  ]

  const quickStats = [
    { label: "This Week's Change", value: "+2.3%", trend: "up" },
    { label: "Monthly Average", value: "₦1,562", trend: "neutral" },
    { label: "Volatility Index", value: "Medium", trend: "neutral" },
    { label: "Next CBN Meeting", value: "Jan 25", trend: "neutral" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-emerald-900">Naira Watch</h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Stay informed with weekly summaries, policy analysis, and educational insights about Nigerian foreign
            exchange markets.
          </p>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Market Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-sm text-emerald-600 mb-1">{stat.label}</div>
                  <div className="font-bold text-emerald-900 flex items-center justify-center gap-1">
                    {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Article */}
            {featuredArticles
              .filter((article) => article.featured)
              .map((article) => (
                <Card key={article.id} className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-600 text-white">Featured</Badge>
                      <Badge
                        variant="outline"
                        className={article.trend === "up" ? "border-green-500 text-green-700" : ""}
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-emerald-900">{article.title}</CardTitle>
                    <CardDescription className="text-emerald-700 text-base">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-emerald-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </div>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Recent Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Latest insights and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredArticles
                  .filter((article) => !article.featured)
                  .map((article) => (
                    <div key={article.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-emerald-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-emerald-700 mb-3">{article.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-emerald-600">
                            <span>{article.author}</span>
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                          Read
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge variant="secondary" className={category.color}>
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-900">Stay Updated</CardTitle>
                <CardDescription className="text-emerald-700">
                  Get weekly rate summaries and market insights delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  CBN Official Rates
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Market Analysis Archive
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  FX Policy Updates
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Educational Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
