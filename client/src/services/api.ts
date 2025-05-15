import { API_BASE_URL } from "@/config/server.config";
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(localStorage.getItem("authToken") && {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }),
  },
});

// Optional: Add interceptor to handle token expiration or other errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect
    const isUserFeedbackCall = error.config?.url?.includes(
      "/feedback/user-feedback/"
    );

    if (
      error.response &&
      error.response.status === 401 &&
      !isUserFeedbackCall
    ) {
      console.error("API Error: Unauthorized (401)");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Add a utility function to check if the user has already given feedback for a campaign
export const getUserFeedbackForCampaign = async (campaignId) => {
  try {
    const response = await api.get(`/feedback/user-feedback/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return { error: true, data: null };
  }
};

// Get paginated feedback list with filtering options
export const getFeedbackList = async (params) => {
  try {
    const response = await api.get("/feedback/paginated_list", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback list:", error);
    throw error;
  }
};

// Upvote or downvote a feedback
export const upvoteDownvoteFeedback = async (feedbackId, action) => {
  try {
    const response = await api.put(`/feedback/upvote_downvote/${feedbackId}`, {
      action,
    });
    return response.data;
  } catch (error) {
    console.error("Error upvoting/downvoting feedback:", error);
    throw error;
  }
};

// Get all campaigns for the logged-in user
export const getUserCampaigns = async () => {
  try {
    // Use the paginated_list endpoint with a filter for the current user
    const response = await api.get("/campaign/paginated_list", {
      params: {
        created_by: JSON.parse(localStorage.getItem("user") || "{}")._id,
        limit: 100, // Get a large number to ensure all campaigns are returned
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    throw error;
  }
};

// Dashboard analytics
export const getDashboardAnalytics = async () => {
  try {
    const response = await api.get("/dashboard/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
};

export default api;
