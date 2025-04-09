// --- Validation Helpers (Optional but recommended for cleaner code) ---

const validateUrl = (url) => {
  // Basic URL regex (adjust for stricter needs if required)
  const validLinkRegex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  return validLinkRegex.test(url);
};

const validateImageUrl = (url) => {
  // Basic image URL regex
  const validBannerImageRegex = /^(https?:\/\/).*\.(jpg|jpeg|png|gif)$/i;
  return validBannerImageRegex.test(url);
};

export { validateUrl, validateImageUrl };
