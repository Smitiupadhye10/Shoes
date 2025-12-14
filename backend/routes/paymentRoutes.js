import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import QRCode from 'qrcode';

import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ContactLens from '../models/ContactLens.js';
import Accessory from '../models/Accessory.js';
import SkincareProduct from '../models/SkincareProduct.js';
import Bag from '../models/Bag.js';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

// -------- Resolve Item - Handle all product types --------
async function resolveItem(productId) {
  // Try each collection until we find the product
  let doc = await Product.findById(productId).lean();
  if (doc) return { ...doc, _type: 'product', price: doc.price || 0 };
  
  doc = await ContactLens.findById(productId).lean();
  if (doc) return { ...doc, _type: 'contactLens', price: doc.price || 0 };
  
  doc = await Accessory.findById(productId).lean();
  if (doc) return { ...doc, _type: 'accessory', price: doc.finalPrice || doc.price || 0 };
  
  doc = await SkincareProduct.findById(productId).lean();
  if (doc) return { ...doc, _type: 'skincare', price: doc.finalPrice || doc.price || 0 };
  
  doc = await Bag.findById(productId).lean();
  if (doc) return { ...doc, _type: 'bag', price: doc.finalPrice || doc.price || 0 };
  
  doc = await MensShoe.findById(productId).lean();
  if (doc) return { ...doc, _type: 'mensShoe', price: doc.finalPrice || doc.price || 0 };
  
  doc = await WomensShoe.findById(productId).lean();
  if (doc) return { ...doc, _type: 'womensShoe', price: doc.finalPrice || doc.price || 0 };
  
  return null;
}

const paymentRouter = express.Router();

// Razorpay lazy instance
let razorpay = null;

// -------- CREATE ORDER --------
paymentRouter.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (!resolved) {
        console.warn(`Could not resolve product ${it.productId}`);
        continue;
      }
      items.push({
        productId: it.productId,
        quantity: it.quantity,
        price: resolved.price || 0
      });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products found in cart' });
    }

    const computedAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const finalAmount = amount > 0 ? Number(amount) : computedAmount;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay keys missing' });
    }

    if (!razorpay) {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: 'INR'
    });

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      totalAmount: finalAmount,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        paymentMethod: req.body.paymentMethod || 'card'
      },
      status: 'pending'
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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------- VERIFY PAYMENT --------
paymentRouter.post('/verify-payment', verifyToken, async (req, res) => {
  console.log('🔍 verify-payment called');
  console.log('🔍 req.body:', req.body);
  console.log('🔍 req.user:', req.user);
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.status = 'processing';
    await order.save();

    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------- USER ORDERS --------
paymentRouter.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort('-createdAt');

    res.json({ success: true, orders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------- ADMIN: GET ORDERS --------
paymentRouter.get('/admin/orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { _id: q },
        { userId: q }
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------- ADMIN: UPDATE ORDER STATUS --------
paymentRouter.patch('/admin/orders/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'processing', 'delivered', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });

  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// -------- CREATE UPI QR --------
paymentRouter.post('/create-upi-qrcode', verifyToken, async (req, res) => {
  try {
    const { amount, shippingAddress, vpa } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const upi = vpa || process.env.RAZORPAY_UPI_ID;
    if (!upi) {
      return res.status(500).json({ success: false, message: 'UPI ID missing' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart empty' });
    }

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (!resolved) {
        console.warn(`Could not resolve product ${it.productId}`);
        continue;
      }
      items.push({
        productId: it.productId,
        quantity: it.quantity,
        price: resolved.price || 0
      });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products found in cart' });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      totalAmount: amount,
      status: 'pending',
      paymentDetails: { upi, paymentMethod: 'upi' }
    });
    await order.save();

    const upiLink = `upi://pay?pa=${upi}&pn=Merchant&am=${amount}&cu=INR&tn=Order:${order._id}`;
    const qrDataUrl = await QRCode.toDataURL(upiLink);

    res.json({ success: true, orderId: order._id, upiLink, qrDataUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------- CONFIRM UPI PAYMENT --------
paymentRouter.post('/confirm-upi-payment', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'orderId required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Update only the fields we need without validating the entire document
    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'processing',
          'paymentDetails.verifiedAt': new Date()
        }
      }
    );

    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'UPI payment confirmed' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default paymentRouter;
