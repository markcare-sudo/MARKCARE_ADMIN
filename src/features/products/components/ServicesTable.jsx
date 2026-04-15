import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useServices } from "@/context/ServiceContext";

const ServicesTable = ({ services, onEdit }) => {
    const { deleteService } = useServices();

    const columns = [
        {
            header: "Service Details",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {row.slug}
                    </span>
                </div>
            ),
        },
        {
            header: "Category",
            render: (row) => (
                <Badge
                    text={row.category?.name}
                    variant={row.category?.name === "SERVICE" ? "purple" : "blue"}
                />
            ),
        },
        {
            header: "Type",
            render: (row) => (
                <Badge
                    text={row.type}
                    variant={
                        row.type === "ONE_TIME"
                            ? "blue"
                            : row.type === "SUBSCRIPTION"
                                ? "purple"
                                : row.type === "AMC"
                                    ? "green"
                                    : "gray"
                    }
                />
            ),
        },

        {
            header: "Pricing",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        ₹{row.base_price}
                    </span>
                    {row.discount_price && (
                        <span className="text-xs text-green-600">
                            ₹{row.discount_price} (Discounted)
                        </span>
                    )}
                </div>
            ),
        },

        {
            header: "Duration",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    {row.estimated_duration_mins} mins
                </span>
            ),
        },

        {
            header: "Benefits",
            render: (row) => {
                const count = row.benefits?.length || 0;

                return (
                    <span className="text-sm">
                        {count} {count === 1 ? "Benefit" : "Benefits"}
                    </span>
                );
            },
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    text={row.is_active ? "ACTIVE" : "INACTIVE"}
                    variant={row.is_active ? "green" : "gray"}
                />
            ),
        },

        {
            header: "Created",
            render: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                    })
                    : "-",
        },

        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Service"
                    displayField="name"
                    actions={[
                        {
                            label: "Edit",
                            onClick: (service) => onEdit(service),
                        },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Delete Service",
                            confirmMessage: `This will delete "${row.name}" and all its associated benefits and schedule. Are you sure?`,
                            onClick: async (service) => {
                                await deleteService(service.id);
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DataTable columns={columns} data={services} />
        </div>
    );
};

export default ServicesTable;