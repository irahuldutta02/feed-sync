
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Check, Loader2, Upload } from 'lucide-react';

const CreateCampaign = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate slug from campaign name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload progress
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create object URL for preview
          const objectUrl = URL.createObjectURL(file);
          setBannerPreview(objectUrl);
          
          toast({
            title: "File uploaded",
            description: "Your banner image has been uploaded successfully.",
          });
        }
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !slug || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate campaign creation for UI demo
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Campaign created!",
        description: "Your feedback campaign has been created successfully.",
      });
      navigate('/dashboard/campaigns');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new feedback collection campaign for your users.
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Provide information about your feedback campaign.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. Product Feedback 2023"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Campaign Slug <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-muted-foreground">(URL identifier)</span>
                </Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">feedsync.com/c/</span>
                  <Input
                    id="slug"
                    placeholder="product-feedback-2023"
                    value={slug}
                    onChange={handleSlugChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  Campaign Description <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-muted-foreground">(Supports Markdown)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please describe what you're collecting feedback for..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="banner">
                  Banner Image 
                  <span className="ml-1 text-xs text-muted-foreground">(Recommended: 1200×400px)</span>
                </Label>
                
                {bannerPreview ? (
                  <div className="mt-2 relative">
                    <img 
                      src={bannerPreview} 
                      alt="Banner preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setBannerPreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-muted rounded-md p-8 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          PNG, JPG or GIF up to 5MB
                        </p>
                        <div className="relative">
                          <Input
                            id="banner"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleBannerUpload}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading... {uploadProgress}%
                              </>
                            ) : (
                              "Select Image"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create Campaign
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCampaign;
