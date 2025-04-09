const mongoose = require("mongoose");

const verifiedUserSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const VerifiedUser = mongoose.model("VerifiedUser", verifiedUserSchema);
module.exports = VerifiedUser;
