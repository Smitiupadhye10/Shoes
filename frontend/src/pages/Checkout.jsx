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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
          color: '#4338ca' // indigo-600
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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <span className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-200 ${
                step >= 1 ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'border-gray-300 bg-white'
              }`}>1</span>
              <span className="ml-3 font-semibold text-lg">Shipping</span>
            </div>
            <div className={`w-32 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <span className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-200 ${
                step >= 2 ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'border-gray-300 bg-white'
              }`}>2</span>
              <span className="ml-3 font-semibold text-lg">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl shadow-md flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Side: Form/Payment UI */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border-2 border-gray-100">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Shipping Address
                </h2>
                <p className="text-gray-600">Please provide your delivery details</p>
              </div>
              <form onSubmit={handleAddressSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={address.name}
                onChange={handleAddressChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                value={address.address}
                onChange={handleAddressChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  placeholder="6-digit PIN"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  placeholder="10-digit number"
                  required
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">₹{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t-2 border-indigo-300 text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-6"
            >
              Continue to Payment →
            </button>
          </form>
        </>) : (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Choose Payment Method
              </h2>
              <p className="text-gray-600">Select your preferred payment option</p>
            </div>
            <div className="space-y-4">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left transform hover:scale-[1.02] ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {qrCode && paymentMethod === 'upi' && (
                <div className="mt-6 p-8 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-white to-indigo-50 text-center shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pay via UPI</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Scan the QR code or use the UPI ID below
                  </p>
                  
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-lg inline-block shadow-md mb-6">
                    <img src={qrCode} alt="UPI QR Code" className="mx-auto w-64 h-64" />
                  </div>
                  
                  {/* UPI ID Display */}
                  {upiId && (
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">Or Pay Directly Using UPI ID:</p>
                      <div className="flex items-center justify-center gap-3">
                        <code className="text-lg font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                          {upiId}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(upiId);
                            alert('UPI ID copied to clipboard!');
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Paste this UPI ID in your payment app
                      </p>
                    </div>
                  )}
                  
                  {/* Payment Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Payment Instructions:</p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                      <li>Scan the QR code or enter the UPI ID manually</li>
                      <li>Enter the amount: ₹{total}</li>
                      <li>Complete the payment</li>
                    </ol>
                  </div>
                  
                  {checkingPayment && (
                    <div className="mt-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-3 text-sm font-medium text-gray-700">Verifying payment...</p>
                      <p className="text-xs text-gray-500 mt-1">Please wait while we confirm your payment</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Shipping
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!paymentMethod || loading}
                  className={`px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                    (!paymentMethod || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
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
        <div className="space-y-4 md:space-y-6">
          {/* Order Items */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <img
                    src={Array.isArray(item.images) ? (item.images[0] || '/placeholder.jpg') : '/placeholder.jpg'}
                    alt={item.title}
                    className="w-24 h-24 object-contain bg-white p-2 rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                    <p className="text-indigo-600 font-bold text-lg">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 sm:p-6 rounded-2xl shadow-xl text-white">
            <h3 className="font-bold text-xl mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-indigo-100">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Shipping</span>
                <span className="font-semibold">₹{shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold pt-4 border-t-2 border-indigo-400 mt-4 text-lg">
                <span>Total</span>
                <span className="text-2xl">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Secure Payment Notice */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium text-gray-900">Secure Checkout</span>
            </div>
            <p>Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;