import apiClient from "../utils/api";

/**
 * Fetches the order history for the authenticated user.
 */
const getOrders = async (params) => {
    return await apiClient.get("/orders/all", { params });
};

/**
 * Fetches detailed information for a specific order.
 * Useful for the "Order Details" tracking page.
 */
const getOrderById = async (orderId) => {
    return await apiClient.get(`/orders/${orderId}`);
};

/**
 * Places a new order.
 * payload: { address_id, payment_method, cart_items, total_amount }
 */
const createOrder = async (payload) => {
    return await apiClient.post("/orders", payload);
};

const verifyPayment = async (payload) => {
    return await apiClient.post("/orders/verify", payload);
};

/**
 * Cancels a pending or confirmed order.
 * Note: Logic usually depends on whether the order has been shipped.
 */
const cancelOrder = async (orderId, reason) => {
    return await apiClient.put(`/orders/${orderId}/cancel`, { reason });
};

/**
 * Fetches tracking information for a specific order.
 */
const trackOrder = async (orderId) => {
    return await apiClient.get(`/orders/${orderId}/track`);
};

const ordersService = {
    getOrders,
    getOrderById,
    createOrder,
    verifyPayment,
    cancelOrder,
    trackOrder
};

export default ordersService;