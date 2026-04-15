import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import UsersTable from "../components/UsersTable";
import UserForm from "../components/UserForm";
import { useUsers } from "@/context/UsersContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import UserFilters from "../components/UserFilters";

const UsersPage = () => {
    // ✅ Updated to use granular states from your corrected Context
    const {
        users = [],
        fetchUsers,
        fetchUser,
        isListLoading,    // Specifically for the table/list
        isListError,      // Specifically for the table/list
        listError,        // The actual error object for the list
        clearActionState  // To reset modal/action errors on close
    } = useUsers();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. READ FILTERS FROM URL
    const search = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const filters = useMemo(() => ({
        search: search || "",
        status: statusParam || "",
        startDate: startDate || "",
        endDate: endDate || ""
    }), [search, statusParam, startDate, endDate]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedUser, setSelectedUser] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
    const filtersKey = JSON.stringify(filters);

    useEffect(() => {
        fetchUsers(filters);
    }, [filtersKey, fetchUsers]);

    // ✅ 3. SYNC MODAL DATA BASED ON URL ID
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                try {
                    const data = await fetchUser(editId);
                    setSelectedUser(data);
                } finally {
                    setIsFetchingSelected(false);
                }
            };
            loadData();
        } else {
            setSelectedUser(null);
        }
    }, [modalType, editId, fetchUser]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const openUserPopup = (user = null) => {
        const params = new URLSearchParams(searchParams);
        if (user?.id) {
            params.set("modal", "edit");
            params.set("id", user.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeUserPopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
        // ✅ Reset action errors so they don't persist when reopening the modal
        clearActionState();
    };

    /** ✅ SEPARATE ERROR STATE (List Level Only) **/
    if (isListError && users.length === 0) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure
                error={listError}
                message="Failed to load users"
                onRetry={() => fetchUsers(filters)}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Management"
                subtitle="Manage user accounts and permissions"
                breadcrumb="RBAC / User Management"
                action={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => fetchUsers(filters)}
                            disabled={isListLoading}
                            className="flex items-center gap-2"
                        >
                            <FiRefreshCw className={isListLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openUserPopup()}>
                            + Create User
                        </Button>
                    </>
                }
            />

            <UserFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="min-h-[400px] relative">
                {/* ✅ GRANULAR LOADING: Only overlays the table, doesn't hide the whole page */}
                {isListLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {/* ✅ SEPARATE EMPTY STATE: Only shows if load finished and no results */}
                {users.length === 0 && !isListLoading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={filters.search ? `No users found for "${filters.search}"` : "No users currently in the system"}
                        />
                    </div>
                ) : (
                    <UsersTable users={users} openUserPopup={openUserPopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeUserPopup}
                title={modalType === "edit" ? "Edit User" : "Create User"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 text-center"><Loader size="sm" /></div>
                ) : (
                    <UserForm
                        initialData={selectedUser}
                        onSuccess={() => {
                            closeUserPopup();
                            // Note: Context's createUser/updateUser calls fetchUsers() automatically, 
                            // so you may not even need to call it again here depending on preference.
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default UsersPage;