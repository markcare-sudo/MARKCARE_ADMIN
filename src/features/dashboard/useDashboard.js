import { useEffect, useState } from "react";
import dahsboardService from "./dashboard.service";
import { apiStatusConstants } from "@/utils/api";

const useDashboard = () => {

    const [stats, setDashboardStats] = useState(null);
    const [subscriptionStats, setSubscriptionStats] = useState(null);

    const [statsStatus, setStatsStatus] = useState(apiStatusConstants.INITIAL);
    const [subscriptionStatus, setSubscriptionStatus] = useState(apiStatusConstants.INITIAL);
    const [error, setError] = useState(null);

    const fetchDashboardStats = async () => {
        setStatsStatus(apiStatusConstants.IN_PROGRESS);

        try {
            const res = await dahsboardService.getDahsboardStats();
            setDashboardStats(res.data.data);
            setStatsStatus(apiStatusConstants.SUCCESS);
        } catch (error) {
            setError(error);
            setStatsStatus(apiStatusConstants.FAILURE);
        } finally {
            setStatsStatus(apiStatusConstants.SUCCESS);
        }
    };

    const fetchSubscriptionStats = async () => {
        setSubscriptionStatus(apiStatusConstants.IN_PROGRESS);
        try {
            const res = await dahsboardService.getSubscriptionStats();
            setSubscriptionStatus(apiStatusConstants.SUCCESS);
            setSubscriptionStats(res.data.data);
        } catch (error) {
            setError(error);
            setSubscriptionStatus(apiStatusConstants.FAILURE);
        } finally {
            setSubscriptionStatus(apiStatusConstants.SUCCESS);
        }
    };

    useEffect(() => {
        fetchDashboardStats()
        fetchSubscriptionStats()
    }, [])

    return {
        error,
        stats,
        subscriptionStats,
        statsStatus,
        subscriptionStatus,
        fetchDashboardStats,
        fetchSubscriptionStats
    };
};

export default useDashboard;