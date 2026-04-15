import apiClient from "../utils/api";


const getRoles = async (filters) => {
    const res = await apiClient.get("/iam/roles", { params : filters});
    return res;
};


const getRole = async (id) => {
    const res = await apiClient.get(`/iam/roles/${id}`);
    return res;
};

const createRole = async (payload) => {
    const res = await apiClient.post(`/iam/roles`, payload);
    return res;
};

const updateRole = async (id, payload) => {
    const res = await apiClient.put(`/iam/roles/${id}`, payload);
    return res;
};

const deleteRole = async (id) => {
    const res = await apiClient.delete(`/iam/roles/${id}`);
    return res;
};

const rolesService = {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole
};

export default rolesService