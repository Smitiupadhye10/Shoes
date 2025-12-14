import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import api from '../api/axios';

// Payment method icons
const PAYMENT_METHODS = {
  CARD: {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay securely with your credit or debit card'
  },
  NETBANKING: {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'Pay using your bank account'
  },
  UPI: {
    id: 'upi',
    name: 'UPI / QR Code',
    icon: '📱',
    description: 'Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)'
  },
  WALLET: {
    id: 'wallet',
    name: 'Mobile Wallet',
    icon: '👝',
    description: 'Pay using Paytm, PhonePe, Amazon Pay etc.'
  },
  EMI: {
    id: 'emi',
    name: 'EMI',
    icon: '📅',
    description: 'Pay in easy monthly installments'
  }
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment Method
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [upiId, setUpiId] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);

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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !address[field]);
    if (missingFields.length > 0) {
      setError('Please fill all address fields');
      return;
    }

    // Move to payment method selection
    setError(null);
    setStep(2);
  };

  const handleUPIPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/payment/create-upi-qrcode', {
        amount: total,
        shippingAddress: address
      });
      const data = response.data;
      if (response.status !== 200) throw new Error(data.message || 'Request failed');

      setQrCode(data.qrDataUrl);
      setUpiId(data.upiLink);
      setOrderId(data.orderId);
      
      // Start polling for payment status
      startPaymentStatusCheck(data.orderId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (orderId) => {
    setCheckingPayment(true);
    const checkInterval = setInterval(async () => {
      try {
        const response = await api.post('/payment/confirm-upi-payment', {
          orderId
        });

        const data = response.data;
        if (response.ok && data.success) {
          clearInterval(checkInterval);
          setCheckingPayment(false);
          clearCart();
          navigate('/orders');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    }, 5000); // Check every 5 seconds

    // Cleanup interval after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      setCheckingPayment(false);
      setError('Payment verification timeout. Please check your order status.');
    }, 300000);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Handle UPI QR code payment separately
      if (paymentMethod === 'upi') {
        await handleUPIPayment();
        return;
      }

      // Load Razorpay SDK
      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const response = await api.post('/payment/create-order', {
        amount: total,
        shippingAddress: address,
        paymentMethod
      });

      const data = response.data;
      if (response.status !== 200) throw new Error(data.message || 'Request failed');

      // Configure Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'LensLogic',
        image: 'https://res.cloudinary.com/dfhjtmvrz/image/upload/v1762174634/20251103_182346_rujtql.png',
        description: 'Purchase from LensLogic',
        order_id: data.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: address.phone
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Popular Banks",
                instruments: [
                  {
                    method: "netbanking",
                    banks: ["HDFC", "ICIC", "SBIN", "UTIB", "AXIS"]
                  }
                ]
              },
              wallets: {
                name: "Mobile Wallets",
                instruments: [
                  {
                    method: "wallet",
                    wallets: ["paytm", "phonepe", "amazonpay", "freecharge", "mobikwik"]
                  }
                ]
              },
              upi: {
                name: "UPI",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              },
              cards: {
                name: "Credit/Debit Cards",
                instruments: [
                  {
                    method: "card"
                  }
                ]
              },
              emi: {
                name: "EMI Options",
                instruments: [
                  {
                    method: "emi"
                  }
                ]
              }
            },
            sequence: ["block.banks", "block.wallets", "block.upi", "block.cards", "block.emi"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function(response) {
          try {
            // Verify payment
            const verifyRes = await api.post('/payment/verify-payment', {
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            const verifyData = verifyRes.data;
            if (verifyRes.status !== 200) throw new Error(verifyData.message || 'Verification failed');

            // Clear cart and navigate to orders
            clearCart();
            navigate('/orders');
          } catch (err) {
            setError('Payment verification failed: ' + err.message);
          }
        },
        theme: {
          color: '#FBBF24' // yellow-400 (accent-yellow)
        }
      };

      // Open Razorpay payment form
      const rzp = new window.Razorpay(options);
      rzp.open();

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
    <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className={`flex items-center ${step >= 1 ? '' : ''}`} style={{ color: step >= 1 ? 'var(--accent-yellow)' : 'var(--text-secondary)' }}>
              <span 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-200 text-sm sm:text-base ${
                  step >= 1 ? 'text-black shadow-lg' : ''
                }`}
                style={{
                  borderColor: step >= 1 ? 'var(--accent-yellow)' : 'var(--border-color)',
                  backgroundColor: step >= 1 ? 'var(--accent-yellow)' : 'var(--bg-secondary)'
                }}
              >1</span>
              <span className="ml-2 sm:ml-3 font-semibold text-sm sm:text-base md:text-lg hidden sm:inline">Shipping</span>
            </div>
            <div 
              className="w-16 sm:w-24 md:w-32 h-1 rounded-full transition-all duration-300" 
              style={{ backgroundColor: step >= 2 ? 'var(--accent-yellow)' : 'var(--border-color)' }}
            />
            <div className={`flex items-center ${step >= 2 ? '' : ''}`} style={{ color: step >= 2 ? 'var(--accent-yellow)' : 'var(--text-secondary)' }}>
              <span 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-200 text-sm sm:text-base ${
                  step >= 2 ? 'text-black shadow-lg' : ''
                }`}
                style={{
                  borderColor: step >= 2 ? 'var(--accent-yellow)' : 'var(--border-color)',
                  backgroundColor: step >= 2 ? 'var(--accent-yellow)' : 'var(--bg-secondary)'
                }}
              >2</span>
              <span className="ml-2 sm:ml-3 font-semibold text-sm sm:text-base md:text-lg hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

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
          {step === 1 ? (
            <>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--accent-yellow)' }}>
                  Shipping Address
                </h2>
                <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Please provide your delivery details</p>
              </div>
              <form onSubmit={handleAddressSubmit} className="space-y-4 sm:space-y-5">
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
                  e.target.style.borderColor = 'var(--accent-yellow)';
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
                  e.target.style.borderColor = 'var(--accent-yellow)';
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
                    e.target.style.borderColor = 'var(--accent-yellow)';
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
                    e.target.style.borderColor = 'var(--accent-yellow)';
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
                    e.target.style.borderColor = 'var(--accent-yellow)';
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
                    e.target.style.borderColor = 'var(--accent-yellow)';
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
              borderColor: 'var(--accent-yellow)'
            }}>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4" style={{ color: 'var(--accent-yellow)' }}>Order Summary</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span>Shipping</span>
                  <span className="font-semibold">₹{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 sm:pt-3 border-t-2 text-base sm:text-lg" style={{ borderColor: 'var(--accent-yellow)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: 'var(--accent-yellow)' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-4 sm:mt-6"
            >
              Continue to Payment →
            </button>
          </form>
        </>) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--accent-yellow)' }}>
                Choose Payment Method
              </h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Select your preferred payment option</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className="w-full p-3 sm:p-4 md:p-5 rounded-xl border-2 transition-all duration-200 text-left transform hover:scale-[1.01] sm:hover:scale-[1.02]"
                  style={{
                    borderColor: paymentMethod === method.id ? 'var(--accent-yellow)' : 'var(--border-color)',
                    backgroundColor: paymentMethod === method.id ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    boxShadow: paymentMethod === method.id ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (paymentMethod !== method.id) {
                      e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paymentMethod !== method.id) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-2xl sm:text-3xl">{method.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg truncate" style={{ color: 'var(--text-primary)' }}>{method.name}</h3>
                      <p className="text-xs sm:text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {qrCode && paymentMethod === 'upi' && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 md:p-8 border-2 rounded-xl text-center shadow-lg" style={{ 
                  borderColor: 'var(--accent-yellow)',
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pay via UPI</h3>
                  <p className="text-xs sm:text-sm mb-4 sm:mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Scan the QR code or use the UPI ID below
                  </p>
                  
                  {/* QR Code */}
                  <div className="p-2 sm:p-4 rounded-lg inline-block shadow-md mb-4 sm:mb-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <img src={qrCode} alt="UPI QR Code" className="mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
                  </div>
                  
                  {/* UPI ID Display */}
                  {upiId && (
                    <div className="p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Or Pay Directly Using UPI ID:</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
                        <code className="text-sm sm:text-base md:text-lg font-bold px-3 sm:px-4 py-2 rounded-lg break-all sm:break-normal" style={{ 
                          color: 'var(--accent-yellow)',
                          backgroundColor: 'var(--bg-primary)'
                        }}>
                          {upiId}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(upiId);
                            alert('UPI ID copied to clipboard!');
                          }}
                          className="btn-primary px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Paste this UPI ID in your payment app
                      </p>
                    </div>
                  )}
                  
                  {/* Payment Instructions */}
                  <div className="rounded-lg p-3 sm:p-4 text-left border-2" style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--accent-yellow)'
                  }}>
                    <p className="text-xs sm:text-sm font-semibold mb-2" style={{ color: 'var(--accent-yellow)' }}>Payment Instructions:</p>
                    <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
                      <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                      <li>Scan the QR code or enter the UPI ID manually</li>
                      <li>Enter the amount: ₹{total}</li>
                      <li>Complete the payment</li>
                    </ol>
                  </div>
                  
                  {checkingPayment && (
                    <div className="mt-4 sm:mt-6">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-yellow)' }}></div>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Verifying payment...</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Please wait while we confirm your payment</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 font-semibold transition-colors duration-200 py-2 sm:py-0"
                  style={{ color: 'var(--accent-yellow)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm sm:text-base">Back to Shipping</span>
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!paymentMethod || loading}
                  className={`btn-primary px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] sm:hover:scale-[1.02] w-full sm:w-auto ${
                    (!paymentMethod || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Processing...</span>
                    </span>
                  ) : (
                    'Pay ₹' + total.toLocaleString()
                  )}
                </button>
              </div>
            </div>
          </>
        )}
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
                    <p className="font-bold text-base sm:text-lg" style={{ color: 'var(--accent-yellow)' }}>
                      ₹{((item.price || item.finalPrice || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="p-4 sm:p-6 rounded-2xl shadow-xl border-2" style={{ 
            backgroundColor: 'var(--accent-yellow)',
            borderColor: 'var(--accent-yellow)',
            color: 'var(--text-primary)'
          }}>
            <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>Order Summary</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>Shipping</span>
                <span className="font-semibold">₹{shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 sm:pt-4 border-t-2 mt-3 sm:mt-4 text-base sm:text-lg" style={{ borderColor: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--text-primary)' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Secure Payment Notice */}
          <div className="p-3 sm:p-4 rounded-lg text-xs sm:text-sm border-2" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Secure Checkout</span>
            </div>
            <p className="leading-relaxed">Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;