import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import api from "../api/axios";
import { Heart, X, Star, ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

// Normalize gender labels
const mapGender = (val) => {
  if (!val) return "";
  const v = String(val).toLowerCase();
  if (v === "male") return "Men";
  if (v === "female") return "Women";
  return val;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPower, setSelectedPower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist = [],
  } = useContext(CartContext);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        if (data.product_info?.powerOptions?.length > 0) {
          setSelectedPower(data.product_info.powerOptions[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Wishlist state
  useEffect(() => {
    if (product?._id) {
      setIsWishlisted(wishlist.some((item) => item._id === product._id));
    }
  }, [product, wishlist]);

  // Get all images for the product - handle all product types
  const getProductImages = () => {
    if (!product) return [];
    
    // Handle images array
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(img => img && img.trim() !== '');
    }
    
    // Fallback to thumbnail
    if (product.thumbnail && product.thumbnail.trim() !== '') {
      return [product.thumbnail];
    }
    
    // Fallback to imageUrl (for skincare)
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return [product.imageUrl];
    }
    
    // If images is a string (not array)
    if (typeof product.images === 'string' && product.images.trim() !== '') {
      return [product.images];
    }
    
    // Fallback to placeholder
    return ["/placeholder.jpg"];
  };

  const images = getProductImages();
  const selectedImage = images[selectedImageIndex] || "/placeholder.jpg";
  
  // Get product title - handle all product types
  const getProductTitle = () => {
    if (!product) return "Product";
    return product.title || product.name || product.productName || "Product";
  };
  
  const productTitle = getProductTitle();

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product._id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const openImageModal = () => setIsModalOpen(true);
  const closeImageModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--text-heading)' }}></div>
          <p className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-optic-body text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const item = { ...product, selectedPower, quantity };
    addToCart(item);
  };

  const handleBuyNow = () => {
    const item = { ...product, selectedPower, quantity };
    addToCart(item);
    navigate("/cart");
  };

  // Calculate prices - handle all product types
  const getPrices = () => {
    // Price is the discounted price (finalPrice)
    const discountedPrice = Number(product.price || product.finalPrice || 0);
    
    // Original price (MRP) - use originalPrice if available, otherwise calculate from discount
    let originalPrice = Number(product.originalPrice || 0);
    const discountPercent = Number(product.discount || product.discountPercent || 0);
    
    // If originalPrice is not provided, calculate it from discounted price and discount
    if (!originalPrice && discountPercent > 0 && discountedPrice > 0) {
      originalPrice = Math.round(discountedPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = discountedPrice; // No discount, MRP equals discounted price
    }
    
    return { originalPrice, discountedPrice, discountPercent };
  };

  const { originalPrice, discountedPrice, discountPercent } = getPrices();

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(num || 0));

  return (
    <div className="py-0 md:py-0 pt-0" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 sm:mb-6 transition-colors duration-200 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Section - Image Carousel */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="card-optic p-4 sm:p-6">
              {/* Wishlist Heart Icon */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="p-3 rounded-full shadow-md hover:scale-110 transition-all duration-200"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "hover:text-red-500"
                    }`}
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </button>
              </div>

              {/* Image Carousel */}
              <div className="relative mb-4">
                {/* Main Image Container */}
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-xl overflow-hidden group" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <img
                    src={selectedImage}
                    alt={productTitle}
                    className="w-full h-full object-contain p-4 sm:p-6 md:p-8 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={openImageModal}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      if (e.target.src !== "/placeholder.jpg") {
                        e.target.src = "/placeholder.jpg";
                      }
                    }}
                    loading="eager"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 p-1 rounded-md sm:rounded-lg border-2 transition-all duration-200 ${
                          selectedImageIndex === i
                            ? "scale-105 ring-2 ring-offset-2"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: selectedImageIndex === i ? 'var(--text-heading)' : 'var(--border-color)',
                          ringColor: selectedImageIndex === i ? 'var(--text-heading)' : 'transparent'
                        }}
                        aria-label={`Select image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${productTitle}-${i}`}
                          className="w-full h-full object-contain rounded p-0.5 sm:p-1"
                          onError={(e) => {
                            // Fallback to placeholder if thumbnail fails to load
                            if (e.target.src !== "/placeholder.jpg") {
                              e.target.src = "/placeholder.jpg";
                            }
                          }}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="btn-secondary flex-1 text-sm sm:text-base"
                  >
                    Buy Now
                  </button>
                </div>
                <button
                  onClick={toggleWishlist}
                  className="w-full flex items-center justify-center gap-2 border-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  style={{
                    borderColor: 'var(--text-heading)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--text-heading)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} style={{ color: isWishlisted ? '#ef4444' : 'var(--text-primary)' }} />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="space-y-6">
            {/* Card 1: Title / Ratings / Price */}
            <div className="card-optic p-4 sm:p-6">
              <div className="mb-3">
                <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2" style={{ backgroundColor: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className="inline-block ml-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {product.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-optic-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
                {productTitle}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.ratings || 0)
                          ? ""
                          : "text-gray-300"
                      }`}
                      style={i < Math.round(product.ratings || 0) ? { fill: 'var(--text-heading)', color: 'var(--text-heading)' } : {}}
                    />
                  ))}
                  <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    ({(product.ratings || 0).toFixed ? (product.ratings || 0).toFixed(1) : Number(product.ratings || 0).toFixed(1)}
                    ) · {product.numReviews || 0} reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatINR(discountedPrice)}
                  </div>
                  {originalPrice > discountedPrice && (
                    <div className="text-base sm:text-lg line-through mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {formatINR(originalPrice)}
                    </div>
                  )}
                </div>
                {discountPercent > 0 && originalPrice > discountedPrice && (
                  <div className="px-4 py-2 rounded-full text-sm font-bold shadow-md" style={{ backgroundColor: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                    {discountPercent.toFixed(1)}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Description */}
            {product.description && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Card 3: Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Product Details</h3>
              <div className="space-y-3">
                {product.product_info?.brand && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.brand}
                    </span>
                  </div>
                )}
                {product.product_info?.gender && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-medium text-gray-900">
                      {mapGender(product.product_info.gender)}
                    </span>
                  </div>
                )}
                {product.product_info?.size && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.size}
                    </span>
                  </div>
                )}
                {product.product_info?.frameShape && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Frame Shape</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.frameShape}
                    </span>
                  </div>
                )}
                {product.product_info?.frameMaterial && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Material</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.frameMaterial}
                    </span>
                  </div>
                )}
                {(product.product_info?.frameColor || product.product_info?.color) && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Color</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.frameColor || product.product_info.color}
                    </span>
                  </div>
                )}
                {(product.product_info?.rimDetails || product.product_info?.rimType) && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Rim</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.rimDetails || product.product_info.rimType}
                    </span>
                  </div>
                )}
                {product.product_info?.warranty && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium text-gray-900">
                      {product.product_info.warranty}
                    </span>
                  </div>
                )}

                {/* Lens-only fields */}
                {product.category?.toLowerCase().includes("lens") && (
                  <>
                    {product.product_info?.disposability && (
                      <div className="flex justify-between py-2 border-t border-gray-100">
                        <span className="text-gray-600">Disposability</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.disposability}
                        </span>
                      </div>
                    )}
                    {product.product_info?.usage && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Usage</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.usage}
                        </span>
                      </div>
                    )}
                    {product.product_info?.waterContent && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Water Content</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.waterContent}
                        </span>
                      </div>
                    )}
                    {product.product_info?.baseCurve && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Base Curve</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.baseCurve}
                        </span>
                      </div>
                    )}
                    {product.product_info?.diameter && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Diameter</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.diameter}
                        </span>
                      </div>
                    )}
                    {product.product_info?.packaging && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Packaging</span>
                        <span className="font-medium text-gray-900">
                          {product.product_info.packaging}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Power Options (if present) */}
            {product.product_info?.powerOptions && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Select Power</h4>
                <div className="flex flex-wrap gap-2">
                  {product.product_info.powerOptions.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPower(p)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                        selectedPower === p
                          ? "text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:border-red-800"
                      }`}
                      style={selectedPower === p ? { backgroundColor: 'var(--text-primary)', borderColor: 'var(--text-primary)' } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="px-4 sm:px-6 py-2 font-medium text-gray-900 text-sm sm:text-base">{quantity}</div>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Static Info Card */}
            <div className="rounded-2xl p-4 sm:p-6 border" style={{ backgroundColor: 'var(--text-heading)', borderColor: 'var(--text-primary)' }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-sm sm:text-base">7 Days Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--text-primary)' }}>
                    <span className="text-white text-xs">↻</span>
                  </div>
                  <span className="text-gray-800 font-medium text-sm sm:text-base">Exchange at 850+ stores</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--text-primary)' }}>
                    <span className="text-white text-xs">🛡</span>
                  </div>
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    Warranty: {product.product_info?.warranty || "As per product"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* End Right Section */}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt={productTitle}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                if (e.target.src !== "/placeholder.jpg") {
                  e.target.src = "/placeholder.jpg";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
