import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useBooking } from "@/context/BookingContext";

const BookingsTable = ({ bookings, onView }) => {
    const { cancelBooking } = useBooking();

    const columns = [
        {
            header: "Booking Info",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        #{row.booking_code}
                    </span>
                    <span className="text-xs text-gray-500">
                        {row.user?.name || "Guest"}
                    </span>
                </div>
            ),
        },

        {
            header: "Service",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {row.service?.name || "Service"}
                    </span>
                    <span className="text-xs text-gray-500">
                        ₹{Number(row.total_amount || 0).toLocaleString()}
                    </span>
                </div>
            ),
        },

        {
            header: "Schedule",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm">
                        {row.scheduled_date
                            ? new Date(row.scheduled_date).toLocaleDateString("en-IN", {
                                dateStyle: "medium",
                            })
                            : "-"}
                    </span>
                    <span className="text-xs text-gray-500">
                        {row.time_slot || "-"}
                    </span>
                </div>
            ),
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
            header: "Status",
            render: (row) => (
                <Badge
                    text={row.status}
                    variant={
                        row.status === "COMPLETED"
                            ? "green"
                            : row.status === "CANCELLED"
                                ? "red"
                                : row.status === "IN_PROGRESS"
                                    ? "blue"
                                    : row.status === "ASSIGNED"
                                        ? "purple"
                                        : "yellow"
                    }
                />
            ),
        },

        {
            header: "Created",
            render: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                    })
                    : new Date(row.createdAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                    }),
        },

        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Booking"
                    displayField="id"
                    actions={[
                        {
                            label: "View",
                            onClick: (booking) => onView(booking),
                        },

                        {
                            label: "Cancel Booking",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Cancel Booking",
                            confirmMessage: `Cancel booking #${row.id}?`,
                            onClick: async (booking) => {
                                const bookingDate = new Date(booking.scheduled_date);
                                const now = new Date();

                                const diffHours =
                                    (bookingDate - now) / (1000 * 60 * 60);

                                // ❗ Example rule: allow cancel only before 6 hours
                                if (diffHours < 6) {
                                    alert("Cannot cancel within 6 hours of service time");
                                    return;
                                }

                                await cancelBooking(booking.id);
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DataTable columns={columns} data={bookings} />
        </div>
    );
};

export default BookingsTable;