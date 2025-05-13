const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create avatar storage engine for Multer
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "feed-sync/avatars",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [
      { width: 500, height: 500, crop: "fill", gravity: "face" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
    filename_override: (req, file) => {
      // Create a unique filename with user ID and timestamp
      const userId = req.user?._id || "unknown";
      const uniqueSuffix = Date.now();
      const extension = file.originalname.split(".").pop();
      return `avatar_${userId}_${uniqueSuffix}.${extension}`;
    },
  },
});

// Create feedback attachments storage engine for Multer
const attachmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "feed-sync/attachments",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [
      { width: 1024, height: 1024, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
    filename_override: (req, file) => {
      // Create a unique filename with original name and timestamp
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split(".").pop();
      return `feedback_${uniqueSuffix}.${extension}`;
    },
  },
});

// Initialize multer with our storage configurations
const uploadAvatar = multer({ storage: avatarStorage });
const uploadAttachments = multer({ storage: attachmentStorage });

module.exports = {
  cloudinary,
  uploadAvatar,
  uploadAttachments,
};
