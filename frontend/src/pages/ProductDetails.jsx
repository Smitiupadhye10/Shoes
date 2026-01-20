import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
      setProduct(null);
      try {
        console.log("Fetching product with ID:", id);
        const { data } = await api.get(`/products/${id}`);
        console.log("Product data received:", data);
        if (data && data._id) {
        setProduct(data);
          // Set default size if available
          if (data.sizes_inventory && data.sizes_inventory.length > 0) {
            setSelectedSize(data.sizes_inventory[0].size);
          }
          // Set default color if available
          if (data.product_info?.color) {
            setSelectedColor(data.product_info.color);
          }
        } else {
          setError("Product data is invalid");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        console.error("Error response:", err.response);
        setError(err.response?.data?.message || err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
    fetchProduct();
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [id]);

  // Wishlist state
  useEffect(() => {
    if (product?._id) {
      setIsWishlisted(wishlist.some((item) => item._id === product._id));
    }
  }, [product, wishlist]);

  // Get all images for the product
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
    
    // Fallback to imageUrl
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return [product.imageUrl];
    }
    
    // If images is a string
    if (typeof product.images === 'string' && product.images.trim() !== '') {
      return [product.images];
    }
    
    // Fallback to placeholder
    return ["/placeholder.jpg"];
  };

  const images = getProductImages();
  const selectedImage = images[selectedImageIndex] || "/placeholder.jpg";
  
  // Get product title
  const getProductTitle = () => {
    if (!product) return "Product";
    return product.title || product.name || product.productName || "Product";
  };
  
  const productTitle = getProductTitle();

  // Get available sizes
  const getAvailableSizes = () => {
    if (product?.sizes_inventory && product.sizes_inventory.length > 0) {
      return product.sizes_inventory.map(item => item.size);
    }
    // Fallback sizes
    return ['XS', 'S', 'M', 'L', 'XL'];
  };

  const availableSizes = getAvailableSizes();

  // Get available colors (if multiple colors available)
  const getAvailableColors = () => {
    const colors = [];
    if (product?.product_info?.color) {
      colors.push(product.product_info.color);
    }
    // Add more colors if available in product data
    if (product?.product_info?.frameColor && product.product_info.frameColor !== product.product_info.color) {
      colors.push(product.product_info.frameColor);
    }
    return colors;
  };

  const availableColors = getAvailableColors();

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-optic-body text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{error}</p>
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

  if (!product && !loading) {
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
    const item = { ...product, selectedSize, selectedColor, quantity };
    addToCart(item);
  };

  const handleBuyNow = () => {
    const item = { ...product, selectedSize, selectedColor, quantity };
    addToCart(item);
    navigate("/cart");
  };

  // Calculate prices
  const getPrices = () => {
    const discountedPrice = Number(product.price || product.finalPrice || 0);
    let originalPrice = Number(product.originalPrice || 0);
    const discountPercent = Number(product.discount || product.discountPercent || 0);
    
    if (!originalPrice && discountPercent > 0 && discountedPrice > 0) {
      originalPrice = Math.round(discountedPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = discountedPrice;
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

  // Get rating
  const rating = product.ratings || product.rating || 0;
  const reviewsCount = product.numReviews || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Section - Product Images */}
          <div className="space-y-3 sm:space-y-4">
                {/* Main Image Container */}
            <div className="relative rounded-lg overflow-hidden group" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <img
                    src={selectedImage}
                    alt={productTitle}
                className="w-full h-auto object-contain"
                    onError={(e) => {
                      if (e.target.src !== "/placeholder.jpg") {
                        e.target.src = "/placeholder.jpg";
                      }
                    }}
              />
              
              {/* Wishlist Icon - Top Right */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
                  
              {/* Navigation Arrows - Always Visible */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-all z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-all z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
            </div>

            {/* Image Carousel Dots */}
                  {images.length > 1 && (
              <div className="flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImageIndex === i
                        ? "bg-pink-500 w-3"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
                    </div>
                  )}

            {/* Thumbnail Images */}
                {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === i
                        ? "border-gray-800 scale-105"
                        : "border-gray-200 hover:border-gray-400"
                        }`}
                        aria-label={`Select image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${productTitle}-${i}`}
                      className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.target.src !== "/placeholder.jpg") {
                              e.target.src = "/placeholder.jpg";
                            }
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

            {/* T&C Applied Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-xs text-green-800 text-center">T&C Applied</p>
              </div>

              {/* Action Buttons */}
            <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                className="w-full px-6 py-3 border-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  borderColor: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
                  >
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
                  </button>
                  <button
                    onClick={handleBuyNow}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-primary)'
                  }}
                  onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-red-hover)';
                  }}
                  onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                  }}
                >
                BUY IT NOW
                </button>
            </div>
          </div>

          {/* Right Section - Product Information */}
          <div className="space-y-6">
            {/* Breadcrumbs */}
            <nav className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <span className="mx-2">/</span>
              <Link to={`/category/${encodeURIComponent(product.category || '')}`} className="hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                {product.category || 'Products'}
              </Link>
              <span className="mx-2">/</span>
              <span style={{ color: 'var(--text-primary)' }}>{productTitle}</span>
            </nav>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {productTitle}
            </h1>

            {/* Price */}
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatINR(discountedPrice)}
              </div>
              {originalPrice > discountedPrice && (
                <div className="text-base sm:text-lg line-through" style={{ color: 'var(--text-secondary)' }}>
                  {formatINR(originalPrice)}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  if (i < fullStars) {
                    return <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
                  } else if (i === fullStars && hasHalfStar) {
                    return <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />;
                  } else {
                    return <Star key={i} className="w-5 h-5 fill-gray-300 text-gray-300" />;
                  }
                })}
              </div>
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                {rating.toFixed(1)} ({reviewsCount})
                </span>
            </div>

            {/* Tax Information */}
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Inclusive of all taxes</p>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                SKU: <span className="font-medium">{product.sku}</span>
              </p>
            )}

            {/* Shipping Promotion Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-green-600 fill-green-600" />
              <span className="text-sm font-medium text-green-800">
                Free shipping on all pre-paid orders
                  </span>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase" style={{ color: 'var(--text-primary)' }}>Size</label>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-sm underline hover:opacity-70 transition-opacity" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded font-medium transition-all ${
                      selectedSize === size
                        ? ""
                        : ""
                    }`}
                    style={selectedSize === size
                      ? { borderColor: 'var(--text-primary)', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }
                      : { borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }
                    }
                    onMouseEnter={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.borderColor = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase block" style={{ color: 'var(--text-primary)' }}>
                  More Colors
                </label>
                <div className="flex gap-3">
                  {availableColors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedColor === color
                          ? "ring-2"
                          : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        borderColor: selectedColor === color ? 'var(--text-primary)' : 'var(--border-color)',
                        ringColor: selectedColor === color ? 'var(--text-primary)' : 'transparent'
                      }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                    </div>
                  )}

            {/* Easy Returns Policy */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">EASY RETURNS</h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Eligible for exchange/return under 7-day return policy</li>
                <li>• Avail store credits on returns</li>
                <li>• T&C Applied*</li>
              </ul>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Description</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
              </div>
            )}

            {/* Product Details - Display All Available Information */}
            <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Product Details</h3>
              <div className="space-y-2 text-sm">
                {product.product_info?.brand && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Brand</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.brand}</span>
                  </div>
                )}
                {product.product_info?.gender && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Gender</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{mapGender(product.product_info.gender)}</span>
                  </div>
                )}
                {product.subCategory && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Category</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.subCategory}</span>
                  </div>
                )}
                {product.subSubCategory && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Sub Category</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.subSubCategory}</span>
                  </div>
                )}
                {product.product_info?.outerMaterial && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Outer Material</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.outerMaterial}</span>
                  </div>
                )}
                {product.product_info?.soleMaterial && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Sole Material</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.soleMaterial}</span>
                  </div>
                )}
                {product.product_info?.innerMaterial && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Inner Material</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.innerMaterial}</span>
                  </div>
                )}
                {product.product_info?.closureType && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Closure Type</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.closureType}</span>
                  </div>
                )}
                {product.product_info?.toeShape && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Toe Shape</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.toeShape}</span>
                      </div>
                    )}
                {product.product_info?.heelHeight && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Heel Height</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.heelHeight}</span>
                  </div>
                )}
                {product.product_info?.embellishments && product.product_info.embellishments.length > 0 && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Embellishments</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.embellishments.join(', ')}</span>
                  </div>
                )}
                {product.product_info?.warranty && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Warranty</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.warranty}</span>
                  </div>
                )}
                {/* Shoes Accessories specific fields */}
                {product.product_info?.material && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Material</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.material}</span>
                  </div>
                )}
                {product.product_info?.accessoryType && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Accessory Type</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.accessoryType}</span>
                  </div>
                )}
                {product.product_info?.usage && (
                  <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Usage</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.usage}</span>
                  </div>
                )}
                {product.product_info?.color && (
                  <div className="flex justify-between py-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Color</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.product_info.color}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                if (e.target.src !== "/placeholder.jpg") {
                  e.target.src = "/placeholder.jpg";
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSizeChartOpen(false)}
        >
          <div 
            className="relative bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close size chart"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>UK</th>
                      <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>US</th>
                      <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>EU</th>
                      <th className="border px-4 py-3 text-left font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Women's Sizes */}
                    <tr>
                      <td colSpan="4" className="border px-4 py-2 font-semibold" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Women's Sizes</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>3 (W)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>3.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>36</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>25</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>4 (W)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>4.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>37</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>25.5</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>5 (W)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>5.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>38</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>26</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>6 (W)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>6.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>39</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>26.5</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>7 (W)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>7.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>40</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>27</td>
                    </tr>
                    {/* Men's Sizes */}
                    <tr>
                      <td colSpan="4" className="border px-4 py-2 font-semibold" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Men's Sizes</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>6 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>6.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>40</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>27.5</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>7 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>7.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>41</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>28</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>8 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>8.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>42</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>28.5</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>9 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>9.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>43</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>29</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>10 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>10.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>44</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>30</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>11 (M)</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>11.5</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>45</td>
                      <td className="border px-4 py-2" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>30.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
