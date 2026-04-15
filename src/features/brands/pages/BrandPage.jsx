import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { useBrands } from "@/context/BrandContext";
import BrandsTable from "../components/BrandsTable";
import BrandForm from "../components/BrandForm";
import { Loader } from "@/components/Loader";
import ApiFailure from "@/components/ui/ApiFailure";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import BrandFilters from "../components/BrandFilters";

const BrandsPage = () => {
    const { brands, fetchBrands, fetchBrand, loading, isError, error } = useBrands();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const filters = useMemo(() => ({ search, status }), [search, status]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => { fetchBrands({ search, status }); }, [search, status, fetchBrands]);

    useEffect(() => {
        if (modalType === "edit" && editId) {
            const load = async () => {
                setIsFetching(true);
                const data = await fetchBrand(editId);
                setSelectedBrand(data);
                setIsFetching(false);
            };
            load();
        } else { setSelectedBrand(null); }
    }, [modalType, editId, fetchBrand]);

    const updateFilters = (newF) => {
        const p = new URLSearchParams(searchParams);
        Object.entries(newF).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k));
        setSearchParams(p, { replace: true });
    };

    const toggleModal = (id = null) => {
        const p = new URLSearchParams(searchParams);
        if (id) { p.set("modal", "edit"); p.set("id", id); }
        else { p.set("modal", "create"); p.delete("id"); }
        setSearchParams(p);
    };

    if (isError) return <ApiFailure error={error} onRetry={() => fetchBrands(filters)} />;

    return (
        <div className="space-y-6">
            <PageHeader title="Brands" breadcrumb={"catalog / brands"} subtitle="Manage product manufacturers" action={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fetchBrands(filters)}><FiRefreshCw />Refresh </Button>
                    <Button onClick={() => toggleModal()}><FiPlus /> Add Brand</Button>
                </div>
            } />

            <BrandFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="relative min-h-[400px]">
                {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"><Loader /></div>}
                <BrandsTable brands={brands} onEdit={(b) => toggleModal(b.id)} />
            </div>

            <Modal isOpen={!!modalType} onClose={() => setSearchParams({})} title={modalType === "edit" ? "Edit Brand" : "Create Brand"}>
                {isFetching ? <Loader /> : <BrandForm initialData={selectedBrand} onSuccess={() => setSearchParams({})} />}
            </Modal>
        </div>
    );
};
export default BrandsPage;