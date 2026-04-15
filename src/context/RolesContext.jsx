import { createContext, useContext, useState, useEffect, useCallback } from "react";
import rolesService from "@/services/roles.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  const [roles, setRoles] = useState([]);

  // 1. Granular Statuses
  const [statuses, setStatuses] = useState({
    list: apiStatusConstants.INITIAL,
    single: apiStatusConstants.INITIAL,
    action: apiStatusConstants.INITIAL,
  });

  // 2. Granular Errors
  const [errors, setErrors] = useState({
    list: null,
    action: null,
  });

  // State Updater Helper
  const updateState = useCallback((key, status, error = null) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
    setErrors((prev) => ({ ...prev, [key]: error }));
  }, []);

  const fetchRoles = useCallback(async (filters) => {
    if (!isAuthenticated) return;
    try {
      updateState("list", apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.getRoles(filters);
      setRoles(res.data?.data?.data || res.data?.data || []);
      updateState("list", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("list", apiStatusConstants.FAILURE, err);
      // We don't usually postErrorHandler for auto-fetches to avoid toast spam
    }
  }, [isAuthenticated]);

  const fetchRole = useCallback(async (id) => {
    if (!isAuthenticated) return;
    try {
      updateState("single", apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.getRole(id);
      updateState("single", apiStatusConstants.SUCCESS);
      return res.data?.data;
    } catch (err) {
      updateState("single", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  }, [isAuthenticated, updateState]);

  const createRole = async (data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.createRole(data);
      successHandler(res);
      await fetchRoles(); // Refresh the table
      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err; // Allow the form to handle the catch block
    }
  };

  const updateRole = async (id, data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.updateRole(id, data);
      successHandler(res);
      await fetchRoles();
      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const deleteRole = async (id) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.deleteRole(id);
      successHandler(res);
      await fetchRoles();
      updateState("action", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
    }
  };

  const clearRoleActionState = () => {
    updateState("action", apiStatusConstants.INITIAL);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRoles();
    } else {
      setRoles([]);
      setStatuses({ list: apiStatusConstants.INITIAL, action: apiStatusConstants.INITIAL });
      setErrors({ list: null, action: null });
    }
  }, [isAuthenticated, fetchRoles]);

  return (
    <RolesContext.Provider
      value={{
        roles,

        // Loading States
        isListLoading: statuses.list === apiStatusConstants.IN_PROGRESS,
        isSingleLoading: statuses.single === apiStatusConstants.IN_PROGRESS,
        isActionLoading: statuses.action === apiStatusConstants.IN_PROGRESS,

        // Error Objects
        listError: errors.list,
        actionError: errors.action,

        // Helper Booleans
        isListError: statuses.list === apiStatusConstants.FAILURE,
        isEmpty: statuses.list === apiStatusConstants.SUCCESS && roles.length === 0,

        // Methods
        fetchRoles,
        fetchRole,
        createRole,
        updateRole,
        deleteRole,
        clearRoleActionState,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};