const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to ensure count fields are always in sync with arrays
FeedbackSchema.pre("save", function (next) {
  // Update counts if arrays exist
  if (this.upvotes) {
    this.upvoteCount = this.upvotes.length;
  }
  if (this.downvotes) {
    this.downvoteCount = this.downvotes.length;
  }
  next();
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
