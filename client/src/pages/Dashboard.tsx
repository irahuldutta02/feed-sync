import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardAnalytics } from "@/services/api";
import {
  BarChart2,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateTime } from "../util/util";

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
  trendUp?: boolean;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  trendUp,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div
          className={`flex items-center mt-2 text-xs ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trendUp ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
          )}
          <span>
            {trendValue} {trend}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Skeleton components
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="col-span-1">
    <CardHeader>
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent className="h-80">
      <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
    </CardContent>
  </Card>
);

const CampaignCardSkeleton = () => (
  <Card className="hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="mt-4">
          <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface FeedbackDataItem {
  rating: string;
  count: number;
}
interface CampaignDataItem {
  name: string;
  value: number;
}
interface RecentCampaign {
  _id: string;
  title: string;
  createdAt: string;
  feedbackCount: number;
  averageRating: number;
  slug: string;
}
interface DashboardStats {
  totalCampaigns: number;
  totalFeedback: number;
  averageRating: number;
  responseRate: string | null;
  campaignData: CampaignDataItem[];
  feedbackData: FeedbackDataItem[];
  recentCampaigns: RecentCampaign[];
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboardAnalytics();
        setStats(res.data);
      } catch {
        setError("Failed to load dashboard analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-destructive text-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  // Fallbacks for stats
  const {
    totalCampaigns = 0,
    totalFeedback = 0,
    averageRating = 0,
    campaignData = [],
    feedbackData = [],
    recentCampaigns = [],
  } = stats || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Campaigns"
                value={String(totalCampaigns)}
                description="Active feedback collection campaigns"
                icon={<BarChart2 className="h-4 w-4" />}
              />
              <StatCard
                title="Total Feedback"
                value={String(totalFeedback)}
                description="Feedback responses collected"
                icon={<MessageCircle className="h-4 w-4" />}
              />
              <StatCard
                title="Average Rating"
                value={averageRating ? averageRating.toFixed(2) : "0.00"}
                description="Star rating across all campaigns"
                icon={<Star className="h-4 w-4" />}
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Feedback Responses</CardTitle>
                  <CardDescription>
                    Monthly responses across all campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={campaignData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>
                    Distribution of star ratings across all feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbackData.map((item) => (
                      <div key={item.rating} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} responses
                          </span>
                        </div>
                        <Progress
                          value={
                            (item.count /
                              feedbackData.reduce(
                                (sum, i) => sum + i.count,
                                0
                              )) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Campaigns */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <>
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
              </>
            ) : recentCampaigns.length > 0 ? (
              recentCampaigns.map((c) => (
                <Card key={c._id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{c.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star
                          className="h-4 w-4 mr-1 text-yellow-500"
                          fill="currentColor"
                        />
                        <span>
                          {c.averageRating ? c.averageRating.toFixed(2) : "0"}
                        </span>
                      </div>
                    </div>
                    <CardDescription>
                      Created on {formatDateTime(c.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{c.feedbackCount}</span>{" "}
                        responses
                      </div>
                      <div className="mt-4">
                        <Link to={`/dashboard/feedback?campaignId=${c._id}`}>
                          <Button variant="outline" className="w-full">
                            View Campaign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No campaigns found. Create your first campaign to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
