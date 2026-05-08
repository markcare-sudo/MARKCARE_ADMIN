import { apiStatusConstants } from "@/utils/api";
import PlatformDashboardStats from "../components/PlatformDashboardStats";
import SubscriptionsStats from "../components/SubscriptionStats";
import useDashboard from "../useDashboard";
import ApiFailure from "@/components/ui/ApiFailure";
import ApiEmpty from "@/components/ui/ApiEmpty";
import { Loader } from "@/components/Loader";

const PlatformDashboard = () => {

    const {
        stats,
        statsStatus,
        subscriptionStats,
        subscriptionStatus,
        fetchDashboardStats,
        fetchSubscriptionStats,
        error,
    } = useDashboard();

    return (
        <div className="space-y-6">

            {/* Top Stats */}
            <div className="">
                {statsStatus === apiStatusConstants.IN_PROGRESS && <Loader />}

                {statsStatus === apiStatusConstants.FAILURE && (
                    <ApiFailure
                        error={error}
                        message="Failed to load dashboard stats"
                        onRetry={fetchDashboardStats}
                    />
                )}

                {statsStatus === apiStatusConstants.SUCCESS && (
                    <PlatformDashboardStats stats={stats} />
                )}
            </div>

            {/* Middle Section */}
            <div className="grid md:grid-cols-2 gap-4">

                {/* Subscription Card */}
                <div className="">

                    {subscriptionStatus === apiStatusConstants.IN_PROGRESS && <Loader />}

                    {subscriptionStatus === apiStatusConstants.FAILURE && (
                        <ApiFailure
                            error={error}
                            message="Failed to load subscription stats"
                            onRetry={fetchSubscriptionStats}
                        />
                    )}

                    {subscriptionStatus === apiStatusConstants.SUCCESS &&
                        subscriptionStats?.total === 0 && (
                            <ApiEmpty message="No subscriptions available" />
                        )}

                    {subscriptionStatus === apiStatusConstants.SUCCESS &&
                        subscriptionStats?.total > 0 && (
                            <SubscriptionsStats subscriptionStats={subscriptionStats} />
                        )}

                </div>

                {/* System Health */}
                <div className="bg-white rounded shadow p-6">
                    System Health
                </div>

            </div>
        </div>
    );
};

export default PlatformDashboard;