"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface Campaign {
  id: string
  created_at: string
  status: string
  contacted_leads: number
  responded_leads: number
  converted_leads: number
}

interface CampaignsChartProps {
  campaigns: Campaign[]
}

export function CampaignsChart({ campaigns }: CampaignsChartProps) {
  const chartData = useMemo(() => {
    // Group campaigns by month and calculate performance
    const monthlyData: {
      [key: string]: { month: string; campaigns: number; contacted: number; responses: number; conversions: number }
    } = {}

    campaigns.forEach((campaign) => {
      const date = new Date(campaign.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          campaigns: 0,
          contacted: 0,
          responses: 0,
          conversions: 0,
        }
      }

      monthlyData[monthKey].campaigns++
      monthlyData[monthKey].contacted += campaign.contacted_leads || 0
      monthlyData[monthKey].responses += campaign.responded_leads || 0
      monthlyData[monthKey].conversions += campaign.converted_leads || 0
    })

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }, [campaigns])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>Monthly campaign metrics and conversion funnel</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="contacted" stroke="hsl(var(--chart-1))" name="Contacted" strokeWidth={2} />
            <Line type="monotone" dataKey="responses" stroke="hsl(var(--chart-2))" name="Responses" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="hsl(var(--chart-3))"
              name="Conversions"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
