import React from 'react';
import useAuth from '@/features/auth/useAuth';
import TenantDashboard from './TenantDashboard';
import PlatformDashboard from './PlatformDashboard';
import SupportDashboard from './SupportDashboard';
import BillingDashboard from './BillingDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();

    // 1. Handle Loading State
    if (loading) {
        return <div className="p-6 text-gray-500">Loading Dashboard...</div>;
    }

    // 2. Extract the role code safely
    // Since we now return [{id, name, code}], we check the code property
    const roleCode = user?.roles?.[0]?.code;

    // 3. Conditional Rendering based on Role Code
    if (roleCode === "SUPER_ADMIN") {
        return <PlatformDashboard />;
    }

    if (roleCode === "LAB_ADMIN") {
        return <TenantDashboard />;
    }

    if (roleCode === "BILLING_ADMIN") {
        return <BillingDashboard />;
    }

    if (roleCode === "SUPPORT_ADMIN") {
        return <SupportDashboard />;
    }

    // 4. Fallback for users with no matching roles
    return (
        <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-gray-800">Welcome, {user?.name}</h2>
            <p className="text-gray-500">You don't have an assigned dashboard view. Please contact support.</p>
        </div>
    );
};

export default Dashboard;