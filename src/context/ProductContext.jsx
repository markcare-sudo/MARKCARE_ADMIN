import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";
import productsService from "@/services/products.service";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const fetchProducts = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await productsService.getProducts(filters);
            // Adjusted to standard response structure
            setProducts(res.data.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const fetchProduct = async (id) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await productsService.getProduct(id);
            setStatus(apiStatusConstants.SUCCESS);
            return res.data.data; // Includes variants and images based on your model
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const createProduct = async (data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await productsService.createProduct(data);
            successHandler(res);
            await fetchProducts();
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const updateProduct = async (id, data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await productsService.updateProduct(id, data);
            successHandler(res);
            await fetchProducts();
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await productsService.deleteProduct(id);
            successHandler(res);
            await fetchProducts();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchProducts();
    }, [isAuthenticated, fetchProducts]);

    return (
        <ProductContext.Provider value={{
            products, status,
            loading: status === apiStatusConstants.IN_PROGRESS,
            isError: status === apiStatusConstants.FAILURE,
            fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);