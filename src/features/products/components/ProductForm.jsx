import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useProducts } from "@/context/ProductContext";
import { useBrands } from "@/context/BrandContext";
import { useCategories } from "@/context/CategoryContext";
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { useGlobalContext } from "@/context/GlobalContext";

const BASE_SPECS = [
    { key: "Manufacturer", value: "" },
    { key: "Model", value: "" },
    { key: "Country of Origin", value: "" },
    { key: "Warranty", value: "" }
];

const ProductForm = ({ initialData, onSuccess }) => {
    const { createProduct, updateProduct } = useProducts();
    const { brands = [] } = useBrands();
    const { categories = [] } = useCategories();
    const { getImageUrl } = useGlobalContext();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        brand_id: "",
        category_id: "",
        description: "",
        common_specifications: BASE_SPECS,
        variants: [],
        image: null,
        preview: null
    });

    // ---------------- OPTIONS ----------------
    const brandOptions = brands.map(b => b.name);
    const categoryOptions = categories.map(c => c.name);

    const getBrandId = (name) => brands.find(b => b.name === name)?.id;
    const getCategoryId = (name) => categories.find(c => c.name === name)?.id;

    // ---------------- INITIAL DATA FIX ----------------
    useEffect(() => {
        if (!initialData) return;

        // ✅ specs object → array
        const specsArray = Object.entries(initialData.common_specifications || {})
            .map(([key, value]) => ({ key, value }));

        // ✅ variants
        const mappedVariants = (initialData.variants || []).map(v => {
            const variantImage = v.variant_images?.[0];
            return {
                id: v.id,
                price: v.price || "",
                discount_price: v.discount_price || "",
                stock_quantity: v.stock_quantity || 0,
                is_default: v.is_default,
                variant_specifications: v.variant_specifications || "",
                image: null,
                preview: variantImage?.url ? getImageUrl(variantImage.url) : null
            };
        });

        setForm({
            name: initialData.name || "",
            brand_id: initialData.brand_id || "",
            category_id: initialData.category_id || "",
            description: initialData.description || "",
            common_specifications: specsArray.length ? specsArray : BASE_SPECS,
            variants: mappedVariants.length
                ? mappedVariants
                : [{
                    price: "",
                    discount_price: "",
                    stock_quantity: 0,
                    is_default: true,
                    variant_specifications: "",
                    image: null,
                    preview: null
                }],
        });

    }, [initialData]);




    // ---------------- FIELD ----------------
    const updateField = (field, value) =>
        setForm(prev => ({ ...prev, [field]: value }));

    // ---------------- CATEGORY ----------------
    const handleCategoryChange = (name) => {
        const categoryId = getCategoryId(name);

        let specs = [...BASE_SPECS];

        if (name?.toLowerCase() === "electronics") {
            specs.push({ key: "Voltage", value: "" }, { key: "Power", value: "" });
        }

        if (name?.toLowerCase() === "clothing") {
            specs.push({ key: "Size", value: "" }, { key: "Fabric", value: "" });
        }

        setForm(prev => ({
            ...prev,
            category_id: categoryId,
            common_specifications: specs
        }));
    };

    // ---------------- SPECS ----------------
    const updateSpec = (i, field, value) => {
        const specs = [...form.common_specifications];
        specs[i][field] = value;
        setForm(prev => ({ ...prev, common_specifications: specs }));
    };

    const addSpec = () =>
        setForm(prev => ({
            ...prev,
            common_specifications: [...prev.common_specifications, { key: "", value: "" }]
        }));

    const removeSpec = (i) =>
        setForm(prev => ({
            ...prev,
            common_specifications: prev.common_specifications.filter((_, idx) => idx !== i)
        }));

    // ---------------- VARIANTS ----------------
    const handleVariantChange = (i, field, value) => {
        const variants = [...form.variants];

        if (field === "is_default") {
            variants.forEach((v, idx) => (v.is_default = idx === i));
        } else {
            variants[i][field] = value;
        }

        setForm(prev => ({ ...prev, variants }));
    };

    const handleVariantImage = (i, file) => {
        const variants = [...form.variants];
        variants[i].image = file;
        variants[i].preview = URL.createObjectURL(file);

        setForm(prev => ({ ...prev, variants }));
    };

    const addVariant = () =>
        setForm(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    price: "",
                    discount_price: "",
                    stock_quantity: 0,
                    is_default: false,
                    variant_specifications: "",
                    image: null,
                    preview: null
                }
            ]
        }));

    const removeVariant = (i) =>
        setForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, idx) => idx !== i)
        }));

    // ---------------- SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            // ✅ specs → object
            const specsObject = form.common_specifications.reduce((acc, cur) => {
                if (cur.key) acc[cur.key] = cur.value;
                return acc;
            }, {});

            // ✅ product
            const productPayload = {
                name: form.name,
                brand_id: form.brand_id || null,
                category_id: form.category_id,
                description: form.description,
                common_specifications: specsObject
            };

            // ✅ variants
            const variantsPayload = form.variants.map(v => ({
                id: v.id, // important for update
                price: parseFloat(v.price || 0),
                discount_price: parseFloat(v.discount_price || 0),
                stock_quantity: parseInt(v.stock_quantity || 0),
                is_default: v.is_default,
                variant_specifications: v.variant_specifications
            }));

            formData.append("product", JSON.stringify(productPayload));
            formData.append("variants", JSON.stringify(variantsPayload));

            // ✅ main image
            if (form.image) {
                formData.append("main_image", form.image);
            }

            // ✅ variant images
            form.variants.forEach((v, i) => {
                if (v.image) {
                    formData.append(`variant_${i}_images`, v.image);
                }
            });

            // ✅ API
            if (initialData?.id) {
                await updateProduct(initialData.id, formData);
            } else {
                await createProduct(formData);
            }

            onSuccess?.();

        } catch (err) {
            console.error(err);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">

            {/* BASIC */}
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-4">
                    <Input
                        label="Product Name"
                        value={form.name}
                        onChange={e => updateField("name", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Brand"
                            value={brands.find(b => b.id === form.brand_id)?.name || ""}
                            onChange={(e) => updateField("brand_id", getBrandId(e.target.value))}
                            options={brandOptions}
                        />

                        <Select
                            label="Category"
                            value={categories.find(c => c.id === form.category_id)?.name || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            options={categoryOptions}
                        />
                    </div>


                    <Input
                        label="Description"
                        type="textarea"
                        multiline
                        rows={5}
                        placeholder="Description"
                        value={form.description}
                        onChange={e => updateField("description", e.target.value)}
                    />
                </div>
            </div>

            {/* (rest UI unchanged — your variants & specs block is already perfect) */}
            <div>
                <h3 className="font-medium mb-2">Specifications</h3>

                {form.common_specifications.map((spec, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 mb-2">
                        <Input value={spec.key} placeholder={"Key"} onChange={e => updateSpec(i, "key", e.target.value)} />
                        <Input value={spec.value} placeholder={"Value"} onChange={e => updateSpec(i, "value", e.target.value)} />
                        <button onClick={() => removeSpec(i)}>
                            <FiTrash2 className="text-red-500" />
                        </button>
                    </div>
                ))}

                <div className="flex justify-end">
                    <Button type="button" onClick={addSpec}>
                        <FiPlus /> Add Specification
                    </Button>
                </div>
            </div>

            {/* VARIANTS */}
            <div>
                <h3 className="font-medium mb-3">Variants</h3>

                {/* HEADER */}
                <div className="grid grid-cols-7 gap-4 text-xs font-semibold text-gray-500 mb-2 px-2">
                    <div>Image</div>
                    <div>Price</div>
                    <div>Discount Price</div>
                    <div>Stock</div>
                    <div>Specifications</div>
                    <div className="text-center">Default</div>
                    <div className="text-right">Action</div>
                </div>

                {/* ROWS */}
                {form.variants.map((v, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-7 gap-4 items-center border p-3 bg-gray-50"
                    >
                        {/* IMAGE */}
                        <label className="w-14 h-14 border rounded-md flex items-center justify-center cursor-pointer overflow-hidden bg-white">
                            {v.preview ? (
                                <img src={v.preview} className="w-full h-full object-cover" />
                            ) : (
                                <FiUpload size={16} />
                            )}
                            <input
                                hidden
                                type="file"
                                onChange={(e) => handleVariantImage(i, e.target.files[0])}
                            />
                        </label>

                        {/* PRICE */}
                        <Input
                            placeholder="₹ Price"
                            value={v.price}
                            onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                        />

                        <Input
                            placeholder="₹ Discount Price"
                            value={v.discount_price}
                            onChange={(e) => handleVariantChange(i, "discount_price", e.target.value)}
                        />

                        {/* STOCK */}
                        <Input
                            placeholder="Qty"
                            value={v.stock_quantity}
                            onChange={(e) =>
                                handleVariantChange(i, "stock_quantity", e.target.value)
                            }
                        />

                        {/* SPEC */}
                        <Input
                            placeholder="e.g. Color: Red"
                            value={v.variant_specifications}
                            onChange={(e) =>
                                handleVariantChange(i, "variant_specifications", e.target.value)
                            }
                        />

                        {/* DEFAULT */}
                        <div className="flex justify-center">
                            <input
                                type="radio"
                                checked={v.is_default}
                                onChange={() => handleVariantChange(i, "is_default", true)}
                            />
                        </div>

                        {/* DELETE */}
                        <div className="flex justify-end">
                            <button onClick={() => removeVariant(i)}>
                                <FiTrash2 className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* ADD BUTTON */}
                <div className="flex justify-end mt-3">
                    <Button type="button" onClick={addVariant}>
                        <FiPlus /> Add Variant
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;