import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ContactLens from "../models/ContactLens.js";
import Accessory from "../models/Accessory.js";
import SkincareProduct from "../models/SkincareProduct.js";
import Bag from "../models/Bag.js";
import MensShoe from "../models/MensShoe.js";
import WomensShoe from "../models/WomensShoe.js";

// Helper function to normalize Accessory to Product-like format
function normalizeAccessory(acc) {
  const doc = acc._doc || acc;
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  // Calculate original price (MRP)
  const finalPrice = doc.finalPrice || doc.price || 0;
  const discountPercent = doc.discountPercent || 0;
  let originalPrice = doc.originalPrice;
  if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
    originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
  } else if (!originalPrice) {
    originalPrice = finalPrice;
  }

  return {
    _id: doc._id,
    title: doc.name || '',
    price: finalPrice,
    originalPrice: originalPrice,
    description: doc.description || '',
    category: doc.category || "Accessories",
    subCategory: doc.subCategory,
    product_info: {
      brand: doc.brand || '',
      gender: doc.gender || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: discountPercent,
    finalPrice: finalPrice,
    _type: 'accessory',
    thumbnail: doc.thumbnail,
    brand: doc.brand,
    name: doc.name
  };
}

// Helper function to normalize SkincareProduct to Product-like format
function normalizeSkincareProduct(skp) {
  const doc = skp._doc || skp;
  let imagesArray = [];
  
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images
      .map(img => {
        if (img && typeof img === 'object' && img.url) {
          return img.url;
        }
        if (img && typeof img === 'string') {
          return img.trim();
        }
        return null;
      })
      .filter(img => img && img.length > 0);
  }
  
  if (imagesArray.length === 0 && doc.thumbnail) {
    const thumb = typeof doc.thumbnail === 'string' ? doc.thumbnail.trim() : 
                  (doc.thumbnail?.url ? doc.thumbnail.url.trim() : '');
    if (thumb) {
      imagesArray = [thumb];
    }
  }
  
  if (imagesArray.length === 0 && doc.imageUrl) {
    const imgUrl = typeof doc.imageUrl === 'string' ? doc.imageUrl.trim() : '';
    if (imgUrl) {
      imagesArray = [imgUrl];
    }
  }
  
  // Calculate original price (MRP)
  const finalPrice = doc.finalPrice || doc.price || 0;
  const discountPercent = doc.discountPercent || 0;
  let originalPrice = doc.originalPrice;
  if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
    originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
  } else if (!originalPrice) {
    originalPrice = finalPrice;
  }

  return {
    _id: doc._id,
    title: doc.productName || doc.name || '',
    price: finalPrice,
    originalPrice: originalPrice,
    description: doc.description || '',
    category: "Skincare",
    subCategory: doc.category,
    product_info: {
      brand: doc.brand || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: discountPercent,
    finalPrice: finalPrice,
    _type: 'skincare',
    thumbnail: doc.thumbnail,
    brand: doc.brand,
    productName: doc.productName,
    imageUrl: doc.imageUrl
  };
}

// Helper function to normalize Bag to Product-like format
function normalizeBag(bag) {
  const doc = bag._doc || bag;
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  
  // Calculate original price (MRP)
  const finalPrice = doc.finalPrice || doc.price || 0;
  const discountPercent = doc.discountPercent || 0;
  let originalPrice = doc.originalPrice;
  if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
    originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
  } else if (!originalPrice) {
    originalPrice = finalPrice;
  }

  return {
    _id: doc._id,
    title: doc.name || '',
    price: finalPrice,
    originalPrice: originalPrice,
    description: doc.description || '',
    category: "Bags",
    subCategory: doc.category,
    product_info: {
      brand: doc.brand || '',
      gender: doc.gender || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: discountPercent,
    finalPrice: finalPrice,
    _type: 'bag',
    brand: doc.brand,
    name: doc.name
  };
}

// Helper function to normalize MensShoe to Product-like format
function normalizeMensShoe(shoe) {
  const doc = shoe._doc || shoe;
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
  
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  // Calculate original price (MRP)
  const finalPrice = doc.finalPrice || doc.price || 0;
  const discountPercent = doc.discountPercent || 0;
  let originalPrice = doc.originalPrice;
  if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
    originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
  } else if (!originalPrice) {
    originalPrice = finalPrice;
  }

  return {
    _id: doc._id,
    title: doc.title || '',
    price: finalPrice,
    originalPrice: originalPrice,
    description: doc.description || '',
    category: doc.category || "Men's Shoes",
    subCategory: doc.subCategory || '',
    subSubCategory: doc.subSubCategory || '',
    product_info: {
      brand: doc.product_info?.brand || '',
      gender: doc.product_info?.gender || 'Men',
      color: doc.product_info?.color || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: discountPercent,
    finalPrice: finalPrice,
    _type: 'mensShoe',
    stock: doc.stock,
    inStock: doc.inStock
  };
}

// Helper function to normalize WomensShoe to Product-like format
function normalizeWomensShoe(shoe) {
  const doc = shoe._doc || shoe;
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
  
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  // Calculate original price (MRP)
  const finalPrice = doc.finalPrice || doc.price || 0;
  const discountPercent = doc.discountPercent || 0;
  let originalPrice = doc.originalPrice;
  if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
    originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
  } else if (!originalPrice) {
    originalPrice = finalPrice;
  }

  return {
    _id: doc._id,
    title: doc.title || '',
    price: finalPrice,
    originalPrice: originalPrice,
    description: doc.description || '',
    category: doc.category || "Women's Shoes",
    subCategory: doc.subCategory || '',
    subSubCategory: doc.subSubCategory || '',
    product_info: {
      brand: doc.product_info?.brand || '',
      gender: doc.product_info?.gender || 'Women',
      color: doc.product_info?.color || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: discountPercent,
    finalPrice: finalPrice,
    _type: 'womensShoe',
    stock: doc.stock,
    inStock: doc.inStock
  };
}

export const listAllProducts = async (req, res) => {
  try {
    // Get ALL products from all collections for admin dashboard
    const [products, contactLenses, accessories, skincareProducts, bags, mensShoes, womensShoes] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      ContactLens.find({}).sort({ createdAt: -1 }).lean(),
      Accessory.find({}).sort({ createdAt: -1 }).lean(),
      SkincareProduct.find({}).sort({ createdAt: -1 }).lean(),
      Bag.find({}).sort({ createdAt: -1 }).lean(),
      MensShoe.find({}).sort({ createdAt: -1 }).lean(),
      WomensShoe.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    // Tag and normalize each item
    const taggedProducts = products.map((p) => ({ ...p, _type: "product" }));
    const taggedContactLenses = contactLenses.map((c) => ({ ...c, _type: "contactLens" }));
    const normalizedAccessories = accessories.map(normalizeAccessory);
    const normalizedSkincare = skincareProducts.map(normalizeSkincareProduct);
    const normalizedBags = bags.map(normalizeBag);
    const normalizedMensShoes = mensShoes.map(normalizeMensShoe);
    const normalizedWomensShoes = womensShoes.map(normalizeWomensShoe);

    // Combine all products and sort by creation date (newest first)
    const allProducts = [
      ...taggedProducts,
      ...taggedContactLenses,
      ...normalizedAccessories,
      ...normalizedSkincare,
      ...normalizedBags,
      ...normalizedMensShoes,
      ...normalizedWomensShoes
    ].sort((a, b) => {
      // Sort by createdAt if available, otherwise by _id
      const dateA = a.createdAt ? new Date(a.createdAt) : null;
      const dateB = b.createdAt ? new Date(b.createdAt) : null;
      if (dateA && dateB) {
        return dateB - dateA; // Newest first
      }
      if (dateA) return -1;
      if (dateB) return 1;
      // Fallback to _id comparison
      return (b._id || '').toString().localeCompare((a._id || '').toString());
    });

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    // Normalize images
    let imagesArray = [];
    if (Array.isArray(body.images)) imagesArray = body.images.filter(Boolean);
    if (!imagesArray.length && body.Images) {
      const { image1, image2 } = body.Images || {};
      imagesArray = [image1, image2].filter(Boolean);
    }
    if (!imagesArray.length && body.image1) {
      imagesArray = [body.image1, body.image2].filter(Boolean);
    }

    const updateData = {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      subCategory: body.subCategory,
      subSubCategory: body.subSubCategory,
      product_info: body.product_info || {},
      images: imagesArray.length > 0 ? imagesArray : undefined,
      ratings: body.ratings,
      discount: body.discount,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error", error: error?.message });
    }
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    console.log('🔍 listOrders called');
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    console.log('🔍 Filter:', filter);
    console.log('🔍 Order model exists:', !!Order);
    
    // First try without populate to see if basic query works
    console.log('🔍 Trying basic Order.find...');
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    console.log('📊 Orders found (no populate):', orders.length);
    
    // If we have orders, try to populate them
    if (orders.length > 0) {
      try {
        console.log('🔍 Trying to populate...');
        const populatedOrders = await Order.find(filter)
          .populate("userId", "name email")
          .populate("items.productId")
          .sort({ createdAt: -1 });
        console.log('📊 Populated orders:', populatedOrders.length);
        res.json(populatedOrders);
      } catch (populateError) {
        console.error('❌ Populate error:', populateError);
        // Return orders without populate if populate fails
        res.json(orders);
      }
    } else {
      res.json(orders);
    }
  } catch (error) {
    console.error('❌ Error in listOrders:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "processing", "delivered", "cancel"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

