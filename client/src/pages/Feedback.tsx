import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { getFeedbackList, getUserCampaigns } from "@/services/api";
import {
  Calendar,
  Eye,
  FileText,
  Image,
  Loader2,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "../util/util";

const ITEMS_PER_PAGE = 5;

const Feedback = () => {
  const { toast } = useToast();

  // State for API data and loading
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filters and pagination
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [hasAttachmentsFilter, setHasAttachmentsFilter] = useState(false);

  // Campaign list for the dropdown
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>(
    []
  );

  // Debounce search input to avoid frequent API calls
  const debouncedSearch = useDebounce((value: string) => {
    setSearchQuery(value);
  }, 500);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update the input value immediately for UI feedback
    setSearchInputValue(value);
    // Debounce the actual search query update
    debouncedSearch(value);
  };

  // Fix the main useEffect for fetching data
  useEffect(() => {
    // Only fetch if we have campaigns
    if (campaigns.length > 0) {
      if (campaignFilter === "all" && campaigns.length > 1) {
        // In "All My Campaigns" mode with multiple campaigns
        fetchAllCampaignsFeedback();
      } else {
        // Single campaign mode or only one campaign exists
        fetchFeedback();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    ratingFilter,
    campaignFilter,
    sortOrder,
    hasAttachmentsFilter,
    searchQuery,
    campaigns.length,
  ]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getUserCampaigns();
        if (response.data && Array.isArray(response.data)) {
          const formattedCampaigns = response.data.map((campaign) => ({
            id: campaign._id,
            name: campaign.title || campaign.name, // Support both title and name
          }));

          if (formattedCampaigns.length > 0) {
            setCampaigns(formattedCampaigns);

            // Don't automatically select a campaign by default
            // This allows the "All My Campaigns" option to work
            // The API handler will use the first campaign when "all" is selected
          } else {
            setCampaigns([]);
          }
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        });
      }
    };

    fetchCampaigns();
  }, [toast]);

  // Flag to track when we're loading data from multiple campaigns
  const [isFetchingAllCampaigns, setIsFetchingAllCampaigns] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    ratingFilter,
    campaignFilter,
    sortOrder,
    hasAttachmentsFilter,
  ]);

  // Add debounce to search input
  useEffect(() => {
    if (campaigns.length === 0) return;

    const timeoutId = setTimeout(() => {
      fetchFeedback();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setDetailsOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // First, let's fix the fetchFeedback function to handle filters properly
  const fetchFeedback = async (
    specificCampaignId?: string,
    isAllCampaignsMode = false
  ) => {
    if (!isAllCampaignsMode) {
      setLoading(true);
    } else {
      setIsFetchingAllCampaigns(true);
    }
    setError(null);

    try {
      // Build query parameters
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      // Add campaign filter (required by the API)
      if (campaigns.length === 0) {
        // No campaigns available yet, can't fetch feedback
        setFeedbackData([]);
        setTotalCount(0);
        setLoading(false);
        setIsFetchingAllCampaigns(false);
        return;
      }

      // If a specific campaign is selected or provided, use it
      if (specificCampaignId) {
        params.campaignId = specificCampaignId;
      } else if (campaignFilter !== "all") {
        params.campaignId = campaignFilter;
      } else if (campaigns.length > 0) {
        params.campaignId = campaigns[0].id;
      }

      // Add sort order
      if (sortOrder === "newest") {
        params.sort = "-createdAt";
      } else if (sortOrder === "oldest") {
        params.sort = "createdAt";
      } else if (sortOrder === "top-rated") {
        params.sort = "-rating";
      } else if (sortOrder === "most-upvoted") {
        params.sort = "-upvotes";
      } else if (sortOrder === "most-downvoted") {
        params.sort = "-downvotes";
      }

      // Add search query
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Add rating filter as a parameter (even though the server might not support it)
      if (ratingFilter !== "all") {
        params.rating = parseInt(ratingFilter);
      }

      const response = await getFeedbackList(params);

      // Apply client-side filters
      let filteredData = response.data;

      // Client-side filter by rating if needed
      if (ratingFilter !== "all") {
        const numericRating = parseInt(ratingFilter);
        filteredData = filteredData.filter(
          (item) => item.rating === numericRating
        );
      }

      // Client-side filter by attachments
      if (hasAttachmentsFilter) {
        filteredData = filteredData.filter(
          (item) => item.attachments && item.attachments.length > 0
        );
      }

      setFeedbackData(filteredData);
      // Adjust total count to reflect filtered results for client-side filtering
      if (ratingFilter !== "all" || hasAttachmentsFilter) {
        setTotalCount(filteredData.length);
      } else {
        // Use the total from pagination for server-side pagination
        setTotalCount(response.pagination.total);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load feedback data";

      // Check if the error message contains the campaign ID error
      const campaignIdRequired =
        (error instanceof Error &&
          error.message.includes("Campaign ID is required")) ||
        /campaign.*id.*required/i.test(errorMessage);

      console.error("Error fetching feedback:", error);

      // Set appropriate error message
      if (campaignIdRequired) {
        setError("Please select a campaign to view feedback.");
      } else {
        setError("Failed to load feedback data. Please try again.");
      }

      toast({
        title: "Error",
        description: campaignIdRequired
          ? "Please select a campaign to view feedback"
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsFetchingAllCampaigns(false);
    }
  };

  // Now let's fix the fetchAllCampaignsFeedback function for proper pagination
  const fetchAllCampaignsFeedback = async () => {
    setLoading(true);
    setIsFetchingAllCampaigns(true);
    setError(null);

    try {
      // If no campaigns, return early
      if (campaigns.length === 0) {
        setFeedbackData([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      // Create base params for all requests
      const baseParams: Record<string, string | number> = {
        // Get more data for client-side pagination
        limit: 100, // Increased limit to get more data at once
      };

      // Add sort order
      if (sortOrder === "newest") {
        baseParams.sort = "-createdAt";
      } else if (sortOrder === "oldest") {
        baseParams.sort = "createdAt";
      } else if (sortOrder === "top-rated") {
        baseParams.sort = "-rating";
      } else if (sortOrder === "most-upvoted") {
        baseParams.sort = "-upvotes";
      } else if (sortOrder === "most-downvoted") {
        baseParams.sort = "-downvotes";
      }

      // Add search query
      if (searchQuery) {
        baseParams.search = searchQuery;
      }

      // Add rating filter as a parameter (even though the server might not support it)
      if (ratingFilter !== "all") {
        baseParams.rating = parseInt(ratingFilter);
      }

      // Make a request for each campaign and collect results
      let allFeedbacks = [];

      // Only fetch for the first 5 campaigns to avoid too many requests
      const campaignsToFetch = campaigns.slice(0, 5);

      const promises = campaignsToFetch.map((campaign) => {
        const params = { ...baseParams, campaignId: campaign.id };
        return getFeedbackList(params);
      });

      const results = await Promise.all(promises);

      // Combine results
      results.forEach((result) => {
        if (result?.data && Array.isArray(result.data)) {
          allFeedbacks = [...allFeedbacks, ...result.data];
        }
      });

      // Sort the combined data
      if (sortOrder === "newest") {
        allFeedbacks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortOrder === "oldest") {
        allFeedbacks.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortOrder === "top-rated") {
        allFeedbacks.sort((a, b) => b.rating - a.rating);
      } else if (sortOrder === "most-upvoted") {
        allFeedbacks.sort(
          (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
        );
      } else if (sortOrder === "most-downvoted") {
        allFeedbacks.sort(
          (a, b) => (b.downvotes?.length || 0) - (a.downvotes?.length || 0)
        );
      }

      // Apply client-side filter by rating if needed
      if (ratingFilter !== "all") {
        const numericRating = parseInt(ratingFilter);
        allFeedbacks = allFeedbacks.filter(
          (item) => item.rating === numericRating
        );
      }

      // Client-side filter by attachments
      if (hasAttachmentsFilter) {
        allFeedbacks = allFeedbacks.filter(
          (item) => item.attachments && item.attachments.length > 0
        );
      }

      // Store the total count before pagination
      const totalItems = allFeedbacks.length;

      // Paginate on client-side
      const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      const paginatedResults = allFeedbacks.slice(startIdx, endIdx);

      setFeedbackData(paginatedResults);
      setTotalCount(totalItems); // Use the total count of filtered items
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load feedback data";

      console.error("Error fetching all campaigns feedback:", error);

      setError("Failed to load feedback data. Please try again.");

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsFetchingAllCampaigns(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze feedback from your campaigns.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Feedback</CardTitle>
                <CardDescription>
                  Viewing {feedbackData.length} of {totalCount} feedback
                  responses
                  {campaignFilter === "all" && campaigns.length > 1
                    ? " across all campaigns"
                    : ""}
                </CardDescription>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    className="pl-8 w-full sm:w-64"
                    value={searchInputValue}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-48">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Filter by Rating
                </label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Filter by Campaign
                </label>
                <Select
                  value={campaignFilter}
                  onValueChange={setCampaignFilter}
                  disabled={campaigns.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        campaigns.length === 0
                          ? "Loading campaigns..."
                          : "Select Campaign"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.length > 0 ? (
                      <>
                        <SelectItem value="all">All My Campaigns</SelectItem>
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <SelectItem value="all" disabled>
                        No campaigns found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Sort By
                </label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                    <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
                    <SelectItem value="most-downvoted">
                      Most Downvoted
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={hasAttachmentsFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasAttachmentsFilter(!hasAttachmentsFilter)}
                  className="h-8"
                >
                  <Image className="h-4 w-4 mr-1" />
                  With Attachments
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Viewing {feedbackData.length} of {totalCount} feedback responses
                {campaignFilter === "all" && campaigns.length > 1
                  ? " across all campaigns"
                  : ""}
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name / Campaign</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Feedback Preview</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Engagement
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>
                            {isFetchingAllCampaigns
                              ? "Loading feedback from all campaigns..."
                              : "Loading feedback data..."}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : feedbackData.length > 0 ? (
                    feedbackData.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {item.anonymous ? (
                              <>
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    A
                                  </span>
                                </div>
                                <span className="italic text-muted-foreground">
                                  Anonymous
                                </span>
                              </>
                            ) : item.createdBy ? (
                              <>
                                {item.createdBy.avatarUrl ? (
                                  <img
                                    src={item.createdBy.avatarUrl}
                                    alt={item.createdBy.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs text-primary">
                                      {item.createdBy.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span>{item.createdBy.name}</span>
                              </>
                            ) : (
                              <>
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    ?
                                  </span>
                                </div>
                                <span className="italic text-muted-foreground">
                                  Unknown User
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground ml-10">
                            {item.campaignId.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDateTime(item.createdAt)}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          <div className="flex items-center space-x-1">
                            {item.feedback.substring(0, 60)}
                            {item.feedback.length > 60 && "..."}
                            {item.attachments &&
                              item.attachments.length > 0 && (
                                <span className="inline-flex items-center text-muted-foreground">
                                  <Image className="h-3 w-3 ml-1" />
                                  <span className="text-xs ml-0.5">
                                    {item.attachments.length}
                                  </span>
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-green-500 fill-green-500 text-muted-foreground" />
                            <span className="text-sm font-medium text-green-500">
                              {item.upvotes?.length ?? 0}
                            </span>
                            <ThumbsDown className="h-4 w-4 text-red-500 fill-red-500 text-muted-foreground" />
                            <span className="text-sm font-medium text-red-500">
                              {item.downvotes?.length ?? 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {searchQuery ||
                        ratingFilter !== "all" ||
                        hasAttachmentsFilter
                          ? "No feedback found with the selected filters"
                          : campaigns.length === 0
                          ? "No campaigns found. Create a campaign first to collect feedback."
                          : campaignFilter === "all" && campaigns.length > 1
                          ? "No feedback found across any of your campaigns. Share your campaign links to collect feedback."
                          : "No feedback found for the selected campaign. Share your campaign link to collect feedback."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && !error && totalCount > ITEMS_PER_PAGE && (
              <FeedbackPagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Details Dialog */}
      {selectedFeedback && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>
                {selectedFeedback.anonymous
                  ? "Detailed anonymous feedback"
                  : selectedFeedback.createdBy
                  ? `Detailed feedback submitted by ${selectedFeedback.createdBy.name}`
                  : "Detailed feedback"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    From
                  </h4>
                  {selectedFeedback.anonymous ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">A</span>
                      </div>
                      <p className="font-medium italic">Anonymous</p>
                    </div>
                  ) : selectedFeedback.createdBy ? (
                    <div className="flex items-center gap-2">
                      {selectedFeedback.createdBy.avatarUrl ? (
                        <img
                          src={selectedFeedback.createdBy.avatarUrl}
                          alt={selectedFeedback.createdBy.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm text-primary">
                            {selectedFeedback.createdBy.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <p className="font-medium">
                        {selectedFeedback.createdBy.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">?</span>
                      </div>
                      <p className="font-medium italic">Unknown User</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Campaign
                  </h4>
                  <p>{selectedFeedback.campaignId.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Rating
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedFeedback.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Date
                  </h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{formatDateTime(selectedFeedback.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Engagement
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 text-green-500 fill-green-500 text-muted-foreground" />
                      <span className="text-green-500 font-medium">
                        {selectedFeedback.upvotes?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="h-4 w-4 text-red-500 fill-red-500 text-muted-foreground" />
                      <span className="text-red-500 font-medium">
                        {selectedFeedback.downvotes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Feedback
                </h4>
                <div className="p-4 bg-muted/50 rounded-md">
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="whitespace-pre-wrap">
                      {selectedFeedback.feedback}
                    </p>
                  </div>
                </div>
              </div>

              {selectedFeedback.attachments &&
                selectedFeedback.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Attachments ({selectedFeedback.attachments.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedFeedback.attachments.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`${url}?w=300&h=200&fit=crop&auto=format`}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border border-border"
                          />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                          >
                            View Full Size
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Feedback;
