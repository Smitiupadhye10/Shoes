import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ContactLens from '../models/ContactLens.js';
import Accessory from '../models/Accessory.js';
import SkincareProduct from '../models/SkincareProduct.js';
import Bag from '../models/Bag.js';
import MensShoe from '../models/MensShoe.js';
import WomensShoe from '../models/WomensShoe.js';

const cartRouter = express.Router();

// Helper to resolve product info from all collections
async function resolveItem(productId) {
  // Try each collection until we find the product
  let doc = await Product.findById(productId).lean();
  if (doc) {
    return {
      ...doc,
      _type: 'product',
      title: doc.title || doc.name || '',
      price: doc.price || 0,
      name: doc.name || doc.title || ''
    };
  }
  
  doc = await ContactLens.findById(productId).lean();
  if (doc) {
    return {
      ...doc,
      _type: 'contactLens',
      title: doc.title || doc.name || '',
      price: doc.price || 0,
      name: doc.name || doc.title || ''
    };
  }
  
  doc = await Accessory.findById(productId).lean();
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
      _type: 'accessory',
      title: doc.name || '',
      name: doc.name || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray,
      Images: doc.Images
    };
  }
  
  doc = await SkincareProduct.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images
        .map(img => {
          if (img && typeof img === 'object' && img.url) return img.url;
          if (img && typeof img === 'string') return img.trim();
          return null;
        })
        .filter(img => img && img.length > 0);
    }
    if (imagesArray.length === 0 && doc.thumbnail) {
      const thumb = typeof doc.thumbnail === 'string' ? doc.thumbnail.trim() : 
                    (doc.thumbnail?.url ? doc.thumbnail.url.trim() : '');
      if (thumb) imagesArray = [thumb];
    }
    if (imagesArray.length === 0 && doc.imageUrl) {
      imagesArray = [doc.imageUrl];
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
      _type: 'skincare',
      title: doc.productName || doc.name || '',
      name: doc.productName || doc.name || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray
    };
  }
  
  doc = await Bag.findById(productId).lean();
  if (doc) {
    // Handle images
    let imagesArray = [];
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
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
      _type: 'bag',
      title: doc.name || '',
      name: doc.name || '',
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountPercent,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      images: imagesArray
    };
  }
  
  doc = await MensShoe.findById(productId).lean();
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

    // Validate existence in any collection
    const existsInProduct = await Product.exists({ _id: productId });
    const existsInContact = !existsInProduct && await ContactLens.exists({ _id: productId });
    const existsInAccessory = !existsInProduct && !existsInContact && await Accessory.exists({ _id: productId });
    const existsInSkincare = !existsInProduct && !existsInContact && !existsInAccessory && await SkincareProduct.exists({ _id: productId });
    const existsInBag = !existsInProduct && !existsInContact && !existsInAccessory && !existsInSkincare && await Bag.exists({ _id: productId });
    const existsInMensShoe = !existsInProduct && !existsInContact && !existsInAccessory && !existsInSkincare && !existsInBag && await MensShoe.exists({ _id: productId });
    const existsInWomensShoe = !existsInProduct && !existsInContact && !existsInAccessory && !existsInSkincare && !existsInBag && !existsInMensShoe && await WomensShoe.exists({ _id: productId });
    
    if (!existsInProduct && !existsInContact && !existsInAccessory && !existsInSkincare && !existsInBag && !existsInMensShoe && !existsInWomensShoe) {
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