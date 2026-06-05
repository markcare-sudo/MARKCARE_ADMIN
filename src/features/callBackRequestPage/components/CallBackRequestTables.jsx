import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useCallbackRequests } from "@/context/CallbackRequestContext";

const CallbackRequestsTable = ({ requests = [], onEdit }) => {
    const { deleteRequest } = useCallbackRequests();

    // Helper to style the dynamic status variants
    const getStatusVariant = (status) => {
        switch (status) {
            case "NEW":
                return "blue";
            case "CONTACTED":
                return "amber";
            case "CLOSED":
                return "green";
            default:
                return "gray";
        }
    };

    // Helper to style the operational source channels
    const getSourceStyle = (source) => {
        switch (source) {
            case "WHATSAPP":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "PHONE":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            default: // WEBSITE
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const columns = [
        {
            header: "Contact Details",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.phone}</span>
                    <span className="text-xs text-gray-500">{row.email}</span>
                </div>
            ),
        },
        {
            header: "Product Interest",
            render: (row) => row.product_name ? (
                <div className="flex flex-col max-w-[220px]">
                    <span className="text-sm font-medium text-gray-800 truncate" title={row.product_name}>
                        {row.product_name}
                    </span>
                    {row.product_price && (
                        <span className="text-xs font-semibold text-slate-500">
                            ₹{Number(row.product_price).toLocaleString()}
                        </span>
                    )}
                </div>
            ) : (
                <span className="text-xs italic text-gray-400">General Inquiry</span>
            ),
        },
        {
            header: "Channel Source",
            render: (row) => (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase ${getSourceStyle(row.source)}`}>
                    {row.source}
                </span>
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
                    itemName="Callback Request"
                    displayField="phone"
                    actions={[
                        { label: "Update Status", onClick: (req) => onEdit(req) },
                        {
                            label: "Remove Record",
                            variant: "danger",
                            showConfirm: true,
                            confirmMessage: `Are you sure you want to delete this callback request record? This action cannot be undone.`,
                            onClick: async (req) => await deleteRequest(req.id),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden">
            <DataTable columns={columns} data={requests} />
        </div>
    );
};

export default CallbackRequestsTable;