const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleCallback);

authRouter.get("/github", githubAuth);
authRouter.get("/github/callback", githubCallback);

authRouter.get("/profile", protect, getUserProfile);
authRouter.put("/update-profile", protect, updateUserProfile);
authRouter.put("/update-password", protect, updateUserPassword);

module.exports = authRouter;
