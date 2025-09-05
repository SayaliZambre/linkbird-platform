import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Megaphone, TrendingUp, Target, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get basic stats
  const { data: leadsCount } = await supabase.from("leads").select("id", { count: "exact" }).eq("user_id", user.id)

  const { data: campaignsCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)

  const { data: activeCampaigns } = await supabase
    .from("campaigns")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", "active")

  const stats = [
    {
      title: "Total Leads",
      value: leadsCount?.length || 0,
      description: "All leads in your database",
      icon: Users,
      color: "text-blue-600",
      href: "/dashboard/leads",
    },
    {
      title: "Total Campaigns",
      value: campaignsCount?.length || 0,
      description: "All campaigns created",
      icon: Megaphone,
      color: "text-green-600",
      href: "/dashboard/campaigns",
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns?.length || 0,
      description: "Currently running campaigns",
      icon: Target,
      color: "text-orange-600",
      href: "/dashboard/campaigns",
    },
    {
      title: "Conversion Rate",
      value: "0%",
      description: "Overall conversion rate",
      icon: TrendingUp,
      color: "text-purple-600",
      href: "/dashboard/analytics",
    },
  ]

  const isNewUser = (leadsCount?.length || 0) === 0 && (campaignsCount?.length || 0) === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {isNewUser ? "Welcome to Linkbird!" : "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {isNewUser
            ? "Let's get you started with your lead management journey."
            : "Welcome back! Here's an overview of your lead management activity."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions or Getting Started */}
      <div className="grid gap-4 md:grid-cols-2">
        {isNewUser ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Add Your First Leads
                </CardTitle>
                <CardDescription>Start building your lead database to track potential customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/leads">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Leads
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center">
                  <Megaphone className="mr-2 h-5 w-5 text-green-600" />
                  Create Your First Campaign
                </CardTitle>
                <CardDescription>Set up outreach campaigns to engage with your leads</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/campaigns">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
                <CardDescription>Your latest lead management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No recent activity to display. Start by adding some leads or creating a campaign.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/leads" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Leads
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/campaigns" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Megaphone className="mr-2 h-4 w-4" />
                    View Campaigns
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/analytics" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
