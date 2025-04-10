const express = require("express");
const {
  manageVerifiedUser,
  campaignCreate,
  campaignUpdate,
  campaignDetail,
  campaignPaginatedList,
  markCampaignDeleted,
} = require("../controllers/campaignController");
const { protect } = require("../middleware/authMiddleware");

const campaignRouter = express.Router();

campaignRouter.post("/create", protect, campaignCreate);
campaignRouter.put("/update/:id", protect, campaignUpdate);
campaignRouter.get("/detail/:idOrSlug", campaignDetail);
campaignRouter.get("/paginated_list/", campaignPaginatedList);
campaignRouter.get("/manage_verified_user/:id", protect, manageVerifiedUser);
campaignRouter.put("/mark_campaign_deleted/:id", protect, markCampaignDeleted);

module.exports = campaignRouter;
