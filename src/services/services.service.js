import apiClient from "../utils/api";

// ✅ GET ALL SERVICES
const getServices = async (filters) => {
    return await apiClient.get("/catalog/services", { params: filters });
};

// ✅ GET SINGLE SERVICE (with benefits + schedule)
const getService = async (id) => {
    return await apiClient.get(`/catalog/services/${id}`);
};

// ✅ CREATE SERVICE
const createService = async (payload) => {
    return await apiClient.post(`/catalog/services`, payload);
};

// ✅ UPDATE SERVICE
const updateService = async (id, payload) => {
    return await apiClient.put(`/catalog/services/${id}`, payload);
};

// ✅ DELETE SERVICE
const deleteService = async (id) => {
    return await apiClient.delete(`/catalog/services/${id}`);
};

/**
 * ✅ OPTIONAL: SERVICE BENEFITS (if managed separately)
 */
const addServiceBenefit = async (serviceId, data) => {
    return await apiClient.post(`/catalog/services/${serviceId}/benefits`, data);
};

const updateServiceBenefit = async (benefitId, data) => {
    return await apiClient.put(`/catalog/service-benefits/${benefitId}`, data);
};

const deleteServiceBenefit = async (benefitId) => {
    return await apiClient.delete(`/catalog/service-benefits/${benefitId}`);
};

/**
 * ✅ OPTIONAL: MAINTENANCE SCHEDULE (AMC/CMC)
 */
const updateServiceSchedule = async (serviceId, data) => {
    return await apiClient.put(`/catalog/services/${serviceId}/schedule`, data);
};

const servicesService = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,

    // optional advanced APIs
    addServiceBenefit,
    updateServiceBenefit,
    deleteServiceBenefit,
    updateServiceSchedule
};

export default servicesService;