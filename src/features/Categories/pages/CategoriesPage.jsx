import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import { useCategories } from "@/context/CategoryContext";
// import CategoriesTable from "../components/CategoriesTable";
// import CategoryForm from "../components/CategoryForm";

import { Loader } from "@/components/Loader";
import ApiFailure from "@/components/ui/ApiFailure";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import CategoryFilters from "../components/CategoriesFilters";
import CategoriesTable from "../components/CategoriesTables";
import CategoryForm from "../components/CategoryForm";

const CategoriesPage = () => {
    const { categories, fetchCategories, fetchCategory, loading, isError, error } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. PARSE FILTERS FROM URL
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const parentId = searchParams.get("parentId") || "";

    const filters = useMemo(() => ({ search, status, parentId }), [search, status, parentId]);

    const modalType = searchParams.get("modal"); // 'create' or 'edit'
    const editId = searchParams.get("id");

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    // ✅ 2. API CALL ON FILTER CHANGE
    useEffect(() => {
        fetchCategories({ search, status, parentId });
    }, [search, status, parentId, fetchCategories]);

    // ✅ 3. SYNC MODAL DATA FOR EDITING
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetching(true);
                const data = await fetchCategory(editId);
                setSelectedCategory(data);
                setIsFetching(false);
            };
            loadData();
        } else {
            setSelectedCategory(null);
        }
    }, [modalType, editId, fetchCategory]);

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
            <ApiFailure error={error} message="Failed to load categories" onRetry={() => fetchCategories(filters)} />
        </div>
    );

    // Filter top-level categories for the "Parent" filter dropdown
    const parentOptions = categories
        .filter(c => !c.parent_id)
        .map(c => ({ label: c.name, value: c.id }));

    return (
        <div className="space-y-6">
            <PageHeader
                title="Product Categories"
                subtitle="Organize your products into hierarchical groups"
                breadcrumb={"catalog / categories"}
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fetchCategories(filters)}><FiRefreshCw />Refresh </Button>
                        <Button onClick={() => toggleModal()}><FiPlus /> Add Category</Button>
                    </div>
                }
            />

            <CategoryFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                <CategoriesTable
                    categories={categories}
                    onEdit={(cat) => toggleModal(cat.id)}
                />
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeModal}
                title={modalType === "edit" ? "Edit Category" : "Create New Category"}
            >
                {isFetching ? (
                    <div className="py-10 flex justify-center"><Loader /></div>
                ) : (
                    <CategoryForm
                        initialData={selectedCategory}
                        onSuccess={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CategoriesPage;