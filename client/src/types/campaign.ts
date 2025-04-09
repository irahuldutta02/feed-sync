// src/types/campaign.ts
export interface Campaign {
  _id: string;
  title: string;
  description: string;
  link?: string;
  slug: string;
  bannerImage: string;
  avarageRating: number;
  status: "Draft" | "Active" | "Inactive";
  allowAnonymous: boolean;
  createdAt: string;
  feedbackCount?: number;
  createdBy?: string;
}

export interface CampaignFormData {
  title: string;
  description: string;
  link: string;
  slug: string;
  bannerImage: string;
  allowAnonymous: boolean;
  status: "Draft" | "Active" | "Inactive";
}

export interface FormErrors {
  title?: string;
  description?: string;
  link?: string;
  slug?: string;
  bannerImage?: string;
}

export interface PaginationData {
  page: number;
  pages: number;
  totalCampaigns: number;
}

export interface ApiResponse<T> {
  status: number;
  error: boolean;
  data: T;
  message?: string;
  pagination?: PaginationData;
}
