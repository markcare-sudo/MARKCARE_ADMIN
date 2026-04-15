import GenericFilter from "@/components/ui/GenericFilter";

const ServiceFilters = ({ filters, onFilterChange }) => {

    // ✅ FILTER CONFIG FOR SERVICES
    const filterConfig = [
        {
            name: "search",
            label: "Search Services",
            type: "text",
            placeholder: "Search by name or slug...",
        },
        {
            name: "type",
            label: "Service Type",
            type: "select",
            options: [
                { label: "One Time", value: "ONE_TIME" },
                { label: "Subscription", value: "SUBSCRIPTION" },
                { label: "AMC", value: "AMC" },
                { label: "CMC", value: "CMC" },
                { label: "OM", value: "OM" },
            ],
        },
        {
            name: "skill",
            label: "Skill Level",
            type: "select",
            options: [
                { label: "Basic", value: "BASIC" },
                { label: "Intermediate", value: "INTERMEDIATE" },
                { label: "Expert", value: "EXPERT" },
            ],
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
            ],
        },
        {
            name: "minPrice",
            label: "Min Price",
            type: "number",
            placeholder: "₹ Min",
        },
        {
            name: "maxPrice",
            label: "Max Price",
            type: "number",
            placeholder: "₹ Max",
        },
        {
            name: "startDate",
            label: "Created From",
            type: "date",
        },
        {
            name: "endDate",
            label: "Created To",
            type: "date",
        },
    ];

    return (
        <GenericFilter
            fields={filterConfig}
            filters={filters}
            onFilterChange={onFilterChange}
        />
    );
};

export default ServiceFilters;