// src/pages/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex flex-col md:flex-row gap-4 justify-between items-center border-b py-4 mb-2 cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/product/${item._id}`)} // Navigate to product details
        >
          <img
            src={item.images?.[0] || item.Images?.image1 || "/placeholder.jpg"}
            alt={item.title}
            className="w-24 h-20 object-contain rounded bg-gray-100 border mr-4"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium truncate">{item.title}</h2>
            <p className="text-gray-500">₹{item.price} × {item.quantity}</p>
          </div>

          {/* Quantity and Remove buttons */}
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()} // Prevent navigating when clicking buttons
          >
            <button
              onClick={() => decreaseQuantity(item._id)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => addToCart(item)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">Total: ₹{total}</h2>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/checkout")} // You can create a checkout page for address + payment
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
