import AnonymousFeedbackToggle from "@/components/feedback/AnonymousFeedbackToggle";
import CampaignInfo from "@/components/feedback/CampaignInfo";
import CampaignStats from "@/components/feedback/CampaignStats";
import FeedbackFormComponent from "@/components/feedback/FeedbackFormComponent";
import FeedbackList from "@/components/feedback/FeedbackList";
import UserFeedbackView from "@/components/feedback/UserFeedbackView";
import FooterCommon from "@/components/ui-custom/FooterCommon";
import { LoginCard } from "@/components/ui-custom/LoginCard";
import { Logo } from "@/components/ui-custom/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
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
  const [files, setFiles] = useState(null);
  const [fileArray, setFileArray] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(!isAuthenticated); // Set to true by default for logged-out users
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);

  // States for user feedback and edit mode
  const [userFeedback, setUserFeedback] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [feedbackId, setFeedbackId] = useState("");
  // Load campaign data
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
      // Check if it's a 401 error - this is normal for campaigns that allow anonymous feedback
      if (err?.response?.status === 401) {
        // Just clear the user feedback state, no need to do anything else
        setUserFeedback(null);
        setFeedbackId("");
      } else {
        // Some other error
        console.log(
          err?.response?.data?.message || "No existing feedback found"
        );
      }
      // No feedback found - that's ok, we'll show the form
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
    setFileArray([]);
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

        // Update user feedback state with new data
        setUserFeedback(response.data.data);

        // Reset form
        setFiles(null);
        setFileArray([]);
        setFilePreviewUrls([]);

        // Reset edit mode
        setIsEditMode(false);

        // Switch to feedbacks tab first
        setActiveTab("feedbacks");

        // Then try to fetch user feedback, but don't await it
        // to avoid potential 401 errors blocking the tab switch
        try {
          fetchUserFeedback();
        } catch (err) {
          // Just ignore any errors here
          console.log("Could not fetch updated user feedback", err);
        }
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
        }); // Reset form and states
        setRating(0);
        setFeedback("");
        setFiles(null);
        setFileArray([]);
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
        });

        // Reset form
        setRating(0);
        setFeedback("");
        setFiles(null);
        setFileArray([]);
        setIsAnonymous(false);
        setFilePreviewUrls([]);

        // Switch to feedbacks tab first
        setActiveTab("feedbacks");

        // Then try to fetch user feedback, but don't await it
        // to avoid potential 401 errors blocking the tab switch
        try {
          fetchUserFeedback();
        } catch (err) {
          // Just ignore any errors here
          console.log("Could not fetch updated user feedback", err);
        }
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
        {/* Campaign Banner */}
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

        {/* Main Content */}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Info + Feedback Form */}
                <div className="lg:col-span-2 relative">
                  <Card className="bg-card shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      {/* Campaign Info */}
                      <CampaignInfo
                        campaign={campaign}
                        copyFeedbackLink={copyFeedbackLink}
                      />

                      {/* Feedback section */}
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
                          {/* Show user's existing feedback or the form */}
                          {userFeedback && !isEditMode ? (
                            <UserFeedbackView
                              userFeedback={userFeedback}
                              handleEditClick={handleEditClick}
                              handleDelete={handleDelete}
                            />
                          ) : (
                            <>
                              {campaign?.allowAnonymous && !isEditMode && (
                                <AnonymousFeedbackToggle
                                  isAnonymous={isAnonymous}
                                  onChange={(value) => {
                                    setIsAnonymous(value);
                                  }}
                                />
                              )}

                              {showForm ? (
                                <FeedbackFormComponent
                                  rating={rating}
                                  setRating={setRating}
                                  hoveredStar={hoveredStar}
                                  setHoveredStar={setHoveredStar}
                                  feedback={feedback}
                                  setFeedback={setFeedback}
                                  files={files}
                                  filePreviewUrls={filePreviewUrls}
                                  isUploading={isUploading}
                                  handleSubmit={handleSubmit}
                                  handleUpdate={handleUpdate}
                                  handleCancelEdit={handleCancelEdit}
                                  handleFileChange={handleFileChange}
                                  removeFile={removeFile}
                                  clearAllFiles={() => {
                                    setFiles(null);
                                    setFileArray([]);
                                    setFilePreviewUrls([]);
                                  }}
                                  isEditMode={isEditMode}
                                />
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

                {/* Campaign Stats */}
                <div className="lg:col-span-1">
                  <CampaignStats campaign={campaign} />
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
