// src/hooks/useOrganizationSummary.js
import { useState, useEffect } from 'react';
import request from '../components/request';

export function useOrganizationSummary(orgId) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!orgId) return;
    setIsLoading(true);
    request
      .get(`/organizations/${orgId}/summary`)
      .then(res => {
        setSummary(res.data);
      })
      .catch(err => {
        console.error('Error loading summary', err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [orgId]);

  return { summary, isLoading, error };
}
