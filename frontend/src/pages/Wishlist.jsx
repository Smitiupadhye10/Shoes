// src/pages/Wishlist.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useContext(CartContext);
  const navigate = useNavigate();

  // Helper function to get prices for display
  const getDisplayPrices = (item) => {
    const discountedPrice = Number(item.price || item.finalPrice || 0);
    let originalPrice = Number(item.originalPrice || 0);
    const discountPercent = Number(item.discount || item.discountPercent || 0);
    
    if (!originalPrice && discountPercent > 0 && discountedPrice > 0) {
      originalPrice = Math.round(discountedPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = discountedPrice;
    }
    
    return { originalPrice, discountedPrice, discountPercent };
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Your Wishlist</h1>
      {wishlist.length === 0 && <p>Your wishlist is empty.</p>}

      {wishlist.map((item) => (
        <div
          key={item._id}
          className="flex w-full flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start justify-between border-b py-4 mb-2 cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/product/${item._id}`)} // Navigate to product details
        >
          <img
            src={item.images?.[0] || item.Images?.image1 || "/placeholder.jpg"}
            alt={item.title}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded bg-gray-100 border mr-0 sm:mr-4"
          />
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h2 className="text-base sm:text-lg font-medium whitespace-normal break-words leading-snug">{item.title || item.name}</h2>
            {(() => {
              const { originalPrice, discountedPrice } = getDisplayPrices(item);
              return (
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">₹{discountedPrice}</span>
                  {originalPrice > discountedPrice && (
                    <span className="text-gray-500 line-through ml-2">₹{originalPrice}</span>
                  )}
                </div>
              );
            })()}
          </div>

          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => addToCart(item)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={() => removeFromWishlist(item._id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
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
