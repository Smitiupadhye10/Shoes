import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ContactLens from '../models/ContactLens.js';

const cartRouter = express.Router();

// Helper to resolve product info from either collection
async function resolveItem(productId) {
  let doc = await Product.findById(productId).lean();
  if (doc) return { ...doc, _type: 'product' };
  doc = await ContactLens.findById(productId).lean();
  if (doc) return { ...doc, _type: 'contactLens' };
  return null;
}

// Get user's cart
cartRouter.get('/',   async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (resolved) items.push({ ...resolved, quantity: it.quantity });
    }

    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add to cart
cartRouter.post('/add',   async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate existence in either collection
    const existsInProduct = await Product.exists({ _id: productId });
    const existsInContact = !existsInProduct && await ContactLens.exists({ _id: productId });
    if (!existsInProduct && !existsInContact) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === String(productId)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (resolved) items.push({ ...resolved, quantity: it.quantity });
    }

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// Decrease quantity
cartRouter.post('/decrease',   async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === String(productId)
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
    }

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (resolved) items.push({ ...resolved, quantity: it.quantity });
    }

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
});

// Remove from cart
cartRouter.delete('/remove/:productId',   async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== String(req.params.productId)
    );

    await cart.save();

    const items = [];
    for (const it of cart.items) {
      const resolved = await resolveItem(it.productId);
      if (resolved) items.push({ ...resolved, quantity: it.quantity });
    }

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
});

export default cartRouter;