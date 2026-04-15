import GenericFilter from "@/components/ui/GenericFilter";


const ModuleFilters = ({ filters, onFilterChange }) => {

    const filterConfig = [
        {
            name: "search",
            label: "Search Modules",
            type: "text",
            placeholder: "e.g. User Management",
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
            name: "startDate",
            label: "From Date",
            type: "date",
        },
        {
            name: "endDate",
            label: "To Date",
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

export default ModuleFilters;
