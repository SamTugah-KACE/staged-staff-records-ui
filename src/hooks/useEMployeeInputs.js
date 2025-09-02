// src/hooks/useEmployeeInputs.js
import { useState, useEffect } from "react";
import request from "../components/request"; // axios with baseURL & withCredentials
import { useAuth } from "../context/AuthContext";



export default function useEmployeeInputs(orgId) {
  const { auth } = useAuth();
  const token = auth.token;

  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!orgId || !token) {
      setLoading(false);
      setError("Missing orgId or authentication");
      return;
    }

    const fetchInitial = async () => {
      try {
        const resp = await request.get("/employee-data-inputs/org/", {
          params: { organization_id: orgId },
        //   headers: { Authorization: `Bearer ${token}` },
        });
        console.log("\n\nresp: ", resp);
        console.log("\n\nresp.data:: ", resp.data);
        setData(resp.data);
      } catch (err) {
        console.error("Failed to fetch inputs:", err);
        setError("Could not load data inputs");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [orgId, token]);

  return { data, loading, error, setData };
}
