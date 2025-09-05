"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, Play, Pause, Users, Megaphone, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CampaignDetailSheet } from "./campaign-detail-sheet"
import { EditCampaignDialog } from "./edit-campaign-dialog"
import { ManageLeadsDialog } from "./manage-leads-dialog"
import { AddCampaignDialog } from "./add-campaign-dialog"
import { EmptyState } from "@/components/ui/empty-state"

interface Campaign {
  id: string
  name: string
  description?: string
  status: string
  type: string
  target_audience?: string
  start_date?: string
  end_date?: string
  total_leads: number
  contacted_leads: number
  responded_leads: number
  converted_leads: number
  created_at: string
  updated_at: string
}

interface CampaignsTableProps {
  initialCampaigns: Campaign[]
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
}

const typeColors = {
  email: "bg-blue-100 text-blue-800",
  linkedin: "bg-purple-100 text-purple-800",
  cold_call: "bg-orange-100 text-orange-800",
}

export function CampaignsTable({ initialCampaigns }: CampaignsTableProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [managingLeadsCampaign, setManagingLeadsCampaign] = useState<Campaign | null>(null)

  // Filter campaigns based on search and status
  useEffect(() => {
    let filtered = campaigns

    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((campaign) => campaign.status === statusFilter)
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, searchTerm, statusFilter])

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsDetailSheetOpen(true)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
  }

  const handleManageLeads = (campaign: Campaign) => {
    setManagingLeadsCampaign(campaign)
  }

  const handleCampaignUpdated = (updatedCampaign: Campaign) => {
    setCampaigns(campaigns.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign)))
    setSelectedCampaign(updatedCampaign)
  }

  const handleCampaignAdded = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns])
  }

  const handleStatusToggle = async (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active"

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("campaigns")
        .update({ status: newStatus })
        .eq("id", campaign.id)
        .select()
        .single()

      if (error) throw error

      handleCampaignUpdated(data)
    } catch (error) {
      console.error("Error updating campaign status:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateResponseRate = (campaign: Campaign) => {
    if (campaign.contacted_leads === 0) return "0%"
    return `${((campaign.responded_leads / campaign.contacted_leads) * 100).toFixed(1)}%`
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table or Empty State */}
      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first outreach campaign to start managing and tracking your lead generation efforts."
          action={{
            label: "Create Your First Campaign",
            onClick: () => {
              // Trigger add campaign dialog
              const addButton = document.querySelector("[data-add-campaign-trigger]") as HTMLElement
              addButton?.click()
            },
          }}
        />
      ) : (
        <>
          {/* Table */}
          <div className="rounded-md border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Campaign</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Leads</TableHead>
                    <TableHead className="min-w-[120px]">Response Rate</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No campaigns found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            {campaign.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {campaign.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeColors[campaign.type as keyof typeof typeColors]}>
                            {campaign.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{campaign.total_leads} total</p>
                            <p className="text-muted-foreground">{campaign.contacted_leads} contacted</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{calculateResponseRate(campaign)}</TableCell>
                        <TableCell className="text-sm">{formatDate(campaign.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewCampaign(campaign)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageLeads(campaign)}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Leads
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusToggle(campaign)}>
                                {campaign.status === "active" ? (
                                  <>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause Campaign
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Campaign
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Hidden trigger for empty state */}
      <div className="hidden">
        <AddCampaignDialog onCampaignAdded={handleCampaignAdded}>
          <Button data-add-campaign-trigger>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </AddCampaignDialog>
      </div>

      {/* Campaign Detail Sheet */}
      <CampaignDetailSheet
        campaign={selectedCampaign}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onCampaignUpdated={handleCampaignUpdated}
      />

      {/* Edit Campaign Dialog */}
      <EditCampaignDialog
        campaign={editingCampaign}
        open={!!editingCampaign}
        onOpenChange={(open) => !open && setEditingCampaign(null)}
        onCampaignUpdated={handleCampaignUpdated}
      />

      {/* Manage Leads Dialog */}
      <ManageLeadsDialog
        campaign={managingLeadsCampaign}
        open={!!managingLeadsCampaign}
        onOpenChange={(open) => !open && setManagingLeadsCampaign(null)}
        onCampaignUpdated={handleCampaignUpdated}
      />
    </div>
  )
}
