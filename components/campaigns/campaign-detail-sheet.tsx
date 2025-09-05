"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, Users, TrendingUp, Edit } from "lucide-react"

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

interface CampaignDetailSheetProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCampaignUpdated?: (campaign: Campaign) => void
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

export function CampaignDetailSheet({ campaign, open, onOpenChange, onCampaignUpdated }: CampaignDetailSheetProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!campaign) return null

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("campaigns")
        .update({ status: newStatus })
        .eq("id", campaign.id)
        .select()
        .single()

      if (error) throw error

      onCampaignUpdated?.(data)
    } catch (error) {
      console.error("Error updating campaign status:", error)
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

  const calculateResponseRate = () => {
    if (campaign.contacted_leads === 0) return 0
    return (campaign.responded_leads / campaign.contacted_leads) * 100
  }

  const calculateConversionRate = () => {
    if (campaign.responded_leads === 0) return 0
    return (campaign.converted_leads / campaign.responded_leads) * 100
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{campaign.name}</span>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </SheetTitle>
          <SheetDescription>Campaign details and performance metrics</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Type */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Select value={campaign.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <div className="mt-1">
                <Badge className={typeColors[campaign.type as keyof typeof typeColors]}>
                  {campaign.type.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Campaign Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campaign Information</h3>

            {campaign.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{campaign.description}</p>
              </div>
            )}

            {campaign.target_audience && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Target Audience</p>
                <p className="text-sm mt-1">{campaign.target_audience}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {campaign.start_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-sm">{formatDate(campaign.start_date)}</p>
                </div>
              )}

              {campaign.end_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">End Date</p>
                  <p className="text-sm">{formatDate(campaign.end_date)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{campaign.total_leads}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>

              <div className="text-center p-4 bg-muted rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{campaign.contacted_leads}</p>
                <p className="text-sm text-muted-foreground">Contacted</p>
              </div>

              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">{campaign.responded_leads}</p>
                <p className="text-sm text-muted-foreground">Responses</p>
              </div>

              <div className="text-center p-4 bg-muted rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{campaign.converted_leads}</p>
                <p className="text-sm text-muted-foreground">Converted</p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Rate</span>
                  <span>{calculateResponseRate().toFixed(1)}%</span>
                </div>
                <Progress value={calculateResponseRate()} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversion Rate</span>
                  <span>{calculateConversionRate().toFixed(1)}%</span>
                </div>
                <Progress value={calculateConversionRate()} className="h-2" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Leads
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              View Analytics
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
