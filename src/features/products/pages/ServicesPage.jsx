import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import ServiceForm from "../components/ServiceForm";
import ServicesTable from "../components/ServicesTable";

import { useServices } from "@/context/ServiceContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";

import { FiRefreshCw, FiPlus } from "react-icons/fi";
import ServiceFilters from "../components/ServiceFilters";

const ServicesPage = () => {
    const {
        services = [],
        fetchServices,
        fetchService,
        loading,
        isError,
        error
    } = useServices();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ FILTERS FROM URL
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    const filters = useMemo(() => ({ search, type, status }), [search, type, status]);

    const modalType = searchParams.get("modal"); // create / edit
    const editId = searchParams.get("id");

    const [selectedService, setSelectedService] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ FETCH SERVICES
    useEffect(() => {
        fetchServices({ search, type, status });
    }, [search, type, status, fetchServices]);

    // ✅ FETCH SINGLE SERVICE (EDIT)
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchService(editId);
                setSelectedService(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedService(null);
        }
    }, [modalType, editId]);

    // ✅ UPDATE FILTERS
    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);

        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    };

    // ✅ OPEN MODAL
    const openServicePopup = (service = null) => {
        const params = new URLSearchParams(searchParams);

        if (service?.id) {
            params.set("modal", "edit");
            params.set("id", service.id);
        } else {
            params.set("modal", "create");
        }

        setSearchParams(params);
    };

    // ✅ CLOSE MODAL
    const closeServicePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    // ✅ ERROR UI
    if (isError) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <ApiFailure
                    error={error}
                    message="Failed to load services"
                    onRetry={() => fetchServices(filters)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <PageHeader
                title="Services Management"
                subtitle="Manage all service offerings, pricing and plans"
                breadcrumb="Catalog / Services"
                action={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => fetchServices(filters)}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => openServicePopup()}
                            className="flex items-center gap-2"
                        >
                            <FiPlus /> Create Service
                        </Button>
                    </>
                }
            />

            {/* FILTERS */}
            <ServiceFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            {/* TABLE */}
            <div className="min-h-[400px] relative">

                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {services.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={
                                filters.search
                                    ? "No services match your search"
                                    : "No services available"
                            }
                        />
                    </div>
                ) : (
                    <ServicesTable
                        services={services}
                        onEdit={openServicePopup}
                    />
                )}
            </div>

            {/* MODAL */}
            <Modal
                isOpen={!!modalType}
                onClose={closeServicePopup}
                size="lg"
                title={
                    modalType === "edit"
                        ? "Edit Service"
                        : "Create New Service"
                }
            >
                {isFetchingSelected ? (
                    <div className="py-20 flex justify-center">
                        <Loader size="md" />
                    </div>
                ) : (
                    <ServiceForm
                        initialData={selectedService}
                        onSuccess={() => {
                            closeServicePopup();
                            fetchServices(filters);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ServicesPage;