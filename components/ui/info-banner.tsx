/**
 * Consistent Info Banner Component
 * Production-ready banners for alerts, warnings, and info messages
 */

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

interface InfoBannerProps {
  variant?: "info" | "success" | "warning" | "error"
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function InfoBanner({
  variant = "info",
  title,
  description,
  action,
  className,
}: InfoBannerProps) {
  const variants = {
    info: {
      container: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20",
      icon: <Info className="w-5 h-5" />,
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-100",
      descColor: "text-blue-800 dark:text-blue-200",
    },
    success: {
      container: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20",
      icon: <CheckCircle className="w-5 h-5" />,
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-900 dark:text-green-100",
      descColor: "text-green-800 dark:text-green-200",
    },
    warning: {
      container: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20",
      icon: <AlertCircle className="w-5 h-5" />,
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-100",
      descColor: "text-amber-800 dark:text-amber-200",
    },
    error: {
      container: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20",
      icon: <XCircle className="w-5 h-5" />,
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-100",
      descColor: "text-red-800 dark:text-red-200",
    },
  }

  const config = variants[variant]

  return (
    <Card className={cn(config.container, className)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={cn(config.iconColor, "flex-shrink-0 mt-0.5")}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-semibold mb-1", config.titleColor)}>
              {title}
            </h3>
            <p className={cn("text-sm leading-relaxed", config.descColor)}>
              {description}
            </p>
            {action && <div className="mt-3">{action}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
