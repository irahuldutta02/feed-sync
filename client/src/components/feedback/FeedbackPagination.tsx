import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeedbackPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center md:justify-between items-center flex-wrap gap-4 mt-6">
      <div className="text-sm text-muted-foreground order-2 md:order-1">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2 order-1 md:order-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FeedbackPagination;
