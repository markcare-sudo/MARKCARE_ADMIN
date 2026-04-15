import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import RowActions from "@/components/ui/RowActions";

const SubscriptionsTable = ({ subscriptions, onEdit, onDelete, onUpdate }) => {
    // Helper for status colors
    const getStatusVariant = (status) => {
        switch (status) {
            case "ACTIVE": return "green";
            case "TRIAL": return "blue";
            case "CANCELLED": return "red";
            case "EXPIRED": return "gray";
            case "SUSPENDED": return "warning";
            case "NO_SHOW": return "orange";
            default: return "gray";
        }
    };


    const columns = [
        {
            header: "Tenant",
            render: (row) => row.tenant?.lab_name || `ID: ${row.tenant_id}`,
        },
        {
            header: "Plan",
            // Assuming your association alias was 'subscription_plan' or similar
            render: (row) => row.subscription_plan?.name || row.plan_id || "-",
        },
        {
            header: "Billing",
            render: (row) => (
                <span className="text-xs font-medium uppercase">{row.billing_cycle}</span>
            ),
        },
        {
            header: "Amount",
            render: (row) =>
                row.price !== undefined && row.price !== null
                    ? new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    }).format(row.price)
                    : "-",
        },
        {
            header: "Duration",
            render: (row) => (
                <div className="text-xs">
                    <div><span className="text-gray-400">S:</span> {row.start_date}</div>
                    <div><span className="text-gray-400">E:</span> {row.end_date}</div>
                </div>
            ),
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    text={row.status}
                    variant={getStatusVariant(row.status)}

                />
            ),
        },
        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Subscription"
                    displayField="id"
                    actions={[
                        {
                            label: "Suspend",
                            variant: "warning",
                            showConfirm: true,
                            confirmTitle: "Confirm Suspension",
                            confirmMessage: (
                                <>
                                    Are you sure you want to suspend subscription <span className="font-bold text-black">"#{row.tenant.lab_name}"</span>?
                                    This action is irreversible.
                                </>
                            ),
                            onClick: async (row) => await onUpdate(row, "SUSPENDED"),
                        },
                        {
                            label: "Cancel",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Confirm Cancellation",
                            confirmMessage: (
                                <>
                                    Are you sure you want to cancel subscription <span className="font-bold text-black">"#{row.tenant.lab_name}"</span>?
                                    This action is irreversible.
                                </>
                            ),
                            onClick: async (row) => await onUpdate(row, "CANCELLED"),
                        },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Permanent Delete",
                            confirmMessage: (
                                <>
                                    Are you sure you want to <span className="text-red-600 font-bold">permanently delete</span> subscription <span className="font-bold">#{row.tenant.lab_name}</span>?
                                    This data cannot be recovered.
                                </>
                            ),
                            onClick: async (row) => await onDelete(row),
                        },
                    ]}
                />
            ),
        },
    ];

    return <DataTable columns={columns} data={subscriptions} />;
};

export default SubscriptionsTable;