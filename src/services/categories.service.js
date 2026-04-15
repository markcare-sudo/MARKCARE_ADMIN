import apiClient from "../utils/api";

const getCategories = async (filters) => {
    return await apiClient.get("/catalog/categories", { params: filters });
};

const getCategory = async (id) => {
    return await apiClient.get(`/catalog/categories/${id}`);
};

const createCategory = async (payload) => {
    return await apiClient.post(`/catalog/categories`, payload);
};

const updateCategory = async (id, payload) => {
    return await apiClient.put(`/catalog/categories/${id}`, payload);
};

const deleteCategory = async (id) => {
    return await apiClient.delete(`/catalog/categories/${id}`);
};

const categoriesService = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoriesService;