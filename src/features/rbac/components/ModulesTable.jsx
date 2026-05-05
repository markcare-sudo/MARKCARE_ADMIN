// export default ModulesTable;
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import { useModules } from "@/context/ModulesContext";
import RowActions from "@/components/ui/RowActions";

const ModulesTable = ({ modules = [], openModulePopup }) => {
  const { deleteModule, isActionLoading } = useModules();

  // 🔥 1. Build map once (O(n))
  const moduleMap = new Map(modules.map((m) => [m.id, m]));

  // 🔥 2. Efficient level calculation
  const getLevel = (row) => {
    let level = 0;
    let current = row;

    while (current?.parent_id) {
      current = moduleMap.get(current.parent_id);
      if (current) level++;
      else break;
    }

    return level;
  };

  const columns = [
    {
      header: "Module",
      render: (row) => {
        const level = getLevel(row);

        return (
          <div
            style={{ paddingLeft: `${level * 20}px` }}
            className="flex items-center gap-2"
          >
            {/* 🔥 Tree indicator */}
            {level > 0 && (
              <span className="text-gray-400">└─</span>
            )}


            {/* Name */}
            <span className="font-medium">{row.name}</span>

            {/* Group indicator */}
            {!row.is_clickable && (
              <Badge text="GROUP" variant="gray" />
            )}
          </div>
        );
      },
    },

    {
      header: "Code",
      render: (row) => row.code || "-",
    },

    {
      header: "Navigation",
      render: (row) => (
        <Badge
          text={row.navigation_type}
          variant={
            row.navigation_type === "SIDEBAR"
              ? "blue"
              : row.navigation_type === "TOPBAR"
                ? "purple"
                : "gray"
          }
        />
      ),
    },

    {
      header: "Visible",
      render: (row) => (
        <Badge
          text={row.is_visible ? "YES" : "NO"}
          variant={row.is_visible ? "green" : "red"}
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
      header: "Created",
      render: (row) => {
        const date = row.created_at || row.createdAt;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
    },

    {
      header: "Action",
      render: (row) => (
        <RowActions
          item={row}
          itemName="Module"
          displayField="name"
          actions={[
            {
              label: "Edit",
              onClick: (module) => openModulePopup(module),
            },
            {
              label: "Delete",
              variant: "danger",
              showConfirm: true,
              loading: isActionLoading,
              confirmTitle: "Delete Module",
              confirmMessage: (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-red-600">
                    "{row.name}"
                  </span>
                  ?
                  <br />
                  This will remove all related permissions and child modules.
                </>
              ),
              onClick: async (module) => {
                await deleteModule(module.id);
              },
            },
          ]}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={modules} showRowNumber={true} />;
};

export default ModulesTable;