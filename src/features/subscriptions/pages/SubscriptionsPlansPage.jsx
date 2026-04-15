import { useState, useCallback } from "react";
import SubscriptionsTable from "../components/SubscriptionPlansTable";
import Button from "@/components/ui/Button";
import { apiStatusConstants } from "@/utils/api";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";
import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import SubscriptionsFilters from "../components/SubscriptionPlansFilters";
import AddSubscriptionModal from "../components/AddSubscriptionModal";
import Pagination from "@/components/ui/Pagination";
import useSubscriptionPlan from "../useSubscriptionPlan";

const SubscriptionsPage = () => {
  const [currentFilters, setCurrentFilters] = useState({});
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    plans,
    status,
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    refresh,
    isLoading,
    isEmpty,
    pagination
  } = useSubscriptionPlan();

  // Helper to load data with filters and page
  const loadData = useCallback((filters, pageNum) => {
    getPlans({ ...filters, page: pageNum });
  }, [getPlans]);

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentFilters(newFilters);
    setPage(1);
    loadData(newFilters, 1);
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadData(currentFilters, newPage);
  };

  const handleAddClick = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (id, payload) => {
    try {
      if (id) {
        await updatePlan(id, payload);
      } else {
        await createPlan(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save plan:", err);
    }
  };

  const handleDeleteClick = async (plan) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      await deletePlan(plan.id);
    }
  };

  const renderTable = () => (
    <div className={`transition-all duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}>
      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <SubscriptionsTable
          subscriptions={plans} // Passing 'plans' from hook
          onEdit={handleEditClick}
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
    // Show loader only on initial load or when list is empty
    if (isLoading && plans.length === 0) {
      return <Loader />;
    }

    if (status === apiStatusConstants.FAILURE) {
      return <ApiFailure onRetry={refresh} className="py-20" />;
    }

    if (status === apiStatusConstants.SUCCESS && isEmpty) {
      return <ApiEmpty message="No subscription plans found matching your criteria." className="py-20" />;
    }

    return renderTable();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Subscription Plans"
        subtitle="Manage available subscription plans and pricing"
        breadcrumb="System / Subscriptions"
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>

            <Button
              variant="primary"
              onClick={handleAddClick}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FiPlus />
              Create Plan
            </Button>
          </div>
        }
      />

      {/* Passing the corrected planStats to your stats component if you uncomment it */}
      {/* <SubscriptionsStats stats={planStats} /> */}

      <SubscriptionsFilters
        onFilterChange={handleFilterChange}
        onAdd={handleAddClick}
      />

      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriptionData={selectedPlan}
        onSave={handleSaveModal}
      />
    </div>
  );
};

export default SubscriptionsPage;