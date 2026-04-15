import { useState } from "react";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import FeatureForm from "./FeatureForm";
import { useFeatures } from "@/context/FeatureContext";

const FeaturesTable = ({ features, openFeaturePopup }) => {

  const { deleteFeature, updateFeature, isActionLoading } = useFeatures();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleUpdate = async (data) => {
    await updateFeature(selectedFeature.id, data);
    setOpenModal(false);
  };

  const columns = [
    {
      header: "Feature Name",
      render: (row) => row.name || "-",
    },
    {
      header: "Code",
      render: (row) => row.code || "-",
    },
    {
      header: "Module",
      render: (row) => row.module?.name || "-",
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
    // {
    //   header: "Action",
    //   render: (row) => (
    //     <RowActions
    //       item={row}
    //       onEdit={(feature) => openFeaturePopup(feature)}
    //       onDelete={async (feature) => {
    //         await deleteFeature(feature.id);
    //       }}
    //     />
    //   ),
    // },

    {
      header: "Action",
      render: (row) => (
        <RowActions
          item={row}
          itemName="Feature"
          displayField="name" // This will show the feature name in the delete confirmation
          actions={[
            {
              label: "Edit",
              onClick: (feature) => openFeaturePopup(feature),
            },
            {
              label: "Delete",
              variant: "danger",
              showConfirm: true,
              loading: isActionLoading,
              confirmTitle: "Delete Feature",
              confirmMessage: (
                <>
                  Are you sure you want to delete the feature <span className="text-red-600 font-bold">"{row.name}"</span>?
                  This data cannot be recovered.
                </>
              ),
              onClick: async (feature) => {
                await deleteFeature(feature.id);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={features} />

      {openModal && (
        <FeatureForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          initialData={selectedFeature}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
};

export default FeaturesTable;