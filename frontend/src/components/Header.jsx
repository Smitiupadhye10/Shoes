import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import { CartContext } from "../context/CartContext";
import { Search, X } from "lucide-react";

const Header = () => {
  const { cart, wishlist } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const categories = {
        eyeglasses: { title: "Eyeglasses" },
        sunglasses: { title: "Sunglasses" },
        computerglasses: { title: "Computer Glasses" },
        contactlenses: { title: "Contact Lenses" },
      };

      const matchedCategory = Object.values(categories).find((cat) =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchedCategory) {
        navigate(`/category/${encodeURIComponent(matchedCategory.title)}`);
      } else {
        navigate(`/home?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      navigate("/home");
    }
    setSearchTerm("");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="w-full z-50 bg-white shadow-md">
      {/* Top Navbar (cart/wishlist etc.) */}
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />

      {/* Unified Category + Search Section */}
      <div className="w-full bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
            {/* Category Dropdown */}
            <div className="w-full md:w-auto flex-shrink-0">
              <CategoryBar />
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative w-full md:max-w-2xl flex-grow"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
