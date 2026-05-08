import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

// UI Components
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";

// Domain Components
import BlogForm from "../components/BlogForm";
import BlogsTable from "../components/BlogsTable";
import BlogFilters from "../components/BlogFilters";

// Hooks/Context
import { useBlogs } from "@/context/BlogContext";

const BlogsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { blogs = [], fetchBlogs, fetchBlog, loading, isError, error } = useBlogs();

    // --- State ---
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // --- Memoized Filters ---
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
        category: searchParams.get("category") || "",
        tag: searchParams.get("tag") || "",
        keyword: searchParams.get("keyword") || "",
    }), [searchParams]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    // --- Actions ---
    const handleUpdateFilters = useCallback((newFilters) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams]);

    const handleOpenModal = (blog = null) => {
        const params = new URLSearchParams(searchParams);
        if (blog?.id) {
            params.set("modal", "edit");
            params.set("id", blog.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const handleCloseModal = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    // --- Side Effects ---
    useEffect(() => {
        fetchBlogs(filters);
    }, [filters, fetchBlogs]);

    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                try {
                    const data = await fetchBlog(editId);
                    setSelectedBlog(data);
                } finally {
                    setIsFetchingSelected(false);
                }
            };
            loadData();
        } else {
            setSelectedBlog(null);
        }
    }, [modalType, editId]);

    // --- Render Helpers ---
    if (isError) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <ApiFailure
                    error={error}
                    message="Failed to load blogs"
                    onRetry={() => fetchBlogs(filters)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Blogs"
                subtitle="Manage blog articles, SEO tags, and publishing"
                breadcrumb="CMS / Blogs"
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => fetchBlogs(filters)}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2"
                        >
                            <FiPlus />
                            Create Blog
                        </Button>
                    </div>
                }
            />

            <BlogFilters
                filters={filters}
                onFilterChange={handleUpdateFilters}
            />

            <div className="min-h-[400px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {blogs.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty message={filters.search ? "No blogs match search" : "No blogs found"} />
                    </div>
                ) : (
                    <BlogsTable blogs={blogs} onEdit={handleOpenModal} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={handleCloseModal}
                width="max-w-5xl"
                title={modalType === "edit" ? "Edit Blog" : "Create New Blog"}
            >
                {isFetchingSelected ? (
                    <div className="py-20 flex justify-center">
                        <Loader size="md" />
                    </div>
                ) : (
                    <BlogForm
                        initialData={selectedBlog}
                        onSuccess={() => {
                            handleCloseModal();
                            fetchBlogs(filters);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default BlogsPage;