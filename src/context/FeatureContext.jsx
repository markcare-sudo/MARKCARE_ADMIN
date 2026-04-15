import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import featuresService from "@/services/feature.service";
import { useModules } from "./ModulesContext";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const FeaturesContext = createContext();

export const FeaturesProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const { fetchModulesFeaturesPermissions } = useModules();

  const [features, setFeatures] = useState([]);

  // 1. Separate Statuses for List (Table) and Action (CRUD/Modal)
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

  // State Updater Helper
  const updateState = useCallback((key, status, error = null) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
    setErrors((prev) => ({ ...prev, [key]: error }));
  }, []);

  const fetchFeatures = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;
    try {
      updateState("list", apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.getFeatures(filters);
      setFeatures(res.data?.data?.data || res.data?.data || []);
      updateState("list", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("list", apiStatusConstants.FAILURE, err);
    }
  }, [isAuthenticated]);

  const fetchFeature = useCallback(async (id) => {
    if (!isAuthenticated) return;
    try {
      updateState("single", apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.getFeature(id);
      updateState("single", apiStatusConstants.SUCCESS);
      return res.data?.data;
    } catch (err) {
      updateState("single", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  }, [isAuthenticated, updateState]);

  const createFeature = async (data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.createFeature(data);
      successHandler(res);

      // Refresh both the flat list and the module tree
      await Promise.all([fetchFeatures(), fetchModulesFeaturesPermissions()]);

      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const updateFeature = async (id, data) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.updateFeature(id, data);
      successHandler(res);

      await Promise.all([fetchFeatures(), fetchModulesFeaturesPermissions()]);
      updateState("action", apiStatusConstants.SUCCESS);
      return res.data;
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const deleteFeature = async (id) => {
    try {
      updateState("action", apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.deleteFeature(id);
      successHandler(res);

      await Promise.all([fetchFeatures(), fetchModulesFeaturesPermissions()]);
      updateState("action", apiStatusConstants.SUCCESS);
    } catch (err) {
      updateState("action", apiStatusConstants.FAILURE, err);
      postErrorHandler(err);
      throw err;
    }
  };

  const clearFeatureActionState = () => {
    updateState("action", apiStatusConstants.INITIAL);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeatures();
    } else {
      setFeatures([]);
      setStatuses({ list: apiStatusConstants.INITIAL, action: apiStatusConstants.INITIAL });
      setErrors({ list: null, action: null });
    }
  }, [isAuthenticated, fetchFeatures]);

  return (
    <FeaturesContext.Provider
      value={{
        features,

        // Loading States
        isListLoading: statuses.list === apiStatusConstants.IN_PROGRESS,
        isSingleLoading: statuses.single === apiStatusConstants.IN_PROGRESS,
        isActionLoading: statuses.action === apiStatusConstants.IN_PROGRESS,

        // Error States
        listError: errors.list,
        actionError: errors.action,

        // UI Helper Booleans
        isListError: statuses.list === apiStatusConstants.FAILURE,
        isEmpty: statuses.list === apiStatusConstants.SUCCESS && features.length === 0,

        // Actions
        fetchFeatures,
        fetchFeature,
        createFeature,
        updateFeature,
        deleteFeature,
        clearFeatureActionState,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
};