import { createContext, useContext, useState, useEffect, useCallback } from "react";
import brandsService from "@/services/brands.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [brands, setBrands] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [error, setError] = useState(null);

    const fetchBrands = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await brandsService.getBrands(filters);

            setBrands(res.data.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setError(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const fetchBrand = async (id) => {
        try {
            const res = await brandsService.getBrand(id);
            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const createBrand = async (data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await brandsService.createBrand(data);
            successHandler(res);
            await fetchBrands();
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const updateBrand = async (id, data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await brandsService.updateBrand(id, data);
            successHandler(res);
            await fetchBrands();
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const deleteBrand = async (id) => {
        try {
            const res = await brandsService.deleteBrand(id);
            successHandler(res);
            await fetchBrands();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchBrands();
        else setBrands([]);
    }, [isAuthenticated, fetchBrands]);

    return (
        <BrandContext.Provider value={{
            brands, status, error,
            loading: status === apiStatusConstants.IN_PROGRESS,
            isError: status === apiStatusConstants.FAILURE,
            fetchBrands, fetchBrand, createBrand, updateBrand, deleteBrand
        }}>
            {children}
        </BrandContext.Provider>
    );
};

export const useBrands = () => useContext(BrandContext);