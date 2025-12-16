import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ text = "Continue with Google" }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      console.log("Google credential received:", credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send credential to backend for verification
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      if (!data?.token) {
        throw new Error("Authentication failed - no token received");
      }

      // Update user context with Google login
      const result = await loginWithGoogle(data.token, data.user);
      
      if (result.success) {
        console.log("Google login successful");
        navigate("/home", { replace: true });
      } else {
        throw new Error(result.error || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Google login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error("Google login error");
    setLoading(false);
    setError("Google login failed. Please try again.");
  };

  const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D', borderWidth: '1px' }}>
        <p className="text-sm" style={{ color: '#92400E' }}>
          Google login is not configured. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', borderWidth: '1px' }}>
          <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}
      <div style={{ width: '100%' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          shape="rectangular"
          theme="outline"
          size="large"
          text={text}
          locale="en"
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;

