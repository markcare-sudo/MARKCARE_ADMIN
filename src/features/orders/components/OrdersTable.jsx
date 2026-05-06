import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useOrder } from "@/context/OrderContext";

const OrdersTable = ({ orders, onView }) => {
    const { cancelOrder } = useOrder();

    const columns = [
        {
            header: "Order Info",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        #{row.order_code}
                    </span>
                    <span className="text-xs text-gray-500">
                        {row.user?.name || "Guest"}
                    </span>
                </div>
            ),
        },

        {
            header: "Items",
            render: (row) => {
                const itemCount = row.items?.length || 0;

                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {itemCount} Items
                        </span>
                        <span className="text-xs text-gray-500">
                            ₹{Number(row.total_amount || 0).toLocaleString()}
                        </span>
                    </div>
                );
            },
        },

        {
            header: "Payment",
            render: (row) => (
                <Badge
                    text={row.payment_status || "PENDING"}
                    variant={
                        row.payment_status === "PAID"
                            ? "green"
                            : row.payment_status === "FAILED"
                                ? "red"
                                : "yellow"
                    }
                />
            ),
        },

        {
            header: "Order Status",
            render: (row) => (
                <Badge
                    text={row.order_status}
                    variant={
                        row.order_status === "DELIVERED"
                            ? "green"
                            : row.order_status === "CANCELLED"
                                ? "red"
                                : row.order_status === "SHIPPED"
                                    ? "blue"
                                    : "yellow"
                    }
                />
            ),
        },

        {
            header: "Date",
            render: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                    })
                    : "-",
        },

        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Order"
                    displayField="id"
                    actions={[
                        {
                            label: "View",
                            onClick: (order) => onView(order),
                        },

                        {
                            label: "Cancel Order",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Cancel Order",
                            confirmMessage: `Are you sure you want to cancel Order #${row.id}? This action is only allowed within 3 days.`,
                            onClick: async (order) => {
                                const orderDate = new Date(order.created_at);
                                const now = new Date();
                                const diffDays =
                                    (now - orderDate) / (1000 * 60 * 60 * 24);

                                if (diffDays > 3) {
                                    alert("Cancellation window expired (3 days only)");
                                    return;
                                }

                                await cancelOrder(order.id);
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DataTable columns={columns} data={orders} />
        </div>
    );
};

export default OrdersTable;