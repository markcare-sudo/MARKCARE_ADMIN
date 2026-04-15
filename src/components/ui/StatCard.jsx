const StatCard = ({ title, value, extra, trend, icon: Icon, color = "blue", className = "" }) => {
  // Mapping for dynamic Tailwind classes based on the 'color' prop
  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-600" },
  };

  // Fallback to blue if an invalid color is passed
  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white p-5 rounded border border-gray-100 shadow-sm flex justify-between items-center ${className}`}>
      <div className="flex-1">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>

        {extra && <p className="text-xs text-gray-400 mt-1">{extra}</p>}

        {trend && (
          <p className="text-green-500 text-xs font-medium mt-1 flex items-center gap-1">
            <span className="text-base">↑</span> {trend}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`${selectedColor.bg} p-3 rounded-lg flex items-center justify-center transition-colors`}>
          <Icon className={`${selectedColor.text} text-xl`} />
        </div>
      )}
    </div>
  );
};

export default StatCard;