import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import { CartContext } from "../context/CartContext";
import { Search, X, ChevronDown } from "lucide-react";
import { categories } from "../data/categories";

// Compact Category Dropdowns Component
const CategoryDropdowns = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const categoryRef = useRef(null);
  const subCategoryRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (subCategoryRef.current && !subCategoryRef.current.contains(event.target)) {
        setIsSubCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    setSelectedSubCategory("");
    setIsCategoryOpen(false);
    setIsSubCategoryOpen(false);
    const categoryTitle = categories[catKey].title;
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  const handleSubCategorySelect = (field, value) => {
    setSelectedSubCategory(`${field}-${value}`);
    setIsSubCategoryOpen(false);
    const categoryTitle = categories[selectedCategory].title;
    const params = new URLSearchParams({ [field]: value });
    navigate(`/category/${encodeURIComponent(categoryTitle)}?${params.toString()}`);
  };

  const currentCategory = selectedCategory ? categories[selectedCategory] : null;
  const subCategories = currentCategory ? Object.entries(currentCategory.fields) : [];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Category Dropdown */}
      <div className="relative" ref={categoryRef}>
        <button
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen);
            setIsSubCategoryOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-sky-400 hover:bg-sky-50 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm min-w-[140px] justify-between"
        >
          <span>{selectedCategory ? categories[selectedCategory].title : "Category"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>
        {isCategoryOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => handleCategorySelect(key)}
                className="w-full text-left px-4 py-2.5 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150 text-sm font-medium"
              >
                {categories[key].title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sub-Category Dropdown (only shown if category is selected) */}
      {selectedCategory && subCategories.length > 0 && (
        <div className="relative" ref={subCategoryRef}>
          <button
            onClick={() => {
              setIsSubCategoryOpen(!isSubCategoryOpen);
              setIsCategoryOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-sky-400 hover:bg-sky-50 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm min-w-[140px] justify-between"
          >
            <span>
              {selectedSubCategory
                ? subCategories.find(([field]) => selectedSubCategory.startsWith(field))?.[0] || "Sub-Category"
                : "Sub-Category"}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubCategoryOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
              {subCategories.map(([field, values]) => (
                <div key={field} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    {field}
                  </div>
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSubCategorySelect(field, value)}
                      className="w-full text-left px-6 py-2 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150 text-sm"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { cart, wishlist } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      navigate("/home");
      setSearchTerm("");
      return;
    }

    const lower = term.toLowerCase();

    // 1) Match by category title
    const matchedCategory = Object.values(categories).find((cat) =>
      cat.title.toLowerCase().includes(lower)
    );
    if (matchedCategory) {
      navigate(`/category/${encodeURIComponent(matchedCategory.title)}`);
      setSearchTerm("");
      return;
    }

    // 2) Match by any subcategory value (field -> values)
    for (const [, cat] of Object.entries(categories)) {
      const fields = cat.fields || {};
      for (const [field, values] of Object.entries(fields)) {
        const found = values.find((v) => v.toLowerCase() === lower || v.toLowerCase().includes(lower));
        if (found) {
          const params = new URLSearchParams({ [field]: found });
          navigate(`/category/${encodeURIComponent(cat.title)}?${params.toString()}`);
          setSearchTerm("");
          return;
        }
      }
    }

    // 3) Fallback to product search on Shop page
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setSearchTerm("");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="w-full z-40 bg-white shadow-md sticky top-0">
      {/* Top Navbar (cart/wishlist etc.) */}
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />

      {/* Unified Category + Search Section */}
      <div className="w-full bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between gap-3">
            <div className="w-full flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-3">
              {/* Category Bar - Full width on mobile, flex-1 on larger screens */}
              <div className="w-full md:flex-1">
                <CategoryBar inline />
              </div>
              
              {/* Search Form - Full width on mobile, max width on larger screens */}
              <form onSubmit={handleSearch} className="w-full md:max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Search products or categories..."
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-base sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search products or categories"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-12 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 flex items-center bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-r-xl hover:from-sky-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm"
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Search</span>
                    <span className="sm:hidden">
                      <Search className="h-5 w-5 text-white" />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
