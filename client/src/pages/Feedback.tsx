
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from '@/components/layout/DashboardLayout';
import FeedbackPagination from '@/components/feedback/FeedbackPagination';
import { Calendar, Eye, FileText, Image, Search, Star } from 'lucide-react';

// Sample data
const feedbackData = [
  {
    id: 1,
    campaignName: "Product Feedback Q3",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    rating: 5,
    feedback: "I love the new dashboard design! It's much easier to navigate and the reporting features are fantastic. The export options are especially helpful for sharing data with my team. Keep up the great work!",
    date: "2023-07-28",
    attachments: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    ],
  },
  {
    id: 2,
    campaignName: "Product Feedback Q3",
    userName: "Michael Chen",
    userEmail: "michael.c@example.com",
    rating: 4,
    feedback: "Overall great experience, but I did notice some lag when loading large datasets. The UI is very intuitive though, and I appreciate the new filtering options.",
    date: "2023-07-26",
    attachments: [],
  },
  {
    id: 3,
    campaignName: "Website Redesign Feedback",
    userName: "Emily Rodriguez",
    userEmail: "emily.r@example.com",
    rating: 3,
    feedback: "The new website looks good, but I'm having trouble finding some of the features that were easier to access in the old design. Maybe consider adding a comprehensive site map or improving the search functionality.",
    date: "2023-07-25",
    attachments: [
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    ],
  },
  {
    id: 4,
    campaignName: "Mobile App Beta Feedback",
    userName: "David Williams",
    userEmail: "david.w@example.com",
    rating: 2,
    feedback: "I'm experiencing frequent crashes when trying to use the image upload feature. Also, the notification system seems to be delayed. I've attached screenshots of the error messages I'm receiving.",
    date: "2023-07-24",
    attachments: [
      "https://images.unsplash.com/photo-1593642532400-2682810df593",
    ],
  },
  {
    id: 5,
    campaignName: "Customer Support Survey",
    userName: "Olivia Brown",
    userEmail: "olivia.b@example.com",
    rating: 5,
    feedback: "The customer support team was incredibly helpful and resolved my issue quickly. The follow-up was also appreciated and thorough. Special thanks to Alex for going above and beyond!",
    date: "2023-07-22",
    attachments: [],
  },
  {
    id: 6,
    campaignName: "New Feature Evaluation",
    userName: "James Wilson",
    userEmail: "james.w@example.com",
    rating: 4,
    feedback: "The new collaborative editing feature is a game-changer for our team. It would be great if there was an option to see who is currently viewing a document in real-time.",
    date: "2023-07-20",
    attachments: [],
  },
];

const ITEMS_PER_PAGE = 5;

const Feedback = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique campaign names for the filter
  const campaigns = Array.from(new Set(feedbackData.map(item => item.campaignName)));

  // Apply filters
  const filteredFeedback = feedbackData.filter(item => {
    // Text search
    const matchesSearch = 
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Rating filter
    const matchesRating = ratingFilter === 'all' || item.rating === parseInt(ratingFilter);
    
    // Campaign filter
    const matchesCampaign = campaignFilter === 'all' || item.campaignName === campaignFilter;
    
    return matchesSearch && matchesRating && matchesCampaign;
  });

  // Paginate the filtered feedback
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, campaignFilter]);

  const handleViewDetails = (feedback: any) => {
    setSelectedFeedback(feedback);
    setDetailsOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze feedback from your campaigns.
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Feedback</CardTitle>
                <CardDescription>
                  Viewing {filteredFeedback.length} of {feedbackData.length} feedback responses
                </CardDescription>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    className="pl-8 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              
              <div className="w-full sm:w-64">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Filter by Campaign
                </label>
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Campaigns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign} value={campaign}>
                        {campaign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name / Campaign</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Feedback Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFeedback.length > 0 ? (
                    paginatedFeedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.userName === "Anonymous" ? (
                            <span className="italic text-muted-foreground">Anonymous</span>
                          ) : (
                            item.userName
                          )}
                          <div className="text-xs text-muted-foreground">{item.campaignName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.date}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          <div className="flex items-center space-x-1">
                            {item.feedback.substring(0, 60)}
                            {item.feedback.length > 60 && "..."}
                            {item.attachments.length > 0 && (
                              <span className="inline-flex items-center text-muted-foreground">
                                <Image className="h-3 w-3 ml-1" />
                                <span className="text-xs ml-0.5">{item.attachments.length}</span>
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {searchQuery || ratingFilter !== 'all' || campaignFilter !== 'all' ? (
                          "No feedback found with the selected filters"
                        ) : (
                          "No feedback found. Create a campaign to start collecting feedback."
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredFeedback.length > ITEMS_PER_PAGE && (
              <FeedbackPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Details Dialog */}
      {selectedFeedback && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>
                {selectedFeedback.userName === "Anonymous" 
                  ? "Detailed anonymous feedback" 
                  : `Detailed feedback submitted by ${selectedFeedback.userName}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">From</h4>
                  {selectedFeedback.userName === "Anonymous" ? (
                    <p className="font-medium italic">Anonymous</p>
                  ) : (
                    <>
                      <p className="font-medium">{selectedFeedback.userName}</p>
                      <p className="text-sm text-muted-foreground">{selectedFeedback.userEmail}</p>
                    </>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Campaign</h4>
                  <p>{selectedFeedback.campaignName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Rating</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedFeedback.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedFeedback.date}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Feedback</h4>
                <div className="p-4 bg-muted/50 rounded-md">
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="whitespace-pre-wrap">{selectedFeedback.feedback}</p>
                  </div>
                </div>
              </div>
              
              {selectedFeedback.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Attachments ({selectedFeedback.attachments.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFeedback.attachments.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={`${url}?w=300&h=200&fit=crop&auto=format`}
                          alt={`Attachment ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-md border border-border"
                        />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                        >
                          View Full Size
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Feedback;
