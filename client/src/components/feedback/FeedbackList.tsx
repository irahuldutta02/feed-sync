import FeedbackListItem from "@/components/feedback/FeedbackListItem";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/services/api";
import { Image, Search } from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

const FeedbackList = ({ campaignId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("most-upvoted");
  const [hasAttachmentsFilter, setHasAttachmentsFilter] = useState(false);

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

  // Reset to page 1 when filters or sort order changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, ratingFilter, hasAttachmentsFilter, sortOrder]);

  // Fetch data from server when campaign, page, or filters/sort/search changes
  useEffect(() => {
    if (campaignId) {
      fetchFeedbacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    campaignId,
    currentPage,
    sortOrder,
    ratingFilter,
    hasAttachmentsFilter,
    searchQuery,
  ]);

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);

      // Determine sort parameter based on selected sort order
      let sortParam = "-createdAt"; // default: newest first
      if (sortOrder === "oldest") sortParam = "createdAt";
      else if (sortOrder === "top-rated") sortParam = "-rating";
      else if (sortOrder === "most-upvoted") sortParam = "-upvoteCount";
      else if (sortOrder === "most-downvoted") sortParam = "-downvoteCount";

      // Build query parameters
      const params: {
        campaignId: string;
        page: number;
        limit: number;
        sort: string;
        rating?: number;
        hasAttachments?: boolean;
        search?: string;
      } = {
        campaignId,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortParam,
      };

      // Add optional filters if selected
      if (ratingFilter !== "all") params.rating = Number(ratingFilter);
      if (hasAttachmentsFilter) params.hasAttachments = true;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await api.get("/feedback/paginated_list", { params });

      if (response?.data?.error === false) {
        const formattedFeedbacks = response.data.data.map((feedback) => ({
          id: feedback._id,
          userName: feedback.anonymous
            ? "Anonymous"
            : feedback.createdBy?.name || "Unknown User",
          userAvatar: feedback.anonymous
            ? null
            : feedback.createdBy?.avatarUrl || null,
          rating: feedback.rating,
          date: feedback.createdAt,
          feedback: feedback.feedback,
          attachments: feedback.attachments || [],
          upvotes: feedback.upvotes || [],
          downvotes: feedback.downvotes || [],
          upvoteCount: feedback.upvoteCount || 0,
          downvoteCount: feedback.downvoteCount || 0,
          isVerified: feedback.isVerified,
          isAnonymous: feedback.anonymous,
        }));

        setFeedbacks(formattedFeedbacks);
        setTotalCount(response.data.pagination.total);
      } else {
        toast({
          title: "Error",
          description: response?.data?.message || "Failed to load feedbacks",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to load feedbacks",
        variant: "destructive",
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top on page change for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate total pages for pagination
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  // Determine if any filters are active for display purposes
  const isFiltering =
    searchQuery.trim() !== "" || ratingFilter !== "all" || hasAttachmentsFilter;

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Feedback Submissions</CardTitle>
              <CardDescription>
                All feedback received for this campaign
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
          <div className="flex flex-col sm:flex-row gap-4">
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
                  <SelectItem value="most-downvoted">Most Downvoted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center">
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
              {isFiltering
                ? `Showing ${feedbacks.length} of ${totalCount} filtered responses`
                : `Showing ${Math.min(
                    ITEMS_PER_PAGE,
                    totalCount - (currentPage - 1) * ITEMS_PER_PAGE
                  )} of ${totalCount} responses`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="p-1">
          {feedbackLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading feedbacks...
              </p>
            </div>
          ) : feedbacks.length > 0 ? (
            <div>
              {feedbacks.map((feedback) => (
                <FeedbackListItem
                  key={feedback.id}
                  id={feedback.id}
                  userName={feedback.userName}
                  userAvatar={feedback.userAvatar}
                  rating={feedback.rating}
                  date={feedback.date}
                  feedback={feedback.feedback}
                  attachments={feedback.attachments}
                  upvotes={feedback.upvotes}
                  downvotes={feedback.downvotes}
                  isVerified={feedback.isVerified}
                  isAnonymous={feedback.isAnonymous}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              {totalCount > 0
                ? "No feedback matches your current filters"
                : "No feedback has been submitted yet for this campaign"}
            </div>
          )}
        </ScrollArea>

        {/* Show pagination controls only when we have more than one page */}
        {!feedbackLoading && totalCount > ITEMS_PER_PAGE && (
          <FeedbackPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
