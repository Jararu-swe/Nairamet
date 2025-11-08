"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Bell, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";

interface Category {
  name: string;
  count: number;
  color: string;
}

interface BlogSidebarProps {
  categories: Category[];
}

export function BlogSidebar({ categories }: BlogSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
    // Scroll to articles section
    const articlesSection = document.getElementById("recent-articles");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex items-center justify-between py-1 hover:bg-muted/50 px-2 -mx-2 rounded-md transition-colors cursor-pointer ${
                selectedCategory === category.name ? "bg-muted" : ""
              }`}
            >
              <span className="text-sm">{category.name}</span>
              <Badge
                variant="secondary"
                className={`${category.color} text-xs px-2 py-0`}
              >
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Useful Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Useful Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* External Links */}
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <a
              href="https://www.cbn.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              <span>CBN Official Site</span>
            </a>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <a
              href="https://www.cbn.gov.ng/rates/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-3 h-3" />
              <span>CBN Exchange Rates</span>
            </a>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <a
              href="https://www.fmdqgroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-3 h-3" />
              <span>FMDQ Market Data</span>
            </a>
          </Button>

          {/* Divider */}
          <div className="border-t my-2" />

          {/* Internal Links */}
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <Link href="/tracker" className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>Live Rate Tracker</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <Link href="/alerts" className="flex items-center gap-2">
              <Bell className="w-3 h-3" />
              <span>Set Rate Alerts</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-sm h-8 px-2 hover:bg-muted"
          >
            <Link href="/charts" className="flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              <span>Historical Charts</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
