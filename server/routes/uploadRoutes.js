const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadAvatar,
  uploadAttachments,
  cloudinary,
} = require("../config/cloudinary");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const uploadRouter = express.Router();

// Upload avatar endpoint
uploadRouter.post(
  "/avatar",
  protect,
  uploadAvatar.single("avatar"),
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

// Upload multiple files for feedback attachments
uploadRouter.post(
  "/",
  uploadAttachments.array("files", 5), // Limit to 5 files per upload
  asyncHandler(async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: true,
          message: "No files uploaded",
        });
      }

      // Maximum file size: 5MB (check file sizes)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const validFiles = req.files.filter((file) => file.size <= MAX_FILE_SIZE);

      if (validFiles.length < req.files.length) {
        // Some files were too large
        return res.status(400).json({
          error: true,
          message: "One or more files exceed the maximum size limit of 5MB",
        });
      }

      // Get array of Cloudinary URLs from the uploaded files
      const fileUrls = req.files.map((file) => file.path);

      // Return success with the file URLs
      res.status(200).json({
        error: false,
        message: "Files uploaded successfully",
        data: fileUrls,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: error.message || "Failed to upload files",
      });
    }
  })
);

module.exports = uploadRouter;
