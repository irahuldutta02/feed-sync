import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

const VoteButtons = ({
  feedbackId,
  initialUpvotes,
  initialDownvotes,
  userInitialVote,
  disabled,
}) => {
  const { isAuthenticated } = useAuth();
  const [userVote, setUserVote] = useState(userInitialVote);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state if props change (e.g. from server refresh)
  useEffect(() => {
    setUpvotes(initialUpvotes);
    setDownvotes(initialDownvotes);
    setUserVote(userInitialVote);
  }, [initialUpvotes, initialDownvotes, userInitialVote]);

  const handleVote = async (action) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on feedback",
        variant: "destructive",
      });
      return;
    }

    if (disabled || isSubmitting) {
      return;
    }

    // Store previous state for rollback if API call fails
    const previousUserVote = userVote;
    const previousUpvotes = upvotes;
    const previousDownvotes = downvotes;

    // Optimistically update UI
    if (action === "upvote") {
      if (userVote === "up") {
        // Undo upvote
        setUpvotes(upvotes - 1);
        setUserVote(null);
      } else {
        // Add upvote and remove downvote if exists
        setUpvotes(upvotes + 1);
        if (userVote === "down") {
          setDownvotes(downvotes - 1);
        }
        setUserVote("up");
      }
    } else {
      if (userVote === "down") {
        // Undo downvote
        setDownvotes(downvotes - 1);
        setUserVote(null);
      } else {
        // Add downvote and remove upvote if exists
        setDownvotes(downvotes + 1);
        if (userVote === "up") {
          setUpvotes(upvotes - 1);
        }
        setUserVote("down");
      }
    }

    // Make API call
    try {
      setIsSubmitting(true);
      const response = await api.put(
        `/feedback/upvote_downvote/${feedbackId}`,
        {
          action: action,
        }
      );

      if (response?.data?.error) {
        throw new Error(response.data.message || "Failed to update vote");
      }

      // Update with actual server values if needed
      const serverData = response.data.data;
      setUpvotes(serverData.upvotes);
      setDownvotes(serverData.downvotes);
      setUserVote(
        serverData.userUpvoted ? "up" : serverData.userDownvoted ? "down" : null
      );
    } catch (error) {
      // Rollback to previous state if API call fails
      setUserVote(previousUserVote);
      setUpvotes(previousUpvotes);
      setDownvotes(previousDownvotes);

      toast({
        title: "Vote failed",
        description:
          error.message || "Failed to update vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote("upvote")}
        className={cn(
          "flex items-center space-x-1 text-sm transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled || isSubmitting}
        aria-label="Upvote"
      >
        <ThumbsUp
          className={cn(
            "h-4 w-4",
            userVote === "up"
              ? "text-green-500 fill-green-500"
              : "text-muted-foreground"
          )}
        />
        <span
          className={cn(
            "text-xs",
            userVote === "up" ? "text-green-500" : "text-muted-foreground"
          )}
        >
          {upvotes}
        </span>
      </button>

      <button
        onClick={() => handleVote("downvote")}
        className={cn(
          "flex items-center space-x-1 text-sm transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled || isSubmitting}
        aria-label="Downvote"
      >
        <ThumbsDown
          className={cn(
            "h-4 w-4",
            userVote === "down"
              ? "text-red-500 fill-red-500"
              : "text-muted-foreground"
          )}
        />
        <span
          className={cn(
            "text-xs",
            userVote === "down" ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {downvotes}
        </span>
      </button>
    </div>
  );
};

export default VoteButtons;
