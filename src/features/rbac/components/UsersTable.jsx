import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useUsers } from "@/context/UsersContext";
import { CheckCircle, AlertTriangle } from "lucide-react";

const UsersTable = ({ users, openUserPopup }) => {
  const { deleteUser, isActionLoading } = useUsers();

  const columns = [
    {
      header: "Name",
      render: (row) => row.name || "-",
    },
    {
      header: "Email",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.email || "-"}</span>
          {row.is_email_verified ? (
            <CheckCircle className="w-4 h-4 text-green-600" title="Verified" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" title="Unverified" />
          )}
        </div>
      ),
    },
    {
      header: "Phone",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.phone || "-"}</span>
          {row.is_phone_verified ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
        </div>
      ),
    },
    {
      header: "User Type",
      render: (row) => (
        <Badge
          text={row.user_type}
          variant={row.user_type === "PLATFORM" ? "purple" : "blue"}
        />
      ),
    },
    {
      header: "Super Admin",
      render: (row) => (
        <Badge
          text={row.is_super_admin ? "YES" : "NO"}
          variant={row.is_super_admin ? "green" : "gray"}
        />
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <Badge
          text={row.is_active ? "ACTIVE" : "INACTIVE"}
          variant={row.is_active ? "green" : "red"}
        />
      ),
    },
    {
      header: "Created Date",
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
    },
    {
      header: "Action",
      render: (row) => {
        // 🔥 Define actions and filter based on Super Admin status
        const actions = [
          {
            label: "Edit User",
            onClick: (user) => openUserPopup(user),
          },
          // 🛑 Only show Delete option if the user is NOT a Super Admin
          !row.is_super_admin && {
            label: "Delete User",
            variant: "danger",
            showConfirm: true,
            loading: isActionLoading,
            confirmTitle: "Revoke User Access",
            confirmMessage: (
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold text-red-600">"{row.name}"</span>?
                This user will immediately lose access to the platform.
              </>
            ),
            onClick: async (user) => {
              await deleteUser(user.id);
            },
          },
        ].filter(Boolean);

        return (
          <RowActions
            item={row}
            itemName="User"
            displayField="name"
            actions={actions}
          />
        );
      },
    },
  ];

  return <DataTable columns={columns} data={users} />;
};

export default UsersTable;