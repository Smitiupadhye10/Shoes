// src/pages/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart, getLastOrderedCart } = useContext(CartContext);
  const navigate = useNavigate();

  const showCart = cart.length > 0 ? cart : getLastOrderedCart();
  const isLastOrder = cart.length === 0 && showCart.length > 0;
  const total = showCart.reduce((sum, p) => sum + (p.price || p.finalPrice || 0) * (p.quantity || 1), 0);

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
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Your Cart</h1>
      {showCart.length === 0 && <p>Your cart is empty.</p>}
      {isLastOrder && <p className="text-green-600 mb-2">These are the products from your last order.</p>}

      {showCart.map((item) => (
        <div
          key={item._id}
          className="flex w-full flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start justify-between border-b py-4 mb-2 cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/product/${item._id}`)}
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
                  <span className="text-gray-500 ml-1">× {item.quantity || 1}</span>
                </div>
              );
            })()}
          </div>

          {/* Quantity and Remove buttons */}
          {!isLastOrder && (
            <div
              className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => decreaseQuantity(item._id)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
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
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {showCart.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Total: ₹{total}</h2>
          {!isLastOrder && (
            <button
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 w-full sm:w-auto text-base"
              onClick={() => navigate("/checkout")}
            >
              Buy Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
