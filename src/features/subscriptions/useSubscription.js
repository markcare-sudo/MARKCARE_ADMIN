import { useState, useEffect, useCallback } from "react";
import { apiStatusConstants } from "@/utils/api";
import subscriptionService from "./subscription.service";
import toast from "react-hot-toast";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";

const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, inactive: 0 });
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await subscriptionService.getSubscriptionStats();
            if (res.data?.data) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch subscription stats", err);
        }
    }, []);

    const fetchSubscriptions = useCallback(async (params = {}) => {
        setStatus(apiStatusConstants.IN_PROGRESS);
        setError(null);

        try {
            const res = await subscriptionService.getSubscriptions(params);
            const result = res.data?.data || res.data;

            if (result && result.rows) {
                setSubscriptions(result.rows);
                setPagination(result.pagination || { totalPages: 1, totalItems: result.count || 0 });
            } else {
                setSubscriptions(Array.isArray(result) ? result : []);
            }

            setStatus(apiStatusConstants.SUCCESS);
        } catch (error) {
            setError(error);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, []);

    const addSubscription = async (data) => {
        try {
            await subscriptionService.createSubscription(data);
            toast.success("Subscription created successfully!");
            fetchSubscriptions({ page: 1 });
            fetchStats();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create subscription");
            throw error;
        }
    };

    const editSubscription = async (id, data) => {
        try {
            const res = await subscriptionService.updateSubscription(id, data);
            successHandler(res)
            fetchSubscriptions({ page: 1 });
            fetchStats();
        } catch (error) {
            postErrorHandler(error)
            throw error;
        }
    };

    const updateSubscription = async (tenantId, id, status) => {
        try {
            const res = await subscriptionService.updateSubscriptionStatus(tenantId, id, status);
            successHandler(res)
            fetchSubscriptions({ page: 1 });
            fetchStats();
        } catch (error) {
            postErrorHandler(error)
            throw error;
        }
    };

    const removeSubscription = async (tenantId, id) => {
        try {
            const res = await subscriptionService.deleteSubscription(tenantId, id);
            successHandler(res)
            fetchSubscriptions({ page: 1 });
            fetchStats();
        } catch (error) {
            postErrorHandler(error)
            throw error;
        }
    };

    useEffect(() => {
        fetchSubscriptions({ page: 1 });
        fetchStats();
    }, [fetchSubscriptions, fetchStats]);

    return {
        subscriptions,
        stats,
        pagination,
        status,
        error,
        fetchSubscriptions,
        addSubscription,
        editSubscription,
        updateSubscription,
        removeSubscription,
        refresh: () => {
            fetchSubscriptions({ page: 1 });
            fetchStats();
        },
        isLoading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && subscriptions.length === 0
    };
};

export default useSubscriptions;
