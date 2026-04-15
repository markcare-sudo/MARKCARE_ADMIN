import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import FeatureForm from "../components/FeatureForm";
import FeaturesTable from "../components/FeaturesTable";
import { useFeatures } from "@/context/FeatureContext";
import { useModules } from "@/context/ModulesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import FeatureFilters from "../components/FeaturesFilters";


const FeaturesPage = () => {
    // ✅ Updated to use granular states from your corrected Context
    const {
        features = [],
        fetchFeatures,
        fetchFeature,
        isListLoading,        // Specifically for the table/list
        isListError,          // Specifically for the table/list
        listError,            // The actual error object for the list
        clearFeatureActionState // To reset modal/action errors on close
    } = useFeatures();

    const { modules = [] } = useModules();

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search");
    const moduleId = searchParams.get("moduleId");
    const statusParam = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ✅ 1. READ FILTERS FROM URL
    const filters = useMemo(() => ({
        search: search || "",
        moduleId: moduleId || "",
        status: statusParam || "",
        startDate: startDate || "",
        endDate: endDate || ""
    }), [search, moduleId, statusParam, startDate, endDate]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
    const filtersKey = JSON.stringify(filters);

    useEffect(() => {
        fetchFeatures(filters);
    }, [filtersKey, fetchFeatures]);

    // ✅ 3. SYNC MODAL DATA BASED ON URL ID
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                try {
                    const data = await fetchFeature(editId);
                    setSelectedFeature(data);
                } finally {
                    setIsFetchingSelected(false);
                }
            };
            loadData();
        } else {
            setSelectedFeature(null);
        }
    }, [modalType, editId, fetchFeature]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const openFeaturePopup = (feature = null) => {
        const params = new URLSearchParams(searchParams);
        if (feature?.id) {
            params.set("modal", "edit");
            params.set("id", feature.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeFeaturePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
        // ✅ Reset action errors so they don't persist when reopening the modal
        clearFeatureActionState();
    };

    /** ✅ REFINED ERROR STATE (List Level Only) **/
    if (isListError && features.length === 0) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure
                error={listError}
                message="Error loading features"
                onRetry={() => fetchFeatures(filters)}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Features"
                subtitle="Manage specific functionalities within modules"
                breadcrumb="RBAC / Features Management"
                action={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => fetchFeatures(filters)}
                            disabled={isListLoading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={isListLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openFeaturePopup()}>
                            + Create Feature
                        </Button>
                    </>
                }
            />

            <FeatureFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="min-h-[400px] relative">
                {/* ✅ LOADING OVERLAY (UX improvement for API filtering) */}
                {isListLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {features.length === 0 && !isListLoading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={filters.search ? "No features match your search" : "No features available"}
                        />
                    </div>
                ) : (
                    <FeaturesTable features={features} openFeaturePopup={openFeaturePopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeFeaturePopup}
                title={modalType === "edit" ? "Edit Feature" : "Create Feature"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 text-center"><Loader size="sm" /></div>
                ) : (
                    <FeatureForm
                        initialData={selectedFeature}
                        modules={modules}
                        onSuccess={() => {
                            closeFeaturePopup();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default FeaturesPage;