import Slider from "react-slick";     
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import LuxuryCarousel from "../components/LuxuryCarousel.jsx";
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
    { icon: Footprints, name: "Men's Shoes", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765632321/-4_rmrf0v.jpg", link: "/category/Men's%20Shoes", color: "bg-red-50" },
    { icon: Footprints, name: "Women's Shoes", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765633228/Step_into_style_ouhtyb.jpg", link: "/category/Women's%20Shoes", color: "bg-red-50" },
    { icon: Footprints, name: "Kids Shoes", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765632321/-4_rmrf0v.jpg", link: "/category/Kids%20Shoes", color: "bg-red-50" }
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
      {/* Hero Section - Brown for Autumn Style with Card Design */}
      <section className="relative min-h-[80vh] flex items-center py-12 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic w-full relative z-10">
          {/* Card Container */}
          <div 
            className="relative rounded-3xl p-8 md:p-12 lg:p-16"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-6 lg:space-y-8 relative pl-8 z-20" style={{ fontFamily: 'Georgia, serif' }}>
                {/* Vertical lines on the left */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col gap-2">
                  <div className="w-0.5 h-16" style={{ backgroundColor: 'var(--text-primary)' }}></div>
                  <div className="w-0.5 h-16" style={{ backgroundColor: 'var(--text-primary)' }}></div>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                  Brown for<br />Autumn
                </h1>
                <p className="text-base md:text-lg max-w-lg font-serif" style={{ color: 'var(--text-secondary)' }}>
                  The best shoes you have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link 
                    to="/shop" 
                    className="btn-primary flex items-center gap-2"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Star className="w-5 h-5" style={{ fill: 'var(--text-primary)', color: 'var(--text-primary)' }} />
                    <span className="text-sm font-medium">4.9 Average Customer Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Product Image */}
              <div className="relative z-10">
                <div 
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1767700197/b0a2ac7a6dfb3cae08ba547b8bc89381_uv6778.jpg" 
                    alt="Featured Shoes"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Explore Our Collections */}
      <section className="relative pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
              <TrendingUp className="w-4 h-4" />
              Trending Categories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-0 font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Explore Our Collections
            </h2>
          </div>
          
          {/* Luxury Carousel */}
          <div className="w-full -mx-4 sm:-mx-6">
            <LuxuryCarousel
              slides={[
                // Men's Shoes Subcategories
                {
                  subCategory: "Formal",
                  title: "Formal",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768383027/Design_to_Shine_18_rmz7ob.svg",
                  link: "/category/Men's%20Shoes?subCategory=Formal",
                  description: "Elegant and sophisticated"
                },
                {
                  subCategory: "Sneakers",
                  title: "Sneakers",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768373064/Design_to_Shine_1_ogmige.svg",
                  link: "/category/Men's%20Shoes?subCategory=Sneakers",
                  description: "Comfort meets style"
                },
                {
                  subCategory: "Boots",
                  title: "Boots",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768373148/Design_to_Shine_2_dx4nlv.svg",
                  link: "/category/Men's%20Shoes?subCategory=Boots",
                  description: "Durable and rugged"
                },
                {
                  subCategory: "Loafers",
                  title: "Loafers",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768374950/Design_to_Shine_5_jqaw2a.svg",
                  link: "/category/Men's%20Shoes?subCategory=Loafers",
                  description: "Classic and versatile"
                },
                {
                  subCategory: "Sandals",
                  title: "Sandals",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768373827/5fc31871-3ccd-415c-af7f-67d1a1b021f7.png",
                  link: "/category/Men's%20Shoes?subCategory=Sandals",
                  description: "Comfortable and casual"
                },
                // Women's Shoes Subcategories
                {
                  subCategory: "Heels",
                  title: "Heels",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768375035/Design_to_Shine_6_yd9kvn.svg",
                  link: "/category/Women's%20Shoes?subCategory=Heels",
                  description: "Elegant and timeless"
                },
                {
                  subCategory: "Flats",
                  title: "Flats",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768377514/Design_to_Shine_7_h4ogqm.svg",
                  link: "/category/Women's%20Shoes?subCategory=Flats",
                  description: "Comfortable everyday style"
                },
                {
                  subCategory: "Sneakers",
                  title: "Sneakers",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768375416/Design_to_Shine_8_ve1mai.svg",
                  link: "/category/Women's%20Shoes?subCategory=Sneakers",
                  description: "Sporty and chic"
                },
                {
                  subCategory: "Boots",
                  title: "Boots",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768376681/Design_to_Shine_9_vv2rh7.svg",
                  link: "/category/Women's%20Shoes?subCategory=Boots",
                  description: "Stylish and practical"
                },
                {
                  subCategory: "Sandals",
                  title: "Sandals",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768376686/Design_to_Shine_10_ossnrx.svg",
                  link: "/category/Women's%20Shoes?subCategory=Sandals",
                  description: "Light and breezy"
                },
                {
                  subCategory: "Chappals",
                  title: "Chappals",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768377370/Design_to_Shine_15_ebfphr.svg",
                  link: "/category/Women's%20Shoes?subCategory=Chappals",
                  description: "Traditional comfort"
                },
                // Kids Shoes Subcategories
                {
                  subCategory: "Boys Footwear",
                  title: "Boys Footwear",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768377162/a2a20b7a-d180-41d1-848f-62b889974700.png",
                  link: "/category/Kids%20Shoes?subCategory=Boys%20Footwear",
                  description: "Durable and fun"
                },
                {
                  subCategory: "Girls Footwear",
                  title: "Girls Footwear",
                  image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768377620/Design_to_Shine_17_dntfxz.svg",
                  link: "/category/Kids%20Shoes?subCategory=Girls%20Footwear",
                  description: "Cute and comfortable"
                }
              ]}
            />
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="relative pt-12 sm:pt-16 md:pt-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}>
              <Star className="w-4 h-4" />
              Best Sellers
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Featured <span style={{ color: 'var(--text-primary)' }}>Products</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
              Handpicked selection of our most popular and stylish footwear
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: 'var(--text-primary)', borderRightColor: 'transparent' }}></div>
              <p className="mt-6 text-lg" style={{ color: 'var(--text-primary)' }}>Loading amazing products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--text-heading)' }}>
                <Star className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
              </div>
              <p className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Unable to load products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-secondary)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--text-primary)'}
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--text-heading)' }}>
                <Eye className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
              </div>
              <p className="text-lg" style={{ color: 'var(--text-primary)' }}>No products found</p>
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
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--text-primary)' }}></div>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Shoes Section - Men's & Women's Combined */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                <Footprints className="w-4 h-4" />
                Footwear Collection
              </div>
              <h2 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Men's & Women's Shoes
              </h2>
              <p className="text-optic-body text-lg md:text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Step out in style with our premium collection of footwear. From formal to casual, sneakers to elegant, discover the perfect pair for every occasion.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-primary)' }}>
                    <Award className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-optic-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Premium quality</h4>
                    <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>Comfortable & durable</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-heading)' }}>
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
                    <div className={`${i === 0 ? 'aspect-[2/1]' : 'aspect-square'} rounded-2xl overflow-hidden`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <img 
                        src={imageSrc}
                        alt={`Shoes ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                      {i === 0 ? 'MEN\'S' : 'WOMEN\'S'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: 'var(--text-primary)' }}></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: 'var(--text-primary)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic py-20">
          <div className="text-center mb-20">
            <h2 className="text-optic-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Why Choose <span style={{ color: 'var(--text-primary)' }}>Sole mate</span>?
            </h2>
            <p className="text-optic-body text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We're committed to providing the best footwear experience with guaranteed quality and service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Shield className="w-12 h-12" style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>100% Authentic</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>All our products are sourced directly from manufacturers and come with authenticity guarantees.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Verified Products</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Truck className="w-12 h-12" style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Free Shipping</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Enjoy free shipping on all orders above ₹500. Fast delivery to your doorstep.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">Express Delivery</span>
              </div>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Award className="w-12 h-12" style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="text-optic-heading text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Expert Support</h3>
              <p className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Our team of footwear specialists is always ready to help you find the perfect pair.</p>
              <div className="mt-6 flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                <Heart className="w-4 h-4" />
                <span className="text-sm">24/7 Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'var(--bg-primary)', opacity: '0.1' }}></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: 'var(--bg-primary)', opacity: '0.05' }}></div>
        </div>
        <div className="container-optic relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--bg-primary)' }}>100k+</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--bg-primary)' }}>Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--bg-primary)' }}>500+</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--bg-primary)' }}>Products</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--bg-primary)' }}>4.9★</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--bg-primary)' }}>Average Rating</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--bg-primary)' }}>30</div>
              <div className="text-sm sm:text-base" style={{ color: 'var(--bg-primary)' }}>Day Returns</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
