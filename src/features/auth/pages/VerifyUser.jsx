import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "../useAuth";
import Button from "@/components/ui/Button";

const VerifyUserPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { verifyUser } = useAuth();

  const hasCalled = useRef(false);

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let timeoutId;

    // 🚫 Prevent double execution (STRICT MODE FIX)
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid or missing verification link.");
      return;
    }

    verifyUser(token)
      .then(() => {
        setStatus("success");

        timeoutId = setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        setStatus("error");

        setErrorMessage(
          err?.response?.data?.message ||
          err?.message ||
          "Verification failed. Please try again."
        );
      });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded p-8 text-center border border-gray-100">

        {status === "loading" && (
          <div className="space-y-4 py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-800">Verifying Identity</h2>
            <p className="text-gray-500">Confirming your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verified Successfully!</h2>
            <p className="text-gray-600">Account and phone number confirmed. Your lab portal is now ready.</p>
            <div className="pt-4">
              <p className="text-sm text-indigo-500 font-medium animate-pulse">Redirecting to login...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <div className="bg-red-50 text-red-700 p-4 rounded text-sm border border-red-200">
              {errorMessage}
            </div>
            <Button onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUserPage;