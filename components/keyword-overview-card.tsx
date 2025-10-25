"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KeywordOverviewCardProps {
  keyword: string
  score: number
  trend: "up" | "down" | "stable"
  onClick: () => void
  isSelected: boolean
}

export function KeywordOverviewCard({ keyword, score, trend, onClick, isSelected }: KeywordOverviewCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500/20 text-green-400 border-green-500/50"
    if (score >= 50) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
    return "bg-red-500/20 text-red-400 border-red-500/50"
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-400" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Minus className="h-4 w-4 text-yellow-400" />
  }

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isSelected ? "bg-indigo-600/20 border-indigo-500/50" : "bg-white/5 border-white/10 hover:border-white/20"
      } backdrop-blur-sm`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white capitalize">{keyword}</h3>
          {getTrendIcon()}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{score}</div>
            <div className="text-sm text-slate-400">Opportunity Score</div>
          </div>
          <Badge className={getScoreColor(score)}>{score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Fair"}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
