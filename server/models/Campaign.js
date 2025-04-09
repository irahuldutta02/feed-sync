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
      required: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avarageRating: {
      type: Number,
      default: 0,
    },
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Inactive"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign;
