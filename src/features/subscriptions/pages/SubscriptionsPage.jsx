import { useState, useCallback } from "react";
import SubscriptionsTable from "../components/SubscriptionsTable";
import Button from "@/components/ui/Button";
import { apiStatusConstants } from "@/utils/api";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";
import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import SubscriptionsFilters from "../components/SubscriptionsFilters";
import AddSubscriptionModal from "../components/AddSubscriptionModal";
import Pagination from "@/components/ui/Pagination";
import SubscriptionsStats from "../components/SubscriptionsStats";
import useSubscriptions from "../useSubscription";
import useSubscriptionPlan from "../useSubscriptionPlan";

const SubscriptionsPage = () => {
    const [currentFilters, setCurrentFilters] = useState({});
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const {
        subscriptions,
        stats,
        status,
        fetchSubscriptions,
        addSubscription,
        editSubscription,
        removeSubscription,
        updateSubscription,
        refresh,
        isLoading,
        isEmpty,
        pagination
    } = useSubscriptions();

    const { plans } = useSubscriptionPlan()

    const loadData = useCallback((filters, pageNum) => {
        fetchSubscriptions({ ...filters, page: pageNum });
    }, [fetchSubscriptions]);

    const handleFilterChange = useCallback((newFilters) => {
        const cleanFilters = { ...newFilters };
        setCurrentFilters(cleanFilters);
        setPage(1);
        loadData(cleanFilters, 1);
    }, [loadData]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadData(currentFilters, newPage);
    };

    const handleRefresh = () => {
        refresh();
    };

    const handleAddClick = () => {
        setSelectedSubscription(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (subscription) => {
        setSelectedSubscription(subscription);
        setIsModalOpen(true);
    };

    const handleSaveModal = async (id, payload) => {
        if (id) {
            await editSubscription(id, payload);
        } else {
            await addSubscription(payload);
        }
    };

    const handleUpdateClick = async (subscription, status) => {
        await updateSubscription(subscription.tenant_id, subscription.id, status);
    };

    const handleDeleteClick = async (subscription) => {
        await removeSubscription(subscription.tenant_id, subscription.id);
    };

    const renderTable = () => (
        <div className={`transition-all duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}>
            <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
                <SubscriptionsTable
                    subscriptions={subscriptions}
                    onEdit={handleEditClick}
                    onUpdate={handleUpdateClick}
                    onDelete={handleDeleteClick}
                />

                <Pagination
                    currentPage={page}
                    totalPages={pagination?.totalPages || 1}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );

    const renderContent = () => {
        if (status === apiStatusConstants.IN_PROGRESS && subscriptions.length === 0) {
            return <Loader />;
        }

        if (status === apiStatusConstants.FAILURE) {
            return <ApiFailure onRetry={handleRefresh} className="py-20" />;
        }

        if (status === apiStatusConstants.SUCCESS && isEmpty) {
            return <ApiEmpty message="No subscription plans found matching your criteria." className="py-20" />;
        }

        return renderTable();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Subscriptions"
                subtitle="Manage available subscriptions and pricing"
                breadcrumb="System / Subscriptions"
                action={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>

                        {/* <Button
                            variant="primary"
                            onClick={handleAddClick}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <FiPlus />
                            Create Plan
                        </Button> */}
                    </div>
                }
            />

            <SubscriptionsStats stats={stats} />
            <SubscriptionsFilters
                onFilterChange={handleFilterChange}
                plans={plans}
                onAdd={handleAddClick}
            />

            <div className="min-h-[400px]">
                {renderContent()}
            </div>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subscriptionData={selectedSubscription}
                onSave={handleSaveModal}
            />
        </div>
    );
};

export default SubscriptionsPage;
