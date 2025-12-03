import Slider from "react-slick";     
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Eye, Sun, Monitor, Phone, Star, Shield, Truck, ArrowRight, Plus, TrendingUp, Users, Award, Zap, Heart, Package, Clock, CheckCircle } from 'lucide-react';

const Home = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        params.limit = 500; // increase the number of products returned on Home
        const { data } = await api.get('/products', { params });
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const posters = ["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1764746468/Objects_Discover_and_Inspire_-_View_Our_Portfolio_KARL_TAYLOR_tzwgky.jpg", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762280427/Gemini_Generated_Image_tx1v8btx1v8btx1v_guh1yj.png", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762765368/Gemini_Generated_Image_v8akptv8akptv8ak_iw2ynn.jpg"];

  const categories = [
    { icon: Eye, name: "Eyeglasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762757250/eyeglass_fuwwlt.webp", link: "/category/Eyeglasses", color: "bg-blue-50" },
    { icon: Sun, name: "Sunglasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762756833/sunglasses_x1svz3.jpg", link: "/category/Sunglasses", color: "bg-amber-50" },
    { icon: Monitor, name: "Computer Glasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1763573363/computer_snzcg9.webp", link: "/category/Computer%20Glasses", color: "bg-green-50" },
    { icon: Phone, name: "Contact Lenses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762756967/Contact_lenses_gncbmy.webp", link: "/category/Contact%20Lenses", color: "bg-purple-50" }
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="space-y-0">
      {/* Hero Section - OPTIC Style */}
      <section className="relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-optic-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl" style={{ color: 'var(--text-primary)' }}>
                Glasses & Lens
              </h1>
              <p className="text-optic-subheading text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-primary)' }}>
                Buy the best high-quality sunglasses from us. More than 100 types of assortment
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop" 
                  className="btn-primary"
                >
                  Start Shopping
                </Link>
                <Link 
                  to="/shop" 
                  className="btn-secondary"
                >
                  Explore More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Product Card */}
            <div className="relative">
               
                {/* Product Image Placeholder */}
                <div className="relative mb-8">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-black/10">
                    <img 
                      src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1764746468/Objects_Discover_and_Inspire_-_View_Our_Portfolio_KARL_TAYLOR_tzwgky.jpg" 
                      alt="Featured Sunglasses"
                      className="w-full h-full object-cover"
                    />
                  </div>
                   
                   
                
                 
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trend Products Section - OPTIC Style */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="text-center mb-16">
            <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Trend Products
            </h2>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 8).map((product, index) => (
              <div key={product._id} className="card-product">
                {/* Product Icon/Image */}
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <Eye className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
                  </div>
                </div>
                
                {/* Product Info */}
                <h3 className="text-optic-heading text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {product.name || `Product ${index + 1}`}
                </h3>
                <p className="text-optic-body text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {product.category || 'vision'}
                </p>
                <div className="text-optic-heading text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  ${product.price || (200 + index * 33)}
                </div>
                
                {/* Add Button */}
                <button 
                  onClick={() => addToCart(product)}
                  className="btn-accent mx-auto"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium mb-6 border border-purple-200">
              <Star className="w-4 h-4" />
              Best Sellers
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked selection of our most popular and stylish eyewear
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading amazing products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 text-lg mb-6">Unable to load products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 ">
                {products.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={() => addToCart(product)}
                    addToWishlist={() => addToWishlist(product)}
                  />
                ))}
              </div>
              <div className="text-center mt-20">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10">View All Products</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Lenses Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mobile enhanced layout */}
          <div className="sm:hidden rounded-3xl border bg-white/80 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium w-fit">
                <Phone className="w-3 h-3" />
                Special Collection
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Premium Contact Lenses</h2>
              <p className="text-gray-600 leading-relaxed">
                Discover our collection of premium contact lenses and solutions. Experience comfort and clarity like never before.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 p-3 bg-sky-50 rounded-xl">
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="font-medium">Medical-grade quality</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">Fast delivery nationwide</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762766654/Contact-lens_fa4zf1.jpg", lens2].map((img, i) => (
                  <div key={i} className="relative group">
                    <img key={i} src={img} alt={`Contact Lens ${i + 1}`} className="w-full h-32 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {i === 0 ? 'NEW' : 'HOT'}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/category/Contact%20Lenses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Contact Lenses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Enhanced Tablet/Desktop gradient card */}
          <div className="hidden sm:block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl relative group">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:py-20 relative">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                  <Phone className="w-4 h-4" />
                  Special Collection
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">Contact Lenses</span>
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Discover our collection of premium contact lenses and solutions. 
                  Experience comfort and clarity like never before.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white group/item">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/item:bg-white/30 transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-lg">Medical-grade quality</span>
                  </div>
                  <div className="flex items-center gap-4 text-white group/item">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/item:bg-white/30 transition-colors">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-lg">Fast delivery nationwide</span>
                  </div>
                </div>
                <Link
                  to="/category/Contact%20Lenses"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span className="relative z-10">Shop Contact Lenses</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762766654/Contact-lens_fa4zf1.jpg", lens2].map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-white/10 rounded-3xl group-hover:bg-white/20 transition-all duration-500 group-hover:scale-105"></div>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img
                        src={img}
                        alt={`Contact Lens ${i + 1}`}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Glass overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                    </div>
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {i === 0 ? 'NEW' : 'HOT'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">LensLogic</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to providing the best eyewear experience with guaranteed quality and service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                <Shield className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Authentic</h3>
              <p className="text-gray-600 leading-relaxed">All our products are sourced directly from manufacturers and come with authenticity guarantees.</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sky-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Verified Products</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                <Truck className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Enjoy free shipping on all orders above ₹500. Fast delivery to your doorstep.</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-green-600 font-medium">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Express Delivery</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                <Award className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">Our team of eyewear specialists is always ready to help you find the perfect pair.</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-purple-600 font-medium">
                <Heart className="w-4 h-4" />
                <span className="text-sm">24/7 Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div className="group">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">100k+</div>
              <div className="text-sky-100 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-sky-100 text-sm sm:text-base">Products</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
              <div className="text-sky-100 text-sm sm:text-base">Average Rating</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">30</div>
              <div className="text-sky-100 text-sm sm:text-base">Day Returns</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
