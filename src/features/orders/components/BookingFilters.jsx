import GenericFilter from "@/components/ui/GenericFilter";
import { useMemo } from "react";

const BookingFilters = ({ filters, onFilterChange }) => {

    const filterConfig = useMemo(() => [
        {
            name: "search",
            label: "Search Bookings",
            type: "text",
            placeholder: "Search by booking ID or customer...",
        },

        {
            name: "status",
            label: "Booking Status",
            type: "select",
            options: [
                { label: "Pending", value: "PENDING" },
                { label: "Assigned", value: "ASSIGNED" },
                { label: "In Progress", value: "IN_PROGRESS" },
                { label: "Completed", value: "COMPLETED" },
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
            ],
        },

        {
            name: "date",
            label: "Scheduled Date",
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

        // ✅ Optional (very useful)
        {
            name: "paymentMethod",
            label: "Payment Method",
            type: "select",
            options: [
                { label: "Online", value: "ONLINE" },
                { label: "Cash on Service", value: "COD" }, // or COS if you kept it
            ],
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

export default BookingFilters;