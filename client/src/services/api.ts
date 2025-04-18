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
    if (error.response && error.response.status === 401) {
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

export default api;
