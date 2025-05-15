import CreateCampaignDialog from "@/components/campaigns/CreateCampaignDialog";
import DeleteCampaignDialog from "@/components/campaigns/DeleteCampaignDialog";
import EditCampaignDialog from "@/components/campaigns/EditCampaignDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, getCurrentTimeZone } from "@/lib/dateUtils";
import api from "@/services/api";
import { ApiResponse, Campaign } from "@/types/campaign";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Share,
  Star,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Campaigns: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 1;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);

  // State for modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?._id;

  const fetchCampaignsWithoutDebounce = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ApiResponse<Campaign[]>>(
        "/campaign/paginated_list/",
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery.trim() || undefined,
            created_by: userId,
            status: statusFilter !== "all" ? statusFilter : undefined,
          },
        }
      );

      if (response.data.error === false) {
        setCampaigns(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
          setTotalCampaigns(response.data.pagination.totalCampaigns);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch campaigns",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching campaigns:", error);
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response?: { data?: { message?: string } };
        };
        toast({
          title: "Error",
          description:
            errorResponse.response?.data?.message ||
            "Failed to fetch campaigns",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch campaigns",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = useDebounce(fetchCampaignsWithoutDebounce, 300);

  // Fetch campaigns
  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Handle campaign deletion
  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  // Open edit campaign modal
  const handleEditClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
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

          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>{" "}
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              </div>
            ) : (
              <>
                {/* Table view for medium and larger screens */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Campaign</TableHead>
                        <TableHead>Responses</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                          <TableRow key={campaign._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-10 w-10 rounded bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(${campaign.bannerImage})`,
                                  }}
                                />
                                <div>
                                  {campaign.title.length > 30
                                    ? campaign.title.substring(0, 30) + "..."
                                    : campaign.title}
                                  <div className="text-xs text-muted-foreground">
                                    /c/
                                    {campaign.slug.length > 20
                                      ? campaign.slug.substring(0, 20) + "..."
                                      : campaign.slug}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{campaign.feedbackCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star
                                  className="h-4 w-4 text-yellow-500 mr-1"
                                  fill="currentColor"
                                />
                                {campaign.averageRating?.toFixed(1) || "0.0"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  campaign.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                                    : campaign.status === "Draft"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                                }`}
                              >
                                {campaign.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatDate(
                                campaign.createdAt,
                                getCurrentTimeZone()
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {" "}
                                  <DropdownMenuItem>
                                    <Link
                                      to={`/c/${campaign.slug}`}
                                      className="flex items-center w-full"
                                      target="_blank"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Campaign
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Link
                                      to={`/dashboard/feedback?campaignId=${campaign._id}`}
                                      className="flex items-center w-full"
                                    >
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      View Feedback
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(campaign)}
                                  >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Campaign
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `${window.location.origin}/c/${campaign.slug}`
                                      );
                                      toast({
                                        title: "Campaign link copied!",
                                        description: "You can now share it.",
                                        variant: "default",
                                      });
                                    }}
                                  >
                                    <Share className="h-4 w-4 mr-2" />
                                    Share Campaign
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDeleteClick(campaign)}
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
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            {searchQuery || statusFilter !== "all" ? (
                              <>
                                No campaigns found matching your filters.
                                {searchQuery && (
                                  <>
                                    {" "}
                                    Search: "<strong>{searchQuery}</strong>"
                                  </>
                                )}
                                {statusFilter !== "all" && (
                                  <>
                                    {" "}
                                    Status: "<strong>{statusFilter}</strong>"
                                  </>
                                )}
                              </>
                            ) : (
                              "No campaigns found. Create your first campaign to get started."
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Card view for small screens */}
                <div className="md:hidden space-y-4">
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <Card key={campaign._id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-12 w-12 rounded bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${campaign.bannerImage})`,
                                }}
                              />
                              <div>
                                <h3 className="font-medium">
                                  {campaign.title.length > 30
                                    ? campaign.title.substring(0, 30) + "..."
                                    : campaign.title}
                                </h3>
                                <div className="text-xs text-muted-foreground">
                                  /c/{campaign.slug}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link
                                    to={`/c/${campaign.slug}`}
                                    className="flex items-center w-full"
                                    target="_blank"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Campaign
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link
                                    to={`/dashboard/feedback?campaignId=${campaign._id}`}
                                    className="flex items-center w-full"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    View Feedback
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(campaign)}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${window.location.origin}/c/${campaign.slug}`
                                    );
                                    toast({
                                      title: "Campaign link copied!",
                                      description: "You can now share it.",
                                      variant: "default",
                                    });
                                  }}
                                >
                                  <Share className="h-4 w-4 mr-2" />
                                  Share Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteClick(campaign)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Campaign
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-0">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  campaign.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                                    : campaign.status === "Draft"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                                }`}
                              >
                                {campaign.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Responses</p>
                              <p>{campaign.feedbackCount || 0}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rating</p>
                              <div className="flex items-center">
                                <Star
                                  className="h-4 w-4 text-yellow-500 mr-1"
                                  fill="currentColor"
                                />
                                {campaign.averageRating?.toFixed(1) || "0.0"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
                          Created:{" "}
                          {formatDate(campaign.createdAt, getCurrentTimeZone())}
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      {searchQuery || statusFilter !== "all" ? (
                        <>
                          No campaigns found matching your filters.
                          {searchQuery && (
                            <>
                              {" "}
                              Search: "<strong>{searchQuery}</strong>"
                            </>
                          )}
                          {statusFilter !== "all" && (
                            <>
                              {" "}
                              Status: "<strong>{statusFilter}</strong>"
                            </>
                          )}
                        </>
                      ) : (
                        "No campaigns found. Create your first campaign to get started."
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex items-center flex-wrap justify-center gap-4 md:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalCampaigns)} of{" "}
                {totalCampaigns} campaigns
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchCampaigns}
      />

      {/* Edit Campaign Dialog */}
      <EditCampaignDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />

      {/* Delete Campaign Dialog */}
      <DeleteCampaignDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />
    </DashboardLayout>
  );
};

export default Campaigns;
