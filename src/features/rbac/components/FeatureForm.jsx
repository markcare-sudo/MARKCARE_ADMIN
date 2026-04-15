import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useModules } from "@/context/ModulesContext";
import { useFeatures } from "@/context/FeatureContext";

const FeatureForm = ({ onSuccess, initialData }) => {
  const { createFeature, updateFeature, isActionLoading, isSingleLoading } = useFeatures();
  const { modules } = useModules();

  const [form, setForm] = useState({
    name: "",
    module_id: "",
    description: "",
  });

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        module_id: initialData.module_id || "",
        description: initialData.description || "",
      });
    } else {
      setForm({
        name: "",
        module_id: "",
        description: "",
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    if (isActionLoading) return; // ✅ prevent edit during submit

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isActionLoading) return; // ✅ prevent double submit

    try {
      if (isEdit) {
        await updateFeature(initialData.id, form);
      } else {
        await createFeature(form);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ✅ Optional: show loading when fetching single */}
      {isSingleLoading && (
        <div className="text-center text-sm text-gray-500 py-2">
          Loading feature data...
        </div>
      )}

      {/* Feature Name */}
      <div>
        <label className="text-sm font-medium">Feature Name</label>
        <Input
          value={form.name}
          placeholder="e.g. Patients"
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isActionLoading || isSingleLoading}
          required
        />
      </div>

      {/* Module Select */}
      <div>
        <label className="text-sm font-medium">Module</label>
        <select
          value={form.module_id}
          onChange={(e) => handleChange("module_id", e.target.value)}
          className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          disabled={isActionLoading || isSingleLoading}
          required
        >
          <option value="">Select Module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={form.description}
          placeholder="Patients management"
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isActionLoading || isSingleLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">

        <Button
          type="button"
          variant="secondary"
          onClick={onSuccess}
          disabled={isActionLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isActionLoading} // ✅ ONLY HERE
          disabled={isActionLoading || isSingleLoading}
        >
          {isActionLoading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Feature"
              : "Create Feature"}
        </Button>

      </div>
    </form>
  );
};

export default FeatureForm;