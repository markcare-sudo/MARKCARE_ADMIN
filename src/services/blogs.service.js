import apiClient from "../utils/api";

const getBlogs = async (filters) => {
    return await apiClient.get("/blogs", {
        params: filters
    });
};

const getBlog = async (id) => {
    return await apiClient.get(`/blogs/${id}`);
};

const createBlog = async (payload) => {
    return await apiClient.post("/blogs", payload);
};

const updateBlog = async (id, payload) => {
    return await apiClient.put(`/blogs/${id}`, payload);
};

const deleteBlog = async (id) => {
    return await apiClient.delete(`/blogs/${id}`);
};

const getTrendingKeywords = async () => {
    return await apiClient.get("/blogs/trending-keywords");
};

const blogsService = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getTrendingKeywords
};

export default blogsService;