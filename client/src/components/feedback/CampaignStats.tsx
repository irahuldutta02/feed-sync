import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

const CampaignStats = ({ campaign }) => {
  return (
    <Card className="bg-card shadow-lg">
      <CardHeader>
        <CardTitle>Campaign Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Average Rating</span>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">
              {campaign.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Feedbacks</span>
          <span className="font-medium">{campaign?.feedbackCount}</span>
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
              <p className="font-medium">{campaign.createdBy.name}</p>
              <p className="text-sm text-muted-foreground">
                {campaign.createdBy.email}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignStats;
