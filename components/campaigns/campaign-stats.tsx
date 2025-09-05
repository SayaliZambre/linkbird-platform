import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Target, Users, TrendingUp } from "lucide-react"

interface CampaignStatsProps {
  stats: {
    totalCampaigns: number
    activeCampaigns: number
    totalLeads: number
    totalResponses: number
    responseRate: string
  }
}

export function CampaignStats({ stats }: CampaignStatsProps) {
  const statItems = [
    {
      title: "Total Campaigns",
      value: stats.totalCampaigns,
      description: "All campaigns created",
      icon: Megaphone,
      color: "text-blue-600",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      description: "Currently running",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Total Leads Contacted",
      value: stats.totalLeads,
      description: "Across all campaigns",
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      description: "Overall response rate",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
