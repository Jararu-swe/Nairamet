"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  TrendingUp,
  Bell,
  BarChart3,
  FileText,
  Wrench,
} from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, login, openAuthModal } = useAuth();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const promptedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enforce route-level protection: if an unauthenticated visitor lands
  // on a protected page, open the global auth modal once and show a
  // small sign-in placeholder instead of the protected content.
  useEffect(() => {
    if (mounted && !isAuthenticated && !promptedRef.current) {
      promptedRef.current = true;
      const target =
        pathname ||
        (typeof window !== "undefined" ? window.location.pathname : "/");
      try {
        openAuthModal(target);
      } catch (e) {
        // best-effort: open without target
        openAuthModal();
      }
    }
  }, [mounted, isAuthenticated, openAuthModal, pathname]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Previously ProtectedRoute blocked unauthenticated users from accessing
  // features. To make all features free, render children for everyone and
  // provide a non-blocking CTA to sign in if they'd like to save preferences.
  const features = [
    {
      icon: TrendingUp,
      title: "Live Exchange Rates",
      description:
        "Real-time USD, GBP, EUR, CNY rates with CBN, black market, and remittance comparisons",
    },
    {
      icon: Bell,
      title: "Rate Alerts",
      description:
        "Email and push notifications when rates hit your target thresholds",
    },
    {
      icon: BarChart3,
      title: "Historical Charts",
      description:
        "Interactive graphs showing rate trends over time with date range selection",
    },
    {
      icon: FileText,
      title: "Searchable Logs",
      description:
        "Historical rate archive with search, statistics, and CSV/PDF export",
    },
    {
      icon: Wrench,
      title: "Widgets & Tools",
      description:
        "Embeddable widgets, advanced calculator, and currency strength maps",
    },
  ];

  // If not authenticated, show fallback/placeholder while the modal is open.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        {fallback ? (
          fallback
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign in to continue</CardTitle>
              <CardDescription>
                Please sign in to access this feature. You will be redirected
                after signing in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    openAuthModal(
                      pathname ||
                        (typeof window !== "undefined"
                          ? window.location.pathname
                          : "/")
                    )
                  }
                >
                  Sign In / Sign Up
                </Button>
                <Button variant="ghost" onClick={() => {}}>
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
      {/* AuthModal is rendered globally by AuthProvider */}
    </div>
  );
}
