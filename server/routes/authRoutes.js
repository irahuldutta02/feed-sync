const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const authRouter = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

router.get("/profile", protect, getUserProfile);

module.exports = authRouter;
