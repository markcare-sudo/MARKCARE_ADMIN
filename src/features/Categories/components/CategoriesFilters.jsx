import GenericFilter from "@/components/ui/GenericFilter";
import { useCategories } from "@/context/CategoryContext";

const CategoryFilters = ({ filters, onFilterChange }) => {
    const { categories = [] } = useCategories();

    // Filter only top-level categories to use as hierarchy filter
    const parentCategories = categories.filter(c => !c.parent_id);

    const filterConfig = [
        {
            name: "search",
            label: "Search Categories",
            type: "text",
            placeholder: "Search name...",
        },
        {
            name: "parentId",
            label: "Parent Category",
            type: "select",
            options: parentCategories.map(c => ({ label: c.name, value: c.id })),
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

export default CategoryFilters;