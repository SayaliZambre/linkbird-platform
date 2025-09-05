"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, Users, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LeadDetailSheet } from "./lead-detail-sheet"
import { EditLeadDialog } from "./edit-lead-dialog"
import { AddLeadDialog } from "./add-lead-dialog"
import { EmptyState } from "@/components/ui/empty-state"

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  position?: string
  phone?: string
  linkedin_url?: string
  status: string
  source?: string
  notes?: string
  score: number
  last_contacted?: string
  created_at: string
  updated_at: string
}

interface LeadsTableProps {
  initialLeads: Lead[]
}

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-purple-100 text-purple-800",
  lost: "bg-red-100 text-red-800",
}

export function LeadsTable({ initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(initialLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter])

  // Load more leads (infinite scroll simulation)
  const loadMoreLeads = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data: newLeads } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(leads.length, leads.length + 49)

    if (newLeads) {
      setLeads([...leads, ...newLeads])
    }
    setIsLoading(false)
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailSheetOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead)
  }

  const handleLeadUpdated = (updatedLead: Lead) => {
    setLeads(leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
    setSelectedLead(updatedLead)
  }

  const handleLeadAdded = (newLead: Lead) => {
    setLeads([newLead, ...leads])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table or Empty State */}
      {leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads yet"
          description="Start building your lead database by adding your first lead. You can import leads or add them manually."
          action={{
            label: "Add Your First Lead",
            onClick: () => {
              // Trigger add lead dialog
              const addButton = document.querySelector("[data-add-lead-trigger]") as HTMLElement
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
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[150px]">Company</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[80px]">Score</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No leads found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell className="text-sm">{lead.email}</TableCell>
                        <TableCell>{lead.company || "-"}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.score}</TableCell>
                        <TableCell className="text-sm">{formatDate(lead.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditLead(lead)}>Edit Lead</DropdownMenuItem>
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

          {/* Load More */}
          {leads.length > 0 && leads.length % 50 === 0 && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMoreLeads} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Hidden trigger for empty state */}
      <div className="hidden">
        <AddLeadDialog onLeadAdded={handleLeadAdded}>
          <Button data-add-lead-trigger>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </AddLeadDialog>
      </div>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onLeadUpdated={handleLeadUpdated}
      />

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        lead={editingLead}
        open={!!editingLead}
        onOpenChange={(open) => !open && setEditingLead(null)}
        onLeadUpdated={handleLeadUpdated}
      />
    </div>
  )
}
