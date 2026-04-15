import React from "react";
import clsx from "clsx";

const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  outline:
    "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  type = "button",
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <div>
      <button
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center cursor-pointer w-full gap-2 whitespace-nowrap justify-center rounded font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          isDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}

        {!loading && leftIcon}

        {!loading && children}

        {!loading && rightIcon}
      </button>
    </div>
  );
};

export default Button;
