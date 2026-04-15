import apiClient from "../utils/api";

const getContext = async () => {
    const res = await apiClient.get("/auth/context");
    return res.data.data;
};

export default {
    getContext,
};
