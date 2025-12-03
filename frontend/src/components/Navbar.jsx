import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);
  const { user, logout } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAccountOpen(false);
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
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-optic-heading text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              LENSLOGIC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart 
                className="w-6 h-6 transition-transform group-hover:scale-110" 
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
                className="w-6 h-6 transition-transform group-hover:scale-110" 
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

            {/* Login */}
            {user ? (
              <div className="relative" ref={navRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center space-x-2 text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
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
                className="text-optic-body text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
