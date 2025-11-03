import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useUser } from '../context/UserContext';

// Payment method icons
const PAYMENT_METHODS = {
  CARD: {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay securely with your credit or debit card'
  },
  UPI: {
    id: 'upi',
    name: 'UPI / QR Code',
    icon: '📱',
    description: 'Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)'
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
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
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
    const requiredFields = ['street', 'city', 'state', 'pincode', 'phone'];
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
      const response = await fetch('http://localhost:4000/api/payment/create-upi-qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total,
          shippingAddress: address
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setQrCode(data.qrDataUrl);
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
        const response = await fetch('http://localhost:4000/api/payment/confirm-upi-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ orderId })
        });

        const data = await response.json();
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

  const handleCardPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load Razorpay SDK
      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const response = await fetch('http://localhost:4000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total,
          shippingAddress: address
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

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
        handler: async function(response) {
          try {
            // Verify payment
            const verifyRes = await fetch('http://localhost:4000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message);

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
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}>1</span>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          <div className={`w-24 h-0.5 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}>2</span>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Form/Payment UI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {step === 1 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  pattern="[0-9]{6}"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  pattern="[0-9]{10}"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Continue to Payment
            </button>
          </form>
        </>) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
            <div className="space-y-4">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-lg border-2 transition duration-200 text-left ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}

              {qrCode && paymentMethod === 'upi' && (
                <div className="mt-6 p-6 border rounded-lg bg-white text-center">
                  <h3 className="font-medium mb-4">Scan QR Code to Pay</h3>
                  <img src={qrCode} alt="UPI QR Code" className="mx-auto max-w-[200px]" />
                  <p className="mt-4 text-sm text-gray-600">
                    Open your UPI app, scan the QR code, and complete the payment
                  </p>
                  {checkingPayment && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Verifying payment...</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  ← Back to Shipping
                </button>
                <button
                  onClick={paymentMethod === 'upi' ? handleUPIPayment : handleCardPayment}
                  disabled={!paymentMethod || loading}
                  className={`px-8 py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
                    (!paymentMethod || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </>
        )}
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 p-3 bg-gray-50 rounded">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-20 h-20 object-contain bg-white p-2 rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <p className="text-indigo-600 font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span className="text-lg">₹{total}</span>
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
  );
};

export default CheckoutPage;