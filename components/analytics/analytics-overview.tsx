import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Megaphone, Target, TrendingUp, Mail, CheckCircle } from "lucide-react"

interface AnalyticsOverviewProps {
  data: {
    totalLeads: number
    totalCampaigns: number
    activeCampaigns: number
    totalContacted: number
    totalResponses: number
    totalConversions: number
    responseRate: string
    conversionRate: string
  }
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const stats = [
    {
      title: "Total Leads",
      value: data.totalLeads,
      description: "All leads in database",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Campaigns",
      value: data.activeCampaigns,
      description: "Currently running",
      icon: Megaphone,
      color: "text-green-600",
    },
    {
      title: "Leads Contacted",
      value: data.totalContacted,
      description: "Across all campaigns",
      icon: Mail,
      color: "text-orange-600",
    },
    {
      title: "Response Rate",
      value: `${data.responseRate}%`,
      description: "Overall response rate",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Total Responses",
      value: data.totalResponses,
      description: "Leads who responded",
      icon: Target,
      color: "text-cyan-600",
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate}%`,
      description: "Responses to conversions",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
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
