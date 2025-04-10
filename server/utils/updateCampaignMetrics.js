const Campaign = require("../models/Campaign");
const Feedback = require("../models/Feedback");

const updateCampaignMetrics = async (campaignId) => {
  // Get all active feedback for the campaign
  const feedbacks = await Feedback.find({
    campaignId,
    status: { $ne: "Deleted" },
  });

  // Calculate metrics
  const feedbackCount = feedbacks.length;

  let averageRating = 0;
  if (feedbackCount > 0) {
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    averageRating = totalRating / feedbackCount;
  }

  // Update campaign
  await Campaign.findByIdAndUpdate(campaignId, {
    feedbackCount,
    averageRating,
  });
};

module.exports = updateCampaignMetrics;
