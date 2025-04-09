const express = require("express");
const {
  manageVerifiedUser,
  campaignCreate,
  campaignUpdate,
  campaignDetail,
  campaignPaginatedList,
} = require("../controllers/campaignController");
const { protect } = require("../middleware/authMiddleware");

const campaignRouter = express.Router();

campaignRouter.post("/create", protect, campaignCreate);
campaignRouter.put("/update/:id", protect, campaignUpdate);
campaignRouter.get("/detail/:id", campaignDetail);
campaignRouter.get("/paginated_list/", campaignPaginatedList);
campaignRouter.get("/manage_verified_user/:id", protect, manageVerifiedUser);

module.exports = campaignRouter;
