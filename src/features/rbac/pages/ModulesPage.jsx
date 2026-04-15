import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import ModuleForm from "../components/ModuleForm";
import ModulesTable from "../components/ModulesTable";
import { useModules } from "@/context/ModulesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import ModuleFilters from "../components/ModuleFilters";

const ModulesPage = () => {
    // ✅ Updated to use granular Context states
    const {
        modules = [],
        fetchModules,
        fetchModule,
        isListLoading,       // List-specific loading
        isListError,         // List-specific error boolean
        listError,           // List-specific error object
        clearModuleActionState // Essential for modal resets
    } = useModules();

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ✅ 1. PARSE FILTERS FROM URL
    const filters = useMemo(() => ({
        search: search || "",
        status: statusParam || "",
        startDate: startDate || "",
        endDate: endDate || ""
    }), [search, statusParam, startDate, endDate]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedModule, setSelectedModule] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
    const filtersKey = JSON.stringify(filters);

    useEffect(() => {
        fetchModules(filters);
    }, [filtersKey, fetchModules]);

    // ✅ 3. SYNC MODAL DATA BASED ON URL ID
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                try {
                    const data = await fetchModule(editId);
                    setSelectedModule(data);
                } finally {
                    setIsFetchingSelected(false);
                }
            };
            loadData();
        } else {
            setSelectedModule(null);
        }
    }, [modalType, editId, fetchModule]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const openModulePopup = (module = null) => {
        const params = new URLSearchParams(searchParams);
        if (module?.id) {
            params.set("modal", "edit");
            params.set("id", module.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeModulePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
        // ✅ CRITICAL: Reset modal/action errors so they don't persist
        clearModuleActionState();
    };

    /** ✅ REFINED ERROR STATE (List-Level) **/
    // We only show the full-screen error if the initial load fails (no data present)
    if (isListError && modules.length === 0) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure
                error={listError}
                message="Error loading modules"
                onRetry={() => fetchModules(filters)}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="System Modules"
                subtitle="Manage high-level platform modules"
                breadcrumb="RBAC / Modules Management"
                action={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => fetchModules(filters)}
                            disabled={isListLoading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={isListLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openModulePopup()}>
                            + Create Module
                        </Button>
                    </>
                }
            />

            <ModuleFilters filters={filters} onFilterChange={updateFilters} />

            <div className="min-h-[400px] relative">
                {/* Overlay Loader specifically for list refreshes */}
                {isListLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {modules.length === 0 && !isListLoading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty message={filters.search ? "No modules match your search" : "No modules available"} />
                    </div>
                ) : (
                    <ModulesTable modules={modules} openModulePopup={openModulePopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeModulePopup}
                title={modalType === "edit" ? "Edit Module" : "Create Module"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 flex justify-center"><Loader size="sm" /></div>
                ) : (
                    <ModuleForm
                        initialData={selectedModule}
                        onSuccess={() => {
                            closeModulePopup();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ModulesPage;