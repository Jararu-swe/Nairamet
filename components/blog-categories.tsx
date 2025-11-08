"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Category {
  name: string;
  color: string;
  icon: string;
  count: number;
}

interface BlogCategoriesProps {
  categories: Category[];
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Article Categories</CardTitle>
        <CardDescription className="text-xs">
          Browse articles by topic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.name}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              onClick={() => {
                // Scroll to articles section
                const articlesSection = document.querySelector('.recent-articles');
                articlesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </span>
              </div>
              <Badge variant="secondary" className={category.color}>
                {category.count}
              </Badge>
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p>📝 Articles coming soon!</p>
            <p className="text-xs mt-1">Check back for updates</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
