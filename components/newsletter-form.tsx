"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // For now just show a success toast. In future this can call an API route.
      await new Promise((r) => setTimeout(r, 600));
      toast({
        title: "Subscribed",
        description: "You'll receive weekly summaries.",
        variant: "default",
      });
      setEmail("");
    } catch (err) {
      toast({
        title: "Subscription failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        aria-label="newsletter-email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </div>
  );
}
