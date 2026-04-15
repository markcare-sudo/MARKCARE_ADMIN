import { createContext, useContext, useState, useEffect, useCallback } from "react";
import usersService from "@/services/users.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  const [users, setUsers] = useState([]);

  // 1. Separate Statuses
  const [statuses, setStatuses] = useState({
    list: apiStatusConstants.INITIAL,
    single: apiStatusConstants.INITIAL,
    action: apiStatusConstants.INITIAL,
  });

  // 2. Separate Errors
  const [errors, setErrors] = useState({
    list: null,
    action: null,
  });

  // Helper to update status and clear related error if moving to IN_PROGRESS
  const updateState = useCallback((key, status, error = null) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
    setErrors((prev) => ({ ...prev, [key]: error }));
  }, []);

  const fetchUsers = useCallback(async (filters) => {
    if (!isAuthenticated) return;
    try {
      updateState("list", apiStatusConstants.IN_PROGRESS);
      const res = await usersService.getUsers(filters);
      setUsers(res.data?.data || res.data || res || []);
      updateState("list", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("list", apiStatusConstants.FAILURE, err);
      // We don't usually use postErrorHandler for list fetches to avoid 
      // aggressive toast popups on every background refresh.
    }
  }, [isAuthenticated]);

  const fetchUser = useCallback(async (id) => {
    if (!isAuthenticated) return;
    try {
      updateState("single", apiStatusConstants.IN_PROGRESS);
      const res = await usersService.getUser(id);
      updateState("single", apiStatusConstants.SUCCESS);
      return res.data?.data || res.data || res;
    } catch (err) {
      updateState("single", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  }, [isAuthenticated, updateState]);

  const createUser = async (data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await usersService.createUser(data);
      successHandler(res);
      await fetchUsers();
      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const updateUser = async (id, data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await usersService.updateUser(id, data);
      successHandler(res);
      await fetchUsers();
      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await usersService.deleteUser(id);
      successHandler(res);
      await fetchUsers();
      updateState("action", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
    }
  };

  // Helper to manually clear action errors (e.g., when opening a modal)
  const clearActionState = () => {
    updateState("action", apiStatusConstants.INITIAL);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    } else {
      setUsers([]);
      setStatuses({ list: apiStatusConstants.INITIAL, action: apiStatusConstants.INITIAL });
      setErrors({ list: null, action: null });
    }
  }, [isAuthenticated, fetchUsers]);

  return (
    <UsersContext.Provider
      value={{
        users,
        // UI Helpers - Loading
        isListLoading: statuses.list === apiStatusConstants.IN_PROGRESS,
        isSingleLoading: statuses.single === apiStatusConstants.IN_PROGRESS,
        isActionLoading: statuses.action === apiStatusConstants.IN_PROGRESS,

        // UI Helpers - Errors
        listError: errors.list,
        actionError: errors.action,

        // Derived States
        isListError: statuses.list === apiStatusConstants.FAILURE,
        isEmpty: statuses.list === apiStatusConstants.SUCCESS && users.length === 0,

        // Actions
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,
        clearActionState,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};