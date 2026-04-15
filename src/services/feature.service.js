import apiClient from "../utils/api";


const getFeatures = async (filters) => {
    const res = await apiClient.get("/iam/features", { params : filters});
    return res;
};

const getFeature = async (id) => {
    const res = await apiClient.get(`/iam/features/${id}`);
    return res;
};

const createFeature = async (payload) => {
    const res = await apiClient.post(`/iam/features`, payload);
    return res;
};

const updateFeature = async (id, payload) => {
    const res = await apiClient.put(`/iam/features/${id}`, payload);
    return res;
};

const deleteFeature = async (id) => {
    const res = await apiClient.delete(`/iam/features/${id}`);
    return res;
};

const featuresService = {
    getFeatures,
    getFeature,
    createFeature,
    updateFeature,
    deleteFeature
};

export default featuresService