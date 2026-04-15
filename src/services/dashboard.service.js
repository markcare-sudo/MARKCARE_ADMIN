import apiClient from "../utils/api";


const getStats = async () => {
  return await apiClient.get("/api/dashboard/stats");
};

const dashboardService = {
  getStats,
};

export default dashboardService;
