import apiClient from "../utils/api";

const getBrands = async (filters) => {
    return await apiClient.get("/catalog/brands", { params: filters });
};

const getBrand = async (id) => {
    return await apiClient.get(`/catalog/brands/${id}`);
};

const createBrand = async (payload) => {
    return await apiClient.post(`/catalog/brands`, payload);
};

const updateBrand = async (id, payload) => {
    return await apiClient.put(`/catalog/brands/${id}`, payload);
};

const deleteBrand = async (id) => {
    return await apiClient.delete(`/catalog/brands/${id}`);
};

const brandsService = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
};

export default brandsService;