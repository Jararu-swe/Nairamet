"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

export default function ScraperAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [lastRun, setLastRun] = useState<string | null>(null)

  const triggerScrape = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/scrape?force=true', {
        cache: 'no-store'
      })
      const data = await response.json()
      setResult(data)
      setLastRun(new Date().toLocaleString())
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Article Scraper Admin</h1>
          <p className="text-muted-foreground mt-2">
            Manually trigger article scraping or view scraping status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scrape Control</CardTitle>
            <CardDescription>
              Fetch latest articles from RSS feeds and news sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={triggerScrape} 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Trigger Scrape Now
                  </>
                )}
              </Button>
              
              {lastRun && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last run: {lastRun}
                </div>
              )}
            </div>

            {result && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                {result.error ? (
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-700">Error</p>
                      <p className="text-sm text-muted-foreground">{result.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-700">Success</p>
                      <p className="text-sm text-muted-foreground">
                        Scraped {result.articles?.length || 0} articles
                      </p>
                      
                      {result.articles && result.articles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Recent Articles:</p>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {result.articles.slice(0, 10).map((article: any, idx: number) => (
                              <div key={idx} className="p-3 bg-background border rounded text-sm">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{article.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {article.source} • {article.date ? new Date(article.date).toLocaleDateString() : 'No date'}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="shrink-0">
                                    {article.source}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scraping Schedule</CardTitle>
            <CardDescription>
              Automatic scraping configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Combined Daily Update Cron</p>
                  <p className="text-sm text-muted-foreground">
                    Runs once daily at 06:00 UTC (6 AM) - Updates both articles & rates
                  </p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Article Cache Duration</p>
                  <p className="text-sm text-muted-foreground">
                    Articles cached for 12 hours
                  </p>
                </div>
                <Badge variant="outline">12 hours</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Currency Cache Duration</p>
                  <p className="text-sm text-muted-foreground">
                    Rates cached for 12 hours
                  </p>
                </div>
                <Badge variant="outline">12 hours</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RSS Feed Sources</CardTitle>
            <CardDescription>
              Active news sources being scraped
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {[
                { name: "Punch Nigeria", url: "punchng.com" },
                { name: "Vanguard News", url: "vanguardngr.com" },
                { name: "Nairametrics", url: "nairametrics.com" },
                { name: "CBN RSS", url: "cbn.gov.ng" },
                { name: "BusinessDay", url: "businessday.ng" },
                { name: "BBC Africa", url: "bbci.co.uk" },
                { name: "Google News Nigeria", url: "news.google.com" },
                { name: "Nairaland News", url: "nairaland.com" },
              ].map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span className="font-medium">{source.name}</span>
                  <span className="text-muted-foreground">{source.url}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

