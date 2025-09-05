"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Building, User, ExternalLink, Edit } from "lucide-react"

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

interface LeadDetailSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeadUpdated?: (lead: Lead) => void
}

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-purple-100 text-purple-800",
  lost: "bg-red-100 text-red-800",
}

export function LeadDetailSheet({ lead, open, onOpenChange, onLeadUpdated }: LeadDetailSheetProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!lead) return null

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("leads")
        .update({
          status: newStatus,
          last_contacted: newStatus === "contacted" ? new Date().toISOString() : lead.last_contacted,
        })
        .eq("id", lead.id)
        .select()
        .single()

      if (error) throw error

      onLeadUpdated?.(data)
    } catch (error) {
      console.error("Error updating lead status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{lead.name}</span>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </SheetTitle>
          <SheetDescription>Lead details and contact information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-2">
              <Select value={lead.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">Email</p>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{lead.phone}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
              )}

              {lead.company && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">Company</p>
                  </div>
                </div>
              )}

              {lead.position && (
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{lead.position}</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                  </div>
                </div>
              )}

              {lead.linkedin_url && (
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <a
                      href={lead.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                    <p className="text-xs text-muted-foreground">Social</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lead Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score</p>
                <p className="text-lg font-semibold">{lead.score}</p>
              </div>

              {lead.source && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source</p>
                  <p className="text-sm">{lead.source}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(lead.created_at)}</p>
              </div>

              {lead.last_contacted && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Contacted</p>
                  <p className="text-sm">{formatDate(lead.last_contacted)}</p>
                </div>
              )}
            </div>

            {lead.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">{lead.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Add to Campaign
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
