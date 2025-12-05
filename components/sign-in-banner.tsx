"use client";

import { useState, useEffect } from "react";
import { X, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function SignInBanner() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem("sign-in-banner-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sign-in-banner-dismissed", "true");
  };

  // Don't show banner if:
  // - Not mounted yet (prevents hydration mismatch)
  // - User is authenticated (navbar already shows user info)
  // - User has dismissed it
  if (!mounted || isAuthenticated || isDismissed) {
    return null;
  }

  // Show sign-in prompt as a compact inline element
  return (
    <>
      {/* Desktop version - full banner */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800 mr-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100 leading-tight">
              Sign in to save alerts
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => openAuthModal()}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-7 px-2.5 text-xs ml-1"
        >
          <LogIn className="w-3 h-3 mr-1" />
          Sign In
        </Button>
        
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded transition-colors text-emerald-600 dark:text-emerald-400"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile version - compact button only */}
      <Button
        onClick={() => openAuthModal()}
        size="sm"
        className="md:hidden bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-8 px-3 text-xs mr-2"
      >
        <LogIn className="w-3.5 h-3.5 mr-1.5" />
        Sign In
      </Button>
    </>
  );
}
