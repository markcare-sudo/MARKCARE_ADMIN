import GenericFilter from "@/components/ui/GenericFilter";

const ModuleFilters = ({ filters, onFilterChange, onDeleteAll }) => {

    const filterConfig = [
        {
            name: "search",
            label: "Search Modules",
            type: "text",
            placeholder: "e.g. Users, Billing",
        },


        {
            name: "navigation_type",
            label: "Navigation Type",
            type: "select",
            options: [
                { label: "Sidebar", value: "SIDEBAR" },
                { label: "Topbar", value: "TOPBAR" },
                { label: "Hidden", value: "HIDDEN" },
            ],
        },

        {
            name: "is_active",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
                { label: "Archive", value: "ARCHIVE" },
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
            headerActions={
                <button
                    onClick={() => onDeleteAll()}
                    className="px-3 py-1.5 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Delete All
                </button>
            }
        />

    );
};

export default ModuleFilters;