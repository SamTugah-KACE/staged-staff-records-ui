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
        const response = await request.get(`/organizations/slug/${slug}`);
        console.log("\nfetch org data using slug in useValidateSlug: ", response.data );
        setOrg(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 
             `\nCheck if there is a typo in ${slug}.\n\n
             If spelling is correct, try running Windows Network Diagnostics.\n
             DNS_PROBE_FINISHED_NXDOMAIN\n\n
             Or contact your Systems Administrator for assistance.`
        );
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
