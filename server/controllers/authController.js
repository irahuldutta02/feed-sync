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
    });
  } else {
    res.status(404);
    throw error;
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
};
