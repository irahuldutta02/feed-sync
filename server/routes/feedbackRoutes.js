const express = require("express");
const {
  feedbackCreate,
  feedbackUpdate,
  feedbackDetail,
  feedbackPaginatedList,
  markFeedbackDeleted,
  upvoteDownvoteFeedback,
  getUserFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const feedbackRouter = express.Router();

feedbackRouter.post("/create", feedbackCreate);
feedbackRouter.put("/update/:id", protect, feedbackUpdate);
feedbackRouter.get("/detail/:id", feedbackDetail);
feedbackRouter.get("/paginated_list", feedbackPaginatedList);
feedbackRouter.put("/mark_feedback_deleted/:id", protect, markFeedbackDeleted);
feedbackRouter.put("/upvote_downvote/:id", protect, upvoteDownvoteFeedback);
feedbackRouter.get("/user-feedback/:campaignId", protect, getUserFeedback);

module.exports = feedbackRouter;
