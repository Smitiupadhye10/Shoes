// src/pages/Wishlist.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
      {wishlist.length === 0 && <p>Your wishlist is empty.</p>}

      {wishlist.map((item) => (
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
            <p className="text-gray-500">₹{item.price}</p>
          </div>

          <div
            className="flex gap-3"
            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking buttons
          >
            <button
              onClick={() => addToCart(item)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button
              onClick={() => removeFromWishlist(item._id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
