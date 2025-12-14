import Slider from "react-slick";     
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Eye, Sun, Monitor, Phone, Star, Shield, Truck, ArrowRight, Plus, TrendingUp, Users, Award, Zap, Heart, Package, Clock, CheckCircle, Sparkles, ShoppingBag, Footprints } from 'lucide-react';

const Home = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        params.limit = 500; // increase the number of products returned on Home
        const { data } = await api.get('/products', { params });
        
        if (isMounted) {
        setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (err) {
        if (isMounted) {
        console.error("Error fetching products:", err);
        setError(err.message);
        }
      } finally {
        if (isMounted) {
        setIsLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [category, search]);

  const posters = ["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1764746468/Objects_Discover_and_Inspire_-_View_Our_Portfolio_KARL_TAYLOR_tzwgky.jpg", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762280427/Gemini_Generated_Image_tx1v8btx1v8btx1v_guh1yj.png", 
    "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762765368/Gemini_Generated_Image_v8akptv8akptv8ak_iw2ynn.jpg"];

  const categories = [
    { icon: Eye, name: "Eyeglasses", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1764754900/eye_ynczat.jpg", link: "/category/Eyeglasses", color: "bg-blue-50" },
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
      <section className="relative -mt-16 md:-mt-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Mobile: Full-width poster - breaks out of container padding */}
        <div className="lg:hidden" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw', paddingLeft: 0, paddingRight: 0 }}>
          <img 
            src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765260875/EYE_GLASS_AD_POSTER_DESIGN_jw5yap.jpg" 
            alt="Featured Sunglasses"
            className="w-full h-auto object-cover block"
          />
        </div>
        
        {/* Desktop: Grid layout with text and image */}
        <div className="container-optic hidden lg:block">
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

      {/* Categories Section - OPTIC Style */}
      <section className="relative pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((cat, i) => {
              return (
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
                      className="w-full h-48 object-cover rounded-xl shadow-md " 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 font-medium group-hover:text-sky-700 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="relative pt-12 sm:pt-16 md:pt-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium mb-6 border border-purple-200">
              <Star className="w-4 h-4" />
              Best Sellers
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Products</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 ">
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
                  className="btn-primary"
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

      {/* Contact Lenses Section - OPTIC Style */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                <Phone className="w-4 h-4" />
                Special Collection
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-primary)' }}>
                Premium Contact Lenses
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Discover our collection of premium contact lenses and solutions. Experience comfort and clarity like never before.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Shield className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Medical-grade quality</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>FDA approved materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Truck className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Fast delivery</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Nationwide shipping</p>
                  </div>
                </div>
              </div>
              
              <Link to="/category/Contact%20Lenses" className="btn-primary">
                Shop Contact Lenses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {["https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765263540/lenses_odr9qz.jpg", "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1764756548/Colour_Contact_Lenses_UK_Buy_Online_qnm0oz.jpg"].map((img, i) => (
                  <div key={i} className={`relative group ${i === 0 ? 'lg:col-span-2' : ''}`}>
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden`}>
                      <img 
                        src={img} 
                        alt={`Contact Lens ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                      {i === 0 ? 'NEW' : 'HOT'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Images */}
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765628634/ForevermarkJewellery_bivmdr.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765381755/Classy_jewellery_tfh1dy.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765604411/-2_c4bayc.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765605150/__gruuxh.jpg"
                ].map((imageSrc, i) => (
                  <div key={i} className={`relative group ${i === 0 ? 'col-span-2' : ''}`}>
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden bg-gray-100`}>
                      <img 
                        src={imageSrc.trim()}
                        alt={`Accessory ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
            </div>

            {/* Right Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                <Sparkles className="w-4 h-4" />
                Fashion Collection
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-primary)' }}>
                Stylish Accessories
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Complete your look with our curated collection of accessories. From necklaces to belts, find the perfect piece to express your style.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Star className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Premium quality</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Handpicked designs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Package className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Wide variety</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Necklaces, bracelets & more</p>
                  </div>
                </div>
              </div>
              
              <Link to="/category/Accessories" className="btn-primary">
                Shop Accessories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skincare Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                <Sparkles className="w-4 h-4" />
                Beauty Essentials
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-primary)' }}>
                Premium Skincare
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Nourish your skin with our carefully selected skincare products. From moisturizers to serums, discover your perfect skincare routine.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Shield className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Natural ingredients</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Safe for all skin types</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Award className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Dermatologist tested</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Proven results</p>
                  </div>
                </div>
              </div>
              
              <Link to="/category/Skincare" className="btn-primary">
                Shop Skincare
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765624761/cfed9d14ca376276db8d5f771096246e_w7zr1a.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765624893/Mock_Up_Cosmetic_Products_For_Skin_And_Hair_Care_With_Plant_Extract_Natural_Cosmetics_Skin_Care_Hair_Care_Cosmetics_PNG_Transparent_Image_and_Clipart_for_Free_Download_hitdtg.jpg"
                ].map((imageSrc, i) => (
                  <div key={i} className={`relative group ${i === 0 ? 'lg:col-span-2' : ''}`}>
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden bg-gray-100`}>
                      <img 
                        src={imageSrc}
                        alt={`Skincare ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                      {i === 0 ? 'NEW' : 'HOT'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bags Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Images */}
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765627731/0bf11b55-b060-48d3-ad2c-6e8c8ea672d2.png",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765625023/Collections_xhdxv4.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765628179/-3_jwchfd.jpg" 
                ].map((imageSrc, i) => (
                  <div key={i} className={`relative group ${i === 0 ? 'col-span-2' : ''}`}>
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden bg-gray-100`}>
                      <img 
                        src={imageSrc}
                        alt={`Bag ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
            </div>

            {/* Right Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                <ShoppingBag className="w-4 h-4" />
                Travel Collection
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-primary)' }}>
                Designer Bags
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Carry your essentials in style with our premium collection of bags. From handbags to backpacks, find the perfect companion for every occasion.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Shield className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Durable materials</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Built to last</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Truck className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Free shipping</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>On orders above ₹500</p>
                  </div>
                </div>
              </div>
              
              <Link to="/category/Bags" className="btn-primary">
                Shop Bags
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shoes Section - Men's & Women's Combined */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                <Footprints className="w-4 h-4" />
                Footwear Collection
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-primary)' }}>
                Men's & Women's Shoes
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Step out in style with our premium collection of footwear. From formal to casual, sneakers to elegant, discover the perfect pair for every occasion.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Award className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Premium quality</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Comfortable & durable</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                    <Star className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Wide variety</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Formal, casual, sneakers & more</p>
                  </div>
                </div>
              </div>
              
              {/* Two buttons for Men's and Women's */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/category/Men's%20Shoes" className="btn-primary flex-1">
                  Men's Shoes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/category/Women's%20Shoes" className="btn-secondary flex-1">
                  Women's Shoes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765632321/-4_rmrf0v.jpg",
                  "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765633228/Step_into_style_ouhtyb.jpg"
                ].map((imageSrc, i) => (
                  <div key={i} className={`relative group ${i === 0 ? 'lg:col-span-2' : ''}`}>
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden bg-gray-100`}>
                      <img 
                        src={imageSrc}
                        alt={`Shoes ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                      {i === 0 ? 'MEN\'S' : 'WOMEN\'S'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic py-20">
          <div className="text-center mb-20">
            <h2 className="text-optic-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Why Choose <span style={{ color: 'var(--accent-yellow)' }}>LensLogic</span>?
            </h2>
            <p className="text-optic-body text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We're committed to providing the best eyewear experience with guaranteed quality and service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Shield className="w-12 h-12" style={{ color: 'var(--accent-yellow)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>100% Authentic</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>All our products are sourced directly from manufacturers and come with authenticity guarantees.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--accent-yellow)' }}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Verified Products</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Truck className="w-12 h-12" style={{ color: 'var(--accent-yellow)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Free Shipping</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Enjoy free shipping on all orders above ₹500. Fast delivery to your doorstep.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--accent-yellow)' }}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">Express Delivery</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Award className="w-12 h-12" style={{ color: 'var(--accent-yellow)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Expert Support</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Our team of eyewear specialists is always ready to help you find the perfect pair.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--accent-yellow)' }}>
                <Heart className="w-4 h-4" />
                <span className="text-sm">24/7 Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--accent-yellow)' }}>
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'var(--bg-primary)', opacity: '0.1' }}></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: 'var(--bg-primary)', opacity: '0.05' }}></div>
        </div>
        <div className="container-optic relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>100k+</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>500+</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Products</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>4.9★</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Average Rating</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>30</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Day Returns</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
