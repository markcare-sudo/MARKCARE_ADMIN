const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  name, // 1. ADDED: Explicitly destructure name
  disabled = false,
  ...props // 3. ADDED: Spread remaining props (id, onBlur, autoFocus, etc.)
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-600 mb-1">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 ${error ? "border-red-500" : "border-gray-300"
          }`}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input