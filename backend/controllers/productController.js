import Product from "../models/Product.js";
import ContactLens from "../models/ContactLens.js";
import Accessory from "../models/Accessory.js";
import SkincareProduct from "../models/SkincareProduct.js";
import Bag from "../models/Bag.js";
import MensShoe from "../models/MensShoe.js";
import WomensShoe from "../models/WomensShoe.js";

const HIERARCHICAL_KEYS = new Set([
  "Gender",
  "Collection",
  "Shape",
  "Style",
  "Brands",
  "Usage",
  "Explore by Disposability",
  "Explore by Power",
  "Explore by Color",
  "Solution",
]);

function mapKeyToProductInfoPath(key) {
  const lowerKey = key.toLowerCase();
  if (lowerKey === "brands" || lowerKey === "brand") return "product_info.brand";
  if (lowerKey === "gender") return "product_info.gender";
  if (lowerKey === "shape") return "product_info.frameShape";
  if (lowerKey === "style") return "product_info.rimDetails";
  if (lowerKey === "usage") return "product_info.usage";
  if (lowerKey === "explore by disposability") return "product_info.usageDuration";
  if (lowerKey === "explore by power") return "product_info.power";
  if (lowerKey === "explore by color") return "product_info.color";
  if (lowerKey === "solution") return "product_info.solution";
  return `product_info.${lowerKey}`;
}

// Helper function to normalize Accessory to Product-like format
function normalizeAccessory(acc) {
  const doc = acc._doc || acc;
  // Handle images - use images array if it has items, otherwise fall back to thumbnail
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  return {
    _id: doc._id,
    title: doc.name || '',
    price: doc.finalPrice || doc.price || 0,
    description: doc.description || '',
    category: doc.category || "Accessories",
    subCategory: doc.subCategory,
    product_info: {
      brand: doc.brand || '',
      gender: doc.gender || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: doc.discountPercent || 0,
    finalPrice: doc.finalPrice || doc.price || 0,
    _type: 'accessory',
    // Preserve original fields that might be useful
    thumbnail: doc.thumbnail,
    brand: doc.brand,
    name: doc.name
  };
}

// Helper function to normalize SkincareProduct to Product-like format
function normalizeSkincareProduct(skp) {
  const doc = skp._doc || skp;
  
  // Handle images - use images array if it has items, otherwise fall back to thumbnail
  let imagesArray = [];
  
  // Check if images is an array
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    // Filter out empty/null/undefined values and ensure they're strings
    imagesArray = doc.images
      .map(img => {
        // Handle if image is an object with a url property
        if (img && typeof img === 'object' && img.url) {
          return img.url;
        }
        // Handle if image is a string
        if (img && typeof img === 'string') {
          return img.trim();
        }
        return null;
      })
      .filter(img => img && img.length > 0);
  }
  
  // Fallback to thumbnail if images array is empty
  if (imagesArray.length === 0 && doc.thumbnail) {
    const thumb = typeof doc.thumbnail === 'string' ? doc.thumbnail.trim() : 
                  (doc.thumbnail?.url ? doc.thumbnail.url.trim() : '');
    if (thumb) {
      imagesArray = [thumb];
    }
  }
  
  // Fallback to imageUrl if still empty (some products might use this field)
  if (imagesArray.length === 0 && doc.imageUrl) {
    const imgUrl = typeof doc.imageUrl === 'string' ? doc.imageUrl.trim() : '';
    if (imgUrl) {
      imagesArray = [imgUrl];
    }
  }
  
  return {
    _id: doc._id,
    title: doc.productName || doc.name || '',
    price: doc.finalPrice || doc.price || 0,
    description: doc.description || '',
    category: "Skincare",
    subCategory: doc.category, // moisturizer, serum, etc.
    product_info: {
      brand: doc.brand || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: doc.discountPercent || 0,
    finalPrice: doc.finalPrice || doc.price || 0,
    _type: 'skincare',
    // Preserve original fields that might be useful
    thumbnail: doc.thumbnail,
    brand: doc.brand,
    productName: doc.productName,
    imageUrl: doc.imageUrl
  };
}

// Helper function to normalize Bag to Product-like format
function normalizeBag(bag) {
  const doc = bag._doc || bag;
  // Handle images - ensure images is an array with valid strings
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  
  return {
    _id: doc._id,
    title: doc.name || '',
    price: doc.finalPrice || doc.price || 0,
    description: doc.description || '',
    category: "Bags",
    subCategory: doc.category, // handbag, backpack, etc.
    product_info: {
      brand: doc.brand || '',
      gender: doc.gender || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: doc.discountPercent || 0,
    finalPrice: doc.finalPrice || doc.price || 0,
    _type: 'bag',
    // Preserve original fields that might be useful
    brand: doc.brand,
    name: doc.name
  };
}

// Helper function to normalize MensShoe to Product-like format
function normalizeMensShoe(shoe) {
  const doc = shoe._doc || shoe;
  
  // Handle images - support multiple formats
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  
  // Fallback to legacy Images format
  if (imagesArray.length === 0 && doc.Images) {
    if (doc.Images.image1) imagesArray.push(doc.Images.image1);
    if (doc.Images.image2) imagesArray.push(doc.Images.image2);
    if (Array.isArray(doc.Images.additionalImages)) {
      imagesArray.push(...doc.Images.additionalImages.filter(img => img && typeof img === 'string' && img.trim() !== ''));
    }
  }
  
  // Fallback to thumbnail
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  return {
    _id: doc._id,
    title: doc.title || '',
    price: doc.finalPrice || doc.price || 0,
    description: doc.description || '',
    category: doc.category || "Men's Shoes",
    subCategory: doc.subCategory || '',
    subSubCategory: doc.subSubCategory || '',
    product_info: {
      brand: doc.product_info?.brand || '',
      gender: doc.product_info?.gender || 'Men',
      color: doc.product_info?.color || '',
      outerMaterial: doc.product_info?.outerMaterial || '',
      soleMaterial: doc.product_info?.soleMaterial || '',
      innerMaterial: doc.product_info?.innerMaterial || '',
      closureType: doc.product_info?.closureType || '',
      heelHeight: doc.product_info?.heelHeight || '',
      toeShape: doc.product_info?.toeShape || '',
      warranty: doc.product_info?.warranty || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: doc.discountPercent || 0,
    finalPrice: doc.finalPrice || doc.price || 0,
    sizes_inventory: doc.sizes_inventory || [],
    _type: 'mensShoe',
    // Preserve original fields
    stock: doc.stock,
    inStock: doc.inStock
  };
}

// Helper function to normalize WomensShoe to Product-like format
function normalizeWomensShoe(shoe) {
  const doc = shoe._doc || shoe;
  
  // Handle images - support multiple formats
  let imagesArray = [];
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    imagesArray = doc.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }
  
  // Fallback to legacy Images format
  if (imagesArray.length === 0 && doc.Images) {
    if (doc.Images.image1) imagesArray.push(doc.Images.image1);
    if (doc.Images.image2) imagesArray.push(doc.Images.image2);
    if (Array.isArray(doc.Images.additionalImages)) {
      imagesArray.push(...doc.Images.additionalImages.filter(img => img && typeof img === 'string' && img.trim() !== ''));
    }
  }
  
  // Fallback to thumbnail
  if (imagesArray.length === 0 && doc.thumbnail && typeof doc.thumbnail === 'string' && doc.thumbnail.trim() !== '') {
    imagesArray = [doc.thumbnail];
  }
  
  return {
    _id: doc._id,
    title: doc.title || '',
    price: doc.finalPrice || doc.price || 0,
    description: doc.description || '',
    category: doc.category || "Women's Shoes",
    subCategory: doc.subCategory || '',
    subSubCategory: doc.subSubCategory || '',
    product_info: {
      brand: doc.product_info?.brand || '',
      gender: doc.product_info?.gender || 'Women',
      color: doc.product_info?.color || '',
      outerMaterial: doc.product_info?.outerMaterial || '',
      soleMaterial: doc.product_info?.soleMaterial || '',
      innerMaterial: doc.product_info?.innerMaterial || '',
      closureType: doc.product_info?.closureType || '',
      toeShape: doc.product_info?.toeShape || '',
      embellishments: doc.product_info?.embellishments || [],
      warranty: doc.product_info?.warranty || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    discount: doc.discountPercent || 0,
    finalPrice: doc.finalPrice || doc.price || 0,
    sizes_inventory: doc.sizes_inventory || [],
    _type: 'womensShoe',
    // Preserve original fields
    stock: doc.stock,
    inStock: doc.inStock
  };
}

// Build filter for Accessories
function buildAccessoryFilter(query) {
  const conditions = [];
  
  // Category is always "Accessories" for this collection
  conditions.push({ category: { $regex: `^Accessories$`, $options: "i" } });
  
  if (query.subCategory) {
    conditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
  }
  
  if (query.search) {
    conditions.push({ name: { $regex: query.search, $options: "i" } });
  }
  
  if (query.priceRange) {
    const pr = String(query.priceRange).trim();
    let priceCond = {};
    if (/^\d+\-\d+$/.test(pr)) {
      const [min, max] = pr.split('-').map(n => parseInt(n, 10));
      if (!isNaN(min)) priceCond.$gte = min;
      if (!isNaN(max)) priceCond.$lte = max;
    } else if (/^\d+\+$/.test(pr)) {
      const min = parseInt(pr.replace('+',''), 10);
      if (!isNaN(min)) priceCond.$gte = min;
    }
    if (Object.keys(priceCond).length) {
      conditions.push({ $or: [
        { price: priceCond },
        { finalPrice: priceCond }
      ]});
    }
  }
  
  if (query.gender) {
    conditions.push({ gender: { $regex: `^${String(query.gender)}$`, $options: 'i' } });
  }
  
  return conditions.length > 0 ? { $and: conditions } : { category: { $regex: `^Accessories$`, $options: "i" } };
}

// Build filter for Skincare
function buildSkincareFilter(query) {
  const conditions = [];
  
  // No top-level category filter needed - all are Skincare
  if (query.subCategory) {
    conditions.push({ category: { $regex: `^${query.subCategory}$`, $options: "i" } }); // category in schema is actually subcategory
  }
  
  if (query.search) {
    conditions.push({ productName: { $regex: query.search, $options: "i" } });
  }
  
  if (query.priceRange) {
    const pr = String(query.priceRange).trim();
    let priceCond = {};
    if (/^\d+\-\d+$/.test(pr)) {
      const [min, max] = pr.split('-').map(n => parseInt(n, 10));
      if (!isNaN(min)) priceCond.$gte = min;
      if (!isNaN(max)) priceCond.$lte = max;
    } else if (/^\d+\+$/.test(pr)) {
      const min = parseInt(pr.replace('+',''), 10);
      if (!isNaN(min)) priceCond.$gte = min;
    }
    if (Object.keys(priceCond).length) {
      conditions.push({ $or: [
        { price: priceCond },
        { finalPrice: priceCond }
      ]});
    }
  }
  
  return conditions.length > 0 ? { $and: conditions } : {};
}

// Build filter for Bags
function buildBagFilter(query) {
  const conditions = [];
  
  // No top-level category filter needed - all are Bags
  if (query.subCategory) {
    conditions.push({ category: { $regex: `^${query.subCategory}$`, $options: "i" } }); // category in schema is actually subcategory
  }
  
  if (query.search) {
    conditions.push({ name: { $regex: query.search, $options: "i" } });
  }
  
  if (query.priceRange) {
    const pr = String(query.priceRange).trim();
    let priceCond = {};
    if (/^\d+\-\d+$/.test(pr)) {
      const [min, max] = pr.split('-').map(n => parseInt(n, 10));
      if (!isNaN(min)) priceCond.$gte = min;
      if (!isNaN(max)) priceCond.$lte = max;
    } else if (/^\d+\+$/.test(pr)) {
      const min = parseInt(pr.replace('+',''), 10);
      if (!isNaN(min)) priceCond.$gte = min;
    }
    if (Object.keys(priceCond).length) {
      conditions.push({ $or: [
        { price: priceCond },
        { finalPrice: priceCond }
      ]});
    }
  }
  
  if (query.gender) {
    conditions.push({ gender: { $regex: `^${String(query.gender)}$`, $options: 'i' } });
  }
  
  return conditions.length > 0 ? { $and: conditions } : {};
}

// Build filter for Men's Shoes
function buildMensShoeFilter(query) {
  const conditions = [];
  
  // Category is always "Men's Shoes" for this collection
  conditions.push({ category: { $regex: `^Men's Shoes$`, $options: "i" } });
  
  if (query.subCategory) {
    conditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
  }
  
  if (query.subSubCategory) {
    conditions.push({ subSubCategory: { $regex: `^${query.subSubCategory}$`, $options: "i" } });
  }
  
  if (query.search) {
    conditions.push({ title: { $regex: query.search, $options: "i" } });
  }
  
  if (query.priceRange) {
    const pr = String(query.priceRange).trim();
    let priceCond = {};
    if (/^\d+\-\d+$/.test(pr)) {
      const [min, max] = pr.split('-').map(n => parseInt(n, 10));
      if (!isNaN(min)) priceCond.$gte = min;
      if (!isNaN(max)) priceCond.$lte = max;
    } else if (/^\d+\+$/.test(pr)) {
      const min = parseInt(pr.replace('+',''), 10);
      if (!isNaN(min)) priceCond.$gte = min;
    }
    if (Object.keys(priceCond).length) {
      conditions.push({ $or: [
        { price: priceCond },
        { finalPrice: priceCond }
      ]});
    }
  }
  
  if (query.gender) {
    conditions.push({ 'product_info.gender': { $regex: `^${String(query.gender)}$`, $options: 'i' } });
  }
  
  if (query.color) {
    conditions.push({ 'product_info.color': { $regex: `^${String(query.color)}$`, $options: 'i' } });
  }
  
  return conditions.length > 0 ? { $and: conditions } : { category: { $regex: `^Men's Shoes$`, $options: "i" } };
}

// Build filter for Women's Shoes
function buildWomensShoeFilter(query) {
  const conditions = [];
  
  // Category is always "Women's Shoes" for this collection
  conditions.push({ category: { $regex: `^Women's Shoes$`, $options: "i" } });
  
  if (query.subCategory) {
    conditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
  }
  
  if (query.subSubCategory) {
    conditions.push({ subSubCategory: { $regex: `^${query.subSubCategory}$`, $options: "i" } });
  }
  
  if (query.search) {
    conditions.push({ title: { $regex: query.search, $options: "i" } });
  }
  
  if (query.priceRange) {
    const pr = String(query.priceRange).trim();
    let priceCond = {};
    if (/^\d+\-\d+$/.test(pr)) {
      const [min, max] = pr.split('-').map(n => parseInt(n, 10));
      if (!isNaN(min)) priceCond.$gte = min;
      if (!isNaN(max)) priceCond.$lte = max;
    } else if (/^\d+\+$/.test(pr)) {
      const min = parseInt(pr.replace('+',''), 10);
      if (!isNaN(min)) priceCond.$gte = min;
    }
    if (Object.keys(priceCond).length) {
      conditions.push({ $or: [
        { price: priceCond },
        { finalPrice: priceCond }
      ]});
    }
  }
  
  if (query.gender) {
    conditions.push({ 'product_info.gender': { $regex: `^${String(query.gender)}$`, $options: 'i' } });
  }
  
  if (query.color) {
    conditions.push({ 'product_info.color': { $regex: `^${String(query.color)}$`, $options: 'i' } });
  }
  
  return conditions.length > 0 ? { $and: conditions } : { category: { $regex: `^Women's Shoes$`, $options: "i" } };
}

export const listProducts = async (req, res) => {
  try {
    const query = req.query || {};
    const andConditions = [];

    // Pagination parameters (default 18 per page)
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 18, 1);
    const skip = (page - 1) * limit;

    if (query.category) andConditions.push({ category: { $regex: `^${query.category}$`, $options: "i" } });
    if (query.subCategory) andConditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
    if (query.subSubCategory) andConditions.push({ subSubCategory: { $regex: `^${query.subSubCategory}$`, $options: "i" } });

    for (const [key, rawVal] of Object.entries(query)) {
      if (!HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({
        $or: [
          { subCategory: key, subSubCategory: rawVal },
          { [infoPath]: { $regex: `^${val}$`, $options: "i" } },
        ],
      });
    }

    const RESERVED = new Set(["category","subCategory","subSubCategory","limit","page","search","sort","order","priceRange","gender","color"]);
    for (const [key, rawVal] of Object.entries(query)) {
      if (RESERVED.has(key)) continue;
      if (HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({ [infoPath]: { $regex: `^${val}$`, $options: "i" } });
    }

    if (query.search) {
      andConditions.push({ title: { $regex: query.search, $options: "i" } });
    }

    // Additional filters
    if (query.priceRange) {
      // Accept forms like "300-1000" or "10000+"
      const pr = String(query.priceRange).trim();
      let priceCond = {};
      if (/^\d+\-\d+$/.test(pr)) {
        const [min, max] = pr.split('-').map(n => parseInt(n, 10));
        if (!isNaN(min)) priceCond.$gte = min;
        if (!isNaN(max)) priceCond.$lte = max;
      } else if (/^\d+\+$/.test(pr)) {
        const min = parseInt(pr.replace('+',''), 10);
        if (!isNaN(min)) priceCond.$gte = min;
      }
      if (Object.keys(priceCond).length) andConditions.push({ price: priceCond });
    }

    if (query.gender) {
      andConditions.push({ 'product_info.gender': { $regex: `^${String(query.gender)}$`, $options: 'i' } });
    }

    if (query.color) {
      andConditions.push({ 'product_info.color': { $regex: `^${String(query.color)}$`, $options: 'i' } });
    }

    const mongoFilter = andConditions.length > 0 ? { $and: andConditions } : {};

    // If a specific category is requested, route to the appropriate collection for reliable results
    const requestedCategory = typeof query.category === 'string' ? query.category : '';
    
    // Handle Accessories
    if (/^accessories$/i.test(requestedCategory)) {
      const accessoryFilter = buildAccessoryFilter(query);
      const [totalCount, data] = await Promise.all([
        Accessory.countDocuments(accessoryFilter),
        Accessory.find(accessoryFilter).sort({ subCategory: 1, _id: 1 }).skip(skip).limit(limit)
      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => normalizeAccessory(d)), pagination });
    }
    
    // Handle Skincare
    if (/^skincare$/i.test(requestedCategory)) {
      const skincareFilter = buildSkincareFilter(query);
      const [totalCount, data] = await Promise.all([
        SkincareProduct.countDocuments(skincareFilter),
        SkincareProduct.find(skincareFilter).sort({ _id: 1 }).skip(skip).limit(limit)
      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => normalizeSkincareProduct(d)), pagination });
    }
    
    // Handle Bags
    if (/^bags$/i.test(requestedCategory)) {
      const bagFilter = buildBagFilter(query);
      const [totalCount, data] = await Promise.all([
        Bag.countDocuments(bagFilter),
        Bag.find(bagFilter).sort({ category: 1, gender: 1, _id: 1 }).skip(skip).limit(limit)
      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => normalizeBag(d)), pagination });
    }
    
    // Handle Men's Shoes
    if (/^men'?s?\s+shoes?$/i.test(requestedCategory) || /^footwear$/i.test(requestedCategory)) {
      const mensShoeFilter = buildMensShoeFilter(query);
      const [totalCount, data] = await Promise.all([
        MensShoe.countDocuments(mensShoeFilter),
        MensShoe.find(mensShoeFilter).sort({ subCategory: 1, _id: 1 }).skip(skip).limit(limit)
      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => normalizeMensShoe(d)), pagination });
    }
    
    // Handle Women's Shoes
    if (/^women'?s?\s+shoes?$/i.test(requestedCategory)) {
      const womensShoeFilter = buildWomensShoeFilter(query);
      const [totalCount, data] = await Promise.all([
        WomensShoe.countDocuments(womensShoeFilter),
        WomensShoe.find(womensShoeFilter).sort({ subCategory: 1, _id: 1 }).skip(skip).limit(limit)
      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => normalizeWomensShoe(d)), pagination });
    }
    
    // Handle Contact Lenses
    if (/^contact\s+lenses$/i.test(requestedCategory)) {
      const [totalCount, data] = await Promise.all([
        ContactLens.countDocuments(mongoFilter),
        ContactLens.find(mongoFilter).sort({ _id: 1 }).skip(skip).limit(limit)

      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => ({ ...d._doc, _type: 'contactLens' })), pagination });
    }
    
    // Handle other categories (Eyeglasses, Sunglasses, Computer Glasses) - use Product collection
    if (requestedCategory && !/^contact\s+lenses|accessories|skincare|bags|men'?s?\s+shoes?|women'?s?\s+shoes?|footwear$/i.test(requestedCategory)) {
      const [totalCount, data] = await Promise.all([
        Product.countDocuments(mongoFilter),
        Product.find(mongoFilter).sort({ _id: 1 }).skip(skip).limit(limit)

      ]);
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      return res.json({ products: data.map(d => ({ ...d._doc, _type: 'product' })), pagination });
    }

    // No specific category: use aggregation with $unionWith for cross-collection pagination
    const matchStage = { $match: mongoFilter };
    const addTypeProduct = { $addFields: { _type: "product" } };
    const addTypeContact = { $addFields: { _type: "contactLens" } };

    const pipeline = [
      matchStage,
      addTypeProduct,
      { $unionWith: { coll: "contactlenses", pipeline: [matchStage, addTypeContact] } },
      { $sort: { _id: 1 } },
      { $facet: { data: [ { $skip: skip }, { $limit: limit } ], totalCount: [ { $count: "count" } ] } }
    ];

    const aggResult = await Product.aggregate(pipeline);
    const data = aggResult?.[0]?.data || [];
    const totalCount = aggResult?.[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit) || 0;

    const pagination = {
      currentPage: page,
      totalPages,
      totalProducts: totalCount,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return res.json({ products: data, pagination });
  } catch (error) {
    return res.status(500).json({
      message: "Error listing products",
      error: error?.message || String(error),
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        productsPerPage: 18,
        hasNextPage: false,
        hasPrevPage: false,
      }
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try Product collection first
    let product = await Product.findById(id);
    if (product) {
      return res.json({ ...product._doc, _type: "product" });
    }
    
    // Try ContactLens collection
    product = await ContactLens.findById(id);
    if (product) {
      return res.json({ ...product._doc, _type: "contactLens" });
    }
    
    // Try Accessory collection
    product = await Accessory.findById(id);
    if (product) {
      return res.json(normalizeAccessory(product));
    }
    
    // Try SkincareProduct collection
    product = await SkincareProduct.findById(id);
    if (product) {
      return res.json(normalizeSkincareProduct(product));
    }
    
    // Try Bag collection
    product = await Bag.findById(id);
    if (product) {
      return res.json(normalizeBag(product));
    }
    
    // Try MensShoe collection
    product = await MensShoe.findById(id);
    if (product) {
      return res.json(normalizeMensShoe(product));
    }
    
    // Try WomensShoe collection
    product = await WomensShoe.findById(id);
    if (product) {
      return res.json(normalizeWomensShoe(product));
    }
    
    // If not found in any collection
    return res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error?.message || String(error) });
  }
};

export const getFacets = async (req, res) => {
  try {
    const query = req.query || {};
    const andConditions = [];

    if (query.category) andConditions.push({ category: { $regex: `^${query.category}$`, $options: "i" } });
    if (query.subCategory) andConditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
    if (query.subSubCategory) andConditions.push({ subSubCategory: { $regex: `^${query.subSubCategory}$`, $options: "i" } });

    for (const [key, rawVal] of Object.entries(query)) {
      if (!HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({ $or: [ { subCategory: key, subSubCategory: rawVal }, { [infoPath]: { $regex: `^${val}$`, $options: "i" } } ] });
    }

    const RESERVED = new Set(["category","subCategory","subSubCategory","limit","page","search","sort","order","priceRange","gender","color"]);
    for (const [key, rawVal] of Object.entries(query)) {
      if (RESERVED.has(key)) continue;
      if (HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({ [infoPath]: { $regex: `^${val}$`, $options: "i" } });
    }

    if (query.search) andConditions.push({ title: { $regex: query.search, $options: "i" } });

    // Apply current selected filters (priceRange, gender, color) to base filter
    if (query.priceRange) {
      const pr = String(query.priceRange).trim();
      const priceCond = {};
      if (/^\d+\-\d+$/.test(pr)) {
        const [min, max] = pr.split('-').map(n => parseInt(n, 10));
        if (!isNaN(min)) priceCond.$gte = min;
        if (!isNaN(max)) priceCond.$lte = max;
      } else if (/^\d+\+$/.test(pr)) {
        const min = parseInt(pr.replace('+',''), 10);
        if (!isNaN(min)) priceCond.$gte = min;
      }
      if (Object.keys(priceCond).length) andConditions.push({ price: priceCond });
    }
    if (query.gender) andConditions.push({ 'product_info.gender': { $regex: `^${String(query.gender)}$`, $options: 'i' } });
    if (query.color) andConditions.push({ 'product_info.color': { $regex: `^${String(query.color)}$`, $options: 'i' } });

    const baseMatch = andConditions.length ? { $and: andConditions } : {};

    const priceBuckets = [
      { label: '300-1000', min: 300, max: 1000 },
      { label: '1001-2000', min: 1001, max: 2000 },
      { label: '2001-3000', min: 2001, max: 3000 },
      { label: '3001-4000', min: 3001, max: 4000 },
      { label: '4001-5000', min: 4001, max: 5000 }, 
      { label: '5000+', min: 5000 }
    ];

    // Build a facets aggregation pipeline
    const priceFacetStages = priceBuckets.map(b => ({
      $group: {
        _id: b.label,
        count: { $sum: {
          $cond: [
            { $and: [
              { $gte: ["$price", b.min] },
              ...(b.max ? [{ $lte: ["$price", b.max] }] : [])
            ] },
            1,
            0
          ]
        } }
      }
    }));

    const pipelineBase = [ { $match: baseMatch } ];

    // genders and colors from product_info
    const genderFacet = [ { $match: baseMatch }, { $group: { _id: { $toUpper: "$product_info.gender" }, count: { $sum: 1 } } } ];
    const colorFacet = [ { $match: baseMatch }, { $group: { _id: { $toUpper: "$product_info.color" }, count: { $sum: 1 } } } ];

    // Use union when no specific category; otherwise query appropriate collection
    const requestedCategory = typeof query.category === 'string' ? query.category : '';
    let dataAgg;
    
    // Handle Accessories
    if (/^accessories$/i.test(requestedCategory)) {
      const accessoryFilter = buildAccessoryFilter(query);
      dataAgg = await Accessory.aggregate([
        { $match: accessoryFilter },
        { $facet: {
          genders: [ { $group: { _id: { $toUpper: "$gender" }, count: { $sum: 1 } } } ],
          subCategories: [ { $group: { _id: { $toUpper: "$subCategory" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: { $ifNull: ["$finalPrice", "$price"] } } } } ]
        } }
      ]);
    }
    // Handle Skincare
    else if (/^skincare$/i.test(requestedCategory)) {
      const skincareFilter = buildSkincareFilter(query);
      dataAgg = await SkincareProduct.aggregate([
        { $match: skincareFilter },
        { $facet: {
          subCategories: [ { $group: { _id: { $toUpper: "$category" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: { $ifNull: ["$finalPrice", "$price"] } } } } ]
        } }
      ]);
    }
    // Handle Bags
    else if (/^bags$/i.test(requestedCategory)) {
      const bagFilter = buildBagFilter(query);
      dataAgg = await Bag.aggregate([
        { $match: bagFilter },
        { $facet: {
          genders: [ { $group: { _id: { $toUpper: "$gender" }, count: { $sum: 1 } } } ],
          subCategories: [ { $group: { _id: { $toUpper: "$category" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: { $ifNull: ["$finalPrice", "$price"] } } } } ]
        } }
      ]);
    }
    // Handle Men's Shoes
    else if (/^men'?s?\s+shoes?$/i.test(requestedCategory) || /^footwear$/i.test(requestedCategory)) {
      const mensShoeFilter = buildMensShoeFilter(query);
      dataAgg = await MensShoe.aggregate([
        { $match: mensShoeFilter },
        { $facet: {
          genders: [ { $group: { _id: { $toUpper: "$product_info.gender" }, count: { $sum: 1 } } } ],
          subCategories: [ { $group: { _id: { $toUpper: "$subCategory" }, count: { $sum: 1 } } } ],
          colors: [ { $group: { _id: { $toUpper: "$product_info.color" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: { $ifNull: ["$finalPrice", "$price"] } } } } ]
        } }
      ]);
    }
    // Handle Women's Shoes
    else if (/^women'?s?\s+shoes?$/i.test(requestedCategory)) {
      const womensShoeFilter = buildWomensShoeFilter(query);
      dataAgg = await WomensShoe.aggregate([
        { $match: womensShoeFilter },
        { $facet: {
          genders: [ { $group: { _id: { $toUpper: "$product_info.gender" }, count: { $sum: 1 } } } ],
          subCategories: [ { $group: { _id: { $toUpper: "$subCategory" }, count: { $sum: 1 } } } ],
          colors: [ { $group: { _id: { $toUpper: "$product_info.color" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: { $ifNull: ["$finalPrice", "$price"] } } } } ]
        } }
      ]);
    }
    // Handle Contact Lenses
    else if (/^contact\s+lenses$/i.test(requestedCategory)) {
      dataAgg = await ContactLens.aggregate([
        ...pipelineBase,
        { $facet: {
          genders: genderFacet.slice(1),
          colors: colorFacet.slice(1),
          prices: [ { $group: { _id: null, values: { $push: "$price" } } } ]
        } }
      ]);
    }
    // Handle other categories (Eyeglasses, Sunglasses, Computer Glasses) - use Product collection
    else if (requestedCategory) {
      dataAgg = await Product.aggregate([
        ...pipelineBase,
        { $facet: {
          genders: genderFacet.slice(1),
          colors: colorFacet.slice(1),
          prices: [ { $group: { _id: null, values: { $push: "$price" } } } ]
        } }
      ]);
    } else {
      dataAgg = await Product.aggregate([
        { $match: baseMatch },
        { $unionWith: { coll: "contactlenses", pipeline: [ { $match: baseMatch } ] } },
        { $facet: {
          genders: [ { $group: { _id: { $toUpper: "$product_info.gender" }, count: { $sum: 1 } } } ],
          colors: [ { $group: { _id: { $toUpper: "$product_info.color" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: "$price" } } } ]
        } }
      ]);
    }

    const gendersRaw = dataAgg?.[0]?.genders || [];
    const colorsRaw = dataAgg?.[0]?.colors || [];
    const subCategoriesRaw = dataAgg?.[0]?.subCategories || [];
    const pricesRaw = (dataAgg?.[0]?.prices?.[0]?.values || []).filter(v => typeof v === 'number');

    // Count price buckets from pricesRaw
    const priceCounts = Object.fromEntries(priceBuckets.map(b => [b.label, 0]));
    for (const p of pricesRaw) {
      for (const b of priceBuckets) {
        if (p >= b.min && (b.max ? p <= b.max : true)) {
          priceCounts[b.label] += 1;
          break;
        }
      }
    }

    const genders = Object.fromEntries(gendersRaw.filter(g => g._id).map(g => [g._id, g.count]));
    const colors = Object.fromEntries(colorsRaw.filter(c => c._id).map(c => [c._id, c.count]));
    const subCategories = Object.fromEntries(subCategoriesRaw.filter(s => s._id).map(s => [s._id, s.count]));

    return res.json({ priceBuckets: priceCounts, genders, colors, subCategories });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching facets', error: err?.message || String(err) });
  }
};

export const adminListProducts = async (req, res) => {
  try {
    const { type = 'product' } = req.query;
    const search = String(req.query.search || '').trim();
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const Model = /^contactlens/i.test(type) ? ContactLens : Product;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Model.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 0,
        totalItems: total,
        perPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error listing products', error: err?.message || String(err) });
  }
};

export const adminCreateProduct = async (req, res) => {
  try {
    const { type = 'product', ...body } = req.body || {};
    const Model = /^contactlens/i.test(type) ? ContactLens : Product;

    // Basic unique check by title (case-insensitive) for Product only

    // Normalize images similar to createProduct
    let imagesArray = [];
    if (Array.isArray(body.images)) imagesArray = body.images.filter(Boolean);
    if (!imagesArray.length && body.Images) {
      const { image1, image2 } = body.Images || {};
      imagesArray = [image1, image2].filter(Boolean);
    }
    if (!imagesArray.length && body.image1) {
      imagesArray = [body.image1, body.image2].filter(Boolean);
    }

    const payload = {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      subCategory: body.subCategory,
      subSubCategory: body.subSubCategory,
      product_info: body.product_info || {},
      images: imagesArray,
      ratings: body.ratings,
      discount: body.discount,
    };

    const created = await Model.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'Duplicate key error', error: err?.message });
    return res.status(400).json({ message: 'Error creating product', error: err?.message || String(err) });
  }
};

export const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'product', ...body } = req.body || {};
    const Model = /^contactlens/i.test(type) ? ContactLens : Product;

    // Do not allow changing _id
    if (body._id) delete body._id;

    // Normalize optional images
    if (Array.isArray(body.images)) {
      body.images = body.images.filter(Boolean);
    }

    const updated = await Model.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Error updating product', error: err?.message || String(err) });
  }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'product' } = req.query;
    const Model = /^contactlens/i.test(type) ? ContactLens : Product;

    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: 'Error deleting product', error: err?.message || String(err) });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };

    // Case-insensitive existence check to prevent duplicates by title

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

    const payload = {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      subCategory: body.subCategory,
      subSubCategory: body.subSubCategory,
      product_info: body.product_info || {},
      images: imagesArray,
      ratings: body.ratings,
      discount: body.discount,
    };

    const created = await Product.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error", error: error?.message });
    }
    return res.status(400).json({ message: "Error creating product", error });
  }
};
