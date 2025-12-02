import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  Award,
  Megaphone,
  PhoneCall,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { DashboardStats, Campaign, Call } from "@shared/schema";

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  subtitle,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trendUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {trendUp ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trend}
              </div>
            )}
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CampaignProgressCard({
  campaigns,
  loading,
}: {
  campaigns: Campaign[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "running" || c.status === "scheduled"
  );

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Active Campaigns</CardTitle>
        <Link href="/campaigns">
          <Button variant="ghost" size="sm" data-testid="button-view-all-campaigns">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {activeCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No active campaigns</p>
            <Link href="/campaigns/new">
              <Button variant="outline" size="sm" className="mt-3" data-testid="button-create-campaign">
                Create Campaign
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCampaigns.slice(0, 4).map((campaign) => {
              const progress = campaign.totalCandidates > 0
                ? Math.round((campaign.completedCalls / campaign.totalCandidates) * 100)
                : 0;
              return (
                <div key={campaign.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-sm truncate">
                        {campaign.name}
                      </span>
                      <Badge
                        variant={campaign.status === "running" ? "default" : "secondary"}
                        className="text-xs shrink-0"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {campaign.completedCalls}/{campaign.totalCandidates}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({
  calls,
  loading,
}: {
  calls: Call[];
  loading?: boolean;
}) {
  const getOutcomeIcon = (outcome: string | null) => {
    switch (outcome) {
      case "interested":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "not_interested":
      case "opt_out":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "no_answer":
      case "busy":
      case "voicemail":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Link href="/calls">
          <Button variant="ghost" size="sm" data-testid="button-view-all-calls">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PhoneCall className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No recent calls</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calls.slice(0, 6).map((call) => (
              <div
                key={call.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {getOutcomeIcon(call.outcome)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Call {call.outcome ? `- ${call.outcome.replace("_", " ")}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {call.duration ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, "0")}` : "0:00"}
                    {call.createdAt && ` • ${formatTime(call.createdAt)}`}
                  </p>
                </div>
                {call.confidence !== null && call.confidence !== undefined && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {call.confidence}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Link href="/vacancies/new">
            <Button data-testid="button-quick-add-vacancy">
              Add Vacancy
            </Button>
          </Link>
          <Link href="/candidates/new">
            <Button variant="outline" data-testid="button-quick-add-candidate">
              Add Candidate
            </Button>
          </Link>
          <Link href="/campaigns/new">
            <Button variant="outline" data-testid="button-quick-start-campaign">
              Start Campaign
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" data-testid="button-quick-settings">
              Configure Integrations
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: recentCalls = [], isLoading: callsLoading } = useQuery<Call[]>({
    queryKey: ["/api/calls", { limit: 10 }],
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's an overview of your recruitment activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats?.totalApplications ?? 0}
          icon={Users}
          trend="+12%"
          trendUp
          subtitle="This month"
          loading={statsLoading}
        />
        <StatsCard
          title="Interviews Scheduled"
          value={stats?.interviewsScheduled ?? 0}
          icon={Calendar}
          trend="+8%"
          trendUp
          subtitle="This week"
          loading={statsLoading}
        />
        <StatsCard
          title="Placements"
          value={stats?.placements ?? 0}
          icon={Award}
          trend="+3"
          trendUp
          subtitle="This month"
          loading={statsLoading}
        />
        <StatsCard
          title="Success Rate"
          value={stats ? `${stats.successRate}%` : "0%"}
          icon={TrendingUp}
          trend="+5%"
          trendUp
          subtitle="Call conversions"
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CampaignProgressCard campaigns={campaigns} loading={campaignsLoading} />
        <RecentActivityCard calls={recentCalls} loading={callsLoading} />
      </div>

      <QuickActionsCard />
    </div>
  );
}
