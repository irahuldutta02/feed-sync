
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, BarChart2, Heart, MessageCircle, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts
const campaignData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 49 },
  { name: 'Apr', value: 63 },
  { name: 'May', value: 58 },
  { name: 'Jun', value: 82 },
  { name: 'Jul', value: 73 },
];

const feedbackData = [
  { rating: '1 Star', count: 5 },
  { rating: '2 Stars', count: 8 },
  { rating: '3 Stars', count: 12 },
  { rating: '4 Stars', count: 25 },
  { rating: '5 Stars', count: 30 },
];

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

const StatCard = ({ title, value, description, icon, trend, trendValue, trendUp }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
          )}
          <span>{trendValue} {trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link to="/dashboard/create-campaign">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white">
              Create Campaign
            </Button>
          </Link>
        </div>
      
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Campaigns"
            value="12"
            description="Active feedback collection campaigns"
            icon={<BarChart2 className="h-4 w-4" />}
            trend="from last month"
            trendValue="+2"
            trendUp={true}
          />
          <StatCard
            title="Total Feedback"
            value="248"
            description="Feedback responses collected"
            icon={<MessageCircle className="h-4 w-4" />}
            trend="from last month"
            trendValue="+32"
            trendUp={true}
          />
          <StatCard
            title="Average Rating"
            value="4.2"
            description="Star rating across all campaigns"
            icon={<Star className="h-4 w-4" />}
            trend="from last month"
            trendValue="+0.3"
            trendUp={true}
          />
          <StatCard
            title="Response Rate"
            value="68%"
            description="Percentage of users giving feedback"
            icon={<Users className="h-4 w-4" />}
            trend="from last month"
            trendValue="-2%"
            trendUp={false}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Feedback Responses</CardTitle>
              <CardDescription>Monthly responses across all campaigns</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={campaignData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Distribution of star ratings across all feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.map((item) => (
                  <div key={item.rating} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">{item.count} responses</span>
                    </div>
                    <Progress value={(item.count / feedbackData.reduce((sum, item) => sum + item.count, 0)) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Campaigns */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Product Feedback {index}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" />
                      <span>4.{index}</span>
                    </div>
                  </div>
                  <CardDescription>Created on July {10 + index}, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">32</span> responses
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last response:</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="mt-4">
                      <Link to={`/dashboard/campaigns/${index}`}>
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
