import apiClient from "../utils/api";


const getUsers = async (filters) => {
    const res = await apiClient.get("/iam/users", { params: filters });
    return res.data.data;
};

const getUser = async (id) => {
    const res = await apiClient.get(`/iam/users/${id}`);
    return res.data.data;
};

const createUser = async (payload) => {
    const res = await apiClient.post(`/iam/users`, payload);
    return res.data.data;
};

const verifyUser = async (token) => {
    const res = await apiClient.get(`/iam/users/verify-email`, {
        params: { token }
    });
    return res;
};

const verifyTenantUser = async (token) => {
    const res = await apiClient.get(`/tenants/verify-email`, {
        params: { token }
    });
    return res;
};

const updateUser = async (id, payload) => {
    const res = await apiClient.put(`/iam/users/${id}`, payload);
    return res.data.data;
};

const deleteUser = async (id) => {
    const res = await apiClient.delete(`/iam/users/${id}/permanent`);
    return res.data.data;
};

// const deleteUser = async (id) => {
//     const res = await apiClient.delete(`/iam/users/${id}`);
//     return res.data.data;
// };

const usersService = {
    getUsers,
    getUser,
    createUser,
    verifyUser,
    verifyTenantUser,
    updateUser,
    deleteUser
};

export default usersService