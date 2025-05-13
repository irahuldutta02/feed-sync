import { Star } from "lucide-react";

const RatingStars = ({
  rating,
  hoveredStar,
  setHoveredStar,
  setRating,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (readOnly) {
          return (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          );
        } else {
          return (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              disabled={readOnly}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredStar || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          );
        }
      })}
      {rating > 0 && !readOnly && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating} star{rating !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
