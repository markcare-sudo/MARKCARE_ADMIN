import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Updated to include 5 colors to match your 5 data points
const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#6B7280", "#F59E0B"];

const SubscriptionsStats = ({ subscriptionStats }) => {
  // Mapping backend "paid" to frontend "Active" and adding fallbacks
  const data = subscriptionStats
    ? [
      { name: "Active", value: subscriptionStats.active || 0 },
      { name: "Cancelled", value: subscriptionStats.cancelled || 0 },
      { name: "Trial", value: subscriptionStats.trial || 0 },
      { name: "Expired", value: subscriptionStats.expired || 0 },
      { name: "No Show", value: subscriptionStats.no_show || 0 }
    ]
    : [];

  // Use the 'total' from backend or calculate it locally
  const total = subscriptionStats?.total ?? data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Chart Wrapper */}
      <div className="relative w-full md:w-1/2 h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              // Ensure we don't render slices with 0 value to avoid label/line clutter
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-800">{total}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend Section */}
      <div className="space-y-3 w-full md:w-48">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="text-gray-600 font-medium">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SubscriptionsStats;