import { useMemo } from "react";
import { useBlogs } from "@/context/BlogContext";
import { useGlobalContext } from "@/context/GlobalContext";

// UI Components
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import RowActions from "@/components/ui/RowActions";

const BlogsTable = ({ blogs, onEdit }) => {
    const { deleteBlog } = useBlogs();
    const { getImageUrl } = useGlobalContext();

    // --- Column Definitions ---
    const columns = useMemo(() => [
        {
            header: "Blog Details",
            render: (row) => (
                <div className="flex items-start gap-3 w-[250px]">
                    {/* Media Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                        {row.featured_media ? (
                            row.media_type === "video" ? (
                                <video
                                    src={getImageUrl(row.featured_media)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={getImageUrl(row.featured_media)}
                                    alt={row.alt_text || row.title}
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] leading-none text-center">
                                No<br />Media
                            </div>
                        )}
                    </div>

                    {/* Title & Slug */}
                    <div className="flex flex-col min-w-0">
                        <span className="block font-medium text-gray-900 text-sm truncate">
                            {row.title}
                        </span>
                        <span className="block text-[11px] text-gray-400 font-mono truncate">
                            /{row.slug}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: "Category",
            render: (row) => (
                <Badge
                    text={row.category || "Uncategorized"}
                    variant={row.category ? "blue" : "gray"}
                />
            ),
        },
        {
            header: "Taxonomy",
            render: (row) => (
                <div className="flex flex-col gap-2 py-1 min-w-0 max-w-[200px]">
                    {/* Tags Group */}
                    {row.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {row.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100 rounded truncate max-w-[80px]"
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {row.tags.length > 4 && (
                                <span className="text-[10px] text-gray-400 self-center">+{row.tags.length - 4}</span>
                            )}
                        </div>
                    )}

                    {/* Keywords Group */}
                    {row.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {row.keywords.slice(0, 3).map((k) => (
                                <span
                                    key={k.id}
                                    className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100 rounded truncate max-w-[90px]"
                                >
                                    {k.keyword}
                                </span>
                            ))}
                            {row.keywords.length > 3 && (
                                <span className="text-[10px] text-gray-400 self-center">+{row.keywords.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "Stats",
            render: (row) => (
                <div className="text-sm">
                    <span className="text-gray-900 font-semibold">{row.view_count || 0}</span>
                    <span className="text-gray-400 ml-1 text-xs">views</span>
                </div>
            ),
        },
        {
            header: "Status",
            render: (row) => {
                const statusMap = {
                    published: "green",
                    draft: "yellow",
                    archived: "gray",
                };
                return (
                    <Badge
                        text={row.status?.toUpperCase()}
                        variant={statusMap[row.status] || "gray"}
                    />
                );
            },
        },
        {
            header: "Dates",
            render: (row) => (
                <div className="text-[11px] leading-relaxed">
                    <div className="text-gray-500">
                        Created: {row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}
                    </div>
                    {row.published_at && (
                        <div className="text-green-600">
                            Live: {new Date(row.published_at).toLocaleDateString()}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "Action",
            className: "text-right",
            render: (row) => (
                <RowActions
                    item={row}
                    itemName="Blog"
                    displayField="title"
                    actions={[
                        {
                            label: "Edit",
                            onClick: (blog) => onEdit(blog),
                        },
                        {
                            label: "Delete",
                            variant: "danger",
                            showConfirm: true,
                            confirmTitle: "Delete Blog",
                            confirmMessage: `This will permanently delete "${row.title}". Are you sure?`,
                            onClick: async (blog) => await deleteBlog(blog.id),
                        },
                    ]}
                />
            ),
        },
    ], [onEdit, deleteBlog, getImageUrl]);

    return (
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <DataTable columns={columns} data={blogs} />
        </div>
    );
};

export default BlogsTable;