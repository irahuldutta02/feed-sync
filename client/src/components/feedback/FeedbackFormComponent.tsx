import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import FilePreview from "./FilePreview";
import RatingStars from "./RatingStars";

const FeedbackFormComponent = ({
  rating,
  setRating,
  hoveredStar,
  setHoveredStar,
  feedback,
  setFeedback,
  files,
  filePreviewUrls,
  isUploading,
  handleSubmit,
  handleUpdate,
  handleCancelEdit,
  handleFileChange,
  removeFile,
  clearAllFiles,
  isEditMode,
}) => {
  return (
    <form
      onSubmit={isEditMode ? handleUpdate : handleSubmit}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="rating">Rating</Label>
        <div className="my-2">
          <RatingStars
            rating={rating}
            hoveredStar={hoveredStar}
            setHoveredStar={setHoveredStar}
            setRating={setRating}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="feedback">Your Feedback</Label>
        <Textarea
          id="feedback"
          rows={5}
          placeholder="Share your thoughts and experiences..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          className="resize-none bg-background"
        />
      </div>

      <div>
        <div className="flex items-center mb-1">
          <Label htmlFor="attachments" className="mr-2">
            Attachments
          </Label>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
            Optional
          </span>
        </div>
        <Input
          id="attachments"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="mt-1 bg-background"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          You can upload up to 5 image files (JPG, PNG, GIF). Maximum size: 5MB
          per file.
        </p>

        <FilePreview
          files={files}
          filePreviewUrls={filePreviewUrls}
          removeFile={removeFile}
          clearAllFiles={clearAllFiles}
          isUploading={isUploading}
        />
      </div>

      <div className="flex space-x-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isUploading || rating === 0 || feedback.trim() === ""}
        >
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              {isEditMode ? "Updating..." : "Submitting..."}
            </>
          ) : (
            <>
              {isEditMode ? "Update Feedback" : "Submit Feedback"}
              {files && files.length > 0 && <Upload className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>

        {isEditMode && (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={isUploading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default FeedbackFormComponent;
