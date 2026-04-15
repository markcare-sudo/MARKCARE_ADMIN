import GenericFilter from "@/components/ui/GenericFilter";


const SubscriptionPlansFilters = ({ onFilterChange }) => {
  const filterConfig = [
    {
      name: "search",
      label: "Search Plans",
      type: "text",
      placeholder: "e.g. Premium, PRO_2024",
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      options: [
        { label: "All Status", value: "" },
        { label: "Active Only", value: "true" },
        { label: "Inactive Only", value: "false" },
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

export default SubscriptionPlansFilters;
