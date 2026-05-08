import { useRef, useEffect } from "react";

const OTPInput = ({
  length = 4,
  value,
  onChange,
  error,
  onComplete,
}) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto complete
    if (newOtp.join("").length === length) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...value];
      newOtp[index] = "";
      onChange(newOtp);

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .replace(/\D/g, "")
      .split("");

    if (pasteData.length === length) {
      onChange(pasteData);
      onComplete?.(pasteData.join(""));
    }
  };

  return (
    <div className={`flex items-center justify-between ${error ? "shake" : ""}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={value[index] || ""}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-10 h-10 md:w-12 md:h-12 text-center text-lg font-semibold border-2 rounded-lg transition-all
          ${error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-indigo-500"
            } focus:outline-none focus:ring-2`}
        />
      ))}
    </div>
  );
};

export default OTPInput;