/**
 * Consistent Alert Card Component
 * Production-ready card for displaying rate alerts
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  alert: {
    id: string
    currency: string
    condition: "above" | "below"
    threshold: number
    email: string
    rateType: string
    isActive: boolean
    pushEnabled?: boolean
  }
  currentRate: number
  isTriggered: boolean
  hasBeenTriggered: boolean
  onToggle: () => void
  onDelete: () => void
}

export function AlertCard({
  alert,
  currentRate,
  isTriggered,
  hasBeenTriggered,
  onToggle,
  onDelete,
}: AlertCardProps) {
  const getRateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cbn: "CBN Official",
      blackMarket: "Black Market",
      remittance: "Remittance",
    }
    return labels[type] || type
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isTriggered && alert.isActive
          ? hasBeenTriggered
            ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/10"
            : "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/10"
          : "border-border bg-card hover:shadow-md"
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Alert Info */}
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2 h-auto hover:bg-transparent"
              title={alert.isActive ? "Disable alert" : "Enable alert"}
            >
              {alert.isActive ? (
                <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-base">
                  {alert.currency} {alert.condition} ₦{alert.threshold.toLocaleString()}
                </h3>
                {isTriggered && alert.isActive && (
                  <Badge
                    variant={hasBeenTriggered ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {hasBeenTriggered ? "SENT" : "TRIGGERED"}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{getRateTypeLabel(alert.rateType)}</span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate">{alert.email}</span>
                {alert.pushEnabled && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Push enabled</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Current Rate & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <div className="font-mono text-lg font-semibold">
                ₦{currentRate.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="p-2 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Delete alert"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
