// src/utils/urlUtils.js
// Utility functions for URL handling

/**
 * Clean a URL by removing any @ symbol prefix and ensuring proper format
 * @param {string} url - The URL to clean
 * @returns {string} - The cleaned URL
 */
export const cleanUrl = (url) => {
  if (!url) return '';
  
  // Remove @ symbol prefix if present
  let cleanedUrl = url.replace(/^@/, '');
  
  // Ensure URL has proper protocol if missing
  if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
    cleanedUrl = `https://${cleanedUrl}`;
  }
  
  return cleanedUrl;
};

/**
 * Extract slug from access URL
 * @param {string} accessUrl - The access URL
 * @returns {string} - The extracted slug
 */
export const extractSlugFromUrl = (accessUrl) => {
  if (!accessUrl) return '';
  
  const cleanedUrl = cleanUrl(accessUrl);
  const urlParts = cleanedUrl.split('/');
  return urlParts[urlParts.length - 1] || '';
};

/**
 * Build signin URL from access URL
 * @param {string} accessUrl - The access URL
 * @returns {string} - The signin URL
 */
export const buildSigninUrl = (accessUrl) => {
  const cleanedUrl = cleanUrl(accessUrl);
  if (!cleanedUrl) return '';
  
  // Extract slug from the access URL
  const slug = extractSlugFromUrl(cleanedUrl);
  if (!slug) return '';
  
  // Use the current frontend domain instead of the backend's access_url domain
  const currentDomain = window.location.origin; // Gets current domain (e.g., https://staged-staff-records-ui-e06g.onrender.com)
  return `${currentDomain}/${slug}/signin`;
};

/**
 * Build dashboard URL from access URL
 * @param {string} accessUrl - The access URL
 * @param {string} route - The route to append (e.g., 'dashboard', 'staff')
 * @returns {string} - The dashboard URL
 */
export const buildDashboardUrl = (accessUrl, route = 'dashboard') => {
  const cleanedUrl = cleanUrl(accessUrl);
  const slug = extractSlugFromUrl(cleanedUrl);
  if (!slug) return '';
  
  // Use the current frontend domain instead of hardcoded domain
  const currentDomain = window.location.origin;
  return `${currentDomain}/${slug}/${route}`;
};

/**
 * Fix domain mismatch between backend access_url and frontend domain
 * @param {string} accessUrl - The access URL from backend
 * @returns {string} - The corrected URL using current frontend domain
 */
export const fixDomainMismatch = (accessUrl) => {
  const cleanedUrl = cleanUrl(accessUrl);
  if (!cleanedUrl) return '';
  
  const slug = extractSlugFromUrl(cleanedUrl);
  if (!slug) return '';
  
  // Always use the current frontend domain
  const currentDomain = window.location.origin;
  return `${currentDomain}/${slug}`;
};
