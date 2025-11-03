import CommentsSection from "@/components/comments-section";
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
  params: { id: string };
};

export default function ArticlePage({ params }: Props) {
  const rawId = params.id;
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

  return (
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

        <div className="mt-6">
          <CommentsSection articleId={rawId} />
        </div>
      </div>
    </div>
  );
}
