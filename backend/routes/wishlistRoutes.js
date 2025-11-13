import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const wishlistRouter = express.Router();

// GET /api/wishlist -> return product details in wishlist
wishlistRouter.get('/',   async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    res.json({ wishlist: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// POST /api/wishlist/add -> add productId
wishlistRouter.post('/add',   async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    if (!wishlist.products.find(p => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ userId: req.user.id }).populate('products');
    res.json({ wishlist: populated.products });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// DELETE /api/wishlist/remove/:productId
wishlistRouter.delete('/remove/:productId',   async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    const populated = await Wishlist.findOne({ userId: req.user.id }).populate('products');
    res.json({ wishlist: populated.products });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

export default wishlistRouter;
