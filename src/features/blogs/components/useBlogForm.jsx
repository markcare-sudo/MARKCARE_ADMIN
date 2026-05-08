import { useState, useEffect } from "react";
import { useBlogs } from "@/context/BlogContext";
import { useGlobalContext } from "@/context/GlobalContext";

export const useBlogForm = (initialData, onSuccess) => {
    const { createBlog, updateBlog } = useBlogs();
    const { getImageUrl } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "", excerpt: "", content: "", category: "",
        status: "draft", tags: [], keywords: [],
        featured_media: null, preview: null, alt_text: "", media_type: "image",
    });

    // Sync initial data
    useEffect(() => {
        if (!initialData) return;

        const parseMeta = (data) => Array.isArray(data)
            ? data.map(i => typeof i === "string" ? i : (i.name || i.label || i.keyword)).filter(Boolean)
            : [];

        setForm({
            ...form,
            title: initialData.title || "",
            content: initialData.content || "",
            category: initialData.category || "",
            tags: parseMeta(initialData.tags || initialData.Tags),
            keywords: parseMeta(initialData.keywords || initialData.Keywords),
            preview: initialData.featured_media ? getImageUrl(initialData.featured_media) : null,
            media_type: initialData.media_type || "image",
        });
    }, [initialData]);

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            ["title", "excerpt", "content", "category", "status", "alt_text"].forEach(key => {
                formData.append(key, form[key]);
            });
            formData.append("tags", JSON.stringify(form.tags));
            formData.append("keywords", JSON.stringify(form.keywords));
            if (form.featured_media) formData.append("featured_media", form.featured_media);

            initialData?.id ? await updateBlog(initialData.id, formData) : await createBlog(formData);
            onSuccess?.();
        } catch (err) {
            alert("Failed to save blog.");
        } finally {
            setLoading(false);
        }
    };

    return { form, setForm, loading, updateField, handleSubmit };
};