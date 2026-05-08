import React, { useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";

const MediaUpload = ({ form, updateField }) => {
    // Cleanup Object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (form.preview?.startsWith("blob:")) {
                URL.revokeObjectURL(form.preview);
            }
        };
    }, [form.preview]);

    const handleMediaChange = (file) => {
        if (!file) return;

        updateField("featured_media", file);
        updateField("preview", URL.createObjectURL(file));
        updateField("media_type", file.type.startsWith("video") ? "video" : "image");
    };

    const clearMedia = () => {
        updateField("featured_media", null);
        updateField("preview", null);
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Featured Media</label>
            <div className="flex items-center gap-4">
                <label className="group relative w-40 h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    {form.preview ? (
                        form.media_type === "video" ? (
                            <video src={form.preview} className="w-full h-full object-cover" />
                        ) : (
                            <img src={form.preview} alt="Preview" className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500">
                            <FiUpload size={24} />
                            <span className="text-xs font-medium">Click to Upload</span>
                        </div>
                    )}
                    <input
                        hidden
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleMediaChange(e.target.files?.[0])}
                    />
                </label>

                {form.preview && (
                    <button
                        type="button"
                        onClick={clearMedia}
                        className="p-3 bg-white border border-gray-200 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaUpload;