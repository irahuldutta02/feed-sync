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
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDateTime } from "../util/util";

const ITEMS_PER_PAGE = 5;

const Feedback = () => {
  const { toast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();

  // State for API data and loading
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filters and pagination
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [hasAttachmentsFilter, setHasAttachmentsFilter] = useState(false);

  // Campaign list for the dropdown
  const [campaigns, setCampaigns] = useState([]);

  // Debounce search input to avoid frequent API calls
  const debouncedSearch = useDebounce((value: string) => {
    setSearchQuery(value);
  }, 500);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  // Always derive campaignFilter from query string
  const campaignFilter = searchParams.get("campaignId") ?? "all";

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await getUserCampaigns();
        if (response.data && Array.isArray(response.data)) {
          setCampaigns(response.data);
          if (response.data.length === 0) {
            setError(
              "No campaigns found. Create a campaign first to collect feedback."
            );
          }
          // If no campaignId in query, set it to the first campaign
          if (response.data.length > 0 && !searchParams.get("campaignId")) {
            setSearchParams({ campaignId: response.data[0]._id });
          }
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
        setError("Failed to load campaigns. Please refresh the page.");
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    ratingFilter,
    campaignFilter,
    sortOrder,
    hasAttachmentsFilter,
  ]);

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);

      if (campaigns.length === 0) {
        setFeedbackData([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      // Build campaignId param
      let campaignIdParam = "";
      if (campaignFilter === "all") {
        campaignIdParam = campaigns.map((c) => c._id).join(",");
      } else {
        campaignIdParam = campaignFilter;
      }

      // Build params
      const params: {
        campaignId: string;
        page: number;
        limit: number;
        sort?: string;
        search?: string;
        rating?: string;
        hasAttachments?: string;
      } = {
        campaignId: campaignIdParam,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      // Sort
      if (sortOrder === "newest") params.sort = "-createdAt";
      else if (sortOrder === "oldest") params.sort = "createdAt";
      else if (sortOrder === "top-rated") params.sort = "-rating";
      else if (sortOrder === "most-upvoted") params.sort = "-upvotes";
      else if (sortOrder === "most-downvoted") params.sort = "-downvotes";

      // Filters
      if (searchQuery) params.search = searchQuery;
      if (ratingFilter !== "all") params.rating = ratingFilter;
      if (hasAttachmentsFilter) params.hasAttachments = "true";

      try {
        const response = await getFeedbackList(params);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format from server");
        }

        setFeedbackData(response.data);

        if (
          response.pagination &&
          typeof response.pagination.total === "number"
        ) {
          setTotalCount(response.pagination.total);
        } else {
          setTotalCount(response.data.length);
        }

        if (response.data.length === 0) {
          setError(
            searchQuery || ratingFilter !== "all" || hasAttachmentsFilter
              ? "No feedback found with the selected filters"
              : campaignFilter === "all" && campaigns.length > 1
              ? "No feedback found across any of your campaigns. Share your campaign links to collect feedback."
              : "No feedback found for the selected campaign. Share your campaign link to collect feedback."
          );
        } else {
          setError(null);
        }
      } catch (error) {
        setFeedbackData([]);
        setTotalCount(0);
        setError("Failed to load feedback data. Please try again.");
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load feedback data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
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

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setDetailsOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              {" "}
              <div>
                <CardTitle>All Feedback</CardTitle>
                <CardDescription>
                  {loading ? "Loading..." : `Viewing feedback responses`}
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
                  onValueChange={(value) => {
                    setSearchParams((prev) => {
                      const params = new URLSearchParams(prev);
                      params.set("campaignId", value);
                      return params;
                    });
                  }}
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
                    <SelectItem disabled value="all">
                      Select Campaign
                    </SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign._id} value={campaign._id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
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
            <div className="flex items-center mb-4 flex-wrap gap-4 justify-center md:justify-between">
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
            </div>{" "}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                <span className="ml-2">Loading feedback data...</span>
              </div>
            ) : (
              <>
                {/* Table view for medium and larger screens */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          Name / Campaign
                        </TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Feedback Preview</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Engagement
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {error ? (
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
                            <TableCell>
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

                {/* Card view for small screens */}
                <div className="md:hidden space-y-4">
                  {error ? (
                    <div className="text-center py-6 text-red-500">{error}</div>
                  ) : feedbackData.length > 0 ? (
                    feedbackData.map((item) => (
                      <Card key={item._id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.anonymous ? (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      A
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium italic text-muted-foreground">
                                      Anonymous
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.campaignId.title}
                                    </p>
                                  </div>
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
                                  <div>
                                    <p className="font-medium">
                                      {item.createdBy.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.campaignId.title}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      ?
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium italic text-muted-foreground">
                                      Unknown User
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.campaignId.title}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-0">
                          <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Rating
                              </p>
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
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Date</p>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs">
                                  {formatDateTime(item.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">
                              Feedback
                            </p>
                            <p className="text-sm">
                              {item.feedback.substring(0, 100)}
                              {item.feedback.length > 100 && "..."}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              {item.attachments &&
                                item.attachments.length > 0 && (
                                  <span className="inline-flex items-center text-xs text-muted-foreground">
                                    <Image className="h-3 w-3 mr-1" />
                                    {item.attachments.length} attachment
                                    {item.attachments.length !== 1 ? "s" : ""}
                                  </span>
                                )}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3 text-green-500 fill-green-500" />
                                  <span className="text-xs text-green-500">
                                    {item.upvotes?.length ?? 0}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsDown className="h-3 w-3 text-red-500 fill-red-500" />
                                  <span className="text-xs text-red-500">
                                    {item.downvotes?.length ?? 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      {searchQuery ||
                      ratingFilter !== "all" ||
                      hasAttachmentsFilter
                        ? "No feedback found with the selected filters"
                        : campaigns.length === 0
                        ? "No campaigns found. Create a campaign first to collect feedback."
                        : campaignFilter === "all" && campaigns.length > 1
                        ? "No feedback found across any of your campaigns. Share your campaign links to collect feedback."
                        : "No feedback found for the selected campaign. Share your campaign link to collect feedback."}
                    </div>
                  )}
                </div>
              </>
            )}{" "}
            {!loading && !error && totalCount > ITEMS_PER_PAGE && (
              <div className="mt-6">
                <FeedbackPagination
                  currentPage={currentPage}
                  totalPages={Math.max(
                    1,
                    Math.ceil(totalCount / ITEMS_PER_PAGE)
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
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
