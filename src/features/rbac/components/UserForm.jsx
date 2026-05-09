import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import PhoneInput from "@/components/ui/PhoneInput";
import { postErrorHandler } from "@/components/ErrorHandler";
import { useUsers } from "@/context/UsersContext";
import { useRoles } from "@/context/RolesContext";

const UserForm = ({ onSuccess, initialData }) => {
  const { createUser, updateUser, isActionLoading, isSingleLoading } = useUsers();
  const { roles } = useRoles();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "PLATFORM",
    role_id: "",
    is_active: true,
    is_super_admin: false,
  });

  const isEdit = Boolean(initialData);

  const roleNames = roles.map(r => r.name);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        user_type: initialData.user_type || "TENANT",
        role_id: initialData.role?.name || "",
        is_active: initialData.is_active ?? true,
        is_super_admin: initialData.is_super_admin ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    if (isActionLoading) return; // ✅ prevent edit during submit

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isActionLoading) return;

    try {
      if (!form.role_id) throw new Error("Please select a Role");

      const selectedRole = roles.find(r => r.name === form.role_id);

      const payload = {
        ...form,
        role_id: selectedRole ? selectedRole.id : null
      };

      if (isEdit) {
        await updateUser(initialData.id, payload);
      } else {
        await createUser(payload);
      }

      onSuccess?.();
    } catch (err) {
      postErrorHandler(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[80vh] px-1"
    >
      {/* 🔥 OPTIONAL: show loader only when fetching existing user */}
      {isSingleLoading && (
        <div className="flex justify-center py-4">
          <span className="text-sm text-gray-500">Loading user data...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter user name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isActionLoading || isSingleLoading}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="user@iqlims.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isEdit || isActionLoading || isSingleLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhoneInput
          label="Phone Number"
          value={form.phone}
          onChange={(val) => handleChange("phone", val)}
          disabled={isActionLoading || isSingleLoading}
        />

        <Select
          label="Role"
          value={form.role_id}
          onChange={(e) => handleChange("role_id", e.target.value)}
          options={roleNames}
          disabled={isActionLoading || isSingleLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="User Type"
          value={form.user_type}
          onChange={(e) => handleChange("user_type", e.target.value)}
          options={["TENANT", "PLATFORM", "CUSTOMER"]}
          disabled={isActionLoading || isSingleLoading}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg flex gap-8 border border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_super_admin}
            onChange={(e) => handleChange("is_super_admin", e.target.checked)}
            disabled={isActionLoading || isSingleLoading}
          />
          <span className="text-sm font-medium text-gray-700">Super Admin</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            disabled={isActionLoading || isSingleLoading}
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 py-4 border-t mt-4">
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
          className="px-8 min-w-[140px]"
        >
          {isActionLoading
            ? isEdit
              ? "Updating..."
              : "Inviting..."
            : isEdit
              ? "Update User"
              : "Invite User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;