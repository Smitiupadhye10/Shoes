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
    <div className="relative flex flex-col border rounded-2xl p-4 shadow bg-gray-100 in-hover:hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      {/* Heart icon overlay */}
      <div className="absolute top-3 right-3 z-10 cursor-pointer" onClick={toggleWishlist}>
        <Heart color={isWishlisted ? "red" : "gray"} fill={isWishlisted ? "red" : "none"} size={24} />
      </div>

      {/* Product Image */}
      <img
        src={imageSrc}
        alt={product.title}
        className="w-full h-48 object-contain rounded-2xl cursor-pointer mb-3"
        onClick={() => navigate(`/product/${product._id}`)}
      />

      {/* Title and meta */}
      <h2 className="text-lg font-semibold leading-tight mb-1 truncate">{product.title}</h2>

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
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-600 font-bold text-lg">₹{discountedPrice}</span>
        {product.discount > 0 && (
          <>
            <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
            <span className="text-red-600 font-bold text-sm">{product.discount}% OFF</span>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m5-8v8m4-8v8m4-8l2 8"/></svg>
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 8 4-16 3 8h4"/></svg>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
