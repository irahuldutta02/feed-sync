import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link as LinkIcon, Share } from "lucide-react";

const CampaignInfo = ({ campaign, copyFeedbackLink }) => {
  return (
    <Card className="bg-card shadow-lg relative">
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
            <Button size="icon" onClick={copyFeedbackLink} className="ml-2">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignInfo;
