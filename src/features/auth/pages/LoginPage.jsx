import AuthSplitLayout from "@/components/layout/AuthSplitLayout";
import LoginForm from "../components/LoginForm";
import { loginMarketingContent } from "@/constants/authMarketing";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/utils/sessionStorage";

const LoginPage = () => {
  const token = getAccessToken();
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/LOGINBG.webp')",
      }}
    >
      <AuthSplitLayout marketing={loginMarketingContent}>
        <LoginForm />
      </AuthSplitLayout>
    </div>
  );
};

export default LoginPage;