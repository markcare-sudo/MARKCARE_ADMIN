import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

// Hooks / Context for Callback Requests (Replace with your actual context)
import { useCallbackRequests } from "@/context/CallbackRequestContext";

import { Loader } from "@/components/Loader";
import ApiFailure from "@/components/ui/ApiFailure";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import CallbackFilters from "../components/CallBackRequestFilters";
import CallbackRequestsTable from "../components/CallBackRequestTables";
import CallbackRequestForm from "../components/CallBackRequestForm";

// Components to be created/adapted for Callback Requests
// import CallbackFilters from "../components/CallbackFilters";
// import CallbackRequestsTable from "../components/CallbackRequestsTable";
// import CallbackRequestForm from "../components/CallbackRequestForm";

const CallBackRequestsPage = () => {
    const {
        requests,
        fetchRequests,
        fetchRequest,
        loading,
        isError,
        error
    } = useCallbackRequests();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. PARSE FILTERS FROM URL (Matches your Sequelize indexes/fields)
    const search = searchParams.get("search") || ""; // Can query product name/email/phone
    const status = searchParams.get("status") || ""; // NEW, CONTACTED, CLOSED
    const source = searchParams.get("source") || ""; // WEBSITE, WHATSAPP, PHONE

    const filters = useMemo(() => ({ search, status, source }), [search, status, source]);

    const modalType = searchParams.get("modal"); // 'create' or 'edit'
    const editId = searchParams.get("id");

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    // ✅ 2. API CALL ON FILTER CHANGE
    useEffect(() => {
        fetchRequests({ search, status, source });
    }, [search, status, source, fetchRequests]);

    // ✅ 3. SYNC MODAL DATA FOR DETAILS/EDITING
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetching(true);
                const data = await fetchRequest(editId);
                setSelectedRequest(data);
                setIsFetching(false);
            };
            loadData();
        } else {
            setSelectedRequest(null);
        }
    }, [modalType, editId, fetchRequest]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const toggleModal = (id = null) => {
        const params = new URLSearchParams(searchParams);
        if (id) {
            params.set("modal", "edit");
            params.set("id", id);
        } else {
            params.set("modal", "create");
            params.delete("id");
        }
        setSearchParams(params);
    };

    const closeModal = () => {
        setSearchParams({}, { replace: true });
    };

    if (isError) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure
                error={error}
                message="Failed to load callback requests"
                onRetry={() => fetchRequests(filters)}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Call Back Requests"
                subtitle="Manage customer callback inquiries, outreach status, and lead streams"
                breadcrumb={"enquiry / callback-requests"}
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fetchRequests(filters)}>
                            <FiRefreshCw /> Refresh
                        </Button>
                        <Button onClick={() => toggleModal()}>
                            <FiPlus /> Log Request
                        </Button>
                    </div>
                }
            />

            <CallbackFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                <CallbackRequestsTable
                    requests={requests}
                    onEdit={(req) => toggleModal(req.id)}
                />
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeModal}
                title={modalType === "edit" ? "Update Callback Status" : "Log Manual Callback"}
            >
                {isFetching ? (
                    <div className="py-10 flex justify-center"><Loader /></div>
                ) : (
                    <CallbackRequestForm
                        initialData={selectedRequest}
                        onSuccess={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CallBackRequestsPage;