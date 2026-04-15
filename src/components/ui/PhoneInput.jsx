import "react-phone-number-input/style.css";
import PhoneInputLib from "react-phone-number-input";

const PhoneInput = ({
  label,
  value,
  onChange,
  error,
  disabled,
  rightText,
  defaultCountry = "IN",
}) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600">
          <label>{label}</label>
          {rightText && <span>{rightText}</span>}
        </div>
      )}

      <div
        className={`w-full border rounded h-11 px-3 flex items-center focus-within:ring-2 focus-within:ring-indigo-500 ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <PhoneInputLib
          international
          defaultCountry={defaultCountry}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="w-full disabled:bg-gray-100"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;