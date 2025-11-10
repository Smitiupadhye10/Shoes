import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
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
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
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

  const images = product ? (Array.isArray(product.images) ? product.images : []) : [];
  const selectedImage = images[selectedImageIndex] || "/placeholder.jpg";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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

  const discount = Number(product.discount || 0);
  const priceNumber = Number(product.price || 0);
  const discountedPrice =
    discount > 0 ? Math.max(0, priceNumber * (1 - discount / 100)) : priceNumber;

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(num || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Section - Image Carousel */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Wishlist Heart Icon */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Image Carousel */}
              <div className="relative mb-4">
                {/* Main Image Container */}
                <div className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={openImageModal}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`flex-shrink-0 w-20 h-20 p-1 rounded-lg border-2 transition-all duration-200 ${
                          selectedImageIndex === i
                            ? "border-indigo-600 shadow-md scale-105"
                            : "border-gray-200 hover:border-indigo-300"
                        } bg-white`}
                        aria-label={`Select image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.title}-${i}`}
                          className="w-full h-full object-contain rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Buy Now
                  </button>
                </div>
                <button
                  onClick={toggleWishlist}
                  className="w-full flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="space-y-6">
            {/* Card 1: Title / Ratings / Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-2">
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {product.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.ratings || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({(product.ratings || 0).toFixed ? (product.ratings || 0).toFixed(1) : Number(product.ratings || 0).toFixed(1)}
                    ) · {product.numReviews || 0} reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-4xl font-bold text-indigo-600">
                    {formatINR(discountedPrice)}
                  </div>
                  {discount > 0 && (
                    <div className="text-lg text-gray-500 line-through mt-1">
                      {formatINR(priceNumber)}
                    </div>
                  )}
                </div>
                {discount > 0 && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold shadow-md">
                    {discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Description */}
            {product.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Card 3: Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3">
                {product.product_info?.brand && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
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
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Select Power</h4>
                <div className="flex flex-wrap gap-2">
                  {product.product_info.powerOptions.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPower(p)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                        selectedPower === p
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-sky-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="px-6 py-2 font-medium text-gray-900">{quantity}</div>
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium">7 Days Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">↻</span>
                  </div>
                  <span className="text-gray-800 font-medium">Exchange at 850+ stores</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🛡</span>
                  </div>
                  <span className="text-gray-800 font-medium">
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
              alt={product.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
