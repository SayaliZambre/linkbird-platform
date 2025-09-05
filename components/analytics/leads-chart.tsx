"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface Lead {
  id: string
  created_at: string
  status: string
}

interface LeadsChartProps {
  leads: Lead[]
}

export function LeadsChart({ leads }: LeadsChartProps) {
  const chartData = useMemo(() => {
    // Group leads by month
    const monthlyData: {
      [key: string]: { month: string; leads: number; new: number; contacted: number; converted: number }
    } = {}

    leads.forEach((lead) => {
      const date = new Date(lead.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          leads: 0,
          new: 0,
          contacted: 0,
          converted: 0,
        }
      }

      monthlyData[monthKey].leads++

      if (lead.status === "new") monthlyData[monthKey].new++
      else if (lead.status === "contacted") monthlyData[monthKey].contacted++
      else if (lead.status === "converted") monthlyData[monthKey].converted++
    })

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }, [leads])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Over Time</CardTitle>
        <CardDescription>Monthly lead generation and status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="new" stackId="a" fill="hsl(var(--chart-1))" name="New" />
            <Bar dataKey="contacted" stackId="a" fill="hsl(var(--chart-2))" name="Contacted" />
            <Bar dataKey="converted" stackId="a" fill="hsl(var(--chart-3))" name="Converted" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
