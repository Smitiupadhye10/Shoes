import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

const Signin = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Disable body scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email.trim().toLowerCase(), password);

    if (result?.success) {
      // ✅ FIXED ONLY THIS LINE
      navigate("/", { replace: true });
    } else {
      setError(result?.error || "Invalid email or password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-0 overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1768806794/0082814518a48318cbf77196757ded98_fsqt5a.jpg" 
          alt="Eyewear Collection"
          className="w-full h-full object-cover hidden lg:block"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sign In</h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', borderWidth: '1px' }}>
              <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Password</label>
                <button
                  type="button"
                  className="text-xs hover:underline transition"
                  style={{ color: 'var(--text-heading)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-yellow-hover)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-heading)'}
                  onClick={() => setError("Please contact support to reset your password.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: 'var(--text-primary)', 
                color: 'var(--bg-primary)'
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: 'var(--bg-primary)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLoginButton text="Continue with Google" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium hover:underline transition"
                  style={{ color: 'var(--text-heading)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-yellow-hover)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-heading)'}
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
