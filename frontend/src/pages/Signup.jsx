import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import api from "../api/axios";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

const Signup = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        firstName,
        lastName,
        phone,
        email: email.trim().toLowerCase(),
        password,
      });
      if (!data?.token) {
        throw new Error("Signup failed");
      }
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      const result = await login(email.trim().toLowerCase(), password);
      if (result?.success) {
        navigate("/home", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sign Up</h2>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Create your account to get started</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', borderWidth: '1px' }}>
            <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Password</label>
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
          
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {showConfirmPassword ? (
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
                Creating account...
              </>
            ) : (
              <>
                <span>Sign Up</span>
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
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium hover:underline transition"
                style={{ color: 'var(--text-heading)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-yellow-hover)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-heading)'}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
