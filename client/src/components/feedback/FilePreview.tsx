import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const FilePreview = ({
  files,
  filePreviewUrls,
  removeFile,
  clearAllFiles,
  isUploading,
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-green-600 mb-2">
        {files.length} file{files.length !== 1 ? "s" : ""} selected
      </p>
      <div className="flex flex-wrap gap-2">
        {filePreviewUrls.map((item, index) => (
          <div
            key={index}
            className="relative w-16 h-16 rounded-md overflow-hidden border group"
          >
            <img
              src={item.url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-white p-1 rounded-full bg-red-500/80 hover:bg-red-600"
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={clearAllFiles}
        disabled={isUploading}
      >
        <X className="h-4 w-4 mr-1" />
        Clear files
      </Button>
    </div>
  );
};

export default FilePreview;
