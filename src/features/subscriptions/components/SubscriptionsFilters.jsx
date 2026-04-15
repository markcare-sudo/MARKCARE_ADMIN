import GenericFilter from "@/components/ui/GenericFilter";


const SubscriptionsFilters = ({ onFilterChange, plans }) => {
    const planNames = [
        { label: "All Plans", value: "" },
        ...(plans?.map((plan) => ({
            label: plan.name,
            value: plan.id,
        })) || [])
    ];

    const filterConfig = [
        {
            name: "search",
            label: "Search Plans",
            type: "text",
            placeholder: "e.g. Premium, PRO_2024",
        },
        {
            name: "planType",
            label: "Plan Type",
            type: "select",
            options: [
                { label: "All Plan Types", value: "" },
                { label: "Monthly", value: "MONTHLY" },
                { label: "Yearly", value: "YEARLY" },
            ],
        },
        {
            name: "plan_id",
            label: "Plan",
            type: "select",
            options: planNames
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "All Status", value: "" },
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "CANCELLED" },
                { label: "Trial", value: "TRIAL" },
                { label: "Expired", value: "EXPIRED" },
                { label: "No Show", value: "NO_SHOW" },
            ],
        },
        {
            name: "startDate",
            label: "From Date",
            type: "date", // GenericFilter handles this via <Input type="date" />
        },
        {
            name: "endDate",
            label: "To Date",
            type: "date", // GenericFilter handles this via <Input type="date" />
        },
    ];

    return (
        <GenericFilter
            fields={filterConfig}
            onFilterChange={onFilterChange}
        />
    );
};

export default SubscriptionsFilters;
