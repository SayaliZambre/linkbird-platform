import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Megaphone, Calendar } from "lucide-react"

interface Lead {
  id: string
  name: string
  status: string
  created_at: string
}

interface Campaign {
  id: string
  name: string
  status: string
  created_at: string
}

interface RecentActivityProps {
  leads: Lead[]
  campaigns: Campaign[]
}

export function RecentActivity({ leads, campaigns }: RecentActivityProps) {
  // Combine and sort recent activities
  const recentLeads = leads.slice(0, 5).map((lead) => ({
    type: "lead" as const,
    id: lead.id,
    title: `New lead: ${lead.name}`,
    status: lead.status,
    date: lead.created_at,
  }))

  const recentCampaigns = campaigns.slice(0, 5).map((campaign) => ({
    type: "campaign" as const,
    id: campaign.id,
    title: `Campaign: ${campaign.name}`,
    status: campaign.status,
    date: campaign.created_at,
  }))

  const allActivities = [...recentLeads, ...recentCampaigns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
      converted: "bg-purple-100 text-purple-800",
      lost: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates on your leads and campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activity to display</div>
          ) : (
            allActivities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-shrink-0">
                  {activity.type === "lead" ? (
                    <Users className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Megaphone className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(activity.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
