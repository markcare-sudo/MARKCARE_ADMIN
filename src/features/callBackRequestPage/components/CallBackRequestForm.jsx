import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCallBackRequests } from "@/context/CallBackRequestContext";

const CallbackRequestForm = ({ onSuccess, initialData }) => {
    const { createRequest, updateRequest } = useCallBackRequests();

    const [form, setForm] = useState({
        product_name: "",
        product_price: "",
        phone: "",
        email: "",
        status: "NEW",
        source: "WEBSITE",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                product_name: initialData.product_name || "",
                product_price: initialData.product_price || "",
                phone: initialData.phone || "",
                email: initialData.email || "",
                status: initialData.status || "NEW",
                source: initialData.source || "WEBSITE",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Clean up empty fields or prices for payload submission
            const payload = {
                ...form,
                product_name: form.product_name || null,
                product_price: form.product_price ? parseFloat(form.product_price) : null,
            };

            if (initialData) {
                await updateRequest(initialData.id, payload);
            } else {
                await createRequest(payload);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Core Contact Details */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    required
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>

            {/* Product Metadata Context */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Interested Product"
                    placeholder="e.g. Water Purifier System"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                />
                <Input
                    label="Product Price (Optional)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.product_price}
                    onChange={(e) => setForm({ ...form, product_price: e.target.value })}
                />
            </div>

            {/* Status & Stream Mappings */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Lead Status</label>
                    <select
                        className="w-full border p-2 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option value="NEW">New Request</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed / Resolved</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Inquiry Channel Source</label>
                    <select
                        className="w-full border p-2 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        value={form.source}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                    >
                        <option value="WEBSITE">Website Form</option>
                        <option value="WHATSAPP">WhatsApp Automation</option>
                        <option value="PHONE">Manual / Direct Call</option>
                    </select>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="secondary" type="button" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving changes..." : initialData ? "Update Request" : "Log Request"}
                </Button>
            </div>
        </form>
    );
};

export default CallbackRequestForm;