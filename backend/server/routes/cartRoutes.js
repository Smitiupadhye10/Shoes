import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const cartItems = cart.items.map(item => ({
      ...item.productId._doc,
      quantity: item.quantity
    }));

  res.json({ items: cartItems });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

  await cart.save();
  // return populated items
  const populated = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  const items = populated.items.map(i => ({ ...i.productId._doc, quantity: i.quantity }));
  res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// Decrease quantity
router.post('/decrease', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
    }

    const populated = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    const items = populated.items.map(i => ({ ...i.productId._doc, quantity: i.quantity }));
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    const populated = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    const items = populated ? populated.items.map(i => ({ ...i.productId._doc, quantity: i.quantity })) : [];
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
});

export default router;