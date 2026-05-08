const Select = ({ label, value, onChange, options, error }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-600">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={`w-full border rounded px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default Select;