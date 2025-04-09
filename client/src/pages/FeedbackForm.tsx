import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FeedbackListItem from "@/components/feedback/FeedbackListItem";
import AnonymousFeedbackToggle from "@/components/feedback/AnonymousFeedbackToggle";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { toast } from "@/hooks/use-toast";
import FooterCommon from "@/components/ui-custom/FooterCommon";

const campaignData = {
  slug: "product-feedback",
  title: "Product Feedback Survey",
  bannerImage:
    "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1080",
  description:
    "We value your feedback on our products. Please share your thoughts to help us improve and better serve your needs.",
  created: "2023-05-15",
  owner: "FeedSync Team",
};

const feedbackData = [
  {
    id: 1,
    userName: "Sarah Johnson",
    rating: 5,
    feedback:
      "I love the new dashboard design! It's much easier to navigate and the reporting features are fantastic.",
    date: "2023-07-28",
    attachments: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    ],
    upvotes: 12,
    downvotes: 2,
  },
  {
    id: 2,
    userName: "Michael Chen",
    rating: 4,
    feedback:
      "Overall great experience, but I did notice some lag when loading large datasets. The UI is very intuitive though, and I appreciate the new filtering options.",
    date: "2023-07-26",
    attachments: [],
    upvotes: 8,
    downvotes: 1,
  },
  {
    id: 3,
    userName: "Anonymous",
    rating: 3,
    feedback:
      "The new website looks good, but I'm having trouble finding some of the features that were easier to access in the old design. Maybe consider adding a comprehensive site map or improving the search functionality.",
    date: "2023-07-25",
    attachments: [
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
    ],
    upvotes: 5,
    downvotes: 3,
  },
  {
    id: 4,
    userName: "David Williams",
    rating: 2,
    feedback:
      "I'm experiencing frequent crashes when trying to use the image upload feature. Also, the notification system seems to be delayed. I've attached screenshots of the error messages I'm receiving.",
    date: "2023-07-24",
    attachments: [
      "https://images.unsplash.com/photo-1593642532400-2682810df593",
    ],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 5,
    userName: "Anonymous",
    rating: 5,
    feedback:
      "The customer support team was incredibly helpful and resolved my issue quickly. The follow-up was also appreciated and thorough.",
    date: "2023-07-22",
    attachments: [],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 6,
    userName: "James Wilson",
    rating: 4,
    feedback:
      "The new collaborative editing feature is a game-changer for our team. It would be great if there was an option to see who is currently viewing a document in real-time.",
    date: "2023-07-20",
    attachments: [],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 7,
    userName: "Anonymous",
    rating: 5,
    feedback:
      "Great product, intuitive interface, and excellent customer support. Would highly recommend!",
    date: "2023-07-18",
    attachments: [],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 8,
    userName: "Emma Thompson",
    rating: 3,
    feedback:
      "The mobile app needs improvement. It crashes occasionally and some features don't work as expected.",
    date: "2023-07-16",
    attachments: [
      "https://images.unsplash.com/photo-1598128558393-70ff21433be0",
    ],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 9,
    userName: "Robert Davis",
    rating: 4,
    feedback:
      "The new UI is much better, but there are still some minor bugs that need to be fixed.",
    date: "2023-07-14",
    attachments: [],
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 10,
    userName: "Jennifer Lee",
    rating: 5,
    feedback:
      "I've been using this product for years, and it just keeps getting better. The latest update is fantastic!",
    date: "2023-07-12",
    attachments: [],
    upvotes: 0,
    downvotes: 0,
  },
];

const ITEMS_PER_PAGE = 3;

const FeedbackForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const campaign = campaignData;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { page, loading, hasMore, setHasMore } = useInfiniteScroll({
    initialPage: 1,
  });

  const [displayedFeedback, setDisplayedFeedback] = useState<
    typeof feedbackData
  >([]);

  const getFilteredFeedback = () => {
    let filtered = [...feedbackData];

    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.rating === parseInt(ratingFilter)
      );
    }

    if (sortBy === "newest") {
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sortBy === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "mostUpvoted") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === "mostDownvoted") {
      filtered.sort((a, b) => (b.downvotes || 0) - (a.downvotes || 0));
    }

    return filtered;
  };

  const filteredFeedback = getFilteredFeedback();

  useEffect(() => {
    const filtered = getFilteredFeedback();

    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const currentPageItems = filtered.slice(startIndex, endIndex);

    setDisplayedFeedback(currentPageItems);

    if (currentPageItems.length >= filtered.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ratingFilter, sortBy]);

  useEffect(() => {
    setDisplayedFeedback([]);
  }, [ratingFilter, sortBy]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
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

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        <div
          className="relative h-64 bg-cover bg-center bg-no-repeat shadow-md"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${campaignData.bannerImage})`,
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <p className="max-w-2xl text-white/90">{campaign.description}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 -mt-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="bg-card shadow-lg">
                <CardHeader>
                  <Link
                    to="/"
                    className="flex items-center text-sm text-muted-foreground mb-2 hover:text-primary"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Return to Home
                  </Link>
                  <CardTitle>Submit Your Feedback</CardTitle>
                  <CardDescription>
                    We value your opinion and would love to hear your thoughts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnonymousFeedbackToggle
                      isAnonymous={isAnonymous}
                      onChange={setIsAnonymous}
                    />

                    {!isAnonymous && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required={!isAnonymous}
                              disabled={isAnonymous}
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required={!isAnonymous}
                              disabled={isAnonymous}
                              className="bg-background"
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
                        You can upload multiple image files (JPG, PNG, GIF)
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
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="bg-card shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle>Community Feedback</CardTitle>
                      <CardDescription>
                        See what others are saying about this
                      </CardDescription>
                    </div>
                    <div className="flex mt-3 sm:mt-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4 bg-popover">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs">
                                Filter by Rating
                              </Label>
                              <Select
                                value={ratingFilter}
                                onValueChange={setRatingFilter}
                              >
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="All Ratings" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                  <SelectItem value="all">
                                    All Ratings
                                  </SelectItem>
                                  <SelectItem value="5">5 Stars</SelectItem>
                                  <SelectItem value="4">4 Stars</SelectItem>
                                  <SelectItem value="3">3 Stars</SelectItem>
                                  <SelectItem value="2">2 Stars</SelectItem>
                                  <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Sort By</Label>
                              <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Newest First" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                  <SelectItem value="newest">
                                    Newest First
                                  </SelectItem>
                                  <SelectItem value="oldest">
                                    Oldest First
                                  </SelectItem>
                                  <SelectItem value="highest">
                                    Highest Rated
                                  </SelectItem>
                                  <SelectItem value="lowest">
                                    Lowest Rated
                                  </SelectItem>
                                  <SelectItem value="mostUpvoted">
                                    Most Upvoted
                                  </SelectItem>
                                  <SelectItem value="mostDownvoted">
                                    Most Downvoted
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <ScrollArea className="p-1">
                    {displayedFeedback.length > 0 ? (
                      <div>
                        {displayedFeedback.map((feedback) => (
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
                          />
                        ))}

                        {loading && (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            Loading more feedback...
                          </div>
                        )}

                        {!hasMore && displayedFeedback.length > 0 && (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            You've reached the end of the feedback
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        {ratingFilter !== "all" ? (
                          <>No feedback with the selected filters</>
                        ) : (
                          <>Be the first to share your feedback!</>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterCommon />
    </>
  );
};

export default FeedbackForm;
