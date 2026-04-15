import GenericFilter from "@/components/ui/GenericFilter";
import { useBrands } from "@/context/BrandContext"; // Assuming you have a brand context

const ProductFilters = ({ filters, onFilterChange }) => {
    // 1. Pull brands from context to populate the dropdown
    const { brands = [] } = useBrands();

    // 2. Define the configuration for the Product Catalog
    const filterConfig = [
        {
            name: "search",
            label: "Search Products",
            type: "text",
            placeholder: "Search by name or slug...",
        },
        {
            name: "brandId",
            label: "Brand",
            type: "select",
            options: brands.map(brand => ({
                label: brand.name,
                value: brand.id
            })),
        },
        {
            name: "type",
            label: "Catalog Type",
            type: "select",
            options: [
                { label: "Physical Product", value: "PRODUCT" },
                { label: "Service", value: "SERVICE" },
            ],
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active/Published", value: "ACTIVE" },
                { label: "Inactive/Draft", value: "INACTIVE" },
            ],
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

export default ProductFilters;