import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

import BookingsTable from "../components/BookingsTable";
import BookingFilters from "../components/BookingFilters";

import { useBooking } from "@/context/BookingContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";

import { FiRefreshCw } from "react-icons/fi";

const BookingsPage = () => {
    const {
        bookings = [],
        fetchBookings,
        fetchBookingDetails,
        loading,
        isError,
        error
    } = useBooking();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ Filters from URL
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";

    const filters = useMemo(
        () => ({ search, status, date }),
        [search, status, date]
    );

    const modalType = searchParams.get("modal"); // view
    const bookingId = searchParams.get("id");

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ Fetch bookings on filter change
    useEffect(() => {
        fetchBookings(filters);
    }, [search, status, date, fetchBookings]);

    // ✅ Load single booking
    useEffect(() => {
        if (modalType === "view" && bookingId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchBookingDetails(bookingId);
                setSelectedBooking(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedBooking(null);
        }
    }, [modalType, bookingId]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);

        Object.keys(newFilters).forEach((key) => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    };

    const openBookingPopup = (booking = null) => {
        const params = new URLSearchParams(searchParams);

        if (booking?.id) {
            params.set("modal", "view");
            params.set("id", booking.id);
        }

        setSearchParams(params);
    };

    const closeBookingPopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    // ❌ Error state
    if (isError) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <ApiFailure
                    error={error}
                    message="Failed to load bookings"
                    onRetry={() => fetchBookings(filters)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <PageHeader
                title="Service Bookings"
                subtitle="Manage customer bookings, schedules, and status"
                breadcrumb="Services / Bookings"
                action={
                    <Button
                        variant="outline"
                        onClick={() => fetchBookings(filters)}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                }
            />

            {/* FILTERS */}
            <BookingFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            {/* TABLE */}
            <div className="min-h-[400px] relative">

                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {bookings.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={
                                filters.search
                                    ? "No bookings match your search"
                                    : "No bookings found"
                            }
                        />
                    </div>
                ) : (
                    <BookingsTable
                        bookings={bookings}
                        onView={openBookingPopup}
                    />
                )}
            </div>

            {/* OPTIONAL MODAL (same as orders if needed) */}
            {/* 
            <Modal
                isOpen={!!modalType}
                onClose={closeBookingPopup}
                size="lg"
                title="Booking Details"
            >
                {isFetchingSelected ? (
                    <div className="py-20 flex justify-center">
                        <Loader size="md" />
                    </div>
                ) : (
                    <BookingDetails
                        booking={selectedBooking}
                        onClose={closeBookingPopup}
                        onRefresh={() => fetchBookings(filters)}
                    />
                )}
            </Modal> 
            */}

        </div>
    );
};

export default BookingsPage;