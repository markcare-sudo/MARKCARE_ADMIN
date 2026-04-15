import StatCard from "@/components/ui/StatCard";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { FiUsers, FiCheckCircle } from "react-icons/fi";

const PlatformDashboardStats = ({ stats }) => {

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <StatCard
        title="Total Tenants"
        value={stats?.tenants?.total || 0}
        extra={`${stats?.tenants?.active || 0} Active • ${stats?.tenants?.suspended || 0} Suspended`}
        icon={FiUsers}
      />

      <StatCard
        title="Total Users"
        value={stats?.users?.total || 0}
        extra={`${stats?.users?.active || 0} Active • ${stats?.users?.inactive || 0} Inactive`}
        icon={FiCheckCircle}
      />

      <StatCard
        title="Total Revenue"
        value={`₹${stats?.revenue?.total || 0}`}
        extra={`Monthly: ₹${stats?.revenue?.monthly || 0}`}
        icon={FaSortAmountUpAlt}
      />

    </div>
  );
};

export default PlatformDashboardStats;
