import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { categories } from "../data/categories";

const Navbar = ({ onSearchClick }) => {
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);
  const { user, logout } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setCategoriesOpen(false);
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
        <div className="flex items-center justify-between py-4 sm:py-6">
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

          {/* Logo - Centered on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-none">
            <Link to="/" className="text-optic-heading text-2xl sm:text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              LENSLOGIC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-center">
            <Link 
              to="/" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              HOME
            </Link>
            <Link 
              to="/shop" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              SHOP
            </Link>
            <Link 
              to="/about" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              ABOUT US
            </Link>
            <Link 
              to="/category/New" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              NEW
            </Link>
            <Link 
              to="/category/Sale" 
              className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              SALE
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon */}
            <button
              onClick={onSearchClick}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Open search"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" 
                style={{ color: 'var(--text-primary)' }}
              />
              {wishlist.length > 0 && (
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <Link to="/cart" className="relative group">
              <ShoppingBag 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" 
                style={{ color: 'var(--text-primary)' }}
              />
              {cart.length > 0 && (
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}
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
                          style={{ color: 'var(--accent-yellow)' }}
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
                  to="/about" 
                  onClick={() => setMenuOpen(false)}
                  className="text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ABOUT US
                </Link>
                
                {/* Categories Section */}
                <div>
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>CATEGORIES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {categoriesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      {Object.entries(categories).map(([key, category]) => (
                        <Link
                          key={key}
                          to={`/category/${encodeURIComponent(category.title)}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setCategoriesOpen(false);
                          }}
                          className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {category.title}
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
                        style={{ color: 'var(--accent-yellow)' }}
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
