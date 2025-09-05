import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadsTable } from "@/components/leads/leads-table"
import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function LeadsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get initial leads data
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (leadsError) {
    console.error("Error fetching leads:", leadsError)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Manage and track your leads</p>
        </div>
        <AddLeadDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </AddLeadDialog>
      </div>

      <LeadsTable initialLeads={leads || []} />
    </div>
  )
}
