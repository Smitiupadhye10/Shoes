import express from 'express';

import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';
import ShoesAccessory from '../models/ShoesAccessory.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

// -------- Resolve Item - Handle all product types --------
async function resolveItem(productId) {
  // Try each shoe collection until we find the product
  let doc = await MensShoe.findById(productId).lean();
  if (doc) return { ...doc, _type: 'mensShoe', price: doc.finalPrice || doc.price || 0 };
  
  doc = await WomensShoe.findById(productId).lean();
  if (doc) return { ...doc, _type: 'womensShoe', price: doc.finalPrice || doc.price || 0 };
  
  doc = await KidsShoe.findById(productId).lean();
  if (doc) return { ...doc, _type: 'kidsShoe', price: doc.finalPrice || doc.price || 0 };
  
  doc = await ShoesAccessory.findById(productId).lean();
  if (doc) return { ...doc, _type: 'shoesAccessory', price: doc.finalPrice || doc.price || 0 };
  
  return null;
}

const paymentRouter = express.Router();

// -------- CREATE ORDER (Cash on Delivery) --------
paymentRouter.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, shippingAddress, paymentMethod } = req.body;

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

    // Create order with Cash on Delivery
    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      totalAmount: finalAmount,
      paymentDetails: {
        paymentMethod: paymentMethod || 'cod'
      },
      status: 'pending'
    });

    await order.save();

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------- USER ORDERS --------
paymentRouter.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort('-createdAt')
      .lean();

    // Manually resolve products for each order item
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await resolveItem(item.productId);
            if (product) {
              // Normalize product data for frontend
              const normalizedProduct = {
                _id: product._id,
                title: product.title || product.name || product.productName || '',
                name: product.name || product.productName || product.title || '',
                images: product.images || (product.image ? [product.image] : []) || (product.thumbnail ? [product.thumbnail] : []),
                thumbnail: product.thumbnail || product.image || (product.images?.[0]),
                price: product.price || product.finalPrice || 0,
                _type: product._type || 'product'
              };
              return {
                ...item,
                product: normalizedProduct
              };
            }
            return item;
          })
        );
        return {
          ...order,
          items: itemsWithProducts
        };
      })
    );

    res.json({ success: true, orders: ordersWithProducts });

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


export default paymentRouter;
