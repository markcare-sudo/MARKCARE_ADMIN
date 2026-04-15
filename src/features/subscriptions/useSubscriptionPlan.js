import { useState, useEffect, useCallback } from "react";
import { apiStatusConstants } from "@/utils/api";
import toast from "react-hot-toast";
import subscriptionPlanService from "./subscriptionPlan.service";

const useSubscriptionPlan = () => {
    // 1. Data States
    const [plans, setPlans] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

    // 2. Status States
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [error, setError] = useState(null);

    // --- Core Functions ---

    const getPlans = useCallback(async (params = {}) => {
        setStatus(apiStatusConstants.IN_PROGRESS);
        setError(null);

        try {
            const res = await subscriptionPlanService.getSubscriptionPlans(params);
            const result = res.data?.data || res.data;

            if (result && result.rows) {
                setPlans(result.rows);
                setPagination(result.pagination || { totalPages: 1, totalItems: result.count || 0 });
            } else {
                setPlans(Array.isArray(result) ? result : []);
            }

            setStatus(apiStatusConstants.SUCCESS);
        } catch (error) {
            setError(error);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, []);

    // --- Action Functions ---

    const createPlan = async (data) => {
        try {
            await subscriptionPlanService.createSubscriptionPlan(data);
            toast.success("Plan created successfully!");
            refreshAll();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create plan");
            throw error;
        }
    };

    const updatePlan = async (id, data) => {
        try {
            await subscriptionPlanService.updateSubscriptionPlan(id, data);
            toast.success("Plan updated successfully!");
            refreshAll();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update plan");
            throw error;
        }
    };

    const deletePlan = async (id) => {
        try {
            await subscriptionPlanService.deleteSubscriptionPlan(id);
            toast.success("Plan deleted successfully!");
            refreshAll();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete plan");
            throw error;
        }
    };

    // Helper to sync both data calls
    const refreshAll = useCallback(() => {
        getPlans({ page: 1 });
    }, [getPlans]);

    // Initial Load
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    // --- Return Object ---
    return {
        // Data
        plans,
        pagination,

        // Actions
        getPlans,
        createPlan,
        updatePlan,
        deletePlan,
        refresh: refreshAll,

        // Status Helpers
        status,
        error,
        isLoading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && plans.length === 0
    };
};

export default useSubscriptionPlan;