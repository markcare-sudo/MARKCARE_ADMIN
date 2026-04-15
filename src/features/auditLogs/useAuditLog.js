import { useState, useEffect, useCallback } from "react";
import { apiStatusConstants } from "@/utils/api";
import auditLogsService from "./audit-log.service";

const useAuditLogs = () => {
    const [logs, setAuditLogs] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 }); // New state
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [error, setError] = useState(null);

    const fetchAuditLogs = useCallback(async (params = {}) => {
        setStatus(apiStatusConstants.IN_PROGRESS);
        setError(null);

        try {
            const res = await auditLogsService.getAuditLogs(params);

            // Your service now returns { rows, pagination } inside res.data
            const result = res.data.data;

            if (result && result.rows) {
                setAuditLogs(result.rows);
                setPagination(result.pagination || { totalPages: 1 });
            } else {
                // Fallback for different API structures
                setAuditLogs(Array.isArray(result) ? result : []);
            }

            setStatus(apiStatusConstants.SUCCESS);
        } catch (error) {
            setError(error);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchAuditLogs({ page: 1 });
    }, [fetchAuditLogs]);

    return {
        logs,
        pagination,
        status,
        error,
        fetchAuditLogs,
        isLoading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && logs.length === 0
    };
};

export default useAuditLogs;