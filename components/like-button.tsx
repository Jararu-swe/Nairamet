"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface LikeButtonProps {
  articleId: string;
}

export function LikeButton({ articleId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const { toast } = useToast();
  const { user, openAuthModal } = useAuth();

  // Load like status on component mount
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/blog/like?articleId=${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
          setLikeCount(data.count);
          setUsingFallback(false);
          return;
        }
        throw new Error("API unavailable");
      } catch (error) {
        console.error("Error fetching like status:", error);
        // Fallback to localStorage
        setUsingFallback(true);
        loadFromLocalStorage();
      }
    };
    
    const loadFromLocalStorage = () => {
      try {
        // Load liked status
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
        setLiked(!!likedArticles[articleId]);
        
        // Load like count
        const likeCounts = JSON.parse(localStorage.getItem('likeCounts') || '{}');
        setLikeCount(likeCounts[articleId] || 0);
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    };
    
    fetchLikeStatus();
  }, [articleId, user?.id]); // Re-fetch when user changes

  const handleLike = async () => {
    // If using fallback mode, don't require login
    if (!usingFallback && !user) {
      openAuthModal();
      toast({
        title: "Authentication required",
        description: "Please log in to like articles.",
      });
      return;
    }
    
    setIsLoading(true);
    
    if (usingFallback) {
      // Handle like with localStorage
      try {
        // Update liked status
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
        const newLiked = !likedArticles[articleId];
        likedArticles[articleId] = newLiked;
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
        
        // Update like count
        const likeCounts = JSON.parse(localStorage.getItem('likeCounts') || '{}');
        likeCounts[articleId] = (likeCounts[articleId] || 0) + (newLiked ? 1 : -1);
        localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
        
        // Update state
        setLiked(newLiked);
        setLikeCount(likeCounts[articleId]);
        
        toast({
          title: newLiked ? "Article liked" : "Article unliked",
          description: newLiked 
            ? "This article has been added to your liked articles." 
            : "This article has been removed from your liked articles.",
        });
      } catch (error) {
        console.error("Error updating like in localStorage:", error);
        toast({
          title: "Error",
          description: "Failed to update like status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Try API if not in fallback mode
    try {
      const response = await fetch("/api/blog/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.count);
        
        toast({
          title: data.liked ? "Article liked" : "Article unliked",
          description: data.liked 
            ? "This article has been added to your liked articles." 
            : "This article has been removed from your liked articles.",
        });
      } else {
        throw new Error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like:", error);
      
      // Switch to fallback mode if API fails
      setUsingFallback(true);
      handleLike(); // Retry with localStorage
      
      toast({
        title: "Using offline mode",
        description: "Database connection unavailable. Your likes will be stored locally.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-emerald-600"} ${usingFallback ? "bg-gray-50" : ""}`}
      disabled={isLoading}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
      <span>{likeCount}</span>
      {usingFallback && <span className="text-xs ml-1">(offline)</span>}
    </Button>
  );
}