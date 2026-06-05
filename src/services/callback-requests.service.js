import apiClient from "../utils/api";

const getRequests = async (filters) => {
    return await apiClient.get("/callback-requests", { params: filters });
};

const getRequest = async (id) => {
    return await apiClient.get(`/callback-requests/${id}`);
};

const createRequest = async (payload) => {
    return await apiClient.post(`/callback-requests`, payload);
};

const updateRequest = async (id, payload) => {
    return await apiClient.put(`/callback-requests/${id}`, payload);
};

const deleteRequest = async (id) => {
    return await apiClient.delete(`/callback-requests/${id}`);
};

const callbackRequestsService = {
    getRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
};

export default callbackRequestsService;