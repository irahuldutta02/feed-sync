import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import React, { useState } from "react";

interface ImageUploaderProps {
  currentImageUrl: string;
  // eslint-disable-next-line no-unused-vars
  onImageUploaded: (url: string) => void;
  inputId: string;
}

const ImageUploader = ({
  currentImageUrl,
  onImageUploaded,
  inputId,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, GIF, WEBP)",
          variant: "destructive",
        });
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", imageFile);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error === false && response.data.data?.length > 0) {
        // Get the uploaded image URL
        const imageUrl = response.data.data[0];
        onImageUploaded(imageUrl);

        // Clear the file and preview
        setImageFile(null);
        setPreviewUrl(null);

        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          {" "}
          <Input
            id={inputId}
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="bg-background"
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Upload a JPG, PNG, GIF or WEBP image (max 5MB)
          </p>
        </div>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!imageFile || isUploading}
          className="whitespace-nowrap h-10"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {previewUrl && (
        <div className="relative">
          <div className="mt-2 relative w-full max-w-md mx-auto border rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto object-cover max-h-[200px]"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearSelectedImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Preview (not yet uploaded)
          </p>
        </div>
      )}

      {!previewUrl && currentImageUrl && (
        <div className="mt-2 relative w-full max-w-md mx-auto border rounded-md overflow-hidden">
          <img
            src={currentImageUrl}
            alt="Current banner"
            className="w-full h-auto object-cover max-h-[200px]"
          />
          <p className="text-center text-sm text-muted-foreground mt-1">
            Current banner image
          </p>
        </div>
      )}

      {!previewUrl && !currentImageUrl && (
        <div className="mt-2 flex items-center justify-center w-full max-w-md mx-auto border rounded-md h-[140px] bg-muted/40">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <p>No image selected</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
