import Slider from "react-slick";     
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Eye, Sun, Monitor, Phone, Star, Shield, Truck, ArrowRight, Sparkles, TrendingUp, Users, Award } from 'lucide-react';

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
  let url = "http://localhost:4000/api/products?";
        if (category) url += `category=${category}&`;
        if (search) url += `search=${search}&`;
        url += `limit=500`; // increase the number of products returned on Home

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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

  const posters = ["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762187614/Poster1_clwk43.jpg", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762280427/Gemini_Generated_Image_tx1v8btx1v8btx1v_guh1yj.png", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762765368/Gemini_Generated_Image_v8akptv8akptv8ak_iw2ynn.jpg"];

  const categories = [
    { icon: Eye, name: "Eyeglasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762757250/eyeglass_fuwwlt.webp", link: "/category/Eyeglasses", color: "bg-blue-50" },
    { icon: Sun, name: "Sunglasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762756833/sunglasses_x1svz3.jpg", link: "/category/Sunglasses", color: "bg-amber-50" },
    { icon: Monitor, name: "Computer Glasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762757347/computer_awjoxt.webp", link: "/category/Computer%20Glasses", color: "bg-green-50" },
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                New Collection 2024
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Vision</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover our collection of premium eyewear. Style meets comfort in every frame.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span className="text-sm">100k+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">100% Authentic</span>
                </div>
              </div>
            </div>
            {/* Mobile/Tablet carousel */}
            <div className="block lg:hidden">
              <div className="relative mt-8">
                <Slider {...carouselSettings} className="rounded-2xl overflow-hidden shadow-2xl">
                  {posters.map((poster, index) => (
                    <div key={index} className="outline-none">
                      <img
                        src={poster}
                        alt={`Featured ${index + 1}`}
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Desktop carousel */}
            <div className="hidden lg:block">
              <div className="relative">
                <Slider {...carouselSettings} className="rounded-2xl overflow-hidden shadow-2xl">
                  {posters.map((poster, index) => (
                    <div key={index} className="outline-none">
                      <img 
                        src={poster} 
                        alt={`Featured ${index + 1}`} 
                        className="w-full h-[450px] object-cover"
                      />
                    </div>
                  ))}
                </Slider>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg animate-bounce">
                  30% OFF
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  Free Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Trending Categories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From classic frames to modern designs, find the perfect eyewear for every occasion
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <Link 
                key={i}
                to={cat.link}
                className={`group relative ${cat.color} rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-600"></div>
                </div>
                
                <div className="relative flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <cat.icon size={32} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                    <p className="text-sm text-gray-600">Premium collection</p>
                  </div>
                  <div className="relative w-full">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-48 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 font-medium group-hover:text-sky-700 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Best Sellers
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {products.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={() => addToCart(product)}
                    addToWishlist={() => addToWishlist(product)}
                  />
                ))}
              </div>
              <div className="text-center mt-16">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Lenses Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center p-12 lg:p-16">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Special Collection
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Premium Contact Lenses
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Discover our collection of premium contact lenses and solutions. 
                  Experience comfort and clarity like never before.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span>Medical-grade quality</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span>Fast delivery nationwide</span>
                  </div>
                </div>
                <Link
                  to="/category/Contact%20Lenses"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Shop Contact Lenses
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762766654/Contact-lens_fa4zf1.jpg", lens2].map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors duration-300"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-xl">
                      <img
                        src={img}
                        alt={`Contact Lens ${i + 1}`}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {i === 0 ? 'NEW' : 'HOT'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose LensLogic?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best eyewear experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-sky-200 transition-colors">
                <Shield className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Authentic</h3>
              <p className="text-gray-600">All our products are sourced directly from manufacturers and come with authenticity guarantees.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Truck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Free Shipping</h3>
              <p className="text-gray-600">Enjoy free shipping on all orders above ₹500. Fast delivery to your doorstep.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600">Our team of eyewear specialists is always ready to help you find the perfect pair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">100k+</div>
              <div className="text-sky-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-sky-100">Products</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.9★</div>
              <div className="text-sky-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">30</div>
              <div className="text-sky-100">Day Returns</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
