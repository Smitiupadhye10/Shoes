import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Razorpay instance will be created lazily so server can start without keys.
let razorpay = null;

// Create a new order
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, shippingAddress } = req.body;

    // Fetch user's cart and populate product details to get price
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Build items array with product, quantity and price
    const items = cart.items.map(i => ({
      product: i.productId._id,
      quantity: i.quantity,
      price: i.productId.price || 0
    }));

    // Ensure Razorpay keys are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay keys are not configured on the server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env' });
    }

    if (!razorpay) {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paisa
      currency: 'INR'
    });

    // Create order in database
    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      totalAmount: amount,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id
      }
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    // Verify signature
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.status = 'processing';
    await order.save();

    // Clear user's cart after successful payment
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get orders for current user
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort('-createdAt');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

// ---- UPI QR endpoints ----
// Create UPI deep link and return a QR image (data URL). Uses provided `vpa` or
// falls back to RAZORPAY_UPI_ID env var. Saves an Order with paymentMethod 'upi'.
import QRCode from 'qrcode';

router.post('/create-upi-qrcode', verifyToken, async (req, res) => {
  try {
    const { amount, shippingAddress, vpa } = req.body;

    // validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const upi = (vpa && vpa.trim()) || process.env.RAZORPAY_UPI_ID;
    if (!upi) {
      return res.status(500).json({ success: false, message: 'UPI ID not configured. Provide vpa in request or set RAZORPAY_UPI_ID in server/.env' });
    }

    // Create order in DB with pending UPI payment
    const order = new Order({
      user: req.user.id,
      items: [],
      shippingAddress: shippingAddress || {},
      totalAmount: amount,
      paymentDetails: { upi },
      status: 'pending'
    });
    await order.save();

    // Build UPI deep link - recommended fields: pa (payee address), pn (payee name), am (amount), cu (currency)
    const payeeName = process.env.MERCHANT_NAME || 'Merchant';
    const upiLink = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent('Order:' + order._id)}`;

    // Generate QR data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(upiLink, { type: 'image/png', margin: 1 });

    res.json({ success: true, orderId: order._id, upiLink, qrDataUrl });
  } catch (err) {
    console.error('Error creating UPI QR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Confirm UPI payment (manual confirmation). Marks order processing.
router.post('/confirm-upi-payment', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'orderId required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user.id && order.user.toString() !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = 'processing';
    order.paymentDetails.verifiedAt = new Date();
    await order.save();

    // Clear cart
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'Order marked as processing (UPI payment confirmed)' });
  } catch (err) {
    console.error('Error confirming UPI payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});