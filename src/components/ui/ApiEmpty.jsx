const ApiEmpty = ({
  message = "No data available",
  className = ""
}) => {
  return (
    <div
      className={`flex flex-col w-full h-full items-center justify-center p-6 text-gray-500 ${className}`}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ApiEmpty;