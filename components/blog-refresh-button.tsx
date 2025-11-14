"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function BlogRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/scrape");
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Articles refreshed!",
          description: `Fetched ${data.articles?.length || 0} new articles from RSS feeds.`,
        });
        // Refresh the page to show new articles
        router.refresh();
      } else {
        throw new Error(data.error || "Failed to refresh");
      }
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not fetch new articles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refreshing..." : "Refresh Articles"}
    </Button>
  );
}
