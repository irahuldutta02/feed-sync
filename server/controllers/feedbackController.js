const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback");
const Campaign = require("../models/Campaign");
const VerifiedUser = require("../models/VerifiedUser");
const updateCampaignMetrics = require("../utils/updateCampaignMetrics");

const feedbackCreate = asyncHandler(async (req, res) => {
  const {
    campaignId,
    rating,
    feedback,
    anonymous = false,
    attachments = [],
    user = null,
  } = req.body;

  console.log(req.body);

  // Validate required fields
  if (!campaignId || !rating || !feedback) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide campaignId, rating and feedback",
    });
  }

  // Validate rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Rating must be between 1 and 5",
    });
  }

  // Check if campaign exists
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Campaign not found",
    });
  }

  // Check if campaign is active
  if (campaign.status !== "Active") {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Cannot add feedback to inactive campaign",
    });
  }

  // Create feedback data object
  const feedbackData = {
    campaignId,
    rating,
    feedback,
    anonymous,
    attachments,
  };

  if (!campaign?.allowAnonymous && !user) {
    res.status(400);
    throw new Error("Anonymous feedback is not allowed for this campaign");
  }

  // If user is logged in and not anonymous, add user reference
  if (!anonymous && user) {
    // Handle both cases: when user is passed as an object with _id or when req.user is available
    const userId = user._id ? user._id : req.user ? req.user._id : null;
    if (userId) {
      feedbackData.createdBy = userId;
    }
  }

  // Check if user is verified for this campaign
  if (!anonymous && user) {
    const userEmail = user.email
      ? user.email
      : req.user
      ? req.user.email
      : null;
    if (userEmail) {
      const verifiedUser = await VerifiedUser.findOne({
        campaignId,
        email: userEmail,
      });

      if (verifiedUser) {
        feedbackData.isVerified = true;
      }
    }
  }

  // Create feedback
  const newFeedback = await Feedback.create(feedbackData);

  // Update campaign's feedback count and average rating
  await updateCampaignMetrics(campaignId);

  return res.status(201).json({
    status: 201,
    error: false,
    data: newFeedback,
  });
});

const feedbackUpdate = asyncHandler(async (req, res) => {
  const { rating, feedback, attachments } = req.body;
  const feedbackId = req.params.id;

  // Find the feedback
  const existingFeedback = await Feedback.findById(feedbackId);

  if (!existingFeedback) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Feedback not found",
    });
  }

  // Check if user is authorized to update this feedback
  if (
    existingFeedback.createdBy &&
    existingFeedback.createdBy.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      status: 403,
      error: true,
      message: "Not authorized to update this feedback",
    });
  }

  // Update fields
  if (rating) existingFeedback.rating = rating;
  if (feedback) existingFeedback.feedback = feedback;
  if (attachments) existingFeedback.attachments = attachments;

  // Mark as edited
  existingFeedback.edited = true;

  // Save the updated feedback
  const updatedFeedback = await existingFeedback.save();

  // Update campaign metrics
  await updateCampaignMetrics(updatedFeedback.campaignId);

  return res.status(200).json({
    status: 200,
    error: false,
    data: updatedFeedback,
  });
});

const feedbackDetail = asyncHandler(async (req, res) => {
  const feedbackId = req.params.id;

  const feedback = await Feedback.findById(feedbackId)
    .populate({
      path: "createdBy",
      select: "name avatarUrl",
    })
    .populate({
      path: "campaignId",
      select: "title slug",
    });

  if (!feedback) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Feedback not found",
    });
  }

  // Don't return feedback if it's deleted
  if (feedback.status === "Deleted") {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Feedback not found",
    });
  }

  return res.status(200).json({
    status: 200,
    error: false,
    data: feedback,
  });
});

const feedbackPaginatedList = asyncHandler(async (req, res) => {
  const { campaignId, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  // Validate campaignId
  if (!campaignId) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Campaign ID is required",
    });
  }

  // Build filter
  const filter = {
    campaignId,
    status: { $ne: "Deleted" },
  };

  // Count total documents
  const total = await Feedback.countDocuments(filter);

  // Get paginated results
  const feedbacks = await Feedback.find(filter)
    .populate({
      path: "createdBy",
      select: "name avatarUrl",
    })
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  return res.status(200).json({
    status: 200,
    error: false,
    data: feedbacks,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

const markFeedbackDeleted = asyncHandler(async (req, res) => {
  const feedbackId = req.params.id;

  // Find the feedback
  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Feedback not found",
    });
  }

  // Check if user is authorized (either the feedback creator or campaign owner)
  const isCreator =
    feedback.createdBy &&
    feedback.createdBy.toString() === req.user._id.toString();

  const campaign = await Campaign.findById(feedback.campaignId);
  const isCampaignOwner =
    campaign && campaign.createdBy.toString() === req.user._id.toString();

  if (!isCreator && !isCampaignOwner) {
    return res.status(403).json({
      status: 403,
      error: true,
      message: "Not authorized to delete this feedback",
    });
  }

  // Mark as deleted
  feedback.status = "Deleted";
  await feedback.save();

  // Update campaign metrics
  await updateCampaignMetrics(feedback.campaignId);

  return res.status(200).json({
    status: 200,
    error: false,
    message: "Feedback deleted successfully",
  });
});

const upvoteDownvoteFeedback = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'upvote' or 'downvote'
  const feedbackId = req.params.id;
  const userId = req.user._id;

  if (!action || (action !== "upvote" && action !== "downvote")) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Invalid action. Must be 'upvote' or 'downvote'",
    });
  }

  // Find the feedback
  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Feedback not found",
    });
  }

  // Don't allow voting on deleted feedback
  if (feedback.status === "Deleted") {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Cannot vote on deleted feedback",
    });
  }

  // Handle upvote
  if (action === "upvote") {
    // Remove from downvotes if present
    if (feedback.downvotes.includes(userId)) {
      feedback.downvotes = feedback.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Toggle upvote
    if (feedback.upvotes.includes(userId)) {
      // Remove upvote if already upvoted
      feedback.upvotes = feedback.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add upvote
      feedback.upvotes.push(userId);
    }
  }

  // Handle downvote
  if (action === "downvote") {
    // Remove from upvotes if present
    if (feedback.upvotes.includes(userId)) {
      feedback.upvotes = feedback.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Toggle downvote
    if (feedback.downvotes.includes(userId)) {
      // Remove downvote if already downvoted
      feedback.downvotes = feedback.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add downvote
      feedback.downvotes.push(userId);
    }
  }

  // Save the updated feedback
  await feedback.save();

  return res.status(200).json({
    status: 200,
    error: false,
    data: {
      upvotes: feedback.upvotes.length,
      downvotes: feedback.downvotes.length,
      userUpvoted: feedback.upvotes.includes(userId),
      userDownvoted: feedback.downvotes.includes(userId),
    },
  });
});

const getUserFeedback = asyncHandler(async (req, res) => {
  const campaignId = req.params.campaignId;
  const userId = req.user._id;

  if (!campaignId) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: "Campaign ID is required",
    });
  }

  // Find feedback by the user for this campaign
  const userFeedback = await Feedback.findOne({
    campaignId,
    createdBy: userId,
    status: { $ne: "Deleted" },
  });

  if (!userFeedback) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "No feedback found",
    });
  }

  return res.status(200).json({
    status: 200,
    error: false,
    data: userFeedback,
  });
});

module.exports = {
  feedbackCreate,
  feedbackUpdate,
  feedbackDetail,
  feedbackPaginatedList,
  markFeedbackDeleted,
  upvoteDownvoteFeedback,
  getUserFeedback,
};
