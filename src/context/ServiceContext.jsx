import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";
import servicesService from "@/services/services.service";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [services, setServices] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    // ✅ FETCH SERVICES LIST
    const fetchServices = useCallback(async (filters = {}) => {
        if (!isAuthenticated) return;

        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await servicesService.getServices(filters);

            // ✅ SAFE DATA EXTRACTION (prevents crash)
            const list = res?.data?.data?.data || [];

            setServices(list);
            setStatus(apiStatusConstants.SUCCESS);

        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    // ✅ FETCH SINGLE SERVICE
    const fetchService = async (id) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await servicesService.getService(id);

            setStatus(apiStatusConstants.SUCCESS);

            // includes benefits + schedule (based on your model)
            return res?.data?.data;

        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // ✅ CREATE SERVICE
    const createService = async (data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await servicesService.createService(data);

            successHandler(res);

            await fetchServices();

        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // ✅ UPDATE SERVICE
    const updateService = async (id, data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await servicesService.updateService(id, data);

            successHandler(res);

            await fetchServices();

        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // ✅ DELETE SERVICE
    const deleteService = async (id) => {
        try {
            const res = await servicesService.deleteService(id);

            successHandler(res);

            await fetchServices();

        } catch (err) {
            postErrorHandler(err);
        }
    };

    // ✅ AUTO FETCH ON LOGIN
    useEffect(() => {
        if (isAuthenticated) {
            fetchServices();
        }
    }, [isAuthenticated, fetchServices]);

    return (
        <ServiceContext.Provider
            value={{
                services,
                status,
                loading: status === apiStatusConstants.IN_PROGRESS,
                isError: status === apiStatusConstants.FAILURE,

                fetchServices,
                fetchService,
                createService,
                updateService,
                deleteService
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

// ✅ HOOK
export const useServices = () => useContext(ServiceContext);