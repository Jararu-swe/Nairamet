"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface UpgradePromptProps {
  feature: string;
  description: string;
  className?: string;
}

export function UpgradePrompt({
  feature,
  description,
  className,
}: UpgradePromptProps) {
  // Make this prompt informational: all features are free
  return (
    <Card
      className={`border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 ${className}`}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Crown className="h-6 w-6 text-emerald-600" />
        </div>
        <CardTitle className="text-emerald-900">Feature Available</CardTitle>
        <CardDescription className="text-emerald-700">
          {feature} is available to all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-emerald-800">{description}</p>

        <div className="pt-2">
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
          >
            Features: Unlimited alerts • Full history • Data export • Priority
            support
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
