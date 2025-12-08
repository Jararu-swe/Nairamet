"use client"

import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CookieSettingsButtonProps {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CookieSettingsButton({ 
  variant = "outline", 
  size = "sm",
  className 
}: CookieSettingsButtonProps) {
  const handleClick = () => {
    // @ts-ignore - Cookiebot is loaded globally
    if (typeof window !== 'undefined' && window.Cookiebot) {
      // @ts-ignore
      window.Cookiebot.show()
    } else {
      console.warn('Cookiebot not loaded yet')
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleClick}
      className={className}
    >
      <Cookie className="mr-2 h-4 w-4" />
      Cookie Settings
    </Button>
  )
}
