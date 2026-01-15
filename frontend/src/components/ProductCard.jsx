import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart, Plus, Star } from "lucide-react";

const ProductCard = ({ product, showBestSeller = true }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useContext(CartContext);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  // Calculate prices for display
  const getDisplayPrices = () => {
    const discountedPrice = Number(product.price || product.finalPrice || 0);
    let originalPrice = Number(product.originalPrice || 0);
    const discountPercent = Number(product.discount || product.discountPercent || 0);
    
    if (!originalPrice && discountPercent > 0 && discountedPrice > 0) {
      originalPrice = Math.round(discountedPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = discountedPrice;
    }
    
    return { originalPrice, discountedPrice: Math.round(discountedPrice), discountPercent };
  };

  const { originalPrice, discountedPrice, discountPercent } = getDisplayPrices();

  // Use first image from images array
  const imageSrc = Array.isArray(product.images) ? (product.images[0] || "/placeholder.jpg") : (product.images || "/placeholder.jpg");

  // Get rating and reviews count
  const rating = product.ratings || product.rating || 0;
  const reviewsCount = product.reviewsCount || product.ratingsCount || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Render star ratings
  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
          } else if (index === fullStars && hasHalfStar) {
            return <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />;
          } else {
            return <Star key={index} className="w-4 h-4 fill-gray-300 text-gray-300" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative">
      {/* Best Seller Badge - Top Left */}
      {showBestSeller && (product.isFeatured || product.onSale || discountPercent > 0) && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
          Best Seller
        </div>
      )}

      {/* Heart Icon - Top Right */}
      <div 
        className="absolute top-3 right-3 z-10 cursor-pointer p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-all duration-200" 
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist();
        }}
      >
        <Heart 
          color={isWishlisted ? "#ef4444" : "#6b7280"} 
          fill={isWishlisted ? "#ef4444" : "none"} 
          size={18}
          className="transition-all duration-200"
        />
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate(`/product/${product._id}`)}
        />
        
        {/* Add to Cart Icon - Bottom Right of Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-3 right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200 cursor-pointer"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Title */}
        <h3 
          className="text-sm font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-600 transition-colors line-clamp-2"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.title}
        </h3>
        
        {/* Star Ratings and Reviews */}
        <div className="flex items-center gap-2 mb-2">
          {renderStars()}
          {reviewsCount > 0 && (
            <span className="text-xs text-gray-600">
              {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>
        
        {/* Price */}
        <div className="text-base font-bold text-gray-900">
          ₹ {discountedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {originalPrice > discountedPrice && (
            <span className="text-xs font-normal text-gray-500 line-through ml-2">
              ₹ {originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
