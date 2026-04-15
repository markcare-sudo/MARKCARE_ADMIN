import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import OtpInput from "../components/OtpInput";
import useAuth from "../useAuth";
import { useAuthContext } from "@/context/AuthContext";
import AuthSplitLayout from "@/components/layout/AuthSplitLayout";
import LOGOS from "@/constants/images";
import { getAccessToken } from "@/utils/sessionStorage";

const VerifyLoginOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, requestOTP } = useAuth();
  const { reloadContext } = useAuthContext();

  // Safely get login data from navigation state
  const loginData = location.state?.loginData;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ================= GUARD =================
  // Prevent infinite loop by checking token only on mount or when token changes
  useEffect(() => {
    const token = getAccessToken();
    if (token && token !== "undefined") {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // ================= INITIALIZE EXPIRY =================
  useEffect(() => {
    if (loginData?.expiresAt) {
      const expiryTime = new Date(loginData.expiresAt).getTime();
      setExpiresAt(expiryTime);
    } else if (!loginData) {
      // If someone accesses this page directly without loginData, send them back
      navigate('/login', { replace: true });
    }
  }, [loginData, navigate]);

  // ================= TIMER LOGIC =================
  useEffect(() => {
    if (!expiresAt) return;

    // 1. Declare the variable first
    let interval;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimer(remaining);

      // 2. Now 'interval' is defined in this scope and can be cleared safely
      if (remaining <= 0 && interval) {
        clearInterval(interval);
      }
    };

    // 3. Initial call
    updateTimer();

    // 4. Assign the interval
    interval = setInterval(updateTimer, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expiresAt]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ================= VERIFY ACTION =================
  const handleVerify = async (code) => {
    const finalOtp = code || otp.join("");

    if (finalOtp.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setVerifyLoading(true);
      setError("");

      const res = await verifyOTP({
        requestId: loginData?.requestId,
        tenantId: loginData?.tenantId,
        otp: finalOtp,
      });

      const responseData = res.data || res;

      // Explicitly load context so immediately available upon redirect
      await reloadContext();

      // 1. Role Selection Check
      if (responseData.requiresRoleSelection) {
        return navigate("/select-role", {
          replace: true,
          state: {
            tempUser: responseData.user,
            roles: responseData.roles,
            tenantId: responseData.tenantId
          }
        });
      }

      // 2. Dashboard
      navigate("/", { replace: true });


    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
      setVerifyLoading(false);
    }
  };

  // ================= RESEND ACTION =================
  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await requestOTP({
        identifier: loginData?.destination,
        channel: "EMAIL",
        tenantId: loginData?.tenantId,
      });

      if (res?.data?.data?.expiresAt) {
        setExpiresAt(new Date(res.data.data.expiresAt).getTime());
      }
      setOtp(["", "", "", "", "", ""]);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        <div className="flex justify-center">
          <Link to="/">
            <img
              src={LOGOS.MARKCARE_LOGO}
              alt="Logo"
              className="h-10 mb-6 object-contain"
            />
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 text-center">Enter OTP</h2>

        {loginData && (
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium text-gray-800">{loginData?.destination}</span>
          </p>
        )}

        <div className="py-4">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            error={error}
            onComplete={handleVerify}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          fullWidth
          loading={verifyLoading}
          onClick={() => handleVerify()}
          className="py-3 text-base font-bold uppercase tracking-wide"
        >
          Verify and Continue
        </Button>

        <div className="text-center text-sm mt-6">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold text-indigo-600">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default VerifyLoginOtpPage;