import FeedbackListItem from "@/components/feedback/FeedbackListItem";
import FooterCommon from "@/components/ui-custom/FooterCommon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { Link as LinkIcon, Share, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnonymousFeedbackToggle from "@/components/feedback/AnonymousFeedbackToggle";
import { Logo } from "@/components/ui-custom/Logo";

const FeedbackForm = () => {
  const { slug } = useParams();

  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await api.get(`/campaign/detail/${slug}`);
        const data = response?.data;
        setCampaign(data?.data);
      } catch (err) {
        setError(`Failed to load campaign details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        setFeedbackLoading(true);

        const mockFeedbacks = [
          {
            id: 1,
            userName: "Sarah Johnson",
            rating: 5,
            feedback:
              "I love the new dashboard design! It's much easier to navigate and the reporting features are fantastic.",
            date: "2023-07-28T15:30:00Z",
            attachments: [
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
            ],
            upvotes: 12,
            downvotes: 2,
            isVerified: true,
          },
          {
            id: 2,
            userName: "Michael Chen",
            rating: 4,
            feedback:
              "Overall great experience, but I did notice some lag when loading large datasets. The UI is very intuitive though, and I appreciate the new filtering options.",
            date: "2023-07-26T09:15:00Z",
            attachments: [],
            upvotes: 8,
            downvotes: 1,
            isVerified: true,
          },
          {
            id: 3,
            userName: "Anonymous",
            rating: 3,
            feedback:
              "The new website looks good, but I'm having trouble finding some of the features that were easier to access in the old design. Maybe consider adding a comprehensive site map or improving the search functionality.",
            date: "2023-07-25T14:20:00Z",
            attachments: [
              "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
            ],
            upvotes: 5,
            downvotes: 3,
            isVerified: false,
          },
        ];

        setFeedbacks(mockFeedbacks);
        setFeedbackLoading(false);
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to load feedbacks ${err?.message}`,
          variant: "destructive",
        });
        setFeedbackLoading(false);
      }
    };

    fetchCampaign();
    fetchFeedbacks();
  }, [slug, user]);

  const copyFeedbackLink = () => {
    const url = `${window.location.origin}/c/${campaign.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Feedback form link copied to clipboard",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      name: isAnonymous ? "Anonymous" : name,
      email: isAnonymous ? "" : email,
      rating,
      feedback,
      files,
      isAnonymous,
    });

    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback.",
    });

    setName("");
    setEmail("");
    setRating(0);
    setFeedback("");
    setFiles(null);
    setIsAnonymous(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  let isOwner = false;

  if (campaign?.createdBy?._id === user?._id) {
    isOwner = true;
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

  if (!error && campaign && campaign?.status === "Draft") {
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

                      {/* feedback form goes here */}
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

                      {!isOwner && campaign?.status === "Active" && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {campaign?.allowAnonymous && (
                            <AnonymousFeedbackToggle
                              isAnonymous={isAnonymous}
                              onChange={setIsAnonymous}
                            />
                          )}

                          {!isAnonymous && (
                            <>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    value={user?.name}
                                    required={!isAnonymous}
                                    disabled={isAnonymous}
                                    className="bg-background"
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={user?.email}
                                    required={!isAnonymous}
                                    disabled={isAnonymous}
                                    className="bg-background"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <Separator />
                            </>
                          )}

                          <div>
                            <Label htmlFor="rating">Rating</Label>
                            <div className="flex items-center space-x-1 my-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="p-1 focus:outline-none"
                                  onMouseEnter={() => setHoveredStar(star)}
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
                            <Label htmlFor="attachments">
                              Attachments (optional)
                            </Label>
                            <Input
                              id="attachments"
                              type="file"
                              onChange={handleFileChange}
                              multiple
                              accept="image/*"
                              className="mt-1 bg-background"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              You can upload multiple image files (JPG, PNG,
                              GIF)
                            </p>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={rating === 0 || feedback.trim() === ""}
                          >
                            Submit Feedback
                          </Button>
                        </form>
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
                            rating={feedback.rating}
                            date={feedback.date}
                            feedback={feedback.feedback}
                            attachments={feedback.attachments}
                            upvotes={feedback.upvotes}
                            downvotes={feedback.downvotes}
                            // isVerified={feedback.isVerified}
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
                <CardFooter className="border-t pt-6 flex justify-center">
                  <Button asChild>
                    <Link to={`/feedback/${campaign.slug}`}>
                      Go to Feedback Form
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FooterCommon />
    </>
  );
};

export default FeedbackForm;
