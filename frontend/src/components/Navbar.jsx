import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogOut, Menu, X } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);
  const { user, logout } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <nav className="bg-gray-800 text-white shadow z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => {
              navigate("/home");
              setMobileMenuOpen(false);
            }}
          >
            <img
              src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762174634/20251103_182346_rujtql.png"
              alt="LensLogic Logo"
              className="h-12 w-auto object-contain"
              style={{ maxWidth: 300 }}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <ul className="flex space-x-8">
              <li>
                <Link to="/home" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Right side items */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <div className="relative">
              <Link 
                to={user ? "/cart" : "/signin"} 
                className="flex items-center text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
                title="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Wishlist */}
            <div className="relative">
              <Link 
                to={user ? "/wishlist" : "/signin"} 
                className="flex items-center text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
                title="Wishlist"
              >
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Account dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                  >
                    <User className="h-6 w-6" />
                    <span className="ml-2 hidden sm:inline">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>
              {accountOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      User Info
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => {
                        setAccountOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="flex items-center">
                        <User size={16} className="mr-2" />
                        My Profile
                      </span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => {
                        setAccountOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </span>
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => {
                          setAccountOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 text-purple-600 font-medium"
                        role="menuitem"
                      >
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Panel
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/signin"
              className="flex items-center text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-6 w-6" />
              <span className="ml-2 hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Shop
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5 space-x-3">
                <Link
                  to={user ? "/cart" : "/signin"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-full"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
                <Link
                  to={user ? "/wishlist" : "/signin"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-full"
                >
                  <Heart className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                {!user && (
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign in
                  </Link>
                )}
              </div>
              {user && (
                <div className="mt-3 pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-400">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Your Orders
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 hover:text-purple-300 hover:bg-gray-700"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
