"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  BarChart3,
  Search,
  Menu,
  X,
  BookOpen,
  Wrench,
  Moon,
  Sun,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      href: "/tracker",
      label: "Rates Tracker",
      icon: TrendingUp,
    },
    {
      href: "/charts",
      label: "Historical Charts",
      icon: BarChart3,
    },
    {
      href: "/logs",
      label: "Rate Logs",
      icon: Search,
    },
    {
      href: "/tools",
      label: "FX Tools",
      icon: Wrench,
    },
    {
      href: "/blog",
      label: "Naira Watch",
      icon: BookOpen,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Live Pulse */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Image
                  src="/Nairamet.svg"
                  alt="NairaMet Logo"
                  className="w-6 h-6"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  Naira<span className="text-emerald-600 dark:text-emerald-400">Met</span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-muted-foreground/80 tracking-wide">
                  Nigeria's FX Platform
                </span>
              </div>
            </Link>

            {/* Live Market Pill Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live FX Active</span>
            </div>
          </div>

          {/* Desktop Nav Items (Wise-Style Pill Links) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-muted/40 border border-border/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border/60 bg-background/50 hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            <Link
              href="/tracker"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Convert Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/60 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1.5 pb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
