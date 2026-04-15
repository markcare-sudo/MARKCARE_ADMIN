import apiClient from "@/utils/api";


const getDahsboardStats = async () => {
    return await apiClient.get("/dashboard/stats");
};

const getSubscriptionStats = async () => {
    return await apiClient.get("/subscriptions/graph");
};


const dahsboardService = {
    getDahsboardStats,
    getSubscriptionStats
};

export default dahsboardService;
