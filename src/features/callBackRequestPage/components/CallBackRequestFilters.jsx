import GenericFilter from "@/components/ui/GenericFilter";

const CallbackFilters = ({ filters, onFilterChange }) => {

    const filterConfig = [
        {
            name: "search",
            label: "Search Inquiries",
            type: "text",
            placeholder: "Search phone, email, or product...",
        },
        {
            name: "status",
            label: "Lead Status",
            type: "select",
            options: [
                { label: "New Request", value: "NEW" },
                { label: "Contacted", value: "CONTACTED" },
                { label: "Closed / Resolved", value: "CLOSED" },
            ],
        },
        {
            name: "source",
            label: "Inquiry Source",
            type: "select",
            options: [
                { label: "Website Lead", value: "WEBSITE" },
                { label: "WhatsApp Chat", value: "WHATSAPP" },
                { label: "Direct Phone Call", value: "PHONE" },
            ],
        },
    ];

    return <GenericFilter fields={filterConfig} filters={filters} onFilterChange={onFilterChange} />;
};

export default CallbackFilters;