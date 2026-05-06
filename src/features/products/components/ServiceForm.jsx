import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { useCategories } from "@/context/CategoryContext";
import { useServices } from "@/context/ServiceContext";
import { useGlobalContext } from "@/context/GlobalContext";

const SERVICE_TYPES = ["ONE_TIME", "SUBSCRIPTION", "AMC", "CMC", "OM"];
const SKILL_LEVELS = ["BASIC", "INTERMEDIATE", "EXPERT"];

const ServiceForm = ({ initialData, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { createService, updateService } = useServices();
    const { categories } = useCategories();
    const { getImageUrl } = useGlobalContext();

    const [form, setForm] = useState({
        name: "",
        slug: "",
        category_id: "",
        description: "",
        type: "ONE_TIME",
        estimated_duration_mins: 60,
        base_price: "",
        discount_price: "",
        required_skill_level: "BASIC",
        is_spares_included: false,
        is_active: true,
        benefits: [{ benefit_text: "", is_included: true }],
        schedule: {
            total_visits: 1,
            frequency_months: 0,
            contract_duration_months: 12
        },
        images: []
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                category_name: initialData.category?.name || "",
                benefits: initialData.benefits || [],
                schedule: initialData.schedule || {
                    total_visits: 1,
                    frequency_months: 0,
                    contract_duration_months: 12
                },
                images: initialData.images || []
            });
        }
    }, [initialData]);

    const categoryOptions = categories.map(c => c.name);

    const updateField = (field, value) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleCategoryChange = (name) => {
        const selected = categories.find(c => c.name === name);
        setForm(prev => ({
            ...prev,
            category_id: selected?.id || "",
            category_name: name
        }));
    };

    // BENEFITS
    const updateBenefit = (i, field, value) => {
        const benefits = [...form.benefits];
        benefits[i][field] = value;
        setForm(prev => ({ ...prev, benefits }));
    };

    const addBenefit = () =>
        setForm(prev => ({
            ...prev,
            benefits: [...prev.benefits, { benefit_text: "", is_included: true }]
        }));

    const removeBenefit = (i) =>
        setForm(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, idx) => idx !== i)
        }));

    // SCHEDULE
    const updateSchedule = (field, value) =>
        setForm(prev => ({
            ...prev,
            schedule: { ...prev.schedule, [field]: value }
        }));

    // IMAGES
    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (i) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== i)
        }));
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.base_price || !form.category_id) {
            alert("Please fill required fields");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // ✅ BASE FIELDS (convert numbers properly)
            Object.keys(form).forEach((key) => {
                if (["benefits", "schedule", "images"].includes(key)) return;

                let value = form[key];

                if (key === "base_price" || key === "discount_price") {
                    value = parseFloat(value || 0);
                }

                if (key === "estimated_duration_mins" || key === "category_id") {
                    value = parseInt(value);
                }

                formData.append(key, value ?? "");
            });

            // ✅ ARRAYS (STRINGIFY)
            formData.append("benefits", JSON.stringify(form.benefits || []));
            formData.append("schedule", JSON.stringify(form.schedule || {}));

            // ✅ IMAGES
            form.images.forEach((file) => {
                formData.append("images", file);
            });

            // ✅ API CALL
            if (initialData?.id) {
                await updateService(initialData.id, formData);
            } else {
                await createService(formData);
            }

            // ✅ SUCCESS
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            alert("Failed to save service");
        } finally {
            setLoading(false);
        }
    };

    const isMaintenanceType = ["AMC", "CMC", "OM"].includes(form.type);

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">

            {/* BASIC INFO */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Info</h3>

                <div className="grid grid-cols-3 gap-6">
                    <Input label="Service Name *" value={form.name}
                        placeholder="Enter service name"
                        onChange={e => updateField("name", e.target.value)} />

                    <Select
                        label="Category"
                        placeholder="Select category"
                        value={form.category_name || ""}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        options={categoryOptions}
                    />

                    <Select label="Service Type" value={form.type}
                        placeholder="Select service type"
                        onChange={(e) => updateField("type", e.target.value)}
                        options={SERVICE_TYPES} />

                    <Select label="Skill Level" value={form.required_skill_level}
                        placeholder="Select skill level"
                        onChange={(e) => updateField("required_skill_level", e.target.value)}
                        options={SKILL_LEVELS} />

                    <Input label="Duration (mins)" value={form.estimated_duration_mins}
                        placeholder="Enter duration in minutes"
                        onChange={e => updateField("estimated_duration_mins", e.target.value)} />

                    <Input label="Base Price *" value={form.base_price}
                        placeholder="Enter base price"
                        onChange={e => updateField("base_price", e.target.value)} />

                    <Input label="Discount Price" value={form.discount_price}
                        placeholder="Enter discount price"
                        onChange={e => updateField("discount_price", e.target.value)} />
                </div>

                <textarea
                    placeholder="Service description..."
                    className="w-full border rounded p-3 h-28 focus:ring-2 focus:ring-indigo-500"
                    value={form.description}
                    onChange={e => updateField("description", e.target.value)}
                />
            </div>

            {/* IMAGES */}
            <div className="bg-white shadow-sm rounded p-4">
                <h3 className="font-semibold mb-3">Service Images</h3>

                <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                    <FiUpload size={24} />
                    <span className="text-sm mt-2">Upload Images</span>
                    <input type="file" multiple hidden onChange={handleImages} />
                </label>

                <div className="flex gap-3 mt-4 flex-wrap">
                    {form.images.map((img, i) => (
                        <div key={i} className="relative">
                            <img
                                src={
                                    img instanceof File
                                        ? URL.createObjectURL(img)
                                        : getImageUrl(img.url) || ""
                                }
                                className="w-24 h-24 object-cover rounded-lg shadow"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* BENEFITS */}
            <div className="bg-white shadow-sm rounded p-4">
                <h3 className="font-semibold mb-4">Service Benefits</h3>

                <div className="space-y-3">
                    {form.benefits.map((b, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3"
                        >
                            {/* Benefit Input */}
                            <div className="flex-1">
                                <Input
                                    placeholder="Enter benefit (e.g. Filter Cleaning)"
                                    value={b.benefit_text}
                                    onChange={(e) =>
                                        updateBenefit(i, "benefit_text", e.target.value)
                                    }
                                />
                            </div>

                            {/* Included Toggle */}
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={b.is_included}
                                    onChange={(e) =>
                                        updateBenefit(i, "is_included", e.target.checked)
                                    }
                                />
                                Included
                            </label>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() => removeBenefit(i)}
                                className="p-2 hover:bg-red-100 rounded"
                            >
                                <FiTrash2 className="text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                <div className="flex justify-end mt-4">
                    <Button type="button" onClick={addBenefit}>
                        <FiPlus className="mr-1" /> Add Benefit
                    </Button>
                </div>
            </div>

            {/* MAINTENANCE */}
            {isMaintenanceType && (
                <div className="bg-white shadow-sm rounded p-6">
                    <h3 className="font-semibold mb-3">Maintenance</h3>

                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Total Visits"
                            placeholder="Enter total visits"
                            value={form.schedule.total_visits}
                            onChange={e => updateSchedule("total_visits", e.target.value)} />

                        <Input label="Frequency"
                            placeholder="Enter frequency"
                            value={form.schedule.frequency_months}
                            onChange={e => updateSchedule("frequency_months", e.target.value)} />

                        <Input label="Contract Duration"
                            placeholder="Enter contract duration"
                            value={form.schedule.contract_duration_months}
                            onChange={e => updateSchedule("contract_duration_months", e.target.value)} />
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-4 bg-white p-4 border-t">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        if (onSuccess) onSuccess(); // close modal
                        else navigate(-1);
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Service"}
                </Button>
            </div>
        </form>
    );
};

export default ServiceForm;