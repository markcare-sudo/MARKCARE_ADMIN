import { createContext, useContext, useState, useCallback, useEffect } from "react";
import ordersService from "@/services/orders.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    // =========================
    // 📦 1. FETCH ORDERS
    // =========================
    const fetchOrders = useCallback(async (params = {}) => {
        if (!isAuthenticated) return;

        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.getOrders(params);
            console.log(res.data.data?.data, "ressss");

            setOrders(res.data.data?.data || []);
            setPagination(res.data.data?.pagination || null);

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    // =========================
    // 📦 2. ORDER DETAILS
    // =========================
    const fetchOrderDetails = async (orderId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.getOrderById(orderId);
            setCurrentOrder(res.data.data);

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 💳 3. CREATE ORDER
    // =========================
    const placeOrder = async (payload) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.createOrder(payload);

            // ⚡ IMPORTANT: return razorpay order
            setStatus(apiStatusConstants.SUCCESS);

            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err;
        }
    };

    // =========================
    // 🔐 4. VERIFY PAYMENT
    // =========================
    const verifyPayment = async (payload) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.verifyPayment(payload);

            successHandler(res);

            await fetchOrders(); // refresh orders after payment

            setStatus(apiStatusConstants.SUCCESS);

            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err;
        }
    };

    // =========================
    // ❌ 5. CANCEL ORDER
    // =========================
    const cancelOrder = async (orderId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.cancelOrder(orderId);

            successHandler(res);
            await fetchOrders();

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 🛠️ 6. UPDATE STATUS (ADMIN)
    // =========================
    const updateOrderStatus = async (orderId, statusValue) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.updateOrderStatus(orderId, {
                status: statusValue,
            });

            successHandler(res);
            await fetchOrders();

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 🗑️ 7. DELETE ORDER (ADMIN)
    // =========================
    const deleteOrder = async (orderId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await ordersService.deleteOrder(orderId);

            successHandler(res);
            await fetchOrders();

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 🔁 AUTO LOAD
    // =========================
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    return (
        <OrderContext.Provider
            value={{
                orders,
                pagination,
                currentOrder,
                status,
                loading: status === apiStatusConstants.IN_PROGRESS,

                fetchOrders,
                fetchOrderDetails,
                placeOrder,
                verifyPayment,
                cancelOrder,

                // admin
                updateOrderStatus,
                deleteOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);