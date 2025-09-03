// src/utils/slugDebugger.js
// Debug utility for slug mechanism

/**
 * Test if a slug is valid by making a direct API call
 * @param {string} slug - The slug to test
 * @returns {Promise<Object>} - Result object with success/error info
 */
export const testSlug = async (slug) => {
  try {
    console.log(`\n🧪 Testing slug: "${slug}"`);
    
    // Import request dynamically to avoid circular dependencies
    const { default: request } = await import('../components/request');
    
    const response = await request.get(`/organizations/slug/${slug}`);
    
    console.log("✅ Slug test successful:", response.data);
    
    return {
      success: true,
      data: response.data,
      message: `Slug "${slug}" is valid`
    };
  } catch (error) {
    console.error("❌ Slug test failed:", error);
    
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
      message: `Slug "${slug}" is invalid: ${error.response?.data?.detail || error.message}`
    };
  }
};

/**
 * Extract slug from URL
 * @param {string} url - The full URL
 * @returns {string} - The extracted slug
 */
export const extractSlugFromUrl = (url) => {
  if (!url) return '';
  
  // Remove protocol and domain, get the path
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/').filter(part => part);
  
  // The slug should be the first part after the domain
  return pathParts[0] || '';
};

/**
 * Test the complete slug flow
 * @param {string} fullUrl - The full URL to test
 * @returns {Promise<Object>} - Complete test result
 */
export const testSlugFlow = async (fullUrl) => {
  console.log(`\n🔬 Testing complete slug flow for: ${fullUrl}`);
  
  const slug = extractSlugFromUrl(fullUrl);
  console.log(`📝 Extracted slug: "${slug}"`);
  
  if (!slug) {
    return {
      success: false,
      message: "No slug found in URL",
      slug: null
    };
  }
  
  const result = await testSlug(slug);
  
  return {
    ...result,
    slug,
    fullUrl
  };
};
