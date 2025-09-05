import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CampaignsTable } from "@/components/campaigns/campaigns-table"
import { CampaignStats } from "@/components/campaigns/campaign-stats"
import { AddCampaignDialog } from "@/components/campaigns/add-campaign-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function CampaignsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get campaigns data
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (campaignsError) {
    console.error("Error fetching campaigns:", campaignsError)
  }

  // Get campaign statistics
  const totalCampaigns = campaigns?.length || 0
  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0
  const totalLeads = campaigns?.reduce((sum, c) => sum + (c.total_leads || 0), 0) || 0
  const totalResponses = campaigns?.reduce((sum, c) => sum + (c.responded_leads || 0), 0) || 0

  const stats = {
    totalCampaigns,
    activeCampaigns,
    totalLeads,
    totalResponses,
    responseRate: totalLeads > 0 ? ((totalResponses / totalLeads) * 100).toFixed(1) : "0",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your outreach campaigns</p>
        </div>
        <AddCampaignDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </AddCampaignDialog>
      </div>

      <CampaignStats stats={stats} />
      <CampaignsTable initialCampaigns={campaigns || []} />
    </div>
  )
}
