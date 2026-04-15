import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import ProductForm from "../components/ProductForm";
import ProductsTable from "../components/ProductsTable";
import { useProducts } from "@/context/ProductContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import ProductFilters from "../components/ProductsFilters";

const ProductsPage = () => {
    const { products = [], fetchProducts, fetchProduct, loading, isError, error } = useProducts();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. PARSE FILTERS FROM URL
    const search = searchParams.get("search") || "";
    const brandId = searchParams.get("brandId") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    const filters = useMemo(() => ({ search, brandId, type, status }), [search, brandId, type, status]);

    const modalType = searchParams.get("modal"); // 'create' or 'edit'
    const editId = searchParams.get("id");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. API CALL ON FILTER CHANGE
    useEffect(() => {
        fetchProducts({ search, brandId, type, status });
    }, [search, brandId, type, status, fetchProducts]);

    // ✅ 3. SYNC MODAL DATA (Fetches full Product + Variants + Images)
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchProduct(editId);
                setSelectedProduct(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedProduct(null);
        }
    }, [modalType, editId]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const openProductPopup = (product = null) => {
        const params = new URLSearchParams(searchParams);
        if (product?.id) {
            params.set("modal", "edit");
            params.set("id", product.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeProductPopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    if (isError) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure error={error} message="Failed to load catalog" onRetry={() => fetchProducts(filters)} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Product Catalog"
                subtitle="Manage your base products, variants, and stock"
                breadcrumb="Catalog / Products"
                action={
                    <>
                        <Button variant="outline" onClick={() => fetchProducts(filters)} disabled={loading} className="flex items-center gap-2">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openProductPopup()} className="flex items-center gap-2">
                            <FiPlus /> Create Product
                        </Button>
                    </>
                }
            />

            <ProductFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="min-h-[400px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {products.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty message={filters.search ? "No products match your search" : "Your catalog is empty"} />
                    </div>
                ) : (
                    <ProductsTable products={products} onEdit={openProductPopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeProductPopup}
                size="lg" // Catalog forms are usually larger
                title={modalType === "edit" ? "Edit Product Details" : "Add New Product to Catalog"}
            >
                {isFetchingSelected ? (
                    <div className="py-20 flex justify-center"><Loader size="md" /></div>
                ) : (
                    <ProductForm
                        initialData={selectedProduct}
                        onSuccess={() => {
                            closeProductPopup();
                            fetchProducts(filters);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductsPage;