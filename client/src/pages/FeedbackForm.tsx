import AnonymousFeedbackToggle from "@/components/feedback/AnonymousFeedbackToggle";
import FeedbackList from "@/components/feedback/FeedbackList";
import FooterCommon from "@/components/ui-custom/FooterCommon";
import { LoginCard } from "@/components/ui-custom/LoginCard";
import { Logo } from "@/components/ui-custom/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import {
  Link as LinkIcon,
  Pencil,
  Share,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FeedbackForm = () => {
  const { slug } = useParams();

  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileArray, setFileArray] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(!isAuthenticated); // Set to true by default for logged-out users
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [filePreviewUrls, setFilePreviewUrls] = useState<
    { url: string; file: File }[]
  >([]);

  // States for user feedback and edit mode
  const [userFeedback, setUserFeedback] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [feedbackId, setFeedbackId] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await api.get(`/campaign/detail/${slug}`);
        const data = response?.data;
        setCampaign(data?.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load campaign details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [slug, user]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/campaign/detail/${slug}`);

        if (response?.data?.error === false) {
          setCampaign(response.data.data);
        } else {
          setError(
            response?.data?.message || "Failed to load campaign details"
          );
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load campaign details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [slug]);

  useEffect(() => {
    if (campaign?._id && isAuthenticated && user?._id) {
      fetchUserFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?._id, isAuthenticated, user?._id]);

  const fetchUserFeedback = async () => {
    try {
      const response = await api.get(`/feedback/user-feedback/${campaign._id}`);

      if (response?.data?.error === false) {
        setUserFeedback(response.data.data);
        setFeedbackId(response.data.data._id);
      }
    } catch (err) {
      // No feedback found - that's ok, we'll show the form
      console.log(err?.response?.data?.message || "No existing feedback found");
    }
  };

  const handleEditClick = () => {
    if (userFeedback) {
      // Populate form with existing feedback data
      setRating(userFeedback.rating);
      setFeedback(userFeedback.feedback);
      setIsEditMode(true);
    }
  };
  const handleCancelEdit = () => {
    // Reset form and exit edit mode
    setRating(userFeedback?.rating || 0);
    setFeedback(userFeedback?.feedback || "");
    setIsEditMode(false);
    setFiles(null);
    setFilePreviewUrls([]);
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || feedback.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Please provide both a rating and feedback",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading state
      setIsUploading(true);
      const { dismiss: dismissLoadingToast } = toast({
        title: "Updating feedback...",
        description: "Please wait while we process your changes",
      }); // Prepare form data for file uploads if needed
      let attachmentUrls: string[] = userFeedback.attachments || [];

      if (fileArray.length > 0) {
        // First upload any new files
        const formData = new FormData();
        fileArray.forEach((file) => {
          formData.append("files", file);
        });

        // Assuming you have an endpoint for file uploads
        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse?.data?.error === false) {
          attachmentUrls = [...attachmentUrls, ...uploadResponse.data.data];
        }
      }

      // Prepare feedback data for update
      const updateData = {
        rating,
        feedback,
        attachments: attachmentUrls,
      };

      // Update feedback
      const response = await api.put(
        `/feedback/update/${feedbackId}`,
        updateData
      );

      // Dismiss loading toast
      dismissLoadingToast();

      if (response?.data?.error === false) {
        // Success
        toast({
          title: "Feedback updated!",
          description: "Your feedback has been updated successfully.",
        });

        // Reset edit mode
        setIsEditMode(false);

        // Update user feedback state with new data
        setUserFeedback(response.data.data);

        // Refresh user feedback
        fetchUserFeedback(); // Reset form
        setFiles(null);
        setFilePreviewUrls([]);

        // Switch to feedbacks tab to see all feedbacks including the updated one
        setActiveTab("feedbacks");
      } else {
        // Error from API
        toast({
          title: "Update failed",
          description: response?.data?.message || "Failed to update feedback",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description:
          err?.response?.data?.message || "Failed to update feedback",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!userFeedback?._id) return;

    try {
      // Show loading state
      const { dismiss: dismissLoadingToast } = toast({
        title: "Deleting feedback...",
        description: "Please wait while we process your request",
      });

      // Delete feedback
      const response = await api.put(
        `/feedback/mark_feedback_deleted/${userFeedback._id}`
      );

      // Dismiss loading toast
      dismissLoadingToast();

      if (response?.data?.error === false) {
        // Success
        toast({
          title: "Feedback deleted!",
          description: "Your feedback has been deleted successfully.",
        });

        // Reset form and states
        setRating(0);
        setFeedback("");
        setFiles(null);
        setIsAnonymous(false);
        setUserFeedback(null);
        setIsEditMode(false);
        setFilePreviewUrls([]);

        // Switch to feedbacks tab to see updated list
        setActiveTab("feedbacks");
      } else {
        // Error from API
        toast({
          title: "Delete failed",
          description: response?.data?.message || "Failed to delete feedback",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description:
          err?.response?.data?.message || "Failed to delete feedback",
        variant: "destructive",
      });
    }
  };

  const copyFeedbackLink = () => {
    const url = `${window.location.origin}/c/${campaign.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Feedback form link copied to clipboard",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || feedback.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Please provide both a rating and feedback",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading state
      setIsUploading(true);
      const { dismiss: dismissLoadingToast } = toast({
        title: "Submitting feedback...",
        description: "Please wait while we process your submission",
      }); // Prepare form data for file uploads if needed
      let attachmentUrls: string[] = [];

      if (fileArray.length > 0) {
        // First upload any files
        const formData = new FormData();
        fileArray.forEach((file) => {
          formData.append("files", file);
        });

        // Assuming you have an endpoint for file uploads
        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse?.data?.error === false) {
          attachmentUrls = uploadResponse.data.data;
        }
      }

      // Prepare feedback data
      const feedbackData: {
        campaignId: string;
        rating: number;
        feedback: string;
        anonymous: boolean;
        attachments: string[];
        user?: {
          _id: string;
          name: string;
          email: string;
        };
      } = {
        campaignId: campaign._id,
        rating,
        feedback,
        anonymous: isAnonymous,
        attachments: attachmentUrls,
      };

      if (!isAnonymous) {
        feedbackData.user = user;
      }

      // Submit feedback
      const response = await api.post("/feedback/create", feedbackData);

      // Dismiss loading toast
      dismissLoadingToast();

      if (response?.data?.error === false) {
        // Success
        toast({
          title: "Feedback submitted!",
          description: "Thank you for your feedback.",
        }); // Reset form
        setRating(0);
        setFeedback("");
        setFiles(null);
        setIsAnonymous(false);
        setFilePreviewUrls([]);

        // Switch to feedbacks tab to see all feedbacks including the new one
        setActiveTab("feedbacks");
        fetchUserFeedback();
      } else {
        // Error from API
        toast({
          title: "Submission failed",
          description: response?.data?.message || "Failed to submit feedback",
          variant: "destructive",
        });
      }
    } catch (err) {
      // Handle error
      toast({
        title: "Submission failed",
        description:
          err?.response?.data?.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);

      // Convert FileList to array of File objects
      const fileArr = Array.from(e.target.files);
      setFileArray(fileArr);

      // Generate preview URLs for the selected files
      const previews: { url: string; file: File }[] = [];
      fileArr.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          previews.push({ url: reader.result as string, file });
          if (previews.length === fileArr.length) {
            setFilePreviewUrls(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setFiles(null);
      setFileArray([]);
      setFilePreviewUrls([]);
    }
  };

  const removeFile = (index: number) => {
    // Remove the file from previews
    const newPreviews = [...filePreviewUrls];
    newPreviews.splice(index, 1);
    setFilePreviewUrls(newPreviews);

    // Update fileArray
    const newFileArray = [...fileArray];
    newFileArray.splice(index, 1);
    setFileArray(newFileArray);

    // Create a new FileList-like object from the updated array
    if (newFileArray.length === 0) {
      setFiles(null);
    } else {
      // Since FileList is immutable, we'll need to create a new one from the remaining files
      // when submitting, we'll use the fileArray instead of files
      const dataTransfer = new DataTransfer();
      newFileArray.forEach((file) => {
        dataTransfer.items.add(file);
      });
      setFiles(dataTransfer.files);
    }
  };

  let isOwner = false;

  if (campaign?.createdBy?._id === user?._id) {
    isOwner = true;
  }
  let showForm = false;

  // Don't show form if user is the campaign owner
  if (isOwner) {
    showForm = false;
  }
  // Show form if authenticated and not the owner
  else if (isAuthenticated) {
    showForm = true;
  }
  // Show form if anonymous is allowed and user is anonymous
  else if (!isAuthenticated && campaign?.allowAnonymous && isAnonymous) {
    showForm = true;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Logo />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
        <p className="text-muted-foreground mb-6">
          {error ||
            "The campaign you're looking for doesn't exist or has been removed."}
        </p>
      </div>
    );
  }

  if (
    !error &&
    campaign &&
    (campaign?.status === "Draft" || campaign?.status === "Deleted")
  ) {
    // show campaign not found
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
        <p className="text-muted-foreground mb-6">
          {"The campaign you're looking for doesn't exist or has been removed."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        <div
          className="relative h-64 bg-cover bg-center bg-no-repeat shadow-md"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${campaign.bannerImage})`,
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <p className="max-w-2xl text-white/90">{campaign.description}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 -mt-10 pt-20">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                <div className="lg:col-span-2 relative">
                  <Card className="bg-card shadow-lg">
                    <CardHeader>
                      <CardTitle>{campaign.title}</CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(campaign.createdAt), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Description
                        </h3>
                        <p className="mt-1">{campaign.description}</p>
                      </div>
                      {campaign.link && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Related Link
                          </h3>
                          <a
                            href={campaign.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-primary hover:underline flex items-center"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            {campaign.link}
                          </a>
                        </div>
                      )}
                      <div className="absolute top-0 right-6">
                        <div className="flex items-center mt-1">
                          <Button
                            size="icon"
                            onClick={copyFeedbackLink}
                            className="ml-2"
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {/* feedback form goes here */}{" "}
                      {!isOwner && campaign?.status === "Inactive" && (
                        <div className="py-8 text-center">
                          <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-md mb-4">
                            <h3 className="font-medium text-lg mb-2">
                              Feedback Closed
                            </h3>
                            <p>
                              This campaign is no longer accepting feedback
                              submissions.
                            </p>
                          </div>
                        </div>
                      )}
                      {isOwner && campaign?.status === "Active" && (
                        <div className="py-8 text-center">
                          <div className="bg-blue-500/10 text-blue-500 p-4 rounded-md mb-4">
                            <h3 className="font-medium text-lg mb-2">
                              Campaign Owner
                            </h3>
                            <p>
                              As the creator of this campaign, you cannot submit
                              feedback to your own campaign.
                            </p>
                          </div>
                        </div>
                      )}
                      {!isOwner && campaign?.status === "Active" && (
                        <>
                          {/* Check if user has already submitted feedback and is not in edit mode */}
                          {userFeedback && !isEditMode ? (
                            <div className="py-8">
                              <div className="bg-green-500/10 text-green-600 p-4 rounded-md mb-4">
                                <h3 className="font-medium text-lg mb-2">
                                  Your Feedback
                                </h3>
                                <p>
                                  You've already submitted feedback for this
                                  campaign.
                                </p>
                              </div>

                              <Card className="mt-4">
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Rating
                                      </Label>
                                      <div className="flex items-center mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-5 w-5 ${
                                              star <= userFeedback.rating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
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
                                      <p className="mt-1">
                                        {userFeedback.feedback}
                                      </p>
                                    </div>{" "}
                                    {userFeedback.attachments &&
                                      userFeedback.attachments.length > 0 && (
                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">
                                            Attachments (
                                            {userFeedback.attachments.length})
                                          </Label>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {userFeedback.attachments.map(
                                              (url, index) => (
                                                <a
                                                  key={index}
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="block w-16 h-16 rounded-md border overflow-hidden relative group"
                                                >
                                                  <img
                                                    src={url}
                                                    alt={`Attachment ${
                                                      index + 1
                                                    }`}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                  />
                                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="text-white text-xs">
                                                      View
                                                    </span>
                                                  </div>
                                                </a>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    <div className="flex space-x-2 mt-4">
                                      <Button
                                        onClick={handleEditClick}
                                        className="w-full"
                                      >
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
                          ) : (
                            <>
                              {/* Show anonymous toggle ONLY when creating new feedback, not when editing */}
                              {campaign?.allowAnonymous && !isEditMode && (
                                <AnonymousFeedbackToggle
                                  isAnonymous={isAnonymous}
                                  onChange={(value) => {
                                    setIsAnonymous(value);
                                  }}
                                />
                              )}

                              {showForm ? (
                                <form
                                  onSubmit={
                                    isEditMode ? handleUpdate : handleSubmit
                                  }
                                  className="space-y-6"
                                >
                                  <div>
                                    <Label htmlFor="rating">Rating</Label>
                                    <div className="flex items-center space-x-1 my-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          className="p-1 focus:outline-none"
                                          onMouseEnter={() =>
                                            setHoveredStar(star)
                                          }
                                          onMouseLeave={() => setHoveredStar(0)}
                                          onClick={() => setRating(star)}
                                        >
                                          <Star
                                            className={`h-6 w-6 ${
                                              star <= (hoveredStar || rating)
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-muted-foreground"
                                            }`}
                                          />
                                        </button>
                                      ))}
                                      {rating > 0 && (
                                        <span className="ml-2 text-sm text-muted-foreground">
                                          {rating} star{rating !== 1 ? "s" : ""}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="feedback">
                                      Your Feedback
                                    </Label>
                                    <Textarea
                                      id="feedback"
                                      rows={5}
                                      placeholder="Share your thoughts and experiences..."
                                      value={feedback}
                                      onChange={(e) =>
                                        setFeedback(e.target.value)
                                      }
                                      required
                                      className="resize-none bg-background"
                                    />
                                  </div>{" "}
                                  <div>
                                    {" "}
                                    <div className="flex items-center mb-1">
                                      <Label
                                        htmlFor="attachments"
                                        className="mr-2"
                                      >
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
                                    />{" "}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      You can upload up to 5 image files (JPG,
                                      PNG, GIF). Maximum size: 5MB per file.
                                    </p>
                                    {files && files.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs font-medium text-green-600 mb-2">
                                          {files.length} file
                                          {files.length !== 1 ? "s" : ""}{" "}
                                          selected
                                        </p>{" "}
                                        <div className="flex flex-wrap gap-2">
                                          {filePreviewUrls.map(
                                            (item, index) => (
                                              <div
                                                key={index}
                                                className="relative w-16 h-16 rounded-md overflow-hidden border group"
                                              >
                                                <img
                                                  src={item.url}
                                                  alt={`Preview ${index + 1}`}
                                                  className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeFile(index)
                                                    }
                                                    className="text-white p-1 rounded-full bg-red-500/80 hover:bg-red-600"
                                                    disabled={isUploading}
                                                  >
                                                    <X className="h-3 w-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => {
                                            setFiles(null);
                                            setFileArray([]);
                                            setFilePreviewUrls([]);
                                          }}
                                          disabled={isUploading}
                                        >
                                          <X className="h-4 w-4 mr-1" />
                                          Clear files
                                        </Button>
                                      </div>
                                    )}
                                  </div>{" "}
                                  <div className="flex space-x-2">
                                    <Button
                                      type="submit"
                                      className="w-full"
                                      disabled={
                                        isUploading ||
                                        rating === 0 ||
                                        feedback.trim() === ""
                                      }
                                    >
                                      {isUploading ? (
                                        <>
                                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                          {isEditMode
                                            ? "Updating..."
                                            : "Submitting..."}
                                        </>
                                      ) : (
                                        <>
                                          {isEditMode
                                            ? "Update Feedback"
                                            : "Submit Feedback"}
                                          {files && files.length > 0 && (
                                            <Upload className="ml-2 h-4 w-4" />
                                          )}
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
                              ) : (
                                <div className="py-8 text-center">
                                  <div className="bg-primary/10 p-4 rounded-md mb-4">
                                    <LoginCard />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card className="bg-card shadow-lg">
                    <CardHeader>
                      <CardTitle>Campaign Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Average Rating
                        </span>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">
                            {campaign.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Feedbacks
                        </span>
                        <span className="font-medium">
                          {campaign?.feedbackCount}
                        </span>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Created By
                        </h3>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            <img
                              src={campaign?.createdBy?.avatarUrl}
                              alt={campaign.createdBy.name}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">
                              {campaign.createdBy.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.createdBy.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feedbacks">
              {campaign && <FeedbackList campaignId={campaign._id} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FooterCommon />
    </>
  );
};

export default FeedbackForm;
