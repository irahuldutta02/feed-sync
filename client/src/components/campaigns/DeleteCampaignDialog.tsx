import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Campaign } from "@/types/campaign";

interface DeleteCampaignDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSuccess: () => void;
}

const DeleteCampaignDialog: React.FC<DeleteCampaignDialogProps> = ({
  open,
  onOpenChange,
  campaign,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!campaign) return;

    setIsDeleting(true);
    try {
      const response = await api.put(
        `/campaign/mark_campaign_deleted/${campaign._id}`
      );

      if (response.data.error === false) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to delete campaign",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Error deleting campaign:", error);
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response?: { data?: { message?: string } };
        };
        toast({
          title: "Error",
          description:
            errorResponse.response?.data?.message ||
            "Failed to delete campaign",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete campaign",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            campaign <strong>{campaign?.title}</strong> and all associated
            feedback data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Campaign"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCampaignDialog;
