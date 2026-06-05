import { createContext, useContext, useState, useEffect, useCallback } from "react";
import callbackRequestsService from "@/services/callback-requests.service"; // ✅ Pointing to your new service file
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const CallBackRequestContext = createContext();

export const CallBackRequestProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const fetchRequests = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await callbackRequestsService.getRequests(filters);
            setRequests(res.data.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const fetchRequest = async (id) => {
        try {
            const res = await callbackRequestsService.getRequest(id);
            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const createRequest = async (data) => {
        try {
            const res = await callbackRequestsService.createRequest(data);
            successHandler(res);
            await fetchRequests();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const updateRequest = async (id, data) => {
        try {
            const res = await callbackRequestsService.updateRequest(id, data);
            successHandler(res);
            await fetchRequests();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const deleteRequest = async (id) => {
        try {
            const res = await callbackRequestsService.deleteRequest(id);
            successHandler(res);
            await fetchRequests();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchRequests();
    }, [isAuthenticated, fetchRequests]);

    return (
        <CallBackRequestContext.Provider value={{
            requests,
            status,
            loading: status === apiStatusConstants.IN_PROGRESS,
            isError: status === apiStatusConstants.FAILURE,
            fetchRequests,
            fetchRequest,
            createRequest,
            updateRequest,
            deleteRequest
        }}>
            {children}
        </CallBackRequestContext.Provider>
    );
};

export const useCallBackRequests = () => useContext(CallBackRequestContext);