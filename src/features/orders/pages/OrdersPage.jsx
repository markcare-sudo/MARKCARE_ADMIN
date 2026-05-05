import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/ui/Button";
// import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import OrdersTable from "../components/OrdersTable";
import OrderFilters from "../components/OrderFilters";
// import OrderDetails from "../components/OrderDetails";

import { useOrder } from "@/context/OrderContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";

import { FiRefreshCw } from "react-icons/fi";

const OrdersPage = () => {
    const {
        orders = [],
        fetchOrders,
        fetchOrderDetails,
        loading,
        isError,
        error
    } = useOrder();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ Filters from URL
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const date = searchParams.get("date") || "";

    const filters = useMemo(
        () => ({ search, status, paymentStatus, date }),
        [search, status, paymentStatus, date]
    );

    const modalType = searchParams.get("modal"); // view
    const orderId = searchParams.get("id");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ Fetch orders on filter change
    useEffect(() => {
        fetchOrders(filters);
    }, [search, status, paymentStatus, date, fetchOrders]);

    // ✅ Load single order (for view modal)
    useEffect(() => {
        if (modalType === "view" && orderId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchOrderDetails(orderId);
                setSelectedOrder(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedOrder(null);
        }
    }, [modalType, orderId]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);

        Object.keys(newFilters).forEach((key) => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    };

    const openOrderPopup = (order = null) => {
        const params = new URLSearchParams(searchParams);

        if (order?.id) {
            params.set("modal", "view");
            params.set("id", order.id);
        }

        setSearchParams(params);
    };

    const closeOrderPopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    if (isError) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <ApiFailure
                    error={error}
                    message="Failed to load orders"
                    onRetry={() => fetchOrders(filters)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <PageHeader
                title="Orders"
                subtitle="Manage customer orders, status, and payments"
                breadcrumb="Sales / Orders"
                action={
                    <Button
                        variant="outline"
                        onClick={() => fetchOrders(filters)}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                }
            />

            {/* FILTERS */}
            <OrderFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            {/* TABLE SECTION */}
            <div className="min-h-[400px] relative">

                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {orders.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={
                                filters.search
                                    ? "No orders match your search"
                                    : "No orders found"
                            }
                        />
                    </div>
                ) : (
                    <OrdersTable
                        orders={orders}
                        onView={openOrderPopup}
                    />
                )}

            </div>

            {/* ORDER DETAILS MODAL */}
            {/* <Modal
                isOpen={!!modalType}
                onClose={closeOrderPopup}
                size="lg"
                title="Order Details"
            >
                {isFetchingSelected ? (
                    <div className="py-20 flex justify-center">
                        <Loader size="md" />
                    </div>
                ) : (
                    <OrderDetails
                        order={selectedOrder}
                        onClose={closeOrderPopup}
                        onRefresh={() => fetchOrders(filters)}
                    />
                )}
            </Modal> */}

        </div>
    );
};

export default OrdersPage;