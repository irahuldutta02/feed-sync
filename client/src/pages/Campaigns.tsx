
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Edit3, Eye, MoreHorizontal, Plus, Search, Star, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Sample data
const campaignsData = [
  {
    id: 1,
    name: "Product Feedback Q3",
    slug: "product-feedback-q3",
    responses: 58,
    averageRating: 4.2,
    status: "Active",
    createdAt: "2023-07-15",
  },
  {
    id: 2,
    name: "Website Redesign Feedback",
    slug: "website-redesign-feedback",
    responses: 32,
    averageRating: 3.8,
    status: "Active",
    createdAt: "2023-06-22",
  },
  {
    id: 3,
    name: "Customer Support Survey",
    slug: "customer-support-survey",
    responses: 124,
    averageRating: 4.5,
    status: "Active",
    createdAt: "2023-05-10",
  },
  {
    id: 4,
    name: "Mobile App Beta Feedback",
    slug: "mobile-app-beta",
    responses: 47,
    averageRating: 3.6,
    status: "Active",
    createdAt: "2023-04-05",
  },
  {
    id: 5,
    name: "New Feature Evaluation",
    slug: "new-feature-evaluation",
    responses: 19,
    averageRating: 4.1,
    status: "Active",
    createdAt: "2023-03-18",
  },
];

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredCampaigns = campaignsData.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setSelectedCampaign(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would delete the campaign
    toast({
      title: "Campaign deleted",
      description: "The campaign has been deleted successfully.",
    });
    setDeleteDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor your feedback collection campaigns.
            </p>
          </div>
          
          <Link to="/dashboard/create-campaign">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Campaign List</CardTitle>
                <CardDescription>
                  You have {campaignsData.length} total campaigns
                </CardDescription>
              </div>
              <div className="w-64 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.name}
                        <div className="text-xs text-muted-foreground">/c/{campaign.slug}</div>
                      </TableCell>
                      <TableCell>{campaign.responses}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                          {campaign.averageRating.toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell>{campaign.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/campaigns/${campaign.slug}`} className="flex items-center w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                View Campaign
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link to={`/dashboard/campaigns/${campaign.id}/edit`} className="flex items-center w-full">
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Campaign
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClick(campaign.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {searchQuery ? (
                        <>No campaigns found matching "<strong>{searchQuery}</strong>"</>
                      ) : (
                        "No campaigns found. Create your first campaign to get started."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone
              and all associated feedback data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaigns;
