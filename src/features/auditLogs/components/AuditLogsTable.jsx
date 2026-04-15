import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import RowActions from "@/components/ui/RowActions";

const AuditLogsTable = ({ logs, openViewModal }) => {
    const columns = [
        {
            header: "User",
            render: (row) =>
                row.user ? `${row.user.name}` : "System",
        },
        {
            header: "Tenant",
            render: (row) => row.tenant?.display_name || "-",
        },
        {
            header: "Action",
            render: (row) => {
                const color =
                    row.action === "CREATE"
                        ? "green"
                        : row.action === "UPDATE"
                            ? "blue"
                            : row.action === "DELETE"
                                ? "red"
                                : "gray";

                return <Badge text={row.action} variant={color} />;
            },
        },
        {
            header: "Module",
            render: (row) => row.module || "-",
        },
        {
            header: "Description",
            render: (row) => row.description || "-",
        },
        {
            header: "Date",
            render: (row) =>
                row.created_at ? new Date(row.created_at).toLocaleString() : "-",
        },
        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Audit Log"
                    displayField="module" // Shows module name in the confirm dialog if used
                    actions={[
                        {
                            label: "View Details",
                            onClick: (item) => openViewModal(item),
                        },
                        // You could easily add more here later, like:
                        // { label: "Export JSON", onClick: (item) => handleExport(item) }
                    ]}
                />
            ),
        },
    ];

    return <DataTable columns={columns} data={logs} />;
};

export default AuditLogsTable;