"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RotateCw } from "lucide-react";
import type { ScrapedArticle } from "@/lib/scraper";

export default function Wire({
  initialItems,
  keywords,
}: {
  initialItems: ScrapedArticle[];
  keywords?: string[];
}) {
  const [items, setItems] = useState<ScrapedArticle[]>(initialItems || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scrape`);
      if (!res.ok) throw new Error("Failed to refresh");
      const body = await res.json();
      let articles: ScrapedArticle[] = body.articles || [];
      if (keywords && keywords.length > 0) {
        const kws = keywords.map((k) => k.toLowerCase());
        articles = articles.filter((a) => {
          const hay = `${a.title || ""} ${a.excerpt || ""} ${a.content || ""} ${
            a.source || ""
          } ${a.url || ""}`.toLowerCase();
          return kws.some((kw) => hay.includes(kw));
        });
      }
      setItems(articles.slice(0, 6));
      toast({
        title: "Wire refreshed",
        description: `${articles.length} items fetched`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Refresh failed",
        description: err?.message || "Unable to refresh wire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">From the Wire</h3>
        <Button
          onClick={refresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />{" "}
          {loading ? "Refreshing..." : "Refresh wire"}
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-gray-600">
            No items available. Try refreshing.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-100 pb-3 last:pb-0"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-900 font-medium"
            >
              {item.title}
            </a>
            <div className="text-sm text-gray-600">
              {item.source} •{" "}
              {item.date ? new Date(item.date).toLocaleString() : ""}
            </div>
            {item.excerpt && (
              <p className="text-sm text-emerald-700 mt-1">{item.excerpt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
