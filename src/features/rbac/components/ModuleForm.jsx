import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useModules } from "@/context/ModulesContext";

const ModuleForm = ({ onSuccess, initialData, modules = [] }) => {
  const { updateModule, createModule, isActionLoading, isSingleLoading } = useModules();

  const [form, setForm] = useState({
    name: "",
    code: "",
    parent_id: "",
    path: "",
    icon: "",
    navigation_type: "SIDEBAR",
    is_clickable: true,
    is_visible: true,
  });

  const [isPathManual, setIsPathManual] = useState(false);
  const [isIconManual, setIsIconManual] = useState(false);

  const isEdit = !!initialData;

  // 🔥 slug helper
  const slugify = (text) =>
    text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  // 🔥 extract parentId from "id::name"
  const extractParentId = (value) => {
    if (!value || value === "None (Root)") return null;
    return value.split("::")[0];
  };

  // 🔥 get parent slug from name
  const getParentSlug = (parentId) => {
    const parent = modules.find((m) => String(m.id) === String(parentId));
    return parent ? slugify(parent.name) : "";
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        code: initialData.code || "",
        parent_id: initialData.parent_id || "",
        path: initialData.path || "",
        icon: initialData.icon || "",
        navigation_type: initialData.navigation_type || "SIDEBAR",
        is_clickable: initialData.is_clickable ?? true,
        is_visible: initialData.is_visible ?? true,
      });

      setIsPathManual(true);
      setIsIconManual(true);
    }
  }, [initialData]);

  // 🔥 AUTO PATH GENERATION
  useEffect(() => {
    if (isPathManual) return;
    if (!form.name) return;

    const childSlug = slugify(form.name);

    if (!form.parent_id) {
      setForm((prev) => ({
        ...prev,
        path: `/${childSlug}`,
      }));
    } else {
      const parentSlug = getParentSlug(form.parent_id);

      setForm((prev) => ({
        ...prev,
        path: `/${parentSlug}/${childSlug}`,
      }));
    }
  }, [form.name, form.parent_id]);

  // 🔥 AUTO ICON GENERATION
  useEffect(() => {
    if (isIconManual) return;
    if (!form.name) return;

    const iconKey = slugify(form.name);

    setForm((prev) => ({
      ...prev,
      icon: iconKey,
    }));
  }, [form.name]);

  const handleChange = (field, value) => {
    if (isActionLoading) return;

    if (field === "path") setIsPathManual(true);
    if (field === "icon") setIsIconManual(true);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleParentChange = (value) => {
    const parentId = extractParentId(value);
    handleChange("parent_id", parentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isActionLoading) return;

    try {
      if (isEdit) {
        await updateModule(initialData.id, form);
      } else {
        await createModule(form);
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {isSingleLoading && (
        <div className="text-center text-sm text-gray-500 py-2">
          Loading module data...
        </div>
      )}

      {/* NAME + CODE */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Module Name"
          placeholder="Enter module name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isActionLoading || isSingleLoading}
          required
        />

        <Input
          label="Path"
          placeholder="/users"
          value={form.path}
          onChange={(e) => handleChange("path", e.target.value)}
        />

      </div>

      {/* PARENT + NAV TYPE */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Parent Module"
          value={
            form.parent_id
              ? `${form.parent_id}::${modules.find((m) => String(m.id) === String(form.parent_id))?.name || ""
              }`
              : "None (Root)"
          }
          onChange={(e) => handleParentChange(e.target.value)}
          options={[
            "None (Root)",
            ...(modules?.map((m) => `${m.id}::${m.name}`) || []),
          ]}
        />

        <Select
          label="Navigation Type"
          value={form.navigation_type}
          disabled={isActionLoading || isSingleLoading}
          options={["SIDEBAR", "TOPBAR", "HIDDEN"]}
          onChange={(e) => handleChange("navigation_type", e.target.value)}
        />
      </div>

      {/* TOGGLES */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_clickable}
            onChange={() => handleChange("is_clickable", !form.is_clickable)}
          />
          Clickable
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={() => handleChange("is_visible", !form.is_visible)}
          />
          Visible
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>

        <Button type="submit" loading={isActionLoading}>
          {isEdit ? "Update Module" : "Create Module"}
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;