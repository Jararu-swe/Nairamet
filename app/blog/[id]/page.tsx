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
              {article.title}
            </CardTitle>
            <CardDescription className="text-emerald-700 mt-1 text-base md:text-lg">
              {article.excerpt}
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
              {article.content && article.content.trim().length > 0 ? (
                article.content
                  .replace(/<[^>]+>/g, "")
                  .split("\n\n")
                  .map((p, i) => (
                    <p
                      key={i}
                      className="leading-relaxed mb-3 text-center break-words"
                    >
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
