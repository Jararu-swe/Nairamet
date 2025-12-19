import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { getArticleById } from "@/lib/blog";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    return {
      title: "Article Not Found | NairaMet",
      description: "The requested article could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // Clean title and excerpt for metadata
  const cleanTitle = article.title.replace(/[^\w\s-]/g, "").trim();
  const cleanExcerpt = article.excerpt.replace(/[^\w\s-.,]/g, "").trim().substring(0, 160);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nairamet.com';
  
  return {
    title: `${cleanTitle} | NairaMet`,
    description: cleanExcerpt,
    keywords: [
      "naira news",
      "fx news",
      "nigeria currency",
      "exchange rate news",
      "cbn news",
      article.category,
      ...cleanTitle.toLowerCase().split(" ").filter(w => w.length > 3).slice(0, 5),
    ],
    authors: article.author ? [{ name: article.author }] : [{ name: "NairaMet Editorial Team" }],
    creator: article.author || "NairaMet",
    publisher: "NairaMet",
    openGraph: {
      title: cleanTitle,
      description: cleanExcerpt,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: article.author ? [article.author] : ["NairaMet Editorial Team"],
      url: `${baseUrl}/blog/${id}`,
      siteName: "NairaMet",
      locale: "en_NG",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanExcerpt,
      creator: "@nairamet",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id: rawId } = await params;
  const article = getArticleById(rawId);

  if (!article) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link
            href="/blog"
            className="flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Article not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function decodeEntities(str: string = ""): string {
    const map: Record<string, string> = {
      "&nbsp;": " ",
      "&amp;": "&",
      "&quot;": '"',
      "&apos;": "'",
      "&#39;": "'",
      "&lt;": "<",
      "&gt;": ">",
      "&ndash;": "–",
      "&mdash;": "—",
      "&ldquo;": "“",
      "&rdquo;": "”",
      "&lsquo;": "‘",
      "&rsquo;": "’",
      "&hellip;": "…",
    };
    let s = str
      .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
      .replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
    s = s.replace(/\s+/g, " ").trim();
    return s;
  }

  const safeTitle = decodeEntities(article.title);
  const safeExcerpt = decodeEntities(article.excerpt);
  const plainContent = decodeEntities(article.content || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const paragraphs = plainContent.length ? plainContent.split(/\n{2,}/) : [];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": safeTitle,
    "description": safeExcerpt,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": article.originalUrl ? "Organization" : "Person",
      "name": article.author || "NairaMet Editorial Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": "NairaMet",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/Nairamet.png`,
      },
    },
    "articleSection": article.category,
    "keywords": ["naira", "exchange rate", "fx", "nigeria", article.category].join(", "),
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/blog`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": safeTitle,
        "item": `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nairamet.com"}/blog/${params.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="container py-8 flex justify-center">
      <div className="w-full max-w-3xl px-2 sm:px-4 md:px-8">
        <div className="mb-6">
          <Link
            href="/blog"
            className="flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>
        </div>

        <Card className="w-full">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-emerald-900 break-words">
              {safeTitle}
            </CardTitle>
            <CardDescription className="text-emerald-700 mt-1 text-base md:text-lg">
              {safeExcerpt}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-2 flex flex-col items-center text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-emerald-600 mb-4">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {article.author}
                </div>
              )}
              {article.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />{" "}
                  {new Date(article.date).toLocaleDateString()}
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {article.readTime}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-emerald max-w-none w-full md:max-w-prose mb-6 text-center text-base sm:text-lg">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed mb-3 text-center break-words">
                    {p}
                  </p>
                ))
              ) : (
                <p className="italic text-gray-600">No content available.</p>
              )}
            </div>

            {/* Original Source citation (optional, as small meta info) */}
            {article.originalUrl && (
              <div className="text-xs text-gray-500 mb-2 text-center break-words">
                Original source:{" "}
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline"
                >
                  {article.author || article.originalUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section - Removed */}
        {/* <div className="mt-6">
          <CommentsSection articleId={rawId} />
        </div> */}
      </div>
    </div>
    </>
  );
}
