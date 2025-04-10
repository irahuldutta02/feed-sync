const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    feedbackCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Inactive", "Deleted"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign;
