"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Bell,
  BarChart3,
  Search,
  Menu,
  X,
  BookOpen,
  Wrench,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import NairametSvg from "@/public/Nairamet.svg";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal, justSignedUp } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      href: "/tracker",
      label: "Live Rates",
      icon: TrendingUp,
      description: "Real-time rates & converter",
      requiresAuth: false,
      tier: "free" as const,
    },
    {
      href: "/alerts",
      label: "Rate Alerts",
      icon: Bell,
      description: "Create alerts and get notified",
      requiresAuth: false,
      tier: "free" as const,
    },
    {
      href: "/charts",
      label: "Historical Charts",
      icon: BarChart3,
      description: "Interactive historical charts",
      requiresAuth: false,
      tier: "free" as const,
    },
    {
      href: "/logs",
      label: "Rate Logs",
      icon: Search,
      description: "Search & export data",
      requiresAuth: false,
      tier: "free" as const,
    },
    {
      href: "/tools",
      label: "Widgets & Tools",
      icon: Wrench,
      description: "All tools available",
      requiresAuth: false,
      tier: "free" as const,
    },
    {
      href: "/blog",
      label: "Naira Watch",
      icon: BookOpen,
      description: "News, analysis & insights",
      requiresAuth: false,
      tier: "free" as const,
    },
  ];

  const getTierBadge = (tier: string, requiresAuth: boolean) => {
    if (tier === "free") {
      return (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          FREE
        </span>
      );
    }
    if (tier === "freemium") {
      return (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          LIMITED
        </span>
      );
    }
    if (tier === "premium") {
      return (
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
          PREMIUM
        </span>
      );
    }
    return null;
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      setIsOpen(false);
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow border border-emerald-200 dark:border-emerald-800">
                <img
                  src="/Nairamet.svg"
                  alt="NairaMet Logo"
                  className="w-7 h-7"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl tracking-tight">
                  Naira<span className="text-emerald-600 dark:text-emerald-400">Met</span>
                </h1>
                <p className="text-xs text-muted-foreground tracking-wide">
                  Nigeria's FX Platform, Simplified
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                      {user?.name || user?.email?.split("@")[0]}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile User Avatar (only on mobile when authenticated) */}
              {isAuthenticated && (
                <div className="lg:hidden mr-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm border-2 border-emerald-200 dark:border-emerald-700">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Action Buttons Group */}
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-background transition-colors"
                  aria-label="Toggle dark mode"
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>

                {/* Menu Toggle */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-background transition-colors"
                  aria-label="Toggle menu"
                  title="Menu"
                >
                  {isOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="border-t bg-background/95 backdrop-blur shadow-lg">
              <div className="py-4 space-y-2">
                {isAuthenticated ? (
                  <div className="px-4 mb-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                          {user?.name}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          {user?.email}
                        </div>
                      </div>
                      <Button
                        onClick={handleAuthAction}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 mb-3">
                    <Button
                      onClick={handleAuthAction}
                      className="w-full justify-start gap-3 h-auto py-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <LogIn className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Sign In / Sign Up</div>
                        <div className="text-sm opacity-90">
                          Access all features
                        </div>
                      </div>
                    </Button>
                  </div>
                )}

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isDisabled = false; // make all links accessible

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {item.label}
                          {getTierBadge(item.tier, item.requiresAuth)}
                        </div>
                        <div className="text-sm opacity-75">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}


              </div>
            </div>
          )}
        </div>
      </nav>

      {/* AuthModal rendered globally by AuthProvider */}
    </>
  );
}
