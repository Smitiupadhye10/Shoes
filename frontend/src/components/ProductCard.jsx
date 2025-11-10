import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useContext(CartContext);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const discountedPrice = (
    product.price * (1 - (product.discount || 0) / 100)
  ).toFixed(0);

  // Use first image from images array (show only one image for contact lenses)
  const imageSrc = Array.isArray(product.images) ? (product.images[0] || "/placeholder.jpg") : (product.images || "/placeholder.jpg");

  const isContactLens = product._type === 'contactLens' || product.category === 'Contact Lenses';

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = Math.round(rating || 0);
    return (
      <span className="text-yellow-500 font-semibold text-sm">
        {"★".repeat(stars) + "☆".repeat(5 - stars)} ({(rating || 0).toFixed(1)})
      </span>
    );
  };

  return (
    <div className="relative flex flex-col border-2 border-gray-200 rounded-2xl p-5 shadow-md bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group">
      {/* Heart icon overlay */}
      <div 
        className="absolute top-4 right-4 z-10 cursor-pointer p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-200" 
        onClick={toggleWishlist}
      >
        <Heart 
          color={isWishlisted ? "#ef4444" : "#6b7280"} 
          fill={isWishlisted ? "#ef4444" : "none"} 
          size={22}
          className="transition-all duration-200"
        />
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl mb-4 bg-white group/image">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-52 object-contain cursor-pointer transition-transform duration-300 group-hover/image:scale-105"
          onClick={() => navigate(`/product/${product._id}`)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Title and meta */}
      <h2 
        className="text-lg font-bold leading-tight mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 cursor-pointer line-clamp-2"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {product.title}
      </h2>

      {/* Meta for contact lenses */}
      {isContactLens ? (
        <div className="text-sm text-gray-600 space-y-1 mb-2">
          {product.product_info?.brand && (
            <div>Brand: <span className="font-medium text-gray-800">{product.product_info.brand}</span></div>
          )}
          {product.product_info?.usageDuration && (
            <div>Usage: <span className="font-medium text-gray-800">{product.product_info.usageDuration}</span></div>
          )}
          {product.product_info?.color && (
            <div>Color: <span className="font-medium text-gray-800">{product.product_info.color}</span></div>
          )}
          <div className="flex gap-2 mt-1">
            {product.product_info?.baseCurve && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">BC {product.product_info.baseCurve}</span>
            )}
            {product.product_info?.diameter && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">DIA {product.product_info.diameter}</span>
            )}
            {product.product_info?.packaging && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{product.product_info.packaging}</span>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Ratings */}
          <div className="mb-1">{renderStars(product.ratings)}</div>
          {/* Category */}
          <p className="text-gray-400 text-sm mb-2 capitalize">{product.category}</p>
        </>
      )}

      {/* Price and Discount (always visible) */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-indigo-600 font-bold text-xl">₹{discountedPrice}</span>
        {product.discount > 0 && (
          <>
            <span className="text-gray-400 line-through text-sm font-medium">₹{product.price}</span>
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5 mt-auto">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m5-8v8m4-8v8m4-8l2 8"/></svg>
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
