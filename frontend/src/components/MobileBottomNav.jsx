import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Grid, Heart, ShoppingBag, User, Eye, Sun, Monitor, Phone, Sparkles, ShoppingBag as BagIcon, Footprints, X, ChevronLeft } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);
  const { user } = useUser();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoriesModalRef = useRef(null);

  // Determine active route
  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    if (path === "/category") {
      return location.pathname.startsWith("/category");
    }
    return location.pathname === path;
  };

  // Close categories modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesModalRef.current && !categoriesModalRef.current.contains(event.target)) {
        setCategoriesOpen(false);
        setSelectedCategory(null);
      }
    };

    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [categoriesOpen]);

  // Reset selected category when modal closes
  useEffect(() => {
    if (!categoriesOpen) {
      setSelectedCategory(null);
    }
  }, [categoriesOpen]);

  const handleCategoriesClick = () => {
    setCategoriesOpen(true);
  };

  const handleCategoryClick = (category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      // Show subcategories
      setSelectedCategory(category);
    } else {
      // Navigate directly if no subcategories
      navigate(category.link);
      setCategoriesOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleSubcategorySelect = (category, subcategory) => {
    const params = new URLSearchParams({ subCategory: subcategory.toLowerCase() });
    navigate(`${category.link}?${params.toString()}`);
    setCategoriesOpen(false);
    setSelectedCategory(null);
  };

  const handleAllCategorySelect = (category) => {
    navigate(category.link);
    setCategoriesOpen(false);
    setSelectedCategory(null);
  };

  const allCategories = [
    { icon: Footprints, name: "Men's Shoes", link: "/category/Men's%20Shoes", subcategories: ["Formal", "Sneakers", "Boots", "Loafers", "Sandals"] },
    { icon: Footprints, name: "Women's Shoes", link: "/category/Women's%20Shoes", subcategories: ["Heels", "Flats", "Sneakers", "Boots", "Sandals", "Chappals"] },
    { icon: Footprints, name: "Kids Shoes", link: "/category/Kids%20Shoes", subcategories: ["Boys Footwear", "Girls Footwear"] },
    { icon: Footprints, name: "Shoes Accessories", link: "/category/Shoes%20Accessories", subcategories: ["Shoe Laces", "Shoe Polish", "Shoe Insoles", "Shoe Bags", "Shoe Trees", "Shoe Care Kits"] },
  ];

  const handleAccountClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/home",
      onClick: null,
    },
    {
      icon: Grid,
      label: "Categories",
      path: "/category",
      onClick: handleCategoriesClick,
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
      badge: wishlist.length > 0 ? wishlist.length : null,
      onClick: null,
    },
    {
      icon: ShoppingBag,
      label: "Cart",
      path: "/cart",
      badge: cart.length > 0 ? cart.length : null,
      onClick: null,
    },
    {
      icon: User,
      label: "Account",
      path: user ? "/profile" : "/signin",
      onClick: handleAccountClick,
    },
  ];

  return (
    <>
      {/* Categories Modal */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setCategoriesOpen(false)}
          />
          {/* Modal Content */}
          <div 
            ref={categoriesModalRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-color)' }} />
            </div>
            
            {/* Header */}
            <div className="px-6 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedCategory ? selectedCategory.name : 'All Categories'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setCategoriesOpen(false);
                    setSelectedCategory(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {selectedCategory ? (
                // Subcategories View
                <div>
                  {/* All Category Option */}
                  <button
                    onClick={() => handleAllCategorySelect(selectedCategory)}
                    className="w-full flex items-center justify-between p-4 mb-3 rounded-xl border-2 transition-all duration-200 active:scale-95"
                    style={{ borderColor: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--text-primary)' }}>
                        {React.createElement(selectedCategory.icon, { className: "w-5 h-5 text-gray-900" })}
                      </div>
                      <span className="text-base font-semibold text-gray-900">All {selectedCategory.name}</span>
                    </div>
                  </button>

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCategory.subcategories.map((subcat) => {
                      const isActive = location.search.includes(`subCategory=${subcat.toLowerCase()}`);
                      return (
                        <button
                          key={subcat}
                          onClick={() => handleSubcategorySelect(selectedCategory, subcat)}
                          className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                            isActive
                              ? 'shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-md active:scale-95'
                          }`}
                          style={isActive ? { borderColor: 'var(--text-primary)', backgroundColor: 'var(--text-heading)' } : {}}
                          onMouseEnter={(e) => !isActive && (e.target.style.borderColor = 'var(--text-primary)', e.target.style.backgroundColor = 'var(--text-heading)')}
                          onMouseLeave={(e) => !isActive && (e.target.style.borderColor = '', e.target.style.backgroundColor = '')}
                        >
                          <span 
                            className={`text-sm font-medium ${
                              isActive ? 'text-gray-900 font-semibold' : 'text-gray-700'
                            }`}
                          >
                            {subcat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Main Categories Grid
                <div className="grid grid-cols-2 gap-4">
                  {allCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = location.pathname.includes(encodeURIComponent(cat.name));
                    const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
                    
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryClick(cat)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                          isActive
                            ? 'shadow-md scale-105'
                            : 'border-gray-200 bg-white hover:shadow-md active:scale-95'
                        }`}
                        style={isActive ? { borderColor: 'var(--text-primary)', backgroundColor: 'var(--text-heading)' } : { backgroundColor: 'var(--bg-primary)' }}
                        onMouseEnter={(e) => !isActive && (e.target.style.borderColor = 'var(--text-primary)', e.target.style.backgroundColor = 'var(--text-heading)')}
                        onMouseLeave={(e) => !isActive && (e.target.style.borderColor = '', e.target.style.backgroundColor = '')}
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: isActive ? 'var(--text-primary)' : 'var(--border-color)' }}
                        >
                          <Icon 
                            className={`w-6 h-6 ${
                              isActive ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          />
                        </div>
                        <span 
                          className={`text-xs font-medium text-center leading-tight ${
                            isActive ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {cat.name}
                        </span>
                        {hasSubcategories && (
                          <span className="text-[10px] text-gray-500 mt-1">
                            {cat.subcategories.length} options
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path) || (item.label === 'Categories' && categoriesOpen);
              
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="flex flex-col items-center justify-center relative px-3 py-1 flex-1 transition-all duration-200"
                  style={{
                    color: active ? 'var(--text-heading)' : 'var(--text-secondary)'
                  }}
                >
                  <div className="relative">
                    <Icon 
                      className={`w-5 h-5 transition-all duration-200 ${active ? 'scale-110' : ''}`}
                      style={{
                        color: active ? 'var(--text-heading)' : 'var(--text-secondary)'
                      }}
                    />
                    {item.badge && (
                      <span 
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ 
                          backgroundColor: 'var(--text-primary)', 
                          color: 'var(--bg-primary)'
                        }}
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span 
                    className="text-[10px] font-medium mt-0.5 transition-all duration-200"
                    style={{
                      color: active ? 'var(--text-heading)' : 'var(--text-secondary)',
                      fontWeight: active ? '600' : '400'
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS for slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileBottomNav;

