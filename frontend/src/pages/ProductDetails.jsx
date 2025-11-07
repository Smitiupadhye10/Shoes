import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart, X, Star, ArrowLeft } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState("/placeholder.jpg");
  const [selectedPower, setSelectedPower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist = [],
  } = useContext(CartContext);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        if (Array.isArray(data.images) && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage("/placeholder.jpg");
        }

        if (data.product_info?.powerOptions?.length > 0) {
          setSelectedPower(data.product_info.powerOptions[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
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

  if (!product) {
    return <div className="text-center text-gray-500 py-12">Loading...</div>;
  }

  const images = Array.isArray(product.images) ? product.images : [];

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-100 text-white py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-sm opacity-90">
              {product.category} · {product.subCategory || ""}
            </p>
          </div>

          {/* Back button with arrow */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Images (sticky) */}
          <div className="lg:w-1/2 lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Wishlist Heart Icon on top-right of the image card */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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

              {/* Main Image */}
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-xl bg-gray-50 cursor-pointer hover:opacity-90 transition"
                  onClick={openImageModal}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {images.length > 0 ? (
                  images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 p-1 rounded-lg border transition-all ${
                        selectedImage === img
                          ? "border-blue-600 shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      } bg-white`}
                      aria-label={`Select image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.title}-${i}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400">No images</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-md"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Cards */}
          <div className="lg:w-1/2 space-y-6">
            {/* Card 1: Title / Ratings / Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>

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

              <div className="flex items-center gap-6 mb-2">
                <div>
                  <div className="text-3xl font-bold text-sky-700">
                    {formatINR(discountedPrice)}
                  </div>
                  {discount > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatINR(priceNumber)}
                    </div>
                  )}
                </div>
                {discount > 0 && (
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
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
