"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Eye } from "lucide-react"

interface EmailPreviewProps {
  currency: string
  condition: "above" | "below"
  threshold: number
  currentRate: number
  rateType: string
  email: string
}

export function EmailPreview({ currency, condition, threshold, currentRate, rateType, email }: EmailPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [emailHtml, setEmailHtml] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePreview = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          currency,
          condition,
          threshold,
          currentRate,
          rateType,
        }),
      })

      const result = await response.json()
      if (result.success && result.preview) {
        setEmailHtml(result.preview)
        setIsPreviewOpen(true)
      }
    } catch (error) {
      console.error("Error generating email preview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={generatePreview}
        disabled={isLoading}
        className="text-xs bg-transparent"
      >
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            <Eye className="w-3 h-3 mr-1" />
            Preview Email
          </>
        )}
      </Button>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Preview
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[70vh]">
                <iframe srcDoc={emailHtml} className="w-full h-[600px] border-0" title="Email Preview" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
