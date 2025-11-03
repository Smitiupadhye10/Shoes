import Slider from "react-slick";
import poster1 from "../assets/images/Poster1.jpeg";
import poster2 from "../assets/images/poster2.jpeg";
import poster3 from "../assets/images/poster3.jpeg";
import fit1 from "../assets/images/sunglasses.jpeg"; 
import fit2 from "../assets/images/eyeglass.jpeg";
import fit3 from "../assets/images/computer.jpeg";
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Eye, Sun, Monitor, Phone } from 'lucide-react';

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

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const posters = [poster1, poster2, poster3];

  const categories = [
    { icon: Eye, name: "Eyeglasses", image: fit2, link: "/category/Eyeglasses", color: "bg-blue-50" },
    { icon: Sun, name: "Sunglasses", image: fit1, link: "/category/Sunglasses", color: "bg-amber-50" },
    { icon: Monitor, name: "Computer Glasses", image: fit3, link: "/category/Computer%20Glasses", color: "bg-green-50" },
    { icon: Phone, name: "Contact Lenses", image: lens1, link: "/category/Contact%20Lenses", color: "bg-purple-50" }
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Find Your Perfect <span className="text-blue-400">Vision</span>
              </h1>
              <p className="text-xl text-gray-300">
                Discover our collection of premium eyewear. Style meets comfort in every frame.
              </p>
              <div className="space-x-4">
                <Link 
                  to="/shop" 
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/about" 
                  className="inline-block px-8 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Slider {...carouselSettings} className="rounded-xl overflow-hidden shadow-2xl">
                {posters.map((poster, index) => (
                  <div key={index} className="outline-none">
                    <img 
                      src={poster} 
                      alt={`Featured ${index + 1}`} 
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Explore Our Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Link 
              key={i}
              to={cat.link}
              className={`group ${cat.color} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <cat.icon size={40} className="text-gray-700" />
                <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-48 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Unable to load products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={() => addToCart(product)}
                    addToWishlist={() => addToWishlist(product)}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/shop"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Lenses Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center p-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Premium Contact Lenses
              </h2>
              <p className="text-gray-700 text-lg">
                Discover our collection of premium contact lenses and solutions. 
                Experience comfort and clarity like never before.
              </p>
              <Link
                to="/category/Contact%20Lenses"
                className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
              >
                Shop Contact Lenses
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[lens1, lens2].map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={img}
                    alt={`Contact Lens ${i + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
