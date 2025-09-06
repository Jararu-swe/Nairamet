"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UpgradePromptProps {
  feature: string
  description: string
  className?: string
}

export function UpgradePrompt({ feature, description, className }: UpgradePromptProps) {
  const { startTrial, upgradeToPremium, isOnTrial, user } = useAuth()

  const canStartTrial = user?.tier === "free" && !user?.trialEndsAt

  return (
    <Card className={`border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <Crown className="h-6 w-6 text-amber-600" />
        </div>
        <CardTitle className="text-amber-900">Premium Feature</CardTitle>
        <CardDescription className="text-amber-700">{feature} is available with NairaMet Premium</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-amber-800">{description}</p>

        <div className="space-y-2">
          {canStartTrial && (
            <Button onClick={startTrial} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Zap className="mr-2 h-4 w-4" />
              Start 7-Day Free Trial
            </Button>
          )}

          <Button
            onClick={upgradeToPremium}
            variant={canStartTrial ? "outline" : "default"}
            className={
              canStartTrial
                ? "w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                : "w-full bg-emerald-600 hover:bg-emerald-700"
            }
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        </div>

        {isOnTrial && user?.trialEndsAt && (
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
            <Clock className="h-4 w-4" />
            <span>Trial ends {new Date(user.trialEndsAt).toLocaleDateString()}</span>
          </div>
        )}

        <div className="pt-2">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Premium Features: Unlimited alerts • Full history • Data export • Priority support
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
