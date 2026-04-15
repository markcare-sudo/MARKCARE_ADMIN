import { useState, useCallback, useEffect } from "react";
import AuditLogsTable from "../components/AuditLogsTable";
import useAuditLogs from "../useAuditLog";
import Button from "@/components/ui/Button";
import { apiStatusConstants } from "@/utils/api";
import { FiRefreshCw } from "react-icons/fi";
import PageHeader from "@/components/ui/PageHeader";
import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import AuditLogsFilters from "../components/AuditLogsFilters";
import Pagination from "@/components/ui/Pagination";

const AuditLogsPage = () => {
  const [currentFilters, setCurrentFilters] = useState({});
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const {
    logs,
    status,
    fetchAuditLogs,
    isLoading,
    isEmpty,
    pagination
  } = useAuditLogs();

  // Function to handle fetching with merged state
  const loadData = useCallback((filters, pageNum) => {
    fetchAuditLogs({ ...filters, page: pageNum });
  }, [fetchAuditLogs]);

  const handleFilterChange = useCallback((newFilters) => {
    const cleanFilters = { ...newFilters };
    setCurrentFilters(cleanFilters);
    setPage(1); // Reset to first page
    loadData(cleanFilters, 1);
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadData(currentFilters, newPage);
  };

  const handleRefresh = () => {
    loadData(currentFilters, page);
  };

  const renderTable = () => (
    <div className={`transition-all duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}>
      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <AuditLogsTable
          logs={logs}
          openViewModal={setSelectedLog}
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
    if (status === apiStatusConstants.IN_PROGRESS && logs.length === 0) {
      return <Loader />;
    }

    if (status === apiStatusConstants.FAILURE) {
      return <ApiFailure onRetry={handleRefresh} className="py-20" />;
    }

    if (status === apiStatusConstants.SUCCESS && isEmpty) {
      return <ApiEmpty message="No logs found matching your criteria." className="py-20" />;
    }

    return renderTable();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activities and data changes"
        breadcrumb="System / Audit Logs"
        action={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />

      <AuditLogsFilters onFilterChange={handleFilterChange} />

      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuditLogsPage;