"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock trend data - would come from Google Trends API
const generateMockTrendData = (keyword: string) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, index) => ({
    month,
    interest: Math.floor(Math.random() * 30) + 60 + index * 2,
  }))
}

interface TrendsChartProps {
  keyword: string
}

export function TrendsChart({ keyword }: TrendsChartProps) {
  const chartData = generateMockTrendData(keyword)

  const chartConfig = {
    interest: {
      label: "Search Interest",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
          <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="interest" stroke="var(--color-interest)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
