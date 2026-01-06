import React from "react";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import router from "./router/Router.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

const App = () => {
  // Warn if Google Client ID is missing
  if (!GOOGLE_CLIENT_ID) {
    console.warn("⚠️ VITE_GOOGLE_CLIENT_ID is not set in environment variables. Google OAuth will not work.");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <CartProvider>
          <RouterProvider router={router()} fallbackElement={<div>Loading...</div>} />
        </CartProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
