const express = require("express");
const { dashboardAnalytics } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const dashboardRouter = express.Router();

dashboardRouter.get("/analytics", protect, dashboardAnalytics);

module.exports = dashboardRouter;
