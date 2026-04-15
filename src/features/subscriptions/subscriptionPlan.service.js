import apiClient from "@/utils/api";

const getSubscriptionPlans = async (params = {}) => {
    return await apiClient.get("/subscription-plans", { params });
};

const getSubscriptionPlanById = async (id) => {
    return await apiClient.get(`/subscription-plans/${id}`);
};

const createSubscriptionPlan = async (data) => {
    return await apiClient.post("/subscription-plans", data);
};

const updateSubscriptionPlan = async (id, data) => {
    return await apiClient.put(`/subscription-plans/${id}`, data);
};

const getSubscriptionPlanStats = async () => {
    return await apiClient.get("/subscription-plans/stats");
};

const deleteSubscriptionPlan = async (id) => {
    return await apiClient.delete(`/subscription-plans/${id}`);
};

const subscriptionPlanService = {
    getSubscriptionPlans,
    getSubscriptionPlanById,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    getSubscriptionPlanStats,
    deleteSubscriptionPlan,
};

export default subscriptionPlanService;
