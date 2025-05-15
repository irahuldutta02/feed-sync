const asyncHandler = require("express-async-handler");
const Campaign = require("../models/Campaign");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Dashboard analytics endpoint
const dashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total campaigns (active, not deleted)
  const totalCampaigns = await Campaign.countDocuments({
    createdBy: userId,
    status: { $ne: "Deleted" },
  });

  // Total feedback responses (for user's campaigns)
  const userCampaigns = await Campaign.find({ createdBy: userId }, "_id");
  const campaignIds = userCampaigns.map((c) => c._id);
  const totalFeedback = await Feedback.countDocuments({
    campaignId: { $in: campaignIds },
    status: { $ne: "Deleted" },
  });

  // Average rating across all feedback for user's campaigns
  const ratingAgg = await Feedback.aggregate([
    {
      $match: { campaignId: { $in: campaignIds }, status: { $ne: "Deleted" } },
    },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);
  const averageRating = ratingAgg.length > 0 ? ratingAgg[0].avg : 0;

  // Feedback responses per month (last 12 months)
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });
  const feedbackByMonth = await Feedback.aggregate([
    {
      $match: { campaignId: { $in: campaignIds }, status: { $ne: "Deleted" } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  const campaignData = months.map((m) => {
    const found = feedbackByMonth.find(
      (f) => f._id.year === m.year && f._id.month === m.month
    );
    return {
      name: `${m.year}-${String(m.month).padStart(2, "0")}`,
      value: found ? found.count : 0,
    };
  });

  // Rating distribution (1-5 stars)
  const ratingDistAgg = await Feedback.aggregate([
    {
      $match: { campaignId: { $in: campaignIds }, status: { $ne: "Deleted" } },
    },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);
  const feedbackData = [1, 2, 3, 4, 5].map((star) => {
    const found = ratingDistAgg.find((r) => r._id === star);
    return {
      rating: `${star} Star${star > 1 ? "s" : ""}`,
      count: found ? found.count : 0,
    };
  });

  // Recent campaigns (last 3, with stats)
  const recentCampaigns = await Campaign.find({
    createdBy: userId,
    status: { $ne: "Deleted" },
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  for (const c of recentCampaigns) {
    c.feedbackCount = await Feedback.countDocuments({
      campaignId: c._id,
      status: { $ne: "Deleted" },
    });
    c.averageRating = await Feedback.aggregate([
      { $match: { campaignId: c._id, status: { $ne: "Deleted" } } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]).then((agg) => (agg.length > 0 ? agg[0].avg : 0));
  }

  res.json({
    status: 200,
    error: false,
    data: {
      totalCampaigns,
      totalFeedback,
      averageRating,
      campaignData,
      feedbackData,
      recentCampaigns,
    },
  });
});

module.exports = { dashboardAnalytics };
