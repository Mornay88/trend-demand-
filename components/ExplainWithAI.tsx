"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Copy, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Tier = "free" | "pro" | "enterprise"

interface ExplainWithAIProps {
  keyword: string
  demand: any
  supply: any
  scores: any
  userTier: Tier
  onUsageUpdate?: (tier: Tier, keywordCount: number) => void
}

interface ExplanationData {
  explanation: string
  source?: "cache" | "llm"
  usage?: {
    total_tokens?: number
  }
}

export function ExplainWithAI({ 
  keyword, 
  demand, 
  supply, 
  scores, 
  userTier, 
  onUsageUpdate 
}: ExplainWithAIProps) {
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<ExplanationData | null>(null)
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  // Daily usage tracking
  const getDailyUsage = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`explain_usage_${today}`)
    return stored ? parseInt(stored, 10) : 0
  }

  const incrementDailyUsage = () => {
    const today = new Date().toDateString()
    const current = getDailyUsage()
    localStorage.setItem(`explain_usage_${today}`, String(current + 1))
  }

  const getDailyLimit = () => {
    switch (userTier) {
      case "free": return 1
      case "pro": return 5
      case "enterprise": return Infinity
      default: return 1
    }
  }

  const canExplain = () => {
    return getDailyUsage() < getDailyLimit()
  }

  const handleExplain = async () => {
    if (!canExplain()) {
      toast({
        title: "Daily limit reached",
        description: userTier === "free" 
          ? "Upgrade to Pro for more AI explanations per day."
          : "Upgrade to Enterprise for unlimited AI explanations.",
        variant: "destructive",
        action: userTier === "free" ? (
          <Button variant="outline" size="sm" onClick={() => window.open('/dashboard/upgrade', '_blank')}>
            Upgrade
          </Button>
        ) : undefined,
      })
      return
    }

    setLoading(true)
    setError("")

    try {
      const baseUrl = process.env.NEXT_PUBLIC_PY_SERVICE_URL
      if (!baseUrl) {
        setError("API URL is not configured (NEXT_PUBLIC_PY_SERVICE_URL)")
        setLoading(false)
        return
      }
      const response = await fetch(`${baseUrl}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          demand,
          supply,
          scores,
          tone: "friendly",
          audience: "beginner"
        }),
      })

      if (!response.ok) {
        throw new Error("Couldn't generate summary. Try again.")
      }

      const data: ExplanationData = await response.json()
      setExplanation(data)
      incrementDailyUsage()
      
      // Telemetry
      onUsageUpdate?.(userTier, 1)
      
    } catch (err: any) {
      setError(err.message || "Couldn't generate summary. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!explanation) return
    
    try {
      await navigator.clipboard.writeText(explanation.explanation)
      toast({
        title: "Copied to clipboard",
        description: "Explanation copied successfully.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Couldn't copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const dailyUsage = getDailyUsage()
  const dailyLimit = getDailyLimit()
  const isLimitReached = dailyUsage >= dailyLimit

  return (
    <div className="space-y-3">
      <Button
        onClick={handleExplain}
        disabled={loading || isLimitReached}
        variant="outline"
        size="sm"
        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/70"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Explaining…
          </>
        ) : (
          <>
            <Bot className="h-3 w-3 mr-1" />
            Explain with AI
          </>
        )}
      </Button>

      {isLimitReached && (
        <div className="text-xs text-amber-400">
          {userTier === "free" && "1/1 used today • "}
          {userTier === "pro" && `${dailyUsage}/5 used today • `}
          Upgrade for more
        </div>
      )}

      {error && (
        <Alert className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription className="text-red-300 text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {explanation && (
        <Card className="bg-slate-800/30 border-slate-600/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white">AI Summary</CardTitle>
              <div className="flex items-center gap-2">
                {explanation.source && (
                  <Badge variant="outline" className="text-xs border-slate-500/50 text-slate-300">
                    {explanation.source}
                    {userTier === "enterprise" && explanation.usage?.total_tokens && 
                      ` · ${explanation.usage.total_tokens} tokens`
                    }
                  </Badge>
                )}
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-slate-400 hover:text-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-slate-300 text-sm leading-relaxed">
              {explanation.explanation}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
