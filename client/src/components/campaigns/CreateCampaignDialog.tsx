import ImageUploader from "@/components/ui-custom/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";

// Form schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase and hyphenated",
    }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  link: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  bannerImage: z.string().url({ message: "Please enter a valid image URL" }),
  allowAnonymous: z.boolean().default(false),
  status: z.enum(["Draft", "Active", "Inactive"]).default("Draft"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      link: "",
      bannerImage: "",
      allowAnonymous: false,
      status: "Draft",
    },
  });

  // Generate slug from title using the slugify package
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);

    const generatedSlug = slugify(title, {
      lower: true, // Convert to lowercase
      strict: true, // Strip special characters
      trim: true, // Trim leading and trailing spaces
    });
    form.setValue("slug", generatedSlug);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/campaign/create", values);

      if (response.data.error === false) {
        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create campaign",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Error creating campaign:", error);
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response?: { data?: { message?: string } };
        };
        toast({
          title: "Error",
          description:
            errorResponse.response?.data?.message ||
            "Failed to create campaign",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create campaign",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign to collect feedback from your users.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter campaign title"
                      {...field}
                      onChange={handleTitleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for your campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="campaign-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL-friendly identifier for your campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your campaign"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain what feedback you're looking for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to the product or service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <div className="space-y-4">
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          className="mb-2"
                        />
                      </FormControl>
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">
                          Or upload an image:
                        </div>
                        <ImageUploader
                          currentImageUrl={field.value}
                          onImageUploaded={(url) =>
                            form.setValue("bannerImage", url)
                          }
                          inputId="campaign-banner-upload"
                        />
                      </div>
                    </div>
                    <FormDescription>
                      Provide a URL or upload an image for your campaign banner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="allowAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Allow Anonymous Feedback
                      </FormLabel>
                      <FormDescription>
                        Let users submit feedback without signing in
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormLabel>Campaign Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the current status of your campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
