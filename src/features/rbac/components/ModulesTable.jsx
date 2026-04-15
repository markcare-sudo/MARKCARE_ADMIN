import { useState } from "react";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import { useModules } from "@/context/ModulesContext";
import RowActions from "@/components/ui/RowActions";
import ModuleForm from "./ModuleForm";

const ModulesTable = ({ modules, openModulePopup }) => {
  const { deleteModule, updateModule, isActionLoading } = useModules();

  const [openModal, setOpenModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);


  const handleUpdate = async (data) => {
    await updateModule(selectedModule.id, data);
    setOpenModal(false);
  };

  const columns = [
    {
      header: "Module Name",
      render: (row) => row.name || "-",
    },
    {
      header: "Code",
      render: (row) => row.code || "-",
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
        row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "-",
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
              confirmTitle: "Delete System Module",
              confirmMessage: (
                <>
                  Are you sure you want to delete the <span className="font-bold text-red-600">"{row.name}"</span> module?
                  This will also remove all associated features and permissions.
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

  return (
    <>
      <DataTable columns={columns} data={modules} />

      {openModal && (
        <ModuleForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          initialData={selectedModule}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
};

export default ModulesTable;