import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import RatingStars from "./RatingStars";

const UserFeedbackView = ({ userFeedback, handleEditClick, handleDelete }) => {
  if (!userFeedback) return null;

  return (
    <div className="py-8">
      <div className="bg-green-500/10 text-green-600 p-4 rounded-md mb-4">
        <h3 className="font-medium text-lg mb-2">Your Feedback</h3>
        <p>You've already submitted feedback for this campaign.</p>
      </div>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Rating
              </Label>
              <div className="flex items-center mt-1">
                <RatingStars
                  rating={userFeedback.rating}
                  hoveredStar={0}
                  setHoveredStar={() => {}}
                  setRating={() => {}}
                  readOnly
                />
                <span className="ml-2 text-sm">
                  {userFeedback.rating} star
                  {userFeedback.rating !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Your Feedback
              </Label>
              <p className="mt-1">{userFeedback.feedback}</p>
            </div>
            {userFeedback.attachments &&
              userFeedback.attachments.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Attachments ({userFeedback.attachments.length})
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userFeedback.attachments.map(
                      (url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-16 h-16 rounded-md border overflow-hidden relative group"
                        >
                          <img
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs">View</span>
                          </div>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleEditClick} className="w-full">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Feedback
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedbackView;
