import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useBrands } from "@/context/BrandContext";

const BrandsTable = ({ brands, onEdit }) => {
    const { deleteBrand } = useBrands();

    const columns = [
        {
            header: "Brand",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded border bg-gray-50 flex-shrink-0 overflow-hidden">
                        {row.image_url ? (
                            <img src={row.image_url} alt={row.name} className="h-full w-full object-contain" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{row.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{row.slug}</span>
                    </div>
                </div>
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
            header: "Created",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
        },
        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Brand"
                    displayField="name"
                    actions={[
                        { label: "Edit", onClick: (brand) => onEdit(brand) },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            onClick: async (brand) => await deleteBrand(brand.id),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DataTable columns={columns} data={brands} />
        </div>
    );
};

export default BrandsTable;