import FeedbackListItem from "@/components/feedback/FeedbackListItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useEffect, useState } from "react";

const FeedbackList = ({ campaignId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      fetchFeedbacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);

      const response = await api.get("/feedback/paginated_list", {
        params: {
          campaignId: campaignId,
          page: 1,
          limit: 10,
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

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader>
        <CardTitle>Feedback Submissions</CardTitle>
        <CardDescription>
          All feedback received for this campaign
        </CardDescription>
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
              No feedback has been submitted yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
