import FeedbackListItem from "@/components/feedback/FeedbackListItem";
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
import api from "@/services/api";
import { Image, Search } from "lucide-react";
import { useEffect, useState } from "react";

const FeedbackList = ({ campaignId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("most-upvoted");
  const [hasAttachmentsFilter, setHasAttachmentsFilter] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchFeedbacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  // Apply filters and sorting when feedbacks change or when filters change
  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbacks, searchQuery, ratingFilter, sortOrder, hasAttachmentsFilter]);

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);

      const response = await api.get("/feedback/paginated_list", {
        params: {
          campaignId: campaignId,
          page: 1,
          limit: 5,
          sort: "-createdAt",
        },
      });

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
          isVerified: feedback.isVerified,
          isAnonymous: feedback.anonymous,
        }));

        setFeedbacks(formattedFeedbacks);
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

  const applyFiltersAndSort = () => {
    let result = [...feedbacks];

    // Apply rating filter
    if (ratingFilter !== "all") {
      const numericRating = parseInt(ratingFilter);
      result = result.filter((item) => item.rating === numericRating);
    }

    // Apply has attachments filter
    if (hasAttachmentsFilter) {
      result = result.filter(
        (item) => item.attachments && item.attachments.length > 0
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.feedback && item.feedback.toLowerCase().includes(query)) ||
          (!item.isAnonymous &&
            item.userName &&
            item.userName.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortOrder) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "top-rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "most-upvoted":
        result.sort(
          (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
        );
        break;
      case "most-downvoted":
        result.sort(
          (a, b) => (b.downvotes?.length || 0) - (a.downvotes?.length || 0)
        );
        break;
      default:
        break;
    }

    setFilteredFeedbacks(result);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
                  value={searchQuery}
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
              Showing {filteredFeedbacks.length} of {feedbacks.length} responses
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
          ) : filteredFeedbacks.length > 0 ? (
            <div>
              {filteredFeedbacks.map((feedback) => (
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
              {feedbacks.length > 0
                ? "No feedback matches your current filters"
                : "No feedback has been submitted yet"}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
