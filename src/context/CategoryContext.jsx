import { createContext, useContext, useState, useEffect, useCallback } from "react";
import categoriesService from "@/services/categories.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const fetchCategories = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await categoriesService.getCategories(filters);
            setCategories(res.data.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const fetchCategory = async (id) => {
        try {
            const res = await categoriesService.getCategory(id);
            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const createCategory = async (data) => {
        try {
            const res = await categoriesService.createCategory(data);
            successHandler(res);
            await fetchCategories();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const updateCategory = async (id, data) => {
        try {
            const res = await categoriesService.updateCategory(id, data);
            successHandler(res);
            await fetchCategories();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const res = await categoriesService.deleteCategory(id);
            successHandler(res);
            await fetchCategories();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchCategories();
    }, [isAuthenticated, fetchCategories]);

    return (
        <CategoryContext.Provider value={{
            categories, status,
            loading: status === apiStatusConstants.IN_PROGRESS,
            fetchCategories, fetchCategory, createCategory, updateCategory, deleteCategory
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => useContext(CategoryContext);