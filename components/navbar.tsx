"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp, Bell, BarChart3, Search, Menu, X, BookOpen, Wrench, User, LogOut, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, login, logout } = useAuth()

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
      description: "1 free alert, unlimited with premium",
      requiresAuth: true,
      tier: "freemium" as const,
    },
    {
      href: "/charts",
      label: "Historical Charts",
      icon: BarChart3,
      description: "7 days free, full history premium",
      requiresAuth: true,
      tier: "freemium" as const,
    },
    {
      href: "/logs",
      label: "Rate Logs",
      icon: Search,
      description: "Search & export data",
      requiresAuth: true,
      tier: "premium" as const,
    },
    {
      href: "/tools",
      label: "Widgets & Tools",
      icon: Wrench,
      description: "Basic free, advanced premium",
      requiresAuth: true,
      tier: "freemium" as const,
    },
    {
      href: "/blog",
      label: "Naira Watch",
      icon: BookOpen,
      description: "News, analysis & insights",
      requiresAuth: false,
      tier: "free" as const,
    },
  ]

  const getTierBadge = (tier: string, requiresAuth: boolean) => {
    if (tier === "free") {
      return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">FREE</span>
    }
    if (tier === "freemium") {
      return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">LIMITED</span>
    }
    if (tier === "premium") {
      return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">PREMIUM</span>
    }
    return null
  }

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout()
      setIsOpen(false)
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">NairaMet</h1>
                <p className="text-xs text-muted-foreground">Nigeria's FX Platform</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-muted-foreground">Hi, {user?.name}</span>
                </div>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="border-t bg-background/95 backdrop-blur">
              <div className="py-4 space-y-2">
                {isAuthenticated && (
                  <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-emerald-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-emerald-900">{user?.name}</div>
                      <div className="text-xs text-emerald-600">{user?.email}</div>
                    </div>
                  </div>
                )}

                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  const isDisabled = item.requiresAuth && !isAuthenticated

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isDisabled
                            ? "text-muted-foreground/50 cursor-not-allowed"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                      {...(isDisabled && { onClick: (e) => e.preventDefault() })}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {item.label}
                          {getTierBadge(item.tier, item.requiresAuth)}
                        </div>
                        <div className="text-sm opacity-75">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}

                <div className="pt-2 mt-2 border-t">
                  <Button
                    onClick={handleAuthAction}
                    variant={isAuthenticated ? "outline" : "default"}
                    className={cn(
                      "w-full justify-start gap-3 h-auto py-3",
                      isAuthenticated
                        ? "bg-transparent hover:bg-muted"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white",
                    )}
                  >
                    {isAuthenticated ? (
                      <>
                        <LogOut className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-sm opacity-75">Leave your account</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Sign In / Sign Up</div>
                          <div className="text-sm opacity-75">Access premium features</div>
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={(user) => {
          login(user)
          setShowAuthModal(false)
        }}
      />
    </>
  )
}
