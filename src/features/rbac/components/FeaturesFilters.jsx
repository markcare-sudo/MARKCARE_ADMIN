import GenericFilter from "@/components/ui/GenericFilter";
import { useModules } from "@/context/ModulesContext";


const FeatureFilters = ({ filters, onFilterChange }) => {

    const { modules = [] } = useModules();

    // ✅ FILTER CONFIG
    const filterConfig = [
        {
            name: "search",
            label: "Search Features",
            type: "text",
            placeholder: "e.g. Create User",
        },
        {
            name: "moduleId",
            label: "Module",
            type: "select",
            options: modules.map(m => ({ label: m.name, value: m.id })),
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

export default FeatureFilters;
