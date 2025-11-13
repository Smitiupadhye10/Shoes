import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ContactLens from '../models/ContactLens.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

async function resolveItem(productId) {
  // Try Product first, then ContactLens
  const prod = await Product.findById(productId).lean();
  if (prod) return { ...prod, _type: 'product' };
  const lens = await ContactLens.findById(productId).lean();
  if (lens) return { ...lens, _type: 'contactLens' };
  return null;
}

const paymentRouter = express.Router();

// Razorpay instance will be created lazily so server can start without keys.
let razorpay = null;

// Create a new order
paymentRouter.post('/create-order',   async (req, res) => {
  try {
    const { amount, shippingAddress } = req.body;

    // Get user ID (handle both id and _id)
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Fetch user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Resolve each cart item from either collection and build items array
    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (!resolved) continue; // skip dangling ids
      items.push({
        product: it.productId, // keep original id
        quantity: it.quantity,
        price: resolved.price || 0
      });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid items found in cart' });
    }

    // Compute amount from items if not provided or invalid
    const computedAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const finalAmount = Number.isFinite(Number(amount)) && Number(amount) > 0 ? Number(amount) : computedAmount;

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
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR'
    });

    // Create order in database - fix structure to match Order schema
    const order = new Order({
      userId: userId,
      items: items.map(item => ({
        productId: item.product, // Convert 'product' to 'productId'
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: shippingAddress || {},
      totalAmount: finalAmount,
      status: 'pending'
    });
    
    // Store payment details separately (not in schema, but we can add to order object)
    order.paymentDetails = {
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: req.body.paymentMethod || 'card'
    };

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
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Verify payment
paymentRouter.post('/verify-payment',   async (req, res) => {
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

    // Initialize paymentDetails if it doesn't exist
    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.status = 'processing';
    await order.save();

    // Clear user's cart after successful payment
    const userId = req.user.id || req.user._id;
    const cart = await Cart.findOne({ userId });
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
paymentRouter.get('/my-orders',  async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---- Admin order management ----
// List orders (paginate, optional search by user id or order id, and status filter)
paymentRouter.get('/admin/orders',   async (req, res) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;
    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.max(parseInt(limit) || 20, 1);
    const skip = (p - 1) * l;

    const filter = {};
    if (status) filter.status = status;
    if (q) {
      const text = String(q).trim();
      // Allow find by order _id or by userId _id
      filter.$or = [
        { _id: text.match(/^[a-f0-9]{24}$/i) ? text : undefined },
        { userId: text.match(/^[a-f0-9]{24}$/i) ? text : undefined },
      ].filter(Boolean);
      if (filter.$or.length === 0) delete filter.$or;
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(l),
      Order.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: {
        currentPage: p,
        totalPages: Math.ceil(total / l) || 0,
        totalItems: total,
        perPage: l,
      },
    });
  } catch (err) {
    console.error('Error listing orders:', err);
    return res.status(500).json({ message: 'Error listing orders', error: err?.message || String(err) });
  }
});

// Update order status: pending | processing | delivered | completed | cancelled
paymentRouter.patch('/admin/orders/:id/status',   async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const ALLOWED = new Set(['pending', 'processing', 'delivered', 'completed', 'cancelled']);
    if (!ALLOWED.has(String(status))) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(400).json({ message: 'Error updating order status', error: err?.message || String(err) });
  }
});

export default paymentRouter;

// ---- UPI QR endpoints ----
// Create UPI deep link and return a QR image (data URL). Uses provided `vpa` or
// falls back to RAZORPAY_UPI_ID env var. Saves an Order with paymentMethod 'upi'.
import QRCode from 'qrcode';

paymentRouter.post('/create-upi-qrcode', async (req, res) => {
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
    // Get user ID
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    // Fetch user's cart and resolve product details
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (!resolved) continue;
      items.push({ product: it.productId, quantity: it.quantity, price: resolved.price || 0 });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid items found in cart' });
    }

    const order = new Order({
      userId: userId,
      items: items.map(item => ({
        productId: item.product, // Convert 'product' to 'productId'
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: shippingAddress || {},
      totalAmount: amount,
      status: 'pending'
    });
    
    // Store payment details separately
    order.paymentDetails = {
      upi,
      paymentMethod: 'upi'
    };
    await order.save();

    // Build UPI deep link - recommended fields: pa (payee address), pn (payee name), am (amount), cu (currency)
    const payeeName = process.env.MERCHANT_NAME || 'Merchant';
    const upiLink = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent('Order:' + order._id)}`;

    // Generate QR data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(upiLink, { type: 'image/png', margin: 1 });

    res.json({ 
      success: true, 
      orderId: order._id, 
      upiLink, 
      qrDataUrl,
      upiId: upi // Include UPI ID in response
    });
  } catch (err) {
    console.error('Error creating UPI QR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Confirm UPI payment (manual confirmation). Marks order processing.
paymentRouter.post('/confirm-upi-payment',   async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'orderId required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId.toString() !== req.user.id && order.userId.toString() !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = 'processing';
    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }
    order.paymentDetails.verifiedAt = new Date();
    await order.save();

    // Clear cart
    const userId = req.user.id || req.user._id;
    const cart = await Cart.findOne({ userId });
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