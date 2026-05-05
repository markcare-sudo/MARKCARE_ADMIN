import apiClient from "../utils/api";

const getMyMenu = async () => {
    const res = await apiClient.get(`/sidebar/me/sidebar`);
    return res.data.data;
};

const getModulesFeaturesPermissions = async () => {

    const res = await apiClient.get(`/iam/modules/my-config`);
    return res;
};

const getModules = async (filters) => {
    const res = await apiClient.get("/iam/modules", { params: filters });
    return res;
};

const getModule = async (id) => {
    const res = await apiClient.get(`/iam/modules/${id}`);
    return res;
};

const createModule = async (payload) => {
    const res = await apiClient.post(`/iam/modules`, payload);
    return res;
};

const updateModule = async (id, payload) => {
    const res = await apiClient.put(`/iam/modules/${id}`, payload);
    return res;
};

const deleteModule = async (id) => {
    const res = await apiClient.delete(`/iam/modules/${id}`);
    return res;
};

const deleteModules = async () => {
    const res = await apiClient.delete(`/iam/modules/force-all`);
    return res;
};

const moduleservice = {
    getMyMenu,
    getModulesFeaturesPermissions,
    getModules,
    getModule,
    createModule,
    updateModule,
    deleteModule,
    deleteModules
};

export default moduleservice