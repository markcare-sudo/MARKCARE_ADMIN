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
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const ModulesPage = () => {
    const {
        modules = [],
        fetchModules,
        fetchModule,
        isListLoading,
        isListError,
        listError,
        clearModuleActionState,
        deleteModules,
    } = useModules();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ UPDATED FILTERS (aligned with module model)
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        navigation_type: searchParams.get("navigation_type") || "",
        is_active: searchParams.get("is_active") || "",
    }), [searchParams]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedModule, setSelectedModule] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // ✅ FETCH MODULE LIST
    useEffect(() => {
        fetchModules(filters);
    }, [JSON.stringify(filters)]);

    // ✅ FETCH SINGLE MODULE FOR EDIT
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
    }, [modalType, editId]);

    // ✅ UPDATE FILTERS IN URL
    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);

        Object.keys(newFilters).forEach((key) => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    };

    // ✅ OPEN MODAL
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

    // ✅ CLOSE MODAL
    const closeModulePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);

        clearModuleActionState(); // reset errors/loading
    };

    const handleDeleteAll = async () => {
        try {
            setLoadingDelete(true);

            await deleteModules(); // 🔥 your API call

            setShowDeleteDialog(false);

            // optional: refresh list
            fetchModules();

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDelete(false);
        }
    };

    // ✅ ERROR STATE
    if (isListError && modules.length === 0) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <ApiFailure
                    error={listError}
                    message="Error loading modules"
                    onRetry={() => fetchModules(filters)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ✅ HEADER */}
            <PageHeader
                title="Module Management"
                subtitle="Manage navigation, hierarchy, and system features"
                breadcrumb="RBAC / Modules"
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

                        <Button
                            variant="primary"
                            onClick={() => openModulePopup()}
                            disabled={isListLoading}
                        >
                            + Create Module
                        </Button>
                    </>
                }
            />

            {/* ✅ FILTERS */}
            <ModuleFilters filters={filters} onFilterChange={updateFilters} onDeleteAll={() => setShowDeleteDialog(true)} />

            {/* ✅ TABLE / LIST */}
            <div className="min-h-[400px] relative">

                {/* Loader overlay */}
                {isListLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {/* Empty */}
                {modules.length === 0 && !isListLoading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={
                                filters.search
                                    ? "No modules match your search"
                                    : "No modules created yet. Start by adding your first module."
                            }
                        />
                    </div>
                ) : (
                    <ModulesTable
                        modules={modules}
                        openModulePopup={openModulePopup}
                    />
                )}
            </div>

            {/* ✅ MODAL */}
            <Modal
                isOpen={!!modalType}
                onClose={closeModulePopup}
                title={modalType === "edit" ? "Edit Module" : "Create Module"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 flex justify-center">
                        <Loader size="sm" />
                    </div>
                ) : (
                    <ModuleForm
                        initialData={selectedModule}
                        modules={modules}   // 🔥 IMPORTANT (for parent selection)
                        onSuccess={closeModulePopup}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete All Modules"
                message="This will permanently delete all modules and permissions. This action cannot be undone."
                confirmText="Delete All"
                cancelText="Cancel"
                onConfirm={handleDeleteAll}
                onCancel={() => setShowDeleteDialog(false)}
                loading={loadingDelete}
            />
        </div>
    );
};

export default ModulesPage;