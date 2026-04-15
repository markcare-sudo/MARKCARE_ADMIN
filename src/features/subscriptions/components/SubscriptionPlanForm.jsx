import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FeatureManager from "./FeatureManager";

const SubscriptionPlanForm = ({ initialData, availableFeatures, onSubmit, onCancel, loading }) => {

    const [form, setForm] = useState({
        name: "",
        description: "",
        price_monthly: "",
        price_yearly: "",
        trial_days: 0,
        is_active: "Active",
        subscription_plan_features: []
    });
    const [errors, setErrors] = useState({});

    // Fix: Sync data when editing
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                description: initialData.description || "",
                price_monthly: initialData.price_monthly?.toString() || "",
                price_yearly: initialData.price_yearly?.toString() || "",
                trial_days: initialData.trial_days || 0,
                is_active: initialData.is_active === false ? "Inactive" : "Active",
                // Map backend 'plan_features' to our internal state array
                subscription_plan_features: (initialData.plan_features || []).map(f => ({
                    feature_id: f.feature_id,
                    is_enabled: f.is_enabled,
                    limit_value: f.limit_value
                }))
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Required";
        if (!form.price_monthly) errs.price_monthly = "Required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleInternalSubmit = () => {
        if (!validate()) return;
        onSubmit({
            ...form,
            price_monthly: parseFloat(form.price_monthly),
            price_yearly: parseFloat(form.price_yearly),
            is_active: form.is_active === "Active"
        });
    };

    return (
        <div className="space-y-6">
            {/* Detail Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Plan Name" placeholder={"Enter Plan Name"} value={form.name} onChange={e => handleChange("name", e.target.value)} error={errors.name} />
                <Input label="Description" placeholder={"Enter Description"} value={form.description} onChange={e => handleChange("description", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Monthly Price" placeholder={"Enter Monthly Price"} type="number" value={form.price_monthly} onChange={e => handleChange("price_monthly", e.target.value)} error={errors.price_monthly} />
                <Input label="Yearly Price" placeholder={"Enter Yearly Price"} type="number" value={form.price_yearly} onChange={e => handleChange("price_yearly", e.target.value)} />
                <Input label="Trial Days" placeholder={"Enter Trial Days"} type="number" value={form.trial_days} onChange={e => handleChange("trial_days", e.target.value)} />
            </div>

            <Select label="Status" value={form.is_active} options={["Active", "Inactive"]} onChange={e => handleChange("is_active", e.target.value)} />

            {/* Reusable Feature Manager */}
            <FeatureManager
                availableFeatures={availableFeatures}
                selectedFeatures={form.subscription_plan_features}
                onChange={(newList) => handleChange("subscription_plan_features", newList)}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button variant="primary" onClick={handleInternalSubmit} loading={loading}>Save Plan</Button>
            </div>
        </div>
    );
};

export default SubscriptionPlanForm;