import { createContext, useContext, useState, useEffect, useCallback } from "react";
import modulesService from "@/services/modules.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const ModulesContext = createContext();

export const ModulesProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuthContext();

    const [modules, setModules] = useState([]);
    const [tree, setTree] = useState([]);
    const [menu, setMenu] = useState([])

    // 1. Separate Statuses for Sidebar (tree), Table (list), and CRUD (action)
    const [statuses, setStatuses] = useState({
        tree: apiStatusConstants.INITIAL,
        list: apiStatusConstants.INITIAL,
        single: apiStatusConstants.INITIAL,
        action: apiStatusConstants.INITIAL,
    });

    // 2. Separate Errors
    const [errors, setErrors] = useState({
        tree: null,
        list: null,
        action: null,
    });

    // Centralized state updater
    const updateState = useCallback((key, status, error = null) => {
        setStatuses((prev) => ({ ...prev, [key]: status }));
        setErrors((prev) => ({ ...prev, [key]: error }));
    }, []);

    const fetchMyMenu = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            updateState("tree", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getMyMenu();
            setMenu(res || []);
            updateState("tree", apiStatusConstants.SUCCESS);
        } catch (err) {
            updateState("tree", apiStatusConstants.FAILURE, err);
        }
    }, [isAuthenticated, user?.id]);

    const fetchModulesFeaturesPermissions = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            updateState("tree", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getModulesFeaturesPermissions(user);
            setTree(res.data.data || []);
            updateState("tree", apiStatusConstants.SUCCESS);
        } catch (err) {
            updateState("tree", apiStatusConstants.FAILURE, err);
        }
    }, [isAuthenticated, user?.id]);

    const fetchModules = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            updateState("list", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getModules(filters);
            setModules(res.data.data.data || []);
            updateState("list", apiStatusConstants.SUCCESS);
        } catch (err) {
            updateState("list", apiStatusConstants.FAILURE, err);
        }
    }, [isAuthenticated]);

    const fetchModule = useCallback(async (id) => {
        if (!isAuthenticated) return;
        try {
            updateState("single", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getModule(id);
            updateState("single", apiStatusConstants.SUCCESS);
            return res.data.data;
        } catch (err) {
            updateState("single", apiStatusConstants.FAILURE, err);
            postErrorHandler(err);
            throw err;
        }
    }, [isAuthenticated, updateState]);

    const createModule = async (data) => {
        try {
            updateState("action", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.createModule(data);
            successHandler(res);
            // Refreshing both ensures Sidebar and Table are synced
            await Promise.all([fetchMyMenu(), fetchModulesFeaturesPermissions(), fetchModules()]);
            updateState("action", apiStatusConstants.SUCCESS);
            return res.data;
        } catch (err) {
            updateState("action", apiStatusConstants.FAILURE, err);
            postErrorHandler(err);
            throw err;
        }
    };

    const updateModule = async (id, data) => {
        try {
            updateState("action", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.updateModule(id, data);
            successHandler(res);
            await Promise.all([fetchMyMenu(), fetchModulesFeaturesPermissions(), fetchModules()]);
            updateState("action", apiStatusConstants.SUCCESS);
            return res.data;
        } catch (err) {
            updateState("action", apiStatusConstants.FAILURE, err);
            postErrorHandler(err);
            throw err;
        }
    };

    const deleteModule = async (id) => {
        try {
            updateState("action", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.deleteModule(id);
            successHandler(res);
            await Promise.all([fetchMyMenu(), fetchModulesFeaturesPermissions(), fetchModules()]);
            updateState("action", apiStatusConstants.SUCCESS);
        } catch (err) {
            updateState("action", apiStatusConstants.FAILURE, err);
            postErrorHandler(err);
            throw err;
        }
    };

    const deleteModules = async () => {
        try {
            updateState("action", apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.deleteModules();
            successHandler(res);
            await Promise.all([fetchMyMenu(), fetchModulesFeaturesPermissions(), fetchModules()]);
            updateState("action", apiStatusConstants.SUCCESS);
        } catch (err) {
            updateState("action", apiStatusConstants.FAILURE, err);
            postErrorHandler(err);
            throw err;
        }
    };

    const clearModuleActionState = () => {
        updateState("action", apiStatusConstants.INITIAL);
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchMyMenu()
            fetchModulesFeaturesPermissions();
            fetchModules();
        } else {
            setMenu([]);
            setModules([]);
            setTree([]);
            setStatuses({
                tree: apiStatusConstants.INITIAL,
                list: apiStatusConstants.INITIAL,
                action: apiStatusConstants.INITIAL,
            });
            setErrors({ tree: null, list: null, action: null });
        }
    }, [isAuthenticated, user?.id, fetchMyMenu, fetchModulesFeaturesPermissions, fetchModules]);

    return (
        <ModulesContext.Provider
            value={{
                // Data
                menu,
                modules,
                tree,

                // Loading States
                isTreeLoading: statuses.tree === apiStatusConstants.IN_PROGRESS,
                isListLoading: statuses.list === apiStatusConstants.IN_PROGRESS,
                isSingleLoading: statuses.single === apiStatusConstants.IN_PROGRESS,
                isActionLoading: statuses.action === apiStatusConstants.IN_PROGRESS,

                // Error States
                treeError: errors.tree,
                listError: errors.list,
                actionError: errors.action,

                // Derived Status
                isListError: statuses.list === apiStatusConstants.FAILURE,
                isTreeError: statuses.tree === apiStatusConstants.FAILURE,
                isEmpty: statuses.list === apiStatusConstants.SUCCESS && modules.length === 0,

                // Methods
                fetchMyMenu,
                fetchModulesFeaturesPermissions,
                fetchModules,
                fetchModule,
                createModule,
                updateModule,
                deleteModule,
                deleteModules,
                clearModuleActionState,
            }}
        >
            {children}
        </ModulesContext.Provider>
    );
};

export const useModules = () => {
    const context = useContext(ModulesContext);
    if (!context) {
        throw new Error("useModules must be used within a ModulesProvider");
    }
    return context;
};