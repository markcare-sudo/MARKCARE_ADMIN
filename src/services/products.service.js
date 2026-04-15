import apiClient from "../utils/api";

const getProducts = async (filters) => {
    return await apiClient.get("/catalog/products", { params: filters });
};

const getProduct = async (id) => {
    // This typically returns Product + Variants + Images via Sequelize 'include'
    return await apiClient.get(`/catalog/products/${id}`);
};

const createProduct = async (payload) => {
    return await apiClient.post(`/catalog/products`, payload);
};

const updateProduct = async (id, payload) => {
    return await apiClient.put(`/catalog/products/${id}`, payload);
};

const deleteProduct = async (id) => {
    return await apiClient.delete(`/catalog/products/${id}`);
};

/** * OPTIONAL: Specialized Variant endpoints 
 * If you manage variants separately from the main product form
 */
const updateVariantStock = async (variantId, quantity) => {
    return await apiClient.patch(`/catalog/variants/${variantId}/stock`, { quantity });
};

const productsService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock
};

export default productsService;