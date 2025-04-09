const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const VerifiedUser = require("../models/VerifiedUser");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

const campaignCreate = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    link,
    bannerImage,
    allowAnonymous,
    status,
  } = req.body;

  const mandatoryFields = [title, slug, description, bannerImage];

  const missingFields = mandatoryFields.filter((field) => !field);
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }

  if (title.length < 3) {
    res.status(400);
    throw new Error("Title must be at least 3 characters long.");
  }
  if (description.length < 10) {
    res.status(400);
    throw new Error("Description must be at least 10 characters long.");
  }

  const validSlugRegex = /^[a-z0-9]{3,}(?:-[a-z0-9]+)*$/;
  if (!validSlugRegex.test(slug)) {
    res.status(400);
    throw new Error(
      "Invalid slug format. Slug must be lowercase and hyphenated."
    );
  }

  const slugExists = await Campaign.findOne({ slug });
  if (slugExists) {
    res.status(400);
    throw new Error(`Slug already exists.`);
  }

  const validBannerImageRegex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*(\?.*)?$/;
  if (!validBannerImageRegex.test(bannerImage)) {
    res.status(400);
    throw new Error("Invalid banner image format. Must be a valid image URL.");
  }

  if (link) {
    const validLinkRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!validLinkRegex.test(link)) {
      res.status(400);
      throw new Error("Invalid link format. Please provide a valid URL.");
    }
  }

  if (allowAnonymous !== undefined && typeof allowAnonymous !== "boolean") {
    res.status(400);
    throw new Error("allowAnonymous must be a boolean value.");
  }

  if (status && !["Draft", "Active", "Inactive"].includes(status)) {
    res.status(400);
    throw new Error(
      "Invalid status value. Must be one of: Draft, Active, Inactive"
    );
  }

  const campaign = new Campaign({
    title,
    description,
    link,
    bannerImage,
    slug,
    createdBy: req.user._id,
    allowAnonymous: allowAnonymous ?? false,
    status: status ?? "Draft",
  });

  const createdCampaign = await campaign.save();

  if (createdCampaign) {
    return res.status(201).json({
      status: 201,
      error: false,
      data: createdCampaign,
    });
  } else {
    res.status(400);
    throw new Error("Unable to create campaign. Please try again.");
  }
});

const campaignUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, link, bannerImage, allowAnonymous, status } =
    req.body;

  // Validate campaign ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid campaign ID format");
  }

  const campaign = await Campaign.findById(id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }

  // Check if the user is authorized to update the campaign
  if (campaign.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("User not authorized to update this campaign");
  }

  // Validations for title
  if (title) {
    if (title.length < 3) {
      res.status(400);
      throw new Error("Title must be at least 3 characters long.");
    }
    campaign.title = title;
  }

  // Validations for description
  if (description) {
    if (description.length < 10) {
      res.status(400);
      throw new Error("Description must be at least 10 characters long.");
    }
    campaign.description = description;
  }

  // Validations for bannerImage
  if (bannerImage) {
    const validBannerImageRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*(\?.*)?$/;
    if (!validBannerImageRegex.test(bannerImage)) {
      res.status(400);
      throw new Error(
        "Invalid banner image format. Must be a valid image URL."
      );
    }
    campaign.bannerImage = bannerImage;
  }

  // Validations for link
  if (link) {
    const validLinkRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!validLinkRegex.test(link)) {
      res.status(400);
      throw new Error("Invalid link format. Please provide a valid URL.");
    }
    campaign.link = link;
  }

  // Validations for allowAnonymous
  if (allowAnonymous !== undefined) {
    if (typeof allowAnonymous !== "boolean") {
      res.status(400);
      throw new Error("allowAnonymous must be a boolean value.");
    }
    campaign.allowAnonymous = allowAnonymous;
  }

  // Validations for status
  if (status) {
    if (!["Draft", "Active", "Inactive"].includes(status)) {
      res.status(400);
      throw new Error(
        "Invalid status value. Must be one of: Draft, Active, Inactive"
      );
    }
    campaign.status = status;
  }

  const updatedCampaign = await campaign.save();
  return res.status(200).json({
    status: 200,
    error: false,
    data: updatedCampaign,
  });
});

const campaignDetail = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let campaign;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    campaign = await Campaign.findById(idOrSlug).populate("createdBy", "");
  } else {
    campaign = await Campaign.findOne({ slug: idOrSlug }).populate(
      "createdBy",
      ""
    );
  }

  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }

  res.status(200).json({
    status: 200,
    error: false,
    data: campaign,
  });
});

const campaignPaginatedList = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";
  const statusFilter = req.query.status || "";
  const createdByFilter = req.query.createdBy || "";
  const averageRatingFilter = Number(req.query.averageRating) || 0;

  // Initialize query filter
  const queryFilter = {};

  // Search functionality: Match title, description, or slug
  if (search) {
    queryFilter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  // Status filter
  if (statusFilter && ["Draft", "Active", "Inactive"].includes(statusFilter)) {
    queryFilter.status = statusFilter;
  } else if (statusFilter) {
    console.warn(`Invalid status filter ignored: ${statusFilter}`);
  }

  // Filter by createdBy
  if (createdByFilter) {
    queryFilter.createdBy = createdByFilter;
  }

  // Filter by averageRating (greater than or equal to the provided value)
  if (averageRatingFilter > 0) {
    queryFilter.avarageRating = { $gte: averageRatingFilter };
  }

  try {
    // Count total campaigns matching the filter
    const count = await Campaign.countDocuments(queryFilter);

    // Fetch paginated campaigns
    const campaigns = await Campaign.find(queryFilter)
      .populate("createdBy", "name email")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    // Respond with paginated data
    return res.status(200).json({
      status: 200,
      error: false,
      data: campaigns,
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        totalCampaigns: count,
      },
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
});

const manageVerifiedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const { type, emails } = req.body;

  if (!type || !["add", "remove"].includes(type)) {
    res.status(400);
    throw new Error("Invalid type. Must be 'add' or 'remove'.");
  }

  if (
    !emails ||
    !Array.isArray(emails) ||
    emails.length === 0 ||
    !emails.every((email) => typeof email === "string")
  ) {
    res.status(400);
    throw new Error("Invalid emails. Must be a non-empty array of strings.");
  }

  if (emails.length > 100) {
    res.status(400);
    throw new Error("Too many emails. Maximum allowed is 100.");
  }

  const successEmails = [];
  const failedEmails = [];

  const campaign = await Campaign.findById(id);
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }

  if (campaign.createdBy.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("User not authorized to manage this campaign");
  }

  emails.forEach(async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      failedEmails.push(email);
      return;
    }

    if (type === "add") {
      const alreadyExists = VerifiedUser.findOne({
        campaignId: id,
        email,
      });

      if (alreadyExists) {
        failedEmails.push(email);
        return;
      }

      const verifiedUser = new VerifiedUser({
        campaignId: id,
        email,
      });
      await verifiedUser.save(async (err) => {
        if (err) {
          failedEmails.push(email);
        } else {
          successEmails.push(email);

          const user = await User.findOne({ email });

          if (user) {
            const feedBacksByEmail = await Feedback.find({
              createdBy: user._id,
              campaignId: id,
            });

            if (feedBacksByEmail && feedBacksByEmail.length > 0) {
              feedBacksByEmail.forEach(async (feedback) => {
                feedback.isVerified = true;
                await feedback.save();
              });
            }
          }
        }
      });
    } else if (type === "remove") {
      const removedUser = await VerifiedUser.findOneAndDelete({
        campaignId: id,
        email,
      });
      if (removedUser) {
        successEmails.push(email);

        const user = await User.findOne({ email });

        if (user) {
          const feedBacksByEmail = await Feedback.find({
            createdBy: user._id,
            campaignId: id,
          });

          if (feedBacksByEmail && feedBacksByEmail.length > 0) {
            feedBacksByEmail.forEach(async (feedback) => {
              feedback.isVerified = false;
              await feedback.save();
            });
          }
        }
      } else {
        failedEmails.push(email);
      }
    }
  });

  if (successEmails.length > 0) {
    res.status(200).json({
      status: 200,
      error: false,
      message: `${type === "add" ? "Added" : "Removed"} successfully`,
      data: {
        successEmails,
        failedEmails,
      },
    });
  } else {
    res.status(200).json({
      status: 200,
      error: false,
      message: `No emails ${type === "add" ? "added" : "removed"}`,
      data: {
        successEmails,
        failedEmails,
      },
    });
  }
});

module.exports = {
  campaignCreate,
  campaignUpdate,
  campaignDetail,
  campaignPaginatedList,
  manageVerifiedUser,
};
