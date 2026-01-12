import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import api from '../api/axios';

// Payment method - Cash on Delivery only
const PAYMENT_METHOD = {
  id: 'cod',
  name: 'Cash on Delivery',
  icon: '💵',
  description: 'Pay with cash when your order is delivered'
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const subtotal = cart.reduce((sum, item) => {
    const price = item.price || item.finalPrice || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const shippingCost = 100; // Fixed shipping cost
  const total = subtotal + shippingCost;

  const handleAddressChange = (e) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !address[field]);
    if (missingFields.length > 0) {
      setError('Please fill all address fields');
      setLoading(false);
      return;
    }

    try {
      // Create order with Cash on Delivery
      const response = await api.post('/payment/create-order', {
        amount: total,
        shippingAddress: address,
        paymentMethod: 'cod'
      });

      const data = response.data;
      if (response.status !== 200) throw new Error(data.message || 'Order creation failed');

      // Clear cart and navigate to orders
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Your cart is empty</p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 md:pt-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 p-4 border-2 border-red-500 rounded-xl shadow-md flex items-center gap-3" style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444'
          }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Side: Form/Payment UI */}
        <div className="card-optic p-4 sm:p-6 md:p-8 rounded-2xl order-2 lg:order-1">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
              Shipping Address
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Please provide your delivery details</p>
          </div>

          {/* Payment Method Info */}
          <div className="mb-6 p-4 rounded-xl border-2" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-heading)'
          }}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl">{PAYMENT_METHOD.icon}</span>
              <div>
                <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-heading)' }}>
                  {PAYMENT_METHOD.name}
                </h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                  {PAYMENT_METHOD.description}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={address.name}
                onChange={handleAddressChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                style={{ 
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--text-heading)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>Street Address</label>
              <input
                type="text"
                name="address"
                value={address.address}
                onChange={handleAddressChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                style={{ 
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--text-heading)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  style={{ 
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  style={{ 
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>PIN Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  pattern="[0-9]{6}"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  style={{ 
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="6-digit PIN"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  pattern="[0-9]{10}"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  style={{ 
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-heading)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="10-digit number"
                  required
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl border-2" style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--text-heading)'
            }}>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4" style={{ color: 'var(--text-heading)' }}>Order Summary</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span>Subtotal</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span>Shipping</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 sm:pt-3 border-t-2 text-base sm:text-lg" style={{ borderColor: 'var(--text-heading)' }}>
                  <span style={{ color: 'var(--text-heading)' }}>Total</span>
                  <span style={{ color: 'var(--text-heading)' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-4 sm:mt-6 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Placing Order...</span>
                </span>
              ) : (
                `Place Order (₹${total.toLocaleString()})`
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Order Items */}
          <div className="card-optic p-4 sm:p-6 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>Order Items</h2>
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div 
                  key={item._id} 
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border hover:shadow-md transition-shadow duration-200"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <img
                    src={Array.isArray(item.images) ? (item.images[0] || '/placeholder.jpg') : '/placeholder.jpg'}
                    alt={item.title || item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain p-1 sm:p-2 rounded-lg border flex-shrink-0"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1 text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>{item.title || item.name}</h3>
                    <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
                      ₹{(item.price || item.finalPrice || 0).toLocaleString()} × {item.quantity || 1}
                    </p>
                    <p className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-heading)' }}>
                      ₹{((item.price || item.finalPrice || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="p-4 sm:p-6 rounded-2xl shadow-xl border-2" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-heading)'
          }}>
            <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6" style={{ color: 'var(--text-heading)' }}>Order Summary</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>Shipping</span>
                <span className="font-semibold">₹{shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 sm:pt-4 border-t-2 mt-3 sm:mt-4 text-base sm:text-lg" style={{ borderColor: 'var(--text-heading)' }}>
                <span style={{ color: 'var(--text-heading)' }}>Total</span>
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--text-heading)' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cash on Delivery Notice */}
          <div className="p-3 sm:p-4 rounded-lg text-xs sm:text-sm border-2" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-heading)'
          }}>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="text-lg">💵</span>
              <span className="font-medium" style={{ color: 'var(--text-heading)' }}>Cash on Delivery</span>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>Pay with cash when your order is delivered. No online payment required.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;