import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { LeadsChart } from "@/components/analytics/leads-chart"
import { CampaignsChart } from "@/components/analytics/campaigns-chart"
import { RecentActivity } from "@/components/analytics/recent-activity"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get analytics data
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate analytics metrics
  const totalLeads = leads?.length || 0
  const totalCampaigns = campaigns?.length || 0
  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0
  const totalContacted = campaigns?.reduce((sum, c) => sum + (c.contacted_leads || 0), 0) || 0
  const totalResponses = campaigns?.reduce((sum, c) => sum + (c.responded_leads || 0), 0) || 0
  const totalConversions = campaigns?.reduce((sum, c) => sum + (c.converted_leads || 0), 0) || 0

  const responseRate = totalContacted > 0 ? ((totalResponses / totalContacted) * 100).toFixed(1) : "0"
  const conversionRate = totalResponses > 0 ? ((totalConversions / totalResponses) * 100).toFixed(1) : "0"

  const analyticsData = {
    totalLeads,
    totalCampaigns,
    activeCampaigns,
    totalContacted,
    totalResponses,
    totalConversions,
    responseRate,
    conversionRate,
    leads: leads || [],
    campaigns: campaigns || [],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your lead generation and campaign performance</p>
      </div>

      <AnalyticsOverview data={analyticsData} />

      <div className="grid gap-6 md:grid-cols-2">
        <LeadsChart leads={leads || []} />
        <CampaignsChart campaigns={campaigns || []} />
      </div>

      <RecentActivity leads={leads || []} campaigns={campaigns || []} />
    </div>
  )
}
