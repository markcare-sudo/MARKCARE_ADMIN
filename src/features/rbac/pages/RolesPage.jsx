import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import RoleForm from "../components/RoleForm";
import RolesTable from "../components/RolesTable";
import { useRoles } from "@/context/RolesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import RolesFilters from "../components/RolesFilters";

const RolesPage = () => {
  const {
    roles = [],
    fetchRoles,
    fetchRole,
    isListLoading,
    isListError,
    listError,
    clearRoleActionState
  } = useRoles();

  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ 1. READ FILTERS FROM URL
  // ✅ FILTERS FIX
  const search = searchParams.get("search");
  const statusParam = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const filters = useMemo(() => ({
    search: search || "",
    status: statusParam || "",
    startDate: startDate || "",
    endDate: endDate || ""
  }), [search, statusParam, startDate, endDate]);

  // ✅ STABLE KEY
  const filtersKey = JSON.stringify(filters);

  const modalType = searchParams.get("modal");
  const editId = searchParams.get("id");

  const [selectedRole, setSelectedRole] = useState(null);
  const [isFetchingSelected, setIsFetchingSelected] = useState(false);

  // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
  useEffect(() => {
    fetchRoles(filters);
  }, [filtersKey, fetchRoles]);

  // ✅ 3. SYNC MODAL DATA BASED ON URL ID
  useEffect(() => {
    if (modalType === "edit" && editId) {
      const loadData = async () => {
        setIsFetchingSelected(true);
        try {
          const data = await fetchRole(editId);
          setSelectedRole(data);
        } finally {
          setIsFetchingSelected(false);
        }
      };
      loadData();
    } else {
      setSelectedRole(null);
    }
  }, [modalType, editId, fetchRole]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params.set(key, newFilters[key]);
      else params.delete(key);
    });
    setSearchParams(params, { replace: true });
  };

  const openRolePopup = (role = null) => {
    const params = new URLSearchParams(searchParams);
    if (role?.id) {
      params.set("modal", "edit");
      params.set("id", role.id);
    } else {
      params.set("modal", "create");
    }
    setSearchParams(params);
  };

  const closeRolePopup = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    params.delete("id");
    setSearchParams(params);
    // ✅ Resets action/modal errors so they don't appear when opening a new form
    clearRoleActionState();
  };

  /** ✅ REFINED ERROR STATE **/
  // Only show full-screen error if we have no data to show
  if (isListError && roles.length === 0) return (
    <div className="h-[70vh] flex items-center justify-center">
      <ApiFailure
        error={listError}
        message="Failed to load roles"
        onRetry={() => fetchRoles(filters)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles Management"
        subtitle="Manage user roles and permissions"
        breadcrumb="RBAC / Roles Management"
        action={
          <>
            <Button
              variant="outline"
              onClick={() => fetchRoles(filters)}
              disabled={isListLoading}
              className="flex items-center gap-2"
            >
              <FiRefreshCw className={isListLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button variant="primary" onClick={() => openRolePopup()}>
              + Create Role
            </Button>
          </>
        }
      />

      <RolesFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      <div className="min-h-[400px] relative">
        {/* ✅ Granular Loading Overlay */}
        {isListLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {roles.length === 0 && !isListLoading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <ApiEmpty
              message={filters.search ? `No roles found for "${filters.search}"` : "No roles available"}
            />
          </div>
        ) : (
          <RolesTable roles={roles} openRolePopup={openRolePopup} />
        )}
      </div>

      <Modal
        isOpen={!!modalType}
        onClose={closeRolePopup}
        title={modalType === "edit" ? "Edit Role" : "Create Role"}
      >
        {isFetchingSelected ? (
          <div className="py-10 text-center"><Loader size="sm" /></div>
        ) : (
          <RoleForm
            initialData={selectedRole}
            onSuccess={() => {
              closeRolePopup();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default RolesPage;