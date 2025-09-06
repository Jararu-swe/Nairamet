"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, TrendingUp, Bell, BarChart3, FileText, Wrench } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Live Exchange Rates",
      description: "Real-time USD, GBP, EUR, CNY rates with CBN, black market, and remittance comparisons",
    },
    {
      icon: Bell,
      title: "Rate Alerts",
      description: "Email and push notifications when rates hit your target thresholds",
    },
    {
      icon: BarChart3,
      title: "Historical Charts",
      description: "Interactive graphs showing rate trends over time with date range selection",
    },
    {
      icon: FileText,
      title: "Searchable Logs",
      description: "Historical rate archive with search, statistics, and CSV/PDF export",
    },
    {
      icon: Wrench,
      title: "Widgets & Tools",
      description: "Embeddable widgets, advanced calculator, and currency strength maps",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-emerald-600">Premium Features</CardTitle>
            <CardDescription className="text-lg">
              Sign up for free to access all NairaMet tools and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 pt-4 border-t">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                onClick={() => setShowAuthModal(true)}
              >
                Get Free Access
              </Button>
              <p className="text-sm text-gray-600">
                <span className="text-emerald-600 font-medium">Free forever</span> • No credit card required • Access
                all features
              </p>
            </div>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={(user) => {
            login(user)
            setShowAuthModal(false)
          }}
        />
      </div>
    </div>
  )
}
