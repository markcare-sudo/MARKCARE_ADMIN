import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useModules } from "@/context/ModulesContext";

const ModuleForm = ({ onSuccess, initialData }) => {
  const { updateModule, createModule, isActionLoading, isSingleLoading } = useModules();

  const [form, setForm] = useState({
    name: "",
    description: "",
    path: "",
    has_features: false,
  });

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        path: initialData.path || "",
        has_features: !!initialData.has_features,
      });
    } else {
      setForm({
        name: "",
        description: "",
        path: "",
        has_features: false,
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
        await updateModule(initialData.id, form);
      } else {
        await createModule(form);
      }

      onSuccess?.();
    } catch (err) {
      console.error("Module submission failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ✅ Optional: show when fetching existing module */}
      {isSingleLoading && (
        <div className="text-center text-sm text-gray-500 py-2">
          Loading module data...
        </div>
      )}

      {/* Name & Path */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Module Name
          </label>
          <Input
            value={form.name}
            placeholder="e.g. Inventory"
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={isActionLoading || isSingleLoading}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Path
          </label>
          <Input
            placeholder="/inventory"
            value={form.path}
            onChange={(e) => handleChange("path", e.target.value)}
            disabled={isActionLoading || isSingleLoading}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-gray-500">
          Description
        </label>
        <Input
          value={form.description}
          placeholder="Briefly describe this module"
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isActionLoading || isSingleLoading}
          required
        />
      </div>

      {/* Toggle */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${form.has_features
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
          }`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800">
            Has Sub-Features?
          </span>
          <span className="text-xs text-gray-500">
            Enable this if the module has a dropdown menu
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleChange("has_features", !form.has_features)}
          disabled={isActionLoading || isSingleLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.has_features ? "bg-blue-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.has_features ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
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
              ? "Update Module"
              : "Create Module"}
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;