import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Image, ShieldCheck, Star } from "lucide-react";
import VoteButtons from "./VoteButtons";

const FeedbackListItem = ({
  id,
  userName,
  userAvatar,
  rating,
  date,
  feedback,
  attachments,
  upvotes = [],
  downvotes = [],
  isVerified,
  isAnonymous,
}) => {
  const { user } = useAuth();

  // Determine if the current user has voted
  const userUpvoted = user && upvotes.includes(user._id);
  const userDownvoted = user && downvotes.includes(user._id);
  const userVote = userUpvoted ? "up" : userDownvoted ? "down" : null;

  // Format date
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return (
    <Card className="mb-4 hover:border-primary/40 transition-all">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-3">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="flex items-center gap-2">
              {isAnonymous || userName === "Anonymous" ? (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">A</span>
                </div>
              ) : userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary">
                    {userName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="font-medium flex items-center">
                {isAnonymous || userName === "Anonymous" ? (
                  <span className="italic text-muted-foreground">
                    Anonymous
                  </span>
                ) : (
                  userName
                )}
                {isVerified && (
                  <div
                    className="ml-1.5 flex items-center"
                    title="Verified User"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified user</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm mb-3 whitespace-pre-wrap">{feedback}</p>

        {attachments && attachments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Image className="h-3.5 w-3.5 mr-1" />
              {attachments.length}{" "}
              {attachments.length === 1 ? "Attachment" : "Attachments"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img
                    src={`${url}?w=150&h=100&fit=crop&auto=format`}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md border border-border"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center text-white text-xs font-medium transition-opacity">
                    View
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <VoteButtons
            feedbackId={id}
            initialUpvotes={upvotes.length}
            initialDownvotes={downvotes.length}
            userInitialVote={userVote}
            disabled={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackListItem;
