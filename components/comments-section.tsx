"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

export default function CommentsSection({
  articleId,
}: {
  articleId: string | number;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // If user is signed in, use their name (or email local-part) and hide name input
  useEffect(() => {
    if (isAuthenticated && user) {
      const derivedName = user.name || user.email.split("@")[0] || "User";
      setName(derivedName);
    } else {
      setName("");
    }
  }, [isAuthenticated, user]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${articleId}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Unable to load comments",
        description: "Try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      // Prompt user to sign in and persist return-to so they come back
      openAuthModal(`/blog/${articleId}`);
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${articleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send name (derived from auth) and content
        body: JSON.stringify({ name: name || "Anonymous", content }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || "Failed to post comment");
      }

      setContent("");
      // don't clear name for signed-in users
      if (!isAuthenticated) setName("");
      setComments((s) => [body.comment, ...s]);
      toast({
        title: "Comment posted",
        description: "Thanks for contributing!",
        variant: "default",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Post failed",
        description: err?.message || "Unable to post comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">Comments</h4>
        <p className="text-sm text-gray-600">
          Join the discussion — be respectful.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Write a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="text-sm text-gray-600">
            No comments yet — be the first.
          </div>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-3 rounded border border-gray-100 bg-white"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium text-emerald-800">{c.name}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-800">{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
