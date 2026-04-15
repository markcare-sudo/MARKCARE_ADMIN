import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCategories } from "@/context/CategoryContext";

const CategoryForm = ({ onSuccess, initialData }) => {
    const { categories, createCategory, updateCategory } = useCategories();
    const [form, setForm] = useState({ name: "", slug: "", parent_id: "", description: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert empty string to null for DB
            const payload = { ...form, parent_id: form.parent_id || null };
            initialData ? await updateCategory(initialData.id, payload) : await createCategory(payload);
            onSuccess();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={form.name} required onChange={(e) => {
                    setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") });
                }} />
                <Input label="Slug" value={form.slug} required onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>

            <div>
                <label className="text-sm font-medium">Parent Category</label>
                <select
                    className="w-full border p-2 rounded-md"
                    value={form.parent_id || ""}
                    onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                >
                    <option value="">None (Top Level)</option>
                    {categories.filter(c => c.id !== initialData?.id).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={onSuccess}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Category"}</Button>
            </div>
        </form>
    );
};
export default CategoryForm;