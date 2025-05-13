const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { upload, cloudinary } = require("../config/cloudinary");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const uploadRouter = express.Router();

// Upload avatar endpoint
uploadRouter.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  asyncHandler(async (req, res) => {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error("No file uploaded");
      }

      // Get the Cloudinary URL from the uploaded file
      const avatarUrl = req.file.path;

      // Update user's avatar URL in the database
      const user = await User.findById(req.user._id);
      user.avatarUrl = avatarUrl;
      await user.save();

      // Return success with the user data
      res.status(200).json({
        error: false,
        message: "Avatar uploaded successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          googleId: user.googleId,
          githubId: user.githubId,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: error.message || "Failed to upload avatar",
      });
    }
  })
);

module.exports = uploadRouter;
