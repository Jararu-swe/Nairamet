import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Bell, Calculator, BookOpen } from "lucide-react";

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface InternalLinksProps {
  title?: string;
  links: RelatedLink[];
}

export function InternalLinks({ title = "Related Pages", links }: InternalLinksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group flex items-start gap-3 p-4 rounded-lg border hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
            >
              {link.icon && (
                <div className="mt-1 text-emerald-600">{link.icon}</div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined link sets for common pages
export const trackerRelatedLinks: RelatedLink[] = [
  {
    title: "Historical Charts",
    description: "View rate trends and historical data",
    href: "/charts",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Currency Converter",
    description: "Convert between currencies instantly",
    href: "/tools",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    title: "FX News & Analysis",
    description: "Latest insights on Nigerian FX markets",
    href: "/blog",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Rate Logs",
    description: "Search and export historical records",
    href: "/logs",
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

export const toolsRelatedLinks: RelatedLink[] = [
  {
    title: "Live Rates",
    description: "Track real-time exchange rates",
    href: "/tracker",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Historical Charts",
    description: "View rate trends and historical data",
    href: "/charts",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Market Analysis",
    description: "Read latest FX insights",
    href: "/blog",
    icon: <BookOpen className="w-5 h-5" />,
  },
];
