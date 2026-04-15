import StatCard from "@/components/ui/StatCard";
import {
    FiLayers,      // Total
    FiCheckCircle, // Active/Paid
    FiZap,         // Trial
    FiAlertCircle, // Expired
    FiSlash        // Cancelled
} from "react-icons/fi";

const SubscriptionsOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard
                title="Total"
                value={stats?.total || 0}
                icon={FiLayers}
                color="blue" // Assuming your StatCard component handles color props
                className="border-l-4 border-blue-500"
            />

            <StatCard
                title="Active"
                value={stats?.active || 0} // Mapping 'paid' from your backend function
                icon={FiCheckCircle}
                color="green"
                className="border-l-4 border-green-500"
            />

            <StatCard
                title="Trial"
                value={stats?.trial || 0}
                icon={FiZap}
                color="indigo"
                className="border-l-4 border-indigo-500"
            />

            <StatCard
                title="Expired"
                value={stats?.expired || 0}
                icon={FiAlertCircle}
                color="gray"
                className="border-l-4 border-gray-500"
            />

            <StatCard
                title="Cancelled"
                value={stats?.cancelled || 0}
                icon={FiSlash}
                color="red"
                className="border-l-4 border-red-500"
            />
        </div>
    );
};

export default SubscriptionsOverview;