// src/hooks/useValidateSlug.js
import { useEffect, useState } from 'react';
import request from '../components/request';

const useValidateSlug = (slug) => {
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        console.log(`\n🔍 Fetching organization data for slug: "${slug}"`);
        console.log(`📡 API endpoint: /organizations/slug/${slug}`);
        
        const response = await request.get(`/organizations/slug/${slug}`);
        console.log("\n✅ Successfully fetched org data:", response.data);
        setOrg(response.data);
      } catch (err) {
        console.error("\n❌ Error fetching organization data:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        const errorMessage = err.response?.data?.detail || 
             `Organization with slug "${slug}" not found.\n\n
             Please check the URL for typos or contact your Systems Administrator for assistance.`;
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchOrg();
    } else {
      setLoading(false);
      setError("No slug provided");
    }
  }, [slug]);

  return { loading, org, error };
};

export default useValidateSlug;
