const Badge = ({ text, variant = "gray" }) => {
  const variants = {
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    gray: "bg-gray-100 text-gray-700 border-gray-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <span className={`px-3 py-1 text-xs border rounded-full ${variants[variant]}`}>
      {text}
    </span>
  );
};

export default Badge;