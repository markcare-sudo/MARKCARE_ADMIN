import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useBrands } from "@/context/BrandContext";

const BrandForm = ({ onSuccess, initialData }) => {
    const { createBrand, updateBrand } = useBrands();
    const [form, setForm] = useState({ name: "", slug: "", image_url: "", description: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            initialData ? await updateBrand(initialData.id, form) : await createBrand(form);
            onSuccess();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Brand Name" value={form.name} required onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, name: val, slug: val.toLowerCase().replace(/ /g, "-") });
            }} />
            <Input label="Slug" value={form.slug} required onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Brand"}</Button>
            </div>
        </form>
    );
};
export default BrandForm;