import Order from "../models/Order.js";
import MensShoe from "../models/MensShoe.js";
import WomensShoe from "../models/WomensShoe.js";
import KidsShoe from "../models/KidsShoe.js";
import ShoesAccessory from "../models/ShoesAccessory.js";

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
    rating: doc.rating || 0,
    reviewsCount: doc.reviewsCount || 0,
    ratingsCount: doc.ratingsCount || 0,
    numReviews: doc.reviewsCount || doc.ratingsCount || 0,
    isFeatured: doc.isFeatured || false,
    onSale: doc.onSale || false,
    discount: discountPercent,
    discountPercent: discountPercent,
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
    rating: doc.rating || 0,
    reviewsCount: doc.reviewsCount || 0,
    ratingsCount: doc.ratingsCount || 0,
    numReviews: doc.reviewsCount || doc.ratingsCount || 0,
    isFeatured: doc.isFeatured || false,
    onSale: doc.onSale || false,
    discount: discountPercent,
    discountPercent: discountPercent,
    finalPrice: finalPrice,
    _type: 'womensShoe',
    stock: doc.stock,
    inStock: doc.inStock
  };
}

// Helper function to normalize KidsShoe to Product-like format
function normalizeKidsShoe(shoe) {
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
    category: doc.category || "Kids Shoes",
    subCategory: doc.subCategory || '',
    subSubCategory: doc.subSubCategory || '',
    product_info: {
      brand: doc.product_info?.brand || '',
      gender: doc.product_info?.gender || 'Kids',
      color: doc.product_info?.color || '',
    },
    images: imagesArray,
    ratings: doc.rating || 0,
    rating: doc.rating || 0,
    reviewsCount: doc.reviewsCount || 0,
    ratingsCount: doc.ratingsCount || 0,
    numReviews: doc.reviewsCount || doc.ratingsCount || 0,
    isFeatured: doc.isFeatured || false,
    onSale: doc.onSale || false,
    discount: discountPercent,
    discountPercent: discountPercent,
    finalPrice: finalPrice,
    _type: 'kidsShoe',
    stock: doc.stock,
    inStock: doc.inStock
  };
}

export const listAllProducts = async (req, res) => {
  try {
    // Get Men's, Women's, Kids Shoes, and Shoes Accessories for admin dashboard
    const [mensShoes, womensShoes, kidsShoes, shoesAccessories] = await Promise.all([
      MensShoe.find({}).sort({ createdAt: -1 }).lean(),
      WomensShoe.find({}).sort({ createdAt: -1 }).lean(),
      KidsShoe.find({}).sort({ createdAt: -1 }).lean(),
      ShoesAccessory.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    // Normalize each item
    const normalizedMensShoes = mensShoes.map(normalizeMensShoe);
    const normalizedWomensShoes = womensShoes.map(normalizeWomensShoe);
    const normalizedKidsShoes = kidsShoes.map(normalizeKidsShoe);
    const normalizedAccessories = shoesAccessories.map(acc => {
      const finalPrice = acc.finalPrice || acc.price || 0;
      const discountPercent = acc.discountPercent || acc.discount || 0;
      let originalPrice = acc.originalPrice;
      if (!originalPrice && discountPercent > 0 && finalPrice > 0) {
        originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
      } else if (!originalPrice) {
        originalPrice = finalPrice;
      }
      return {
        ...acc,
        _type: 'shoesAccessory',
        finalPrice: finalPrice,
        originalPrice: originalPrice,
        discount: discountPercent,
        ratings: acc.rating || acc.ratings || 0,
        images: Array.isArray(acc.images) ? acc.images : (acc.thumbnail ? [acc.thumbnail] : []),
      };
    });

    // Combine all products and sort by creation date (newest first)
    const allProducts = [
      ...normalizedMensShoes,
      ...normalizedWomensShoes,
      ...normalizedKidsShoes,
      ...normalizedAccessories
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
    
    console.log('Update product request:', {
      id,
      category: body.category,
      subCategory: body.subCategory,
      brand: body.product_info?.brand,
      hasImages: !!body.images && body.images.length > 0
    });

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

    // Calculate discountPercent and finalPrice if discount is provided
    let discountPercent = body.discount || 0;
    let finalPrice = body.price || 0;
    let originalPrice = body.price || 0;
    
    if (discountPercent > 0 && finalPrice > 0) {
      originalPrice = Math.round(finalPrice / (1 - discountPercent / 100));
    }

    // First, find which collection the product is in
    let product = null;
    let productType = null;
    
    // Try to find the product in each collection
    product = await MensShoe.findById(id);
    if (product) {
      productType = 'mensShoe';
    } else {
      product = await WomensShoe.findById(id);
      if (product) {
        productType = 'womensShoe';
      } else {
        product = await KidsShoe.findById(id);
        if (product) {
          productType = 'kidsShoe';
        } else {
          product = await Product.findById(id);
          if (product && product.category === "Shoes Accessories") {
            productType = 'shoesAccessory';
          }
        }
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine which collection to update based on new category or existing type
    const categoryToUse = body.category || product.category || "";
    
    // Build product_info with proper field mapping
    const productInfo = body.product_info || {};
    const category = categoryToUse;
    
    // Determine gender based on category
    let gender = productInfo.gender;
    if (!gender) {
      if (/men'?s?\s+shoes?/i.test(category)) {
        gender = 'Men';
      } else if (/women'?s?\s+shoes?/i.test(category)) {
        gender = 'Women';
      } else if (/kids'?\s+shoes?/i.test(category)) {
        gender = 'Kids';
      } else {
        gender = product.product_info?.gender || 'Men';
      }
    }

    // Map material and style to schema fields
    // Ensure brand is not empty - it's required
    const brand = productInfo.brand || product.product_info?.brand;
    if (!brand || brand.trim() === '') {
      return res.status(400).json({ 
        message: "Brand is required",
        error: "product_info.brand cannot be empty"
      });
    }

    const mappedProductInfo = {
      brand: brand.trim(),
      gender: gender,
      color: productInfo.color || productInfo.frameColor || product.product_info?.color || '',
      outerMaterial: productInfo.material || productInfo.frameMaterial || product.product_info?.outerMaterial || '',
      ...product.product_info, // Keep existing fields
      ...productInfo // Override with new values
    };

    // Ensure gender is set correctly
    mappedProductInfo.gender = gender;

    // Remove undefined and empty string values from product_info (except brand which is required)
    Object.keys(mappedProductInfo).forEach(
      (key) => {
        if (key !== 'brand' && (mappedProductInfo[key] === undefined || mappedProductInfo[key] === '')) {
          delete mappedProductInfo[key];
        }
      }
    );

    // Ensure subCategory is present - it's required
    const subCategory = body.subCategory || product.subCategory;
    if (!subCategory || subCategory.trim() === '') {
      return res.status(400).json({ 
        message: "SubCategory is required",
        error: "subCategory cannot be empty"
      });
    }

    // Validate subCategory enum based on category
    const subCategoryTrimmed = subCategory.trim();
    let validSubCategories = [];
    if (/men'?s?\s+shoes?/i.test(categoryToUse)) {
      validSubCategories = ['Formal', 'Sneakers', 'Boots', 'Loafers', 'Sandals'];
    } else if (/women'?s?\s+shoes?/i.test(categoryToUse)) {
      validSubCategories = ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals', 'Chappals'];
    } else if (/kids'?\s+shoes?/i.test(categoryToUse)) {
      validSubCategories = ['Boys Footwear', 'Girls Footwear'];
    } else if (/shoes?\s+accessories?/i.test(categoryToUse)) {
      validSubCategories = ['Shoe Laces', 'Shoe Polish', 'Shoe Insoles', 'Shoe Bags', 'Shoe Trees', 'Shoe Care Kits'];
    }

    // Check if subCategory matches enum (case-insensitive) and normalize to exact enum value
    let normalizedSubCategory = subCategoryTrimmed;
    if (validSubCategories.length > 0) {
      const matchedSubCategory = validSubCategories.find(
        valid => valid.toLowerCase() === subCategoryTrimmed.toLowerCase()
      );
      if (!matchedSubCategory) {
        return res.status(400).json({ 
          message: "Invalid SubCategory",
          error: `subCategory must be one of: ${validSubCategories.join(', ')}`,
          received: subCategoryTrimmed
        });
      }
      // Use the exact enum value (case-sensitive)
      normalizedSubCategory = matchedSubCategory;
    }

    const updateData = {
      title: body.title || product.title,
      price: body.price !== undefined ? body.price : product.price,
      finalPrice: finalPrice,
      originalPrice: originalPrice,
      description: body.description !== undefined ? body.description : product.description,
      category: body.category || product.category,
      subCategory: normalizedSubCategory,
      subSubCategory: body.subSubCategory !== undefined ? body.subSubCategory : product.subSubCategory,
      product_info: mappedProductInfo,
      images: imagesArray.length > 0 ? imagesArray : (product.images || []),
      rating: body.ratings !== undefined ? body.ratings : (product.rating || 0),
      discountPercent: discountPercent,
    };

    // Remove undefined and null fields (but keep required ones)
    // Also remove empty strings for optional fields
    const cleanedUpdateData = {};
    Object.keys(updateData).forEach((key) => {
      const value = updateData[key];
      // Keep required fields even if undefined (they'll use existing values)
      if (key === 'title' || key === 'price' || key === 'category' || key === 'subCategory' || key === 'product_info') {
        cleanedUpdateData[key] = value;
      } else if (value !== undefined && value !== null && value !== '') {
        cleanedUpdateData[key] = value;
      }
    });
    
    // Clean product_info as well
    if (cleanedUpdateData.product_info) {
      const cleanedProductInfo = {};
      Object.keys(cleanedUpdateData.product_info).forEach((key) => {
        const value = cleanedUpdateData.product_info[key];
        if (key === 'brand' || key === 'gender') {
          // Required fields
          cleanedProductInfo[key] = value;
        } else if (value !== undefined && value !== null && value !== '') {
          cleanedProductInfo[key] = value;
        }
      });
      cleanedUpdateData.product_info = cleanedProductInfo;
    }
    
    // Use cleaned data for update
    const finalUpdateData = cleanedUpdateData;

    let updatedProduct = null;

    // If category changed, we might need to move to a different collection
    // For now, update in the same collection
    try {
      console.log('Attempting to update product with data:', JSON.stringify(finalUpdateData, null, 2));
      
      if (productType === 'mensShoe' || /men'?s?\s+shoes?/i.test(categoryToUse)) {
        updatedProduct = await MensShoe.findByIdAndUpdate(id, finalUpdateData, {
          new: true,
          runValidators: true,
        });
      } else if (productType === 'womensShoe' || /women'?s?\s+shoes?/i.test(categoryToUse)) {
        updatedProduct = await WomensShoe.findByIdAndUpdate(id, finalUpdateData, {
          new: true,
          runValidators: true,
        });
      } else if (productType === 'kidsShoe' || /kids'?\s+shoes?/i.test(categoryToUse)) {
        updatedProduct = await KidsShoe.findByIdAndUpdate(id, finalUpdateData, {
          new: true,
          runValidators: true,
        });
      } else if (productType === 'shoesAccessory' || /shoes?\s+accessories?/i.test(categoryToUse)) {
        updatedProduct = await ShoesAccessory.findByIdAndUpdate(id, finalUpdateData, {
          new: true,
          runValidators: true,
        });
      }
      
      console.log('Update successful, product:', updatedProduct ? 'found' : 'not found');
    } catch (validationError) {
      console.error('Validation error during update:', validationError);
      console.error('Validation error name:', validationError.name);
      console.error('Validation error message:', validationError.message);
      console.error('Validation error errors:', validationError.errors);
      
      // Format Mongoose validation errors
      let errorDetails = null;
      if (validationError.errors) {
        errorDetails = Object.keys(validationError.errors).map(key => ({
          field: key,
          message: validationError.errors[key].message || String(validationError.errors[key])
        }));
      }
      
      return res.status(400).json({ 
        message: "Validation error", 
        error: validationError.message || 'Validation failed',
        errorName: validationError.name,
        details: errorDetails,
        errors: validationError.errors ? Object.keys(validationError.errors).reduce((acc, key) => {
          acc[key] = validationError.errors[key].message || String(validationError.errors[key]);
          return acc;
        }, {}) : null
      });
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found or update failed" });
    }

    // Normalize the response based on product type
    let normalizedProduct;
    if (productType === 'mensShoe' || /men'?s?\s+shoes?/i.test(categoryToUse)) {
      normalizedProduct = normalizeMensShoe(updatedProduct);
    } else if (productType === 'womensShoe' || /women'?s?\s+shoes?/i.test(categoryToUse)) {
      normalizedProduct = normalizeWomensShoe(updatedProduct);
    } else if (productType === 'kidsShoe' || /kids'?\s+shoes?/i.test(categoryToUse)) {
      normalizedProduct = normalizeKidsShoe(updatedProduct);
    } else {
      // Default to mensShoe normalization
      normalizedProduct = normalizeMensShoe(updatedProduct);
    }

    res.json(normalizedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error", error: error?.message });
    }
    // Return more detailed error information
    const errorMessage = error.message || 'Unknown error';
    const errorDetails = error.errors ? Object.keys(error.errors).map(key => ({
      field: key,
      message: error.errors[key].message
    })) : null;
    
    res.status(400).json({ 
      message: "Error updating product", 
      error: errorMessage,
      details: errorDetails
    });
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

