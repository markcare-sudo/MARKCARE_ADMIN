import { useState } from "react";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";
import { useProducts } from "@/context/ProductContext";

const ProductsTable = ({ products, onEdit }) => {
    const { deleteProduct } = useProducts();

    const columns = [
        {
            header: "Product Details",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{row.slug}</span>
                </div>
            ),
        },
        {
            header: "Brand",
            render: (row) => (
                <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                    {row.brand?.name || "No Brand"}
                </span>
            ),
        },
        {
            header: "Category",
            render: (row) => (
                <Badge
                    text={row.category?.name}
                    variant={row.category?.name === "SERVICE" ? "purple" : "blue"}
                />
            ),
        },
        {
            header: "Variants & Stock",
            render: (row) => {
                const variantCount = row.variants?.length || 0;
                const totalStock = row.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);

                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{variantCount} Variants</span>
                        <span className={`text-xs ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            Total Stock: {totalStock}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    text={row.is_active ? "PUBLISHED" : "DRAFT"}
                    variant={row.is_active ? "green" : "gray"}
                />
            ),
        },
        {
            header: "Created",
            render: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                    })
                    : "-",
        },
        {
            header: "Action",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Product"
                    displayField="name"
                    actions={[
                        {
                            label: "Edit",
                            onClick: (product) => onEdit(product),
                        },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Delete Product Catalog",
                            confirmMessage: `This will delete "${row.name}" and all its associated variants and images. Are you sure?`,
                            onClick: async (product) => {
                                await deleteProduct(product.id);
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DataTable columns={columns} data={products} />
        </div>
    );
};

export default ProductsTable;