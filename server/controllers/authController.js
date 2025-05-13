const User = require("../models/User");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      googleId: user.googleId,
      githubId: user.githubId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw error;
  }
});

const loginUser = asyncHandler((req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(500);
      throw new Error("Server error during login");
    }
    if (!user) {
      res.status(401);
      throw new Error(info.message || "Login failed");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      googleId: user.googleId,
      githubId: user.githubId,
      token: generateToken(user._id),
    });
  })(req, res, next);
});

const googleAuth = asyncHandler((req, res, next) => {
  const { redirect } = req.query;
  const state = redirect ? encodeURIComponent(redirect) : undefined;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
});

const googleCallback = asyncHandler((req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      res.status(500);
      throw new Error("Google OAuth failed");
    }
    if (!user) {
      res.status(401);
      throw new Error(info?.message || "Google login failed");
    }

    const token = generateToken(user._id);
    const redirectUrl = info?.redirectUrl || "/";

    res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?token=${token}&redirect=${encodeURIComponent(
        redirectUrl
      )}`
    );
  })(req, res, next);
});

const githubAuth = asyncHandler((req, res, next) => {
  const { redirect } = req.query;
  const state = redirect ? encodeURIComponent(redirect) : undefined;

  passport.authenticate("github", {
    scope: ["user:email"],
    state: state,
  })(req, res, next);
});

const githubCallback = asyncHandler((req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err) {
      res.status(500);
      throw new Error("GitHub OAuth failed");
    }
    if (!user) {
      res.status(401);
      throw new Error(info?.message || "GitHub login failed");
    }

    const token = generateToken(user._id);
    const redirectUrl = info?.redirectUrl || "/";

    res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?token=${token}&redirect=${encodeURIComponent(
        redirectUrl
      )}`
    );
  })(req, res, next);
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
      googleId: req.user.googleId,
      githubId: req.user.githubId,
    });
  } else {
    res.status(404);
    throw error;
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = name;
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    await user.save();

    res.json({
      error: false,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        googleId: user.googleId,
        githubId: user.githubId,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update profile: " + error.message);
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if user has password (OAuth users might not)
    if (!user.password) {
      res.status(400);
      throw new Error("Password cannot be changed for OAuth accounts");
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      error: false,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update password: " + error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};
