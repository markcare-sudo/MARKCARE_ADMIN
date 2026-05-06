import apiClient from "../utils/api";

/**
 * 📅 Fetch all bookings (user)
 */
const getBookings = async (params) => {
    return await apiClient.get("/service-bookings", { params });
};

/**
 * 📅 Get single booking details
 */
const getBookingById = async (bookingId) => {
    return await apiClient.get(`/service-bookings/${bookingId}`);
};

/**
 * 📅 Create booking
 * payload:
 * {
 *   service_id,
 *   address_id,
 *   scheduled_date,
 *   time_slot,
 *   payment_method, // ONLINE | COS
 *   notes,
 *   asset_info
 * }
 */
const create = async (payload) => {
    return await apiClient.post("/service-bookings", payload);
};

/**
 * 💳 Verify Razorpay payment
 */
const verifyPayment = async (payload) => {
    return await apiClient.post("/service-bookings/verify", payload);
};

/**
 * ❌ Cancel booking
 */
const cancelBooking = async (bookingId, reason) => {
    return await apiClient.put(`/service-bookings/${bookingId}/cancel`, { reason });
};

/**
 * 📊 Track booking (status timeline)
 */
const trackBooking = async (bookingId) => {
    return await apiClient.get(`/service-bookings/${bookingId}/track`);
};

/**
 * 🛠️ Admin: update booking status
 */
const updateBookingStatus = async (bookingId, data) => {
    return await apiClient.patch(`/service-bookings/${bookingId}/status`, data);
};

/**
 * 🗑️ Admin: delete booking
 */
const deleteBooking = async (bookingId) => {
    return await apiClient.delete(`/service-bookings/${bookingId}`);
};

const bookingService = {
    getBookings,
    getBookingById,
    create,
    verifyPayment,
    cancelBooking,
    trackBooking,

    // admin
    updateBookingStatus,
    deleteBooking,
};

export default bookingService;