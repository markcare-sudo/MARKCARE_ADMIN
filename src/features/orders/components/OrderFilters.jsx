import GenericFilter from "@/components/ui/GenericFilter";
import { useMemo } from "react";

const OrderFilters = ({ filters, onFilterChange }) => {

    // 1. Define Order Filter Configuration
    const filterConfig = useMemo(() => [
        {
            name: "search",
            label: "Search Orders",
            type: "text",
            placeholder: "Search by order ID or customer...",
        },

        {
            name: "status",
            label: "Order Status",
            type: "select",
            options: [
                { label: "Pending", value: "PENDING" },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Processing", value: "PROCESSING" },
                { label: "Shipped", value: "SHIPPED" },
                { label: "Delivered", value: "DELIVERED" },
                { label: "Cancelled", value: "CANCELLED" },
            ],
        },

        {
            name: "paymentStatus",
            label: "Payment Status",
            type: "select",
            options: [
                { label: "Paid", value: "PAID" },
                { label: "Pending", value: "PENDING" },
                { label: "Failed", value: "FAILED" },
                { label: "Refunded", value: "REFUNDED" },
            ],
        },

        {
            name: "date",
            label: "Order Date",
            type: "date",
        },

        {
            name: "startDate",
            label: "From Date",
            type: "date",
        },

        {
            name: "endDate",
            label: "To Date",
            type: "date",
        },
    ], []);

    return (
        <GenericFilter
            fields={filterConfig}
            filters={filters}
            onFilterChange={onFilterChange}
        />
    );
};

export default OrderFilters;