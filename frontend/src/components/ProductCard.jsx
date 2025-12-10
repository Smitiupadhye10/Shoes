import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart, Plus } from "lucide-react";

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

  // Calculate display price - use finalPrice if available (already discounted), otherwise calculate from price and discount
  const getDisplayPrice = () => {
    if (product.finalPrice) {
      // For accessories and skincare, finalPrice is already the discounted price
      return product.finalPrice;
    }
    // For regular products, calculate discounted price
    return product.price * (1 - (product.discount || 0) / 100);
  };
  
  const displayPrice = getDisplayPrice().toFixed(0);

  // Get product title - handle all product types
  const getProductTitle = () => {
    return product.title || product.name || product.productName || "Product";
  };

  // Use first image from images array (show only one image for contact lenses)
  // Handle different image formats: array, string, or object
  const getImageSrc = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      // Filter out empty/null/undefined images
      const validImage = product.images.find(img => img && img.trim() !== '');
      if (validImage) return validImage;
    }
    // Fallback to thumbnail if images array is empty
    if (product.thumbnail && product.thumbnail.trim() !== '') {
      return product.thumbnail;
    }
    // Fallback to imageUrl for skincare products
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }
    // If images is a string (not array)
    if (typeof product.images === 'string' && product.images.trim() !== '') {
      return product.images;
    }
    return "/placeholder.jpg";
  };
  
  const imageSrc = getImageSrc();
  const productTitle = getProductTitle();

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
    <div className="card-product">
      {/* Heart icon overlay */}
      <div 
        className="absolute top-4 right-4 z-10 cursor-pointer p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200" 
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={toggleWishlist}
      >
        <Heart 
          color={isWishlisted ? "#ef4444" : "#6b7280"} 
          fill={isWishlisted ? "#ef4444" : "none"} 
          size={20}
          className="transition-all duration-200"
        />
      </div>

      {/* Product Image */}
      <div className="relative mb-6">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={productTitle}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/product/${product._id}`)}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = "/placeholder.jpg";
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <h3 
        className="text-optic-heading text-sm sm:text-base md:text-lg font-bold mb-2 cursor-pointer hover:opacity-80 transition-opacity line-clamp-2"
        style={{ color: 'var(--text-primary)' }}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {productTitle}
      </h3>
      
      <p className="text-optic-body text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: 'var(--text-secondary)' }}>
        {product.category || 'vision'}
      </p>
      
      <div className="text-optic-heading text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
        ₹{displayPrice}
        {(product.discount > 0 || (product.finalPrice && product.finalPrice < product.price)) && (
          <span className="text-xs sm:text-sm font-normal line-through ml-2" style={{ color: 'var(--text-secondary)' }}>
            ₹{product.price}
          </span>
        )}
      </div>
      
      {/* Add Button */}
      <button 
        onClick={() => addToCart(product)}
        className="btn-accent mx-auto"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProductCard;
