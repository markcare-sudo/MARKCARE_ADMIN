import { createContext, useContext, useState, useCallback, useEffect } from "react";
import bookingService from "@/services/booking.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    // =========================
    // 📅 1. FETCH BOOKINGS
    // =========================
    const fetchBookings = useCallback(async (params = {}) => {
        if (!isAuthenticated) return;

        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.getBookings(params);

            setBookings(res.data?.data.data || []);
            setPagination(res.data?.data.pagination || null);

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    // =========================
    // 📅 2. BOOKING DETAILS
    // =========================
    const fetchBookingDetails = async (bookingId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.getBookingById(bookingId);
            setCurrentBooking(res.data.data);

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 💳 3. CREATE BOOKING
    // =========================
    const createBooking = async (payload) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.create(payload);

            setStatus(apiStatusConstants.SUCCESS);

            // ⚡ important for Razorpay
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
    const verifyBookingPayment = async (payload) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.verifyPayment(payload);

            successHandler(res);

            await fetchBookings();

            setStatus(apiStatusConstants.SUCCESS);

            return res.data.data;
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err;
        }
    };

    // =========================
    // ❌ 5. CANCEL BOOKING
    // =========================
    const cancelBooking = async (bookingId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.cancelBooking(bookingId);

            successHandler(res);
            await fetchBookings();

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 🔄 6. UPDATE STATUS (ADMIN)
    // =========================
    const updateBookingStatus = async (bookingId, statusValue) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.updateBookingStatus(bookingId, {
                status: statusValue,
            });

            successHandler(res);
            await fetchBookings();

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // =========================
    // 🗑️ 7. DELETE BOOKING (ADMIN)
    // =========================
    const deleteBooking = async (bookingId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await bookingService.deleteBooking(bookingId);

            successHandler(res);
            await fetchBookings();

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
            fetchBookings();
        }
    }, [isAuthenticated, fetchBookings]);

    return (
        <BookingContext.Provider
            value={{
                bookings,
                pagination,
                currentBooking,
                status,
                loading: status === apiStatusConstants.IN_PROGRESS,

                fetchBookings,
                fetchBookingDetails,
                createBooking,
                verifyBookingPayment,
                cancelBooking,

                // admin
                updateBookingStatus,
                deleteBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);