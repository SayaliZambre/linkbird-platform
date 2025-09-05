"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  status: string
}

interface Campaign {
  id: string
  name: string
  total_leads: number
}

interface ManageLeadsDialogProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCampaignUpdated?: (campaign: Campaign) => void
}

export function ManageLeadsDialog({ campaign, open, onOpenChange, onCampaignUpdated }: ManageLeadsDialogProps) {
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([])
  const [campaignLeads, setCampaignLeads] = useState<string[]>([])
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (campaign && open) {
      loadLeads()
    }
  }, [campaign, open])

  const loadLeads = async () => {
    if (!campaign) return

    try {
      const supabase = createClient()

      // Get all available leads
      const { data: leads } = await supabase.from("leads").select("id, name, email, company, status").order("name")

      // Get leads already in this campaign
      const { data: campaignLeadIds } = await supabase
        .from("campaign_leads")
        .select("lead_id")
        .eq("campaign_id", campaign.id)

      setAvailableLeads(leads || [])
      const existingLeadIds = campaignLeadIds?.map((cl) => cl.lead_id) || []
      setCampaignLeads(existingLeadIds)
      setSelectedLeads(existingLeadIds)
    } catch (error) {
      console.error("Error loading leads:", error)
    }
  }

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const handleSave = async () => {
    if (!campaign) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      // Remove leads that are no longer selected
      const leadsToRemove = campaignLeads.filter((id) => !selectedLeads.includes(id))
      if (leadsToRemove.length > 0) {
        await supabase.from("campaign_leads").delete().eq("campaign_id", campaign.id).in("lead_id", leadsToRemove)
      }

      // Add newly selected leads
      const leadsToAdd = selectedLeads.filter((id) => !campaignLeads.includes(id))
      if (leadsToAdd.length > 0) {
        const newCampaignLeads = leadsToAdd.map((leadId) => ({
          campaign_id: campaign.id,
          lead_id: leadId,
          status: "pending",
        }))

        await supabase.from("campaign_leads").insert(newCampaignLeads)
      }

      // Update campaign total_leads count
      await supabase.from("campaigns").update({ total_leads: selectedLeads.length }).eq("id", campaign.id)

      onCampaignUpdated?.({ ...campaign, total_leads: selectedLeads.length })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating campaign leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLeads = availableLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!campaign) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Manage Campaign Leads
          </DialogTitle>
          <DialogDescription>Select leads to include in "{campaign.name}" campaign</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          <div className="text-sm text-muted-foreground">{selectedLeads.length} leads selected</div>

          {/* Leads list */}
          <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-md p-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No leads found</div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleLeadToggle(lead.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
                      </div>
                      <Badge variant="outline">{lead.status}</Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
