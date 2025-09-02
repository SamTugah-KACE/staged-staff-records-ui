import request from "../request";

export const fetchSummaryData = async (token) => {
    const response = await request.get('/api/dashboard/summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  };