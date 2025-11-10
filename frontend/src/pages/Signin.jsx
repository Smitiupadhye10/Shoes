import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Shield, Truck, ShoppingBag } from "lucide-react";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthPage = () => {
  const [mode, setMode] = useState("signin"); // 'signup' | 'signin'
  const navigate = useNavigate();
  const { login, user } = useUser();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Debugging effect to log auth state changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Auth state changed - User:', user);
    console.log('Current token:', token);
    
    // If user is already logged in, redirect to home
    if (user && token) {
      console.log('User is already logged in, redirecting to /home');
      navigate('/home');
    }
  }, [user, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      // Create the user
      const { data } = await api.post("/users/register", { 
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password
      });
      
      if (data.token) {
        // Store the token
        localStorage.setItem("token", data.token);
        
        // Update user context
        login(data.user.email, password)
          .then(() => {
            navigate("/home");
          })
          .catch(err => {
            console.error("Auto-login after signup failed:", err);
            setError("Account created but login failed. Please sign in manually.");
          });
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      console.log('Attempting to login with:', { email: email.trim().toLowerCase() });
      const result = await login(email.trim().toLowerCase(), password);
      console.log('Login result:', result);
      
      if (result?.success) {
        console.log('Login successful, navigating to /home');
        navigate("/home");
      } else {
        throw new Error(result?.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      let errorMessage = "Failed to sign in. Please check your credentials and try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      if (isMounted) setLoading(false);
    }
  };


  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submit handler - dynamically chooses between signin and signup based on mode
  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signin') {
      await handleSignin(e);
    } else {
      await handleSignup(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => navigate("/home")}
              >
                <img
                  src="https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762174634/20251103_182346_rujtql.png"
                  alt="LensLogic Logo"
                  className="h-18 w-auto object-contain drop-shadow"
                  style={{ maxWidth: 200 }}
                />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                {mode === "signin" ? "Welcome Back!" : "Join Us Today"}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {mode === "signin" 
                  ? "Sign in to access your orders, wishlist, and personalized recommendations."
                  : "Create an account to enjoy exclusive offers, faster checkout, and order tracking."}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Shopping</h3>
                  <p className="opacity-80">100% secure payment gateway</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Fast Delivery</h3>
                  <p className="opacity-80">Quick delivery to your doorstep</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <ShoppingBag className="w-8 h-8 text-sky-600" />
              <h1 className="text-2xl font-bold text-gray-900">Glasses Store</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Tab Navigation */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    mode === "signin"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    mode === "signup"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Forms */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="First Name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required={mode === "signup"}
                          disabled={loading}
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required={mode === "signup"}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={mode === "signup"}
                        disabled={loading}
                      />
                    </div>
                  </>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {mode === "signin" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded border-gray-300"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => setError("Please contact support to reset your password.")}
                      className="text-sm text-sky-600 hover:text-sky-700 transition"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signin' ? (
                        <>
                          <span>Sign in</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <span>Create account</span>
                      )}
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex items-center justify-center">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                {mode === "signin" ? (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-medium text-sky-600 hover:text-sky-700"
                      disabled={loading}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-medium text-sky-600 hover:text-sky-700"
                      disabled={loading}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;