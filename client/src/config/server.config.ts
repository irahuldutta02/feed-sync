/// <reference types="vite/client" />

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export { API_BASE_URL };
