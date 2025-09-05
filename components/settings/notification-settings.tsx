"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    campaignUpdates: true,
    leadNotifications: false,
    weeklyReports: true,
  })

  const handleSave = () => {
    // Save notification settings
    console.log("Saving notification settings:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="campaign-updates">Campaign Updates</Label>
            <p className="text-sm text-muted-foreground">Get notified when campaigns start, pause, or complete</p>
          </div>
          <Switch
            id="campaign-updates"
            checked={settings.campaignUpdates}
            onCheckedChange={(checked) => setSettings({ ...settings, campaignUpdates: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="lead-notifications">New Lead Notifications</Label>
            <p className="text-sm text-muted-foreground">Get notified when new leads are added or respond</p>
          </div>
          <Switch
            id="lead-notifications"
            checked={settings.leadNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, leadNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-reports">Weekly Reports</Label>
            <p className="text-sm text-muted-foreground">Receive weekly performance summaries via email</p>
          </div>
          <Switch
            id="weekly-reports"
            checked={settings.weeklyReports}
            onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
          />
        </div>

        <Button onClick={handleSave}>Save Preferences</Button>
      </CardContent>
    </Card>
  )
}
