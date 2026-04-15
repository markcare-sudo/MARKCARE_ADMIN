import GenericFilter from "@/components/ui/GenericFilter";

const AuditLogsFilters = ({ onFilterChange }) => {
  const filterConfig = [
    {
      name: "search",
      label: "Search",
      type: "text",
      placeholder: "User, tenant, module...",
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
    {
      name: "module",
      label: "Module",
      type: "select",
      options: [
        { label: "All Modules", value: "" },
        { label: "Auth", value: "auth" },
        { label: "Users", value: "users" },
        { label: "Roles", value: "roles" },
        { label: "Tenants", value: "tenants" },
      ],
    },
    {
      name: "action",
      label: "Action",
      type: "select",
      options: [
        { label: "All Actions", value: "" },
        { label: "Login", value: "LOGIN" },
        { label: "Request OTP", value: "REQUEST_OTP" },
        { label: "Signup", value: "USER_SIGNUP" },
        { label: "Create Role", value: "CREATE_ROLE" },
        { label: "Update Role", value: "UPDATE_ROLE" },
        { label: "Delete User", value: "DELETE_USER" },
        { label: "Verify Email", value: "VERIFY_EMAIL" },
      ],
    },
  ];

  return (
    <GenericFilter
      fields={filterConfig}
      onFilterChange={onFilterChange}
    />
  );
};

export default AuditLogsFilters;