import GenericFilter from "@/components/ui/GenericFilter";

const BlogFilters = ({ filters, onFilterChange }) => {

    const filterConfig = [
        {
            name: "search",
            label: "Search Blogs",
            type: "text",
            placeholder: "Search by title or slug...",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
                { label: "Archived", value: "archived" },
            ],
        },
        {
            name: "category",
            label: "Category",
            type: "text",
            placeholder: "Enter category...",
        },
        {
            name: "tag",
            label: "Tag",
            type: "text",
            placeholder: "Search by tag...",
        },
        {
            name: "keyword",
            label: "Keyword",
            type: "text",
            placeholder: "Search by keyword...",
        },
        {
            name: "startDate",
            label: "Published From",
            type: "date",
        },
        {
            name: "endDate",
            label: "Published To",
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

export default BlogFilters;