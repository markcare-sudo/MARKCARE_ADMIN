import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useRoles } from "@/context/RolesContext";

const RolesTable = ({ roles, openRolePopup }) => {
  const { deleteRole, updateRole, isActionLoading } = useRoles();

  const columns = [
    {
      header: "Role Name",
      render: (row) => row.name || "-",
    },
    {
      header: "Code",
      render: (row) => row.code || "-",
    },
    {
      header: "Tenant",
      render: (row) => row.tenant_id || "Platform",
    },
    {
      header: "Status",
      render: (row) => {
        const status = row.is_active;

        return (
          <Badge
            text={status ? "ACTIVE" : "INACTIVE"}
            variant={status ? "green" : "red"}
          />
        );
      },
    },
    {
      header: "Created Date",
      render: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "-",
    },
    {
      header: "Action",
      render: (row) => (
        <RowActions
          item={row}
          itemName="Role"
          displayField="name"
          actions={[
            {
              label: "Edit Role",
              onClick: (role) => openRolePopup(role),
            },
            {
              label: "Delete Role",
              variant: "danger",
              showConfirm: true,
              confirmTitle: "Delete Role",
              loading: isActionLoading,
              // Using a Fragment instead of backticks to fix the text-overflow bug
              confirmMessage: (
                <>
                  Are you sure you want to delete the role <span className="font-bold text-red-600">"{row.name}"</span>?
                  This will affect all users currently assigned to this role.
                </>
              ),
              onClick: async (role) => {
                await deleteRole(role.id);
              },
            },
          ]}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={roles} />;
};

export default RolesTable;