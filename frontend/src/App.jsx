import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router()} fallbackElement={<div>Loading...</div>} />
      </CartProvider>
    </UserProvider>
  );
};

export default App;
