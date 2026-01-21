import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { categories } from "../data/categories";

const Navbar = ({ onSearchClick, isSearchOpen, onSearchClose, searchTerm, onSearchChange, onSearchSubmit }) => {
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);
  const { user, logout } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [bagsOpen, setBagsOpen] = useState(false);
  const [skincareOpen, setSkincareOpen] = useState(false);
  const [mensShoesOpen, setMensShoesOpen] = useState(false);
  const [womensShoesOpen, setWomensShoesOpen] = useState(false);
  const [kidsShoesOpen, setKidsShoesOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Focus search input when it opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setCategoriesOpen(false);
        setAccessoriesOpen(false);
        setSkincareOpen(false);
        setMensShoesOpen(false);
        setWomensShoesOpen(false);
        setKidsShoesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <div className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-optic">
        <div className="flex items-center justify-between py-1 sm:py-1.5">
          {/* Left Side - Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-4 flex-1">
          {/* Menu Button (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

            {/* Logo - Left Side */}
            <Link to="/" className="flex items-center">
              <img 
                src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1767693849/White_Teal_Yellow_And_Blue_Illustrative_Digital_Payment_Solutions_Presentation_100_x_100_px_2_fspuqo.png" 
                alt="Sole mate" 
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
                style={{ maxWidth: '200px' }}
              />
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-center">
            <Link 
              to="/" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              HOME
            </Link>
            <Link 
              to="/about" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              ABOUT US
            </Link>
            <Link 
              to="/shop" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              SHOP
            </Link>
            <Link 
              to="/sale" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              SALE
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 relative z-10 flex-1 justify-end">
            {/* Search Bar - Inline for Desktop, Hidden for Mobile (will show below navbar) */}
            <div className="relative hidden md:block z-10">
              {!isSearchOpen ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onSearchClick) onSearchClick(e);
                  }}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  aria-label="Open search"
                  type="button"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onSearchSubmit) onSearchSubmit(e);
                  }}
                  className="flex items-center"
                >
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm || ''}
                      onChange={(e) => {
                        if (onSearchChange) onSearchChange(e);
                      }}
                      className="w-48 sm:w-64 md:w-80 lg:w-96 h-10 sm:h-11 pl-10 pr-20 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSearchChange) onSearchChange({ target: { value: '' } });
                          }}
                          className="p-1 hover:opacity-70 transition-opacity rounded"
                          style={{ color: 'var(--text-secondary)' }}
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onSearchClose}
                        className="p-1 hover:opacity-70 transition-opacity rounded"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Close search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            {/* Search Icon for Mobile - Will trigger search bar below navbar */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onSearchClick) onSearchClick(e);
              }}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Open search"
              type="button"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist - Hidden on mobile (shown in bottom nav) */}
            <Link to="/wishlist" className="relative group hidden md:block">
              <Heart 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" 
                style={{ color: 'var(--text-primary)' }}
              />
              {wishlist.length > 0 && (
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag - Hidden on mobile (shown in bottom nav) */}
            <Link to="/cart" className="relative group hidden md:block">
              <ShoppingBag 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" 
                style={{ color: 'var(--text-primary)' }}
              />
              {cart.length > 0 && (
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Login - Desktop Only */}
            {user ? (
              <div className="relative hidden md:block" ref={navRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 text-optic-body text-xs sm:text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
                </button>
                
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-50"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Orders
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 font-medium"
                          style={{ color: 'var(--text-heading)' }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="hidden md:block text-optic-body text-xs sm:text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div 
            ref={menuRef}
            className="md:hidden border-t" 
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="container-optic py-4">
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                  className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  HOME
                </Link>
                <Link 
                  to="/shop" 
                  onClick={() => setMenuOpen(false)}
                  className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  SHOP
                </Link>
                <Link 
                  to="/sale" 
                  onClick={() => setMenuOpen(false)}
                  className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  SALE
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setMenuOpen(false)}
                  className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ABOUT US
                </Link>
                
                {/* Men's Shoes Section */}
                <div>
                  <button
                    onClick={() => {
                      setMensShoesOpen(!mensShoesOpen);
                      setWomensShoesOpen(false);
                      setKidsShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>MEN'S SHOES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mensShoesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mensShoesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      <Link
                        to="/category/Men's%20Shoes"
                        onClick={() => {
                          setMenuOpen(false);
                          setMensShoesOpen(false);
                        }}
                        className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        All Men's Shoes
                      </Link>
                      {["Formal", "Sneakers", "Boots", "Loafers", "Sandals"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/Men's%20Shoes?subCategory=${category}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setMensShoesOpen(false);
                          }}
                          className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Women's Shoes Section */}
                <div>
                  <button
                    onClick={() => {
                      setWomensShoesOpen(!womensShoesOpen);
                      setMensShoesOpen(false);
                      setKidsShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>WOMEN'S SHOES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${womensShoesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {womensShoesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      <Link
                        to="/category/Women's%20Shoes"
                        onClick={() => {
                          setMenuOpen(false);
                          setWomensShoesOpen(false);
                        }}
                        className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        All Women's Shoes
                      </Link>
                      {["Heels", "Flats", "Sneakers", "Boots", "Sandals", "Chappals"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/Women's%20Shoes?subCategory=${category}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setWomensShoesOpen(false);
                          }}
                          className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kids Shoes Section */}
                <div>
                  <button
                    onClick={() => {
                      setKidsShoesOpen(!kidsShoesOpen);
                      setMensShoesOpen(false);
                      setWomensShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>KIDS SHOES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${kidsShoesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {kidsShoesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      <Link
                        to="/category/Kids%20Shoes"
                        onClick={() => {
                          setMenuOpen(false);
                          setKidsShoesOpen(false);
                        }}
                        className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        All Kids Shoes
                      </Link>
                      {["Boys Footwear", "Girls Footwear"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/Kids%20Shoes?subCategory=${encodeURIComponent(category)}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setKidsShoesOpen(false);
                          }}
                          className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Section */}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      ACCOUNT
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      ORDERS
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: 'var(--text-heading)' }}
                      >
                        ADMIN DASHBOARD
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    LOGIN
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
