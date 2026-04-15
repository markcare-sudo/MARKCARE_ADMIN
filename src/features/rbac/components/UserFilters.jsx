import GenericFilter from "@/components/ui/GenericFilter";


const UserFilters = ({ filters, onFilterChange }) => {


    // ✅ FILTER CONFIGURATION
    const filterConfig = [
        { name: "search", label: "Search", placeholder: "Name or email...", type: "text" },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" }
            ]
        },
        { name: "startDate", label: "Joined After", type: "date" },
        { name: "endDate", label: "Joined Before", type: "date" },
    ];

    return (
        <GenericFilter
            fields={filterConfig}
            filters={filters}
            onFilterChange={onFilterChange}
        />
    );
};

export default UserFilters;
