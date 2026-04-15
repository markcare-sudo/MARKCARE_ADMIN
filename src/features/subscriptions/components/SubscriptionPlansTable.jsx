import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import RowActions from "@/components/ui/RowActions";

const SubscriptionPlansTable = ({ subscriptions, onEdit, onDelete, onUpdate }) => {
    const columns = [
        {
            header: "Name",
            render: (row) => row.name || "-",
        },
        {
            header: "Code",
            render: (row) => row.code || "-",
        },
        {
            header: "Monthly Price",
            // Uses Intl.NumberFormat for proper Indian currency formatting (₹)
            render: (row) =>
                row.price_monthly !== undefined && row.price_monthly !== null
                    ? new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 2
                    }).format(row.price_monthly)
                    : "-",
        },
        {
            header: "Yearly Price",
            render: (row) =>
                row.price_yearly !== undefined && row.price_yearly !== null
                    ? new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 2
                    }).format(row.price_yearly)
                    : "-",
        },
        {
            header: "Trial Days",
            render: (row) => row.trial_days || "0",
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    text={row.is_active ? "Active" : "Inactive"}
                    variant={row.is_active ? "green" : "gray"}
                />
            ),
        },
        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Subscription Plan"
                    displayField="name" // Matches the property in your data
                    actions={[
                        {
                            label: "Edit",
                            // 🔥 This calls the handleEditClick in TenantsPage, 
                            // which sets selectedTenant and opens the modal
                            onClick: (row) => onEdit(row),
                        },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Confirm Deletion",
                            confirmMessage: (
                                <>
                                    Are you sure you want to delete <span className="font-bold text-black">"{row.name}"</span>?
                                    This action is irreversible.
                                </>
                            ),
                            onClick: async (row) => {
                                await onDelete(row);
                            },
                        },
                        // Note: You can add a specific toggleStatus function in context 
                        // if you want "Suspend" to be different from "Delete"
                    ]}
                />
            ),
        },
    ];

    return <DataTable columns={columns} data={subscriptions} />;
};

export default SubscriptionPlansTable;
