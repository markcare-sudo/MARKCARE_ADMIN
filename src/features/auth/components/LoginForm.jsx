import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LOGOS from "@/constants/images";
import { apiStatusConstants } from "@/utils/api"; // 1. Import constants

const LoginForm = () => {
  // 2. Destructure status instead of loading
  const { requestOTP, status } = useAuth();
  const navigate = useNavigate();

  // 3. Derive isLoading boolean
  const isLoading = status === apiStatusConstants.IN_PROGRESS;

  const [form, setForm] = useState({
    channel: "EMAIL",
    identifier: "",
  });

  const [errors, setErrors] = useState({});
  const isEmail = form.channel === "EMAIL";

  const heading = isEmail ? "Login via Email" : "Login via SMS";
  const subText = isEmail
    ? "Enter your registered email to receive OTP"
    : "Enter your mobile number to receive OTP";

  const label = isEmail ? "Email Address" : "Mobile Number";
  const placeholder = isEmail
    ? "Enter your email address"
    : "Enter your mobile number";

  const buttonText = isEmail ? "Send Email OTP" : "Send SMS OTP";

  const validate = () => {
    const err = {};
    if (!form.identifier) {
      err.identifier = isEmail
        ? "Email is required"
        : "Mobile number is required";
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await requestOTP(form);

      navigate("/verify-otp", {
        // Ensure res matches your API structure (res.data.data or res.data)
        state: { loginData: res.data?.data || res.data },
      });
    } catch (error) {
      setErrors({
        api: error?.message || "Unable to send OTP. Please try again.",
      });
    }
  };

  const switchChannel = () => {
    setForm({
      channel: isEmail ? "SMS" : "EMAIL",
      identifier: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* LOGO SECTION */}
      <div className="flex justify-center">
        <Link to="/">
          <img
            src={LOGOS.MARKCARE_LOGO}
            alt="MarkCare Logo"
            className="h-14 mb-2 md:mb-6 object-contain"
          />
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <p className="text-sm text-gray-500">{subText}</p>
      </div>

      {/* Input */}
      <Input
        label={label}
        type={isEmail ? "email" : "tel"}
        placeholder={placeholder}
        value={form.identifier}
        onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        error={errors.identifier}
        disabled={isLoading} // Disable input while sending
      />

      {errors.api && (
        <p className="text-red-500 text-sm text-center">{errors.api}</p>
      )}

      {/* 4. Pass derived isLoading to Button */}
      <Button type="submit" fullWidth loading={isLoading}>
        {buttonText}
      </Button>

      {/* Switch */}
      <div className="text-center">
        <button
          type="button"
          disabled={isLoading} // Prevent switching while loading
          className={`w-full border border-indigo-600 text-indigo-600 py-2 rounded hover:bg-indigo-50 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={switchChannel}
        >
          {isEmail ? "Login via SMS instead" : "Login via Email instead"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-indigo-600">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;