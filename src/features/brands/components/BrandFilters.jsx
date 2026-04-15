import GenericFilter from "@/components/ui/GenericFilter";

const BrandFilters = ({ filters, onFilterChange }) => {
    const filterConfig = [
        {
            name: "search",
            label: "Search Brands",
            type: "text",
            placeholder: "Brand name...",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];

    return <GenericFilter fields={filterConfig} filters={filters} onFilterChange={onFilterChange} />;
};

export default BrandFilters;