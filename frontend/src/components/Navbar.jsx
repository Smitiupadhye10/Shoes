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
        <div className="flex items-center justify-between py-2 sm:py-3">
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
            <Link to="/" className="flex items-center">
              <img 
                src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1765629960/b7a50a65-12b2-4dc8-89a4-1a5985bd6706.png" 
                alt="LENS LOGIC" 
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
                style={{ maxWidth: '280px' }}
              />
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
             
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar - Inline for Desktop, Hidden for Mobile (will show below navbar) */}
            <div className="relative hidden md:block">
              {!isSearchOpen ? (
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
              onClick={onSearchClick}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Open search"
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
                  style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}
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
                    <span>GLASSES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {categoriesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      {Object.entries(categories).filter(([key]) => key !== 'accessories').map(([key, category]) => (
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

                {/* Accessories Section */}
                <div>
                  <button
                    onClick={() => {
                      setAccessoriesOpen(!accessoriesOpen);
                      setCategoriesOpen(false);
                      setSkincareOpen(false);
                      setMensShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>ACCESSORIES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${accessoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {accessoriesOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      {["Men", "Women"].map((gender) => (
                        <Link
                          key={gender}
                          to={`/category/Accessories?gender=${gender}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setAccessoriesOpen(false);
        setSkincareOpen(false);
                            setMensShoesOpen(false);
                          }}
                          className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {gender}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bags Section */}
                <div>
                  <button
                    onClick={() => {
                      setBagsOpen(!bagsOpen);
                      setCategoriesOpen(false);
                      setAccessoriesOpen(false);
                      setSkincareOpen(false);
                      setMensShoesOpen(false);
                      setWomensShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>BAGS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${bagsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {bagsOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      <Link
                        to="/category/Bags"
                        onClick={() => {
                          setMenuOpen(false);
                          setBagsOpen(false);
                        }}
                        className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        All Bags
                      </Link>
                      {["Handbag", "Backpack", "Sling Bag", "Tote Bag", "Duffle Bag", "Wallet", "Laptop Bag", "Travel Bag", "Crossbody Bag", "Clutch", "Shoulder Bag"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/Bags?subCategory=${category.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setBagsOpen(false);
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

                {/* Skincare Section */}
                <div>
                  <button
                    onClick={() => {
                      setSkincareOpen(!skincareOpen);
                      setCategoriesOpen(false);
                      setAccessoriesOpen(false);
                      setBagsOpen(false);
                      setMensShoesOpen(false);
                      setWomensShoesOpen(false);
                    }}
                    className="w-full text-left text-optic-body text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>SKINCARE</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${skincareOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {skincareOpen && (
                    <div className="pl-4 mt-2 space-y-1">
                      <Link
                        to="/category/Skincare"
                        onClick={() => {
                          setMenuOpen(false);
                          setSkincareOpen(false);
                        }}
                        className="block text-optic-body text-sm py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        All Skincare
                      </Link>
                      {["Moisturizer", "Serum", "Cleanser", "Facewash", "Sunscreen"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/Skincare?subCategory=${category.toLowerCase()}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setSkincareOpen(false);
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

                {/* Men's Shoes Section */}
                <div>
                  <button
                    onClick={() => {
                      setMensShoesOpen(!mensShoesOpen);
                      setCategoriesOpen(false);
                      setAccessoriesOpen(false);
                      setBagsOpen(false);
                      setSkincareOpen(false);
                      setWomensShoesOpen(false);
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
                      {["Formal", "Sneakers", "Boots"].map((category) => (
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
                      setCategoriesOpen(false);
                      setAccessoriesOpen(false);
                      setBagsOpen(false);
                      setSkincareOpen(false);
                      setMensShoesOpen(false);
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
                      {["Heels", "Flats", "Sneakers", "Boots", "Sandals"].map((category) => (
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
