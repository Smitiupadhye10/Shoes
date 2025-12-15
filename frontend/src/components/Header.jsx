import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import { CartContext } from "../context/CartContext";
import { Search, X, ChevronDown, ShoppingBag, Menu, Plus } from "lucide-react";
import { categories } from "../data/categories";

// Accessories Dropdown Component
const AccessoriesDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const navigate = useNavigate();
  const accessoriesRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accessoriesRef.current && !accessoriesRef.current.contains(event.target)) {
        setIsAccessoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsAccessoriesOpen(false);
    if (category === "All") {
      navigate(`/category/Accessories`);
    } else {
      // Use subCategory parameter for accessories subcategories
      const params = new URLSearchParams({ subCategory: category.toLowerCase() });
      navigate(`/category/Accessories?${params.toString()}`);
    }
  };

  // Handle clicking on the Accessories button itself
  const handleAccessoriesClick = () => {
    if (!isAccessoriesOpen) {
      setIsAccessoriesOpen(true);
    } else {
      // If dropdown is open and user clicks button again, navigate to all accessories
      navigate(`/category/Accessories`);
      setIsAccessoriesOpen(false);
    }
  };

  const subcategories = ["Necklace", "Bracelets", "Tie", "Anklets", "Earings", "Belts", "Scarfs"];

  return (
    <div className="relative" ref={accessoriesRef}>
      <button
        onClick={handleAccessoriesClick}
        className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm min-w-[100px] sm:min-w-[140px] justify-between"
      >
        <span className="group-hover:text-sky-700 transition-colors truncate">
            <span>Accessories</span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 flex-shrink-0 ${isAccessoriesOpen ? 'rotate-180' : ''}`} />
      </button>
      {isAccessoriesOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 md:w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-2xl z-[100] max-h-[70vh] sm:max-h-96 overflow-y-auto">
          <div className="p-1 sm:p-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group font-semibold"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Accessories</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            {subcategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Bags Dropdown Component
const BagsDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isBagsOpen, setIsBagsOpen] = useState(false);
  const navigate = useNavigate();
  const bagsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bagsRef.current && !bagsRef.current.contains(event.target)) {
        setIsBagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsBagsOpen(false);
    if (category === "All") {
      navigate(`/category/Bags`);
    } else {
      // Use subCategory parameter for bag categories
      const params = new URLSearchParams({ subCategory: category.toLowerCase() });
      navigate(`/category/Bags?${params.toString()}`);
    }
  };

  // Handle clicking on the Bags button itself
  const handleBagsClick = () => {
    if (!isBagsOpen) {
      setIsBagsOpen(true);
    } else {
      // If dropdown is open and user clicks button again, navigate to all bags
      navigate(`/category/Bags`);
      setIsBagsOpen(false);
    }
  };

  const categories = ["Handbag" , "Sling Bag", "Tote Bag", "Duffle Bag", "Wallet", "Laptop Bag", "Travel Bag", "Clutch", "Shoulder Bag"];

  return (
    <div className="relative" ref={bagsRef}>
      <button
        onClick={handleBagsClick}
        className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm min-w-[100px] sm:min-w-[140px] justify-between"
      >
        <span className="group-hover:text-sky-700 transition-colors truncate">
            <span>Bags</span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 flex-shrink-0 ${isBagsOpen ? 'rotate-180' : ''}`} />
      </button>
      {isBagsOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 md:w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-2xl z-[100] max-h-[70vh] sm:max-h-96 overflow-y-auto">
          <div className="p-1 sm:p-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group font-semibold"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Bags</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Skincare Dropdown Component
const SkincareDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSkincareOpen, setIsSkincareOpen] = useState(false);
  const navigate = useNavigate();
  const skincareRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skincareRef.current && !skincareRef.current.contains(event.target)) {
        setIsSkincareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSkincareOpen(false);
    if (category === "All") {
      navigate(`/category/Skincare`);
    } else {
      // Use subCategory parameter for skincare subcategories to avoid conflict with main category
      const params = new URLSearchParams({ subCategory: category.toLowerCase() });
      navigate(`/category/Skincare?${params.toString()}`);
    }
  };

  // Handle clicking on the Skincare button itself
  const handleSkincareClick = () => {
    if (!isSkincareOpen) {
      setIsSkincareOpen(true);
    } else {
      // If dropdown is open and user clicks button again, navigate to all skincare
      navigate(`/category/Skincare`);
      setIsSkincareOpen(false);
    }
  };

  const subcategories = ["Moisturizer", "Serum", "Cleanser", "Facewash", "Sunscreen"];

  return (
    <div className="relative" ref={skincareRef}>
      <button
        onClick={handleSkincareClick}
        className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm min-w-[100px] sm:min-w-[140px] justify-between"
      >
        <span className="group-hover:text-sky-700 transition-colors truncate">
            <span>Skincare</span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 flex-shrink-0 ${isSkincareOpen ? 'rotate-180' : ''}`} />
      </button>
      {isSkincareOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 md:w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-2xl z-[100] max-h-[70vh] sm:max-h-96 overflow-y-auto">
          <div className="p-1 sm:p-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group font-semibold"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Skincare</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            {subcategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Men's Shoes Dropdown Component
const MensShoesDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMensShoesOpen, setIsMensShoesOpen] = useState(false);
  const navigate = useNavigate();
  const mensShoesRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mensShoesRef.current && !mensShoesRef.current.contains(event.target)) {
        setIsMensShoesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsMensShoesOpen(false);
    if (category === "All") {
      navigate(`/category/Men's%20Shoes`);
    } else {
      // Use subCategory parameter for men's shoes subcategories
      const params = new URLSearchParams({ subCategory: category });
      navigate(`/category/Men's%20Shoes?${params.toString()}`);
    }
  };

  // Handle clicking on the Men's Shoes button itself
  const handleMensShoesClick = () => {
    if (!isMensShoesOpen) {
      setIsMensShoesOpen(true);
    } else {
      // If dropdown is open and user clicks button again, navigate to all men's shoes
      navigate(`/category/Men's%20Shoes`);
      setIsMensShoesOpen(false);
    }
  };

  const subcategories = ["Formal", "Sneakers", "Boots"];

  return (
    <div className="relative" ref={mensShoesRef}>
      <button
        onClick={handleMensShoesClick}
        className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm min-w-[100px] sm:min-w-[140px] justify-between"
      >
        <span className="group-hover:text-sky-700 transition-colors truncate">
          <span>Men's Shoes</span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 flex-shrink-0 ${isMensShoesOpen ? 'rotate-180' : ''}`} />
      </button>
      {isMensShoesOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 md:w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-2xl z-[100] max-h-[70vh] sm:max-h-96 overflow-y-auto">
          <div className="p-1 sm:p-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group font-semibold"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Men's Shoes</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            {subcategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Women's Shoes Dropdown Component
const WomensShoesDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isWomensShoesOpen, setIsWomensShoesOpen] = useState(false);
  const navigate = useNavigate();
  const womensShoesRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (womensShoesRef.current && !womensShoesRef.current.contains(event.target)) {
        setIsWomensShoesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsWomensShoesOpen(false);
    if (category === "All") {
      navigate(`/category/Women's%20Shoes`);
    } else {
      // Use subCategory parameter for women's shoes subcategories
      const params = new URLSearchParams({ subCategory: category });
      navigate(`/category/Women's%20Shoes?${params.toString()}`);
    }
  };

  // Handle clicking on the Women's Shoes button itself
  const handleWomensShoesClick = () => {
    if (!isWomensShoesOpen) {
      setIsWomensShoesOpen(true);
    } else {
      // If dropdown is open and user clicks button again, navigate to all women's shoes
      navigate(`/category/Women's%20Shoes`);
      setIsWomensShoesOpen(false);
    }
  };

  const subcategories = ["Heels", "Flats", "Sneakers", "Boots", "Sandals"];

  return (
    <div className="relative" ref={womensShoesRef}>
      <button
        onClick={handleWomensShoesClick}
        className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 shadow-sm min-w-[100px] sm:min-w-[140px] justify-between"
      >
        <span className="group-hover:text-sky-700 transition-colors truncate">
          <span>Women's Shoes</span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 flex-shrink-0 ${isWomensShoesOpen ? 'rotate-180' : ''}`} />
      </button>
      {isWomensShoesOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 md:w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-2xl z-[100] max-h-[70vh] sm:max-h-96 overflow-y-auto">
          <div className="p-1 sm:p-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group font-semibold"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Women's Shoes</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            {subcategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div className="flex items-center gap-3 flex-wrap">
      {/* Category Dropdown */}
      <div className="relative" ref={categoryRef}>
        <button
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen);
            setIsSubCategoryOpen(false);
          }}
          className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm min-w-[140px] justify-between"
        >
          <span className="group-hover:text-sky-700 transition-colors">{selectedCategory ? categories[selectedCategory].title : "Glasses"}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>
        {isCategoryOpen && (
          <div className="absolute top-full left-0 mt-2 w-52 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-80 overflow-y-auto">
            <div className="p-2">
              {Object.keys(categories).filter(key => key !== 'accessories' && key !== 'skincare').map((key) => (
                <button
                  key={key}
                  onClick={() => handleCategorySelect(key)}
                  className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-sm font-medium rounded-lg group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{categories[key].title}</span>
                </button>
              ))}
            </div>
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
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm min-w-[140px] justify-between"
          >
            <span className="group-hover:text-sky-700 transition-colors">
              {selectedSubCategory
                ? subCategories.find(([field]) => selectedSubCategory.startsWith(field))?.[0] || "Sub-Category"
                : "Sub-Category"}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-sky-600 transition-all duration-200 ${isSubCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-96 overflow-y-auto">
              <div className="p-2">
                {subCategories.map(([field, values]) => (
                  <div key={field} className="mb-2 last:mb-0">
                    <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-sky-50 text-xs font-semibold text-gray-600 uppercase rounded-lg mb-1">
                      {field}
                    </div>
                    <div className="space-y-1">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleSubCategorySelect(field, value)}
                          className="w-full text-left px-6 py-2.5 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 transition-all duration-200 text-sm rounded-lg group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">{value}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

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

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Only close if search term is empty
        if (!searchTerm.trim()) {
          setIsSearchOpen(false);
        }
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen, searchTerm]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [isSearchOpen]);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(e);
    setIsSearchOpen(false);
  };

  return (
    <header className="w-full z-50  sticky bottom-10 top-0" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navbar (cart/wishlist etc.) */}
      <Navbar 
        cartCount={cart.length} 
        wishlistCount={wishlist.length} 
        onSearchClick={() => setIsSearchOpen(true)}
        isSearchOpen={isSearchOpen}
        onSearchClose={handleSearchClose}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Search Bar Below Navbar - Mobile Only */}
      {isSearchOpen && (
        <div className="md:hidden border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="container-optic py-3">
            <form 
              onSubmit={handleSearchSubmit} 
              className="w-full"
              ref={searchRef}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  id="search-mobile"
                  name="search"
                  type="text"
                  placeholder="Search for eyewear, brands..."
                  className="block w-full pl-10 pr-20 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm placeholder-gray-400 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1.5 hover:opacity-70 transition-opacity rounded-lg hover:bg-gray-100"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="p-1.5 hover:opacity-70 transition-opacity rounded-lg hover:bg-gray-100"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Section - Desktop Only */}
      <div className="hidden md:block border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="container-optic py-3 sm:py-4">
          <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap">
            <CategoryDropdowns />
            <AccessoriesDropdown />
            <BagsDropdown />
            <SkincareDropdown />
            <MensShoesDropdown />
            <WomensShoesDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="container-optic py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-optic-body text-sm font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                HOME
              </Link>
              <Link 
                to="/shop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-optic-body text-sm font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                SHOP
              </Link>
              <Link 
                to="/category/New" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-optic-body text-sm font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                NEW
              </Link>
              <Link 
                to="/category/Sale" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-optic-body text-sm font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                SALE
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
