import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useCategories } from "@/context/CategoryContext";

const CategoriesTable = ({ categories, onEdit }) => {
    const { deleteCategory } = useCategories();

    const columns = [
        {
            header: "Category",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.name}</span>
                    <span className="text-xs text-gray-500 uppercase">{row.slug}</span>
                </div>
            ),
        },
        {
            header: "Hierarchy",
            render: (row) => row.parent_id ? (
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    Sub of {row.Parent?.name || row.parent_id}
                </span>
            ) : (
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Top Level
                </span>
            ),
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
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Category"
                    displayField="name"
                    actions={[
                        { label: "Edit", onClick: (cat) => onEdit(cat) },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmMessage: `Are you sure? This may affect products linked to this category.`,
                            onClick: async (cat) => await deleteCategory(cat.id),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white shadow-sm border border-gray-200">
            <DataTable columns={columns} data={categories} />
        </div>
    );
};

export default CategoriesTable;