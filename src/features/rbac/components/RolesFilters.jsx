import GenericFilter from "@/components/ui/GenericFilter";


const RolesFilters = ({ filters, onFilterChange }) => {

    // ✅ FILTER CONFIGURATION
    const filterConfig = [
        { name: "search", label: "Search", placeholder: "Role name...", type: "text" },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" }
            ]
        },
        { name: "startDate", label: "Created After", type: "date" },
        { name: "endDate", label: "Created Before", type: "date" },
    ];

    return (
        <GenericFilter
            fields={filterConfig}
            filters={filters}
            onFilterChange={onFilterChange}
        />
    );
};

export default RolesFilters;
