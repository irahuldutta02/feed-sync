const express = require("express");

const campaignRouter = express.Router();

router.post("/create", protect, campaignCreate);
router.post("/update/:id", protect, campaignUpdate);
router.get("/detail/:id", campaignDetail);
router.get("/paginated_list/", campaignPaginatedList);

module.exports = campaignRouter;
