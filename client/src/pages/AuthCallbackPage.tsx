// client/src/pages/AuthCallbackPage.jsx
import { Logo } from "@/components/ui-custom/Logo";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallbackPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    const handleAuth = async () => {
      if (token) {
        // 1. Store token immediately
        localStorage.setItem("authToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 2. Fetch user data using the new token
        try {
          const response = await api.get("/auth/profile");
          // 3. Update AuthContext fully (login handles this)
          login(response.data, token);
          // 4. Redirect user
          navigate(redirectPath, { replace: true });
        } catch (error) {
          console.error(
            "Failed to fetch user profile after OAuth callback:",
            error
          );
          localStorage.removeItem("authToken");
          delete api.defaults.headers.common["Authorization"];
          navigate(`/login?error=callback_profile_fetch_failed`, {
            replace: true,
          });
        }
      } else {
        console.error("OAuth callback missing token.");
        navigate("/login?error=callback_token_missing", { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="flex flex-col items-center justify-center animate-pulse">
        <Logo />
      </span>
    </div>
  );
};

export default AuthCallbackPage;
