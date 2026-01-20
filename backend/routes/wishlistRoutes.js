import express from 'express';
import Wishlist from '../models/Wishlist.js';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';
import KidsShoe from '../models/KidsShoe.js';
import ShoesAccessory from '../models/ShoesAccessory.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const wishlistRouter = express.Router();

// Helper to resolve product info from shoe collections
async function resolveItem(productId) {
  // Try each shoe collection until we find the product
  let doc = await MensShoe.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    }
    if (imagesArray.length === 0 && doc.Images) {
      if (doc.Images.image1) imagesArray.push(doc.Images.image1);
      if (doc.Images.image2) imagesArray.push(doc.Images.image2);
      if (Array.isArray(doc.Images.additionalImages)) {
        imagesArray.push(...doc.Images.additionalImages.filter(img => img && typeof img === 'string' && img.trim() !== ''));
      }
    }
    if (imagesArray.length === 0 && doc.thumbnail) {
      imagesArray = [doc.thumbnail];
    }
    
    // Calculate originalPrice
    const finalPrice = doc.finalPrice || doc.price || 0;
    const discountPercent = doc.discountPercent || 0;
    let originalPrice = doc.originalPrice;
    if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
      originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = finalPrice;
    }
    
    return {
      ...doc,
      _type: 'mensShoe',
      title: doc.title || '',
      name: doc.title || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray,
      Images: doc.Images
    };
  }
  
  doc = await WomensShoe.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    }
    if (imagesArray.length === 0 && doc.Images) {
      if (doc.Images.image1) imagesArray.push(doc.Images.image1);
      if (doc.Images.image2) imagesArray.push(doc.Images.image2);
      if (Array.isArray(doc.Images.additionalImages)) {
        imagesArray.push(...doc.Images.additionalImages.filter(img => img && typeof img === 'string' && img.trim() !== ''));
      }
    }
    if (imagesArray.length === 0 && doc.thumbnail) {
      imagesArray = [doc.thumbnail];
    }
    
    // Calculate originalPrice
    const finalPrice = doc.finalPrice || doc.price || 0;
    const discountPercent = doc.discountPercent || 0;
    let originalPrice = doc.originalPrice;
    if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
      originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = finalPrice;
    }
    
    return {
      ...doc,
      _type: 'womensShoe',
      title: doc.title || '',
      name: doc.title || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray,
      Images: doc.Images
    };
  }
  
  doc = await KidsShoe.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    }
    if (imagesArray.length === 0 && doc.Images) {
      if (doc.Images.image1) imagesArray.push(doc.Images.image1);
      if (doc.Images.image2) imagesArray.push(doc.Images.image2);
      if (Array.isArray(doc.Images.additionalImages)) {
        imagesArray.push(...doc.Images.additionalImages.filter(img => img && typeof img === 'string' && img.trim() !== ''));
      }
    }
    if (imagesArray.length === 0 && doc.thumbnail) {
      imagesArray = [doc.thumbnail];
    }
    
    // Calculate originalPrice
    const finalPrice = doc.finalPrice || doc.price || 0;
    const discountPercent = doc.discountPercent || 0;
    let originalPrice = doc.originalPrice;
    if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
      originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = finalPrice;
    }
    
    return {
      ...doc,
      _type: 'kidsShoe',
      title: doc.title || '',
      name: doc.title || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray,
      Images: doc.Images
    };
  }
  
  // Try ShoesAccessory collection
  doc = await ShoesAccessory.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    }
    if (imagesArray.length === 0 && doc.thumbnail) {
      imagesArray = [doc.thumbnail];
    }
    
    // Calculate originalPrice
    const finalPrice = doc.finalPrice || doc.price || 0;
    const discountPercent = doc.discountPercent || 0;
    let originalPrice = doc.originalPrice;
    if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
      originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
    } else if (!originalPrice) {
      originalPrice = finalPrice;
    }
    
    return {
      ...doc,
      _type: 'shoesAccessory',
      title: doc.title || '',
      name: doc.title || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray
    };
  }
  
  return null;
}

// GET /api/wishlist -> return product details in wishlist
wishlistRouter.get('/', verifyToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    
    // Resolve all products manually since they can be from different collections
    const resolvedProducts = [];
    for (const productId of wishlist.products) {
      const resolved = await resolveItem(productId);
      if (resolved) resolvedProducts.push(resolved);
    }
    
    res.json({ wishlist: resolvedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// POST /api/wishlist/add -> add productId
wishlistRouter.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists in any shoe collection
    const existsInMensShoe = await MensShoe.exists({ _id: productId });
    const existsInWomensShoe = !existsInMensShoe && await WomensShoe.exists({ _id: productId });
    const existsInKidsShoe = !existsInMensShoe && !existsInWomensShoe && await KidsShoe.exists({ _id: productId });
    
    if (!existsInMensShoe && !existsInWomensShoe && !existsInKidsShoe) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    if (!wishlist.products.find(p => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    // Resolve all products manually
    const resolvedProducts = [];
    for (const pid of wishlist.products) {
      const resolved = await resolveItem(pid);
      if (resolved) resolvedProducts.push(resolved);
    }
    
    res.json({ wishlist: resolvedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// DELETE /api/wishlist/remove/:productId
wishlistRouter.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    // Resolve all products manually
    const resolvedProducts = [];
    for (const pid of wishlist.products) {
      const resolved = await resolveItem(pid);
      if (resolved) resolvedProducts.push(resolved);
    }
    
    res.json({ wishlist: resolvedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

export default wishlistRouter;
