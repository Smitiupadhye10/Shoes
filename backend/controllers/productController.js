import Product from "../models/Product.js";
import ContactLens from "../models/ContactLens.js";
import Accessory from "../models/Accessory.js";
import SkincareProduct from "../models/SkincareProduct.js";

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

export const listProducts = async (req, res) => {
  try {
    const query = req.query || {};
    const andConditions = [];

    // Pagination parameters (default 18 per page)
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 18, 1);
    const skip = (page - 1) * limit;

    // Get requested category early to handle special cases (skincare, accessories) before general filtering
    const requestedCategory = typeof query.category === 'string' ? query.category : '';
    
    // Only apply general category/subCategory filters if NOT skincare or accessories
    // (these have their own specific handling)
    if (!/^skincare$/i.test(requestedCategory) && !/^accessories$/i.test(requestedCategory)) {
      if (query.category) andConditions.push({ category: { $regex: `^${query.category}$`, $options: "i" } });
      if (query.subCategory) andConditions.push({ subCategory: { $regex: `^${query.subCategory}$`, $options: "i" } });
      if (query.subSubCategory) andConditions.push({ subSubCategory: { $regex: `^${query.subSubCategory}$`, $options: "i" } });
    }

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
    // (requestedCategory already defined above)
    
    // Handle Skincare category (check before general filtering to avoid conflicts)
    if (/^skincare$/i.test(requestedCategory)) {
      // Create fresh filter conditions for skincare (don't use general andConditions)
      const skincareConditions = [];
      
      // Map subcategory filter for skincare (moisturizer, serum, cleanser, etc.)
      // Use subCategory query parameter for skincare subcategories
      if (query.subCategory) {
        const subcategoryValue = String(query.subCategory).toLowerCase().trim();
        const validSubcategories = ['moisturizer', 'serum', 'cleanser', 'facewash', 'sunscreen'];
        if (validSubcategories.includes(subcategoryValue)) {
          // Filter by category field (which stores the subcategory value like "serum", "moisturizer", etc.)
          skincareConditions.push({ 
            category: { 
              $regex: `^${subcategoryValue}$`, 
              $options: 'i' 
            } 
          });
        }
      } else {
        // If no subcategory filter, show all skincare products (no category filter)
        // This allows viewing all skincare when clicking "All Skincare"
      }
      
      // Map price filter - Skincare uses 'price' field directly
      const priceRangeFilter = query.priceRange ? String(query.priceRange).trim() : null;
      
      const skincareFilter = skincareConditions.length > 0 ? { $and: skincareConditions } : {};
      
      // Handle sorting for skincare
      let sortOption = { _id: 1 }; // default
      if (query.sort) {
        const sortValue = String(query.sort).toLowerCase();
        if (sortValue === 'price-asc') sortOption = { finalPrice: 1, price: 1 };
        else if (sortValue === 'price-desc') sortOption = { finalPrice: -1, price: -1 };
        else if (sortValue === 'newest') sortOption = { createdAt: -1 };
        else if (sortValue === 'relevance') sortOption = { _id: 1 };
      }
      
      // Use aggregation pipeline for price filtering if needed
      const pipeline = [
        { $match: skincareFilter },
        // Add calculated finalPrice field for price filtering
        { $addFields: {
          calculatedFinalPrice: {
            $cond: {
              if: { $and: [{ $ne: ["$finalPrice", null] }, { $ne: ["$finalPrice", undefined] }] },
              then: "$finalPrice",
              else: "$price"
            }
          }
        }},
        // Apply price filter using calculated finalPrice
        ...(priceRangeFilter ? (() => {
          let priceMatch = {};
          if (/^\d+\-\d+$/.test(priceRangeFilter)) {
            const [min, max] = priceRangeFilter.split('-').map(n => parseInt(n, 10));
            if (!isNaN(min) && !isNaN(max)) {
              priceMatch = {
                $expr: {
                  $and: [
                    { $gte: ["$calculatedFinalPrice", min] },
                    { $lte: ["$calculatedFinalPrice", max] }
                  ]
                }
              };
            }
          } else if (/^\d+\+$/.test(priceRangeFilter)) {
            const min = parseInt(priceRangeFilter.replace('+',''), 10);
            if (!isNaN(min)) {
              priceMatch = {
                $expr: {
                  $gte: ["$calculatedFinalPrice", min]
                }
              };
            }
          }
          return Object.keys(priceMatch).length > 0 ? [{ $match: priceMatch }] : [];
        })() : []),
        { $sort: sortOption },
        { $project: { calculatedFinalPrice: 0 } },
        { $skip: skip },
        { $limit: limit }
      ];
      
      // For count, apply the same price filter logic
      const countPipeline = [
        { $match: skincareFilter },
        { $addFields: {
          calculatedFinalPrice: {
            $cond: {
              if: { $and: [{ $ne: ["$finalPrice", null] }, { $ne: ["$finalPrice", undefined] }] },
              then: "$finalPrice",
              else: "$price"
            }
          }
        }},
        ...(priceRangeFilter ? (() => {
          let priceMatch = {};
          if (/^\d+\-\d+$/.test(priceRangeFilter)) {
            const [min, max] = priceRangeFilter.split('-').map(n => parseInt(n, 10));
            if (!isNaN(min) && !isNaN(max)) {
              priceMatch = {
                $expr: {
                  $and: [
                    { $gte: ["$calculatedFinalPrice", min] },
                    { $lte: ["$calculatedFinalPrice", max] }
                  ]
                }
              };
            }
          } else if (/^\d+\+$/.test(priceRangeFilter)) {
            const min = parseInt(priceRangeFilter.replace('+',''), 10);
            if (!isNaN(min)) {
              priceMatch = {
                $expr: {
                  $gte: ["$calculatedFinalPrice", min]
                }
              };
            }
          }
          return Object.keys(priceMatch).length > 0 ? [{ $match: priceMatch }] : [];
        })() : []),
        { $count: "total" }
      ];
      
      const [countResult, dataResult] = await Promise.all([
        SkincareProduct.aggregate(countPipeline),
        SkincareProduct.aggregate(pipeline)
      ]);
      
      const totalCount = countResult[0]?.total || 0;
      const data = dataResult;
      
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      
      // Map SkincareProduct fields to match frontend expectations
      const mappedData = data.map(d => {
        // Handle images: prioritize images array, then thumbnail, then imageUrl
        let imagesArray = [];
        if (Array.isArray(d.images) && d.images.length > 0) {
          imagesArray = d.images.filter(img => img && img.trim() !== '');
        }
        if (imagesArray.length === 0 && d.thumbnail && d.thumbnail.trim() !== '') {
          imagesArray = [d.thumbnail];
        }
        if (imagesArray.length === 0 && d.imageUrl && d.imageUrl.trim() !== '') {
          imagesArray = [d.imageUrl];
        }
        
        return {
          ...d,
          _type: 'skincare',
          title: d.productName || d.title,
          name: d.productName,
          discount: d.discountPercent || 0,
          ratings: d.rating || 0,
          numReviews: d.reviewsCount || 0,
          // Ensure images array is preserved with all fallbacks
          images: imagesArray,
          product_info: {
            brand: d.brand,
            category: d.category,
            skinType: d.skinType,
            ingredients: d.ingredients || []
          }
        };
      });
      
      return res.json({ products: mappedData, pagination });
    }
    
    // Handle Accessories category
    if (/^accessories$/i.test(requestedCategory)) {
      // Map gender filter for accessories
      // Convert "Men"/"Women" from dropdown to "men"/"women" for database matching
      if (query.gender) {
        const genderValue = String(query.gender).toLowerCase().trim();
        // Map common variations to database values (database uses: men, women, unisex)
        let dbGenderValue = genderValue;
        if (genderValue === 'man' || genderValue === 'male') dbGenderValue = 'men';
        if (genderValue === 'woman' || genderValue === 'female') dbGenderValue = 'women';
        
        // Use exact match (case-insensitive) to filter by gender
        andConditions.push({ 
          gender: { 
            $regex: `^${dbGenderValue}$`, 
            $options: 'i' 
          } 
        });
      }
      // Map price filter - Accessories should filter by finalPrice (discounted price) if available, otherwise price
      // We'll handle this in the aggregation pipeline to check both fields
      const priceRangeFilter = query.priceRange ? String(query.priceRange).trim() : null;
      
      const accessoryFilter = andConditions.length > 0 ? { $and: andConditions } : {};
      
      // Handle sorting for accessories - group by subcategory first, then gender (men, women, unisex), then apply selected sort
      // Use aggregation to add custom sort order fields for subcategory and gender
      // Make it case-insensitive to handle any case variations
      const genderSortOrder = {
        $switch: {
          branches: [
            { case: { $eq: [{ $toLower: "$gender" }, "men"] }, then: 1 },
            { case: { $eq: [{ $toLower: "$gender" }, "women"] }, then: 2 },
            { case: { $eq: [{ $toLower: "$gender" }, "unisex"] }, then: 3 }
          ],
          default: 4
        }
      };
      
      // Subcategory sort order - sort alphabetically by subcategory name
      // If subcategory is null/empty, put it at the end
      const subCategorySortOrder = {
        $cond: {
          if: { $or: [{ $eq: ["$subCategory", null] }, { $eq: ["$subCategory", ""] }] },
          then: "zzz", // Put empty subcategories at the end
          else: { $toLower: { $ifNull: ["$subCategory", "zzz"] } } // Sort alphabetically
        }
      };
      
      // Determine secondary sort based on query.sort
      let secondarySort = {};
      if (query.sort) {
        const sortValue = String(query.sort).toLowerCase();
        if (sortValue === 'price-asc') {
          secondarySort = { finalPrice: 1, price: 1 };
        } else if (sortValue === 'price-desc') {
          secondarySort = { finalPrice: -1, price: -1 };
        } else if (sortValue === 'newest') {
          secondarySort = { createdAt: -1 };
        } else {
          secondarySort = { _id: 1 };
        }
      } else {
        secondarySort = { _id: 1 };
      }
      
      // Use aggregation pipeline for custom gender sorting and price filtering
      const pipeline = [
        { $match: accessoryFilter },
        // Add calculated finalPrice field for price filtering (use finalPrice if exists, otherwise price)
        { $addFields: {
          calculatedFinalPrice: {
            $cond: {
              if: { $and: [{ $ne: ["$finalPrice", null] }, { $ne: ["$finalPrice", undefined] }] },
              then: "$finalPrice",
              else: "$price"
            }
          }
        }},
        // Apply price filter using calculated finalPrice
        ...(priceRangeFilter ? (() => {
          let priceMatch = {};
          if (/^\d+\-\d+$/.test(priceRangeFilter)) {
            const [min, max] = priceRangeFilter.split('-').map(n => parseInt(n, 10));
            if (!isNaN(min) && !isNaN(max)) {
              priceMatch = {
                $expr: {
                  $and: [
                    { $gte: ["$calculatedFinalPrice", min] },
                    { $lte: ["$calculatedFinalPrice", max] }
                  ]
                }
              };
            }
          } else if (/^\d+\+$/.test(priceRangeFilter)) {
            const min = parseInt(priceRangeFilter.replace('+',''), 10);
            if (!isNaN(min)) {
              priceMatch = {
                $expr: {
                  $gte: ["$calculatedFinalPrice", min]
                }
              };
            }
          }
          return Object.keys(priceMatch).length > 0 ? [{ $match: priceMatch }] : [];
        })() : []),
        { $addFields: { 
          genderSortOrder: genderSortOrder,
          subCategorySortOrder: subCategorySortOrder
        }},
        // Sort: subcategory first (alphabetically), then gender (men=1, women=2, unisex=3), then by selected sort option (price, newest, etc.)
        { $sort: { subCategorySortOrder: 1, genderSortOrder: 1, ...secondarySort } },
        // Remove temporary fields in final projection
        { $project: { genderSortOrder: 0, subCategorySortOrder: 0, calculatedFinalPrice: 0 } },
        { $skip: skip },
        { $limit: limit }
      ];
      
      // For count, we need to apply the same price filter logic
      const countPipeline = [
        { $match: accessoryFilter },
        { $addFields: {
          calculatedFinalPrice: {
            $cond: {
              if: { $and: [{ $ne: ["$finalPrice", null] }, { $ne: ["$finalPrice", undefined] }] },
              then: "$finalPrice",
              else: "$price"
            }
          }
        }},
        ...(priceRangeFilter ? (() => {
          let priceMatch = {};
          if (/^\d+\-\d+$/.test(priceRangeFilter)) {
            const [min, max] = priceRangeFilter.split('-').map(n => parseInt(n, 10));
            if (!isNaN(min) && !isNaN(max)) {
              priceMatch = {
                $expr: {
                  $and: [
                    { $gte: ["$calculatedFinalPrice", min] },
                    { $lte: ["$calculatedFinalPrice", max] }
                  ]
                }
              };
            }
          } else if (/^\d+\+$/.test(priceRangeFilter)) {
            const min = parseInt(priceRangeFilter.replace('+',''), 10);
            if (!isNaN(min)) {
              priceMatch = {
                $expr: {
                  $gte: ["$calculatedFinalPrice", min]
                }
              };
            }
          }
          return Object.keys(priceMatch).length > 0 ? [{ $match: priceMatch }] : [];
        })() : []),
        { $count: "total" }
      ];
      
      const [countResult, dataResult] = await Promise.all([
        Accessory.aggregate(countPipeline),
        Accessory.aggregate(pipeline)
      ]);
      
      const totalCount = countResult[0]?.total || 0;
      const data = dataResult;
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 0,
        totalProducts: totalCount,
        productsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      };
      // Map Accessory fields to match frontend expectations
      // Note: aggregation results don't have _doc, they're plain objects
      const mappedData = data.map(d => {
        return {
          ...d,
          _type: 'accessory',
          title: d.name || d.title,
          discount: d.discountPercent || 0,
          ratings: d.rating || 0,
          numReviews: d.reviewsCount || 0,
          // Ensure images array is preserved - use images array or fallback to thumbnail
          images: Array.isArray(d.images) && d.images.length > 0 
            ? d.images.filter(img => img && img.trim() !== '') 
            : (d.thumbnail && d.thumbnail.trim() !== '' ? [d.thumbnail] : []),
          // Keep gender on the root level for easy access
          gender: d.gender,
          product_info: {
            brand: d.brand,
            gender: d.gender, // Also keep in product_info for consistency
            material: d.material,
            pattern: d.pattern,
            ...(d.specifications || {})
          }
        };
      });
      return res.json({ products: mappedData, pagination });
    }
    
    if (/^contact\s+lenses$/i.test(requestedCategory)) {
      // Handle sorting for contact lenses
      let sortOption = { _id: 1 }; // default
      if (query.sort) {
        const sortValue = String(query.sort).toLowerCase();
        if (sortValue === 'price-asc') sortOption = { price: 1 };
        else if (sortValue === 'price-desc') sortOption = { price: -1 };
        else if (sortValue === 'newest') sortOption = { createdAt: -1 };
        else if (sortValue === 'relevance') sortOption = { _id: 1 };
      }
      
      const [totalCount, data] = await Promise.all([
        ContactLens.countDocuments(mongoFilter),
        ContactLens.find(mongoFilter).sort(sortOption).skip(skip).limit(limit)

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
    if (requestedCategory && !/^contact\s+lenses$/i.test(requestedCategory) && !/^accessories$/i.test(requestedCategory)) {
      // Handle sorting for regular products
      let sortOption = { _id: 1 }; // default
      if (query.sort) {
        const sortValue = String(query.sort).toLowerCase();
        if (sortValue === 'price-asc') sortOption = { price: 1 };
        else if (sortValue === 'price-desc') sortOption = { price: -1 };
        else if (sortValue === 'newest') sortOption = { createdAt: -1 };
        else if (sortValue === 'relevance') sortOption = { _id: 1 };
      }
      
      const [totalCount, data] = await Promise.all([
        Product.countDocuments(mongoFilter),
        Product.find(mongoFilter).sort(sortOption).skip(skip).limit(limit)

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
    // For accessories: map fields (images will be handled in post-processing)
    const addTypeAccessory = { 
      $addFields: { 
        _type: "accessory", 
        title: "$name", 
        discount: "$discountPercent", 
        ratings: "$rating", 
        numReviews: "$reviewsCount"
      } 
    };
    // For skincare: map fields (images will be handled in post-processing)
    const addTypeSkincare = { 
      $addFields: { 
        _type: "skincare", 
        title: "$productName",
        name: "$productName",
        discount: "$discountPercent", 
        ratings: "$rating", 
        numReviews: "$reviewsCount"
      } 
    };

    const pipeline = [
      matchStage,
      addTypeProduct,
      { $unionWith: { coll: "contactlenses", pipeline: [matchStage, addTypeContact] } },
      { $unionWith: { coll: "accesories", pipeline: [matchStage, addTypeAccessory] } },
      { $unionWith: { coll: "skincareproducts", pipeline: [matchStage, addTypeSkincare] } },
      { $sort: { _id: 1 } },
      { $facet: { data: [ { $skip: skip }, { $limit: limit } ], totalCount: [ { $count: "count" } ] } }
    ];

    const aggResult = await Product.aggregate(pipeline);
    const rawData = aggResult?.[0]?.data || [];
    
    // Post-process data to ensure images are properly formatted for all product types
    const data = rawData.map(d => {
      if (d._type === 'accessory') {
        // Handle accessory images
        let imagesArray = [];
        if (Array.isArray(d.images) && d.images.length > 0) {
          imagesArray = d.images.filter(img => img && img.trim() !== '');
        }
        if (imagesArray.length === 0 && d.thumbnail && d.thumbnail.trim() !== '') {
          imagesArray = [d.thumbnail];
        }
        return { ...d, images: imagesArray };
      } else if (d._type === 'skincare') {
        // Handle skincare images
        let imagesArray = [];
        if (Array.isArray(d.images) && d.images.length > 0) {
          imagesArray = d.images.filter(img => img && img.trim() !== '');
        }
        if (imagesArray.length === 0 && d.thumbnail && d.thumbnail.trim() !== '') {
          imagesArray = [d.thumbnail];
        }
        if (imagesArray.length === 0 && d.imageUrl && d.imageUrl.trim() !== '') {
          imagesArray = [d.imageUrl];
        }
        return { ...d, images: imagesArray };
      }
      // For products and contact lenses, images should already be in correct format
      return d;
    });

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
    let product = await Product.findById(req.params.id);
    if (!product) {
      product = await ContactLens.findById(req.params.id);
      if (!product) {
        product = await Accessory.findById(req.params.id);
        if (!product) {
        product = await SkincareProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        // Map SkincareProduct fields to match frontend expectations
        const doc = product._doc;
        // Handle images: prioritize images array, then thumbnail, then imageUrl
        let imagesArray = [];
        if (Array.isArray(doc.images) && doc.images.length > 0) {
          imagesArray = doc.images.filter(img => img && img.trim() !== '');
        }
        if (imagesArray.length === 0 && doc.thumbnail && doc.thumbnail.trim() !== '') {
          imagesArray = [doc.thumbnail];
        }
        if (imagesArray.length === 0 && doc.imageUrl && doc.imageUrl.trim() !== '') {
          imagesArray = [doc.imageUrl];
        }
        
        return res.json({
          ...doc,
          _type: "skincare",
          title: doc.productName || doc.title,
          name: doc.productName,
          discount: doc.discountPercent || 0,
          ratings: doc.rating || 0,
          numReviews: doc.reviewsCount || 0,
          // Ensure images array is preserved with all fallbacks
          images: imagesArray,
          product_info: {
            brand: doc.brand,
            category: doc.category,
            skinType: doc.skinType,
            ingredients: doc.ingredients || []
          }
        });
        }
        // Map Accessory fields to match frontend expectations
        const doc = product._doc;
        return res.json({
          ...doc,
          _type: "accessory",
          title: doc.name || doc.title,
          discount: doc.discountPercent || 0,
          ratings: doc.rating || 0,
          numReviews: doc.reviewsCount || 0,
          // Ensure images array is preserved
          images: Array.isArray(doc.images) && doc.images.length > 0 
            ? doc.images.filter(img => img && img.trim() !== '') 
            : (doc.thumbnail && doc.thumbnail.trim() !== '' ? [doc.thumbnail] : []),
          product_info: {
            brand: doc.brand,
            gender: doc.gender,
            material: doc.material,
            pattern: doc.pattern,
            ...doc.specifications
          }
        });
      }
      return res.json({ ...product._doc, _type: "contactLens" });
    }
    res.json({ ...product._doc, _type: "product" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
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
    
    // Handle Skincare facets
    if (/^skincare$/i.test(requestedCategory)) {
      // Map subcategory filter for skincare (moisturizer, serum, cleanser, etc.)
      // Use subCategory query parameter for skincare subcategories
      if (query.subCategory) {
        const subcategoryValue = String(query.subCategory).toLowerCase().trim();
        const validSubcategories = ['moisturizer', 'serum', 'cleanser', 'facewash', 'sunscreen'];
        if (validSubcategories.includes(subcategoryValue)) {
          andConditions.push({ 
            category: { 
              $regex: `^${subcategoryValue}$`, 
              $options: 'i' 
            } 
          });
        }
      }
      const skincareFilter = andConditions.length > 0 ? { $and: andConditions } : {};
      
      const priceFacetStages = [
        { $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$finalPrice", 1000] }, then: "300-1000" },
                { case: { $lte: ["$finalPrice", 2000] }, then: "1001-2000" },
                { case: { $lte: ["$finalPrice", 3000] }, then: "2001-3000" },
                { case: { $lte: ["$finalPrice", 4000] }, then: "3001-4000" },
                { case: { $lte: ["$finalPrice", 5000] }, then: "4001-5000" }
              ],
              default: "5000+"
            }
          },
          count: { $sum: 1 }
        } }
      ];
      
      const [priceFacets, categoryFacets] = await Promise.all([
        SkincareProduct.aggregate([
          { $match: skincareFilter },
          { $addFields: {
            calculatedFinalPrice: {
              $cond: {
                if: { $and: [{ $ne: ["$finalPrice", null] }, { $ne: ["$finalPrice", undefined] }] },
                then: "$finalPrice",
                else: "$price"
              }
            }
          }},
          ...priceFacetStages
        ]),
        SkincareProduct.aggregate([
          { $match: skincareFilter },
          { $group: { _id: { $toUpper: "$category" }, count: { $sum: 1 } } }
        ])
      ]);
      
      const priceBucketsObj = {};
      priceFacets.forEach(f => { priceBucketsObj[f._id] = f.count; });
      const categoriesObj = {};
      categoryFacets.forEach(f => { if (f._id) categoriesObj[f._id] = f.count; });
      
      return res.json({ priceBuckets: priceBucketsObj, genders: {}, colors: categoriesObj });
    }
    
    // Handle Accessories facets
    if (/^accessories$/i.test(requestedCategory)) {
      // Map gender filter for accessories
      // Convert "Men"/"Women" from dropdown to "men"/"women" for database matching
      if (query.gender) {
        const genderValue = String(query.gender).toLowerCase().trim();
        // Map common variations to database values (database uses: men, women, unisex)
        let dbGenderValue = genderValue;
        if (genderValue === 'man' || genderValue === 'male') dbGenderValue = 'men';
        if (genderValue === 'woman' || genderValue === 'female') dbGenderValue = 'women';
        
        // Use exact match (case-insensitive) to filter by gender
        andConditions.push({ 
          gender: { 
            $regex: `^${dbGenderValue}$`, 
            $options: 'i' 
          } 
        });
      }
      const accessoryFilter = andConditions.length > 0 ? { $and: andConditions } : {};
      
      const [priceFacets, genderFacets] = await Promise.all([
        Accessory.aggregate([
          { $match: accessoryFilter },
          ...priceFacetStages
        ]),
        Accessory.aggregate([
          { $match: accessoryFilter },
          { $group: { _id: { $toUpper: "$gender" }, count: { $sum: 1 } } }
        ])
      ]);
      
      const priceBucketsObj = {};
      priceFacets.forEach(f => { priceBucketsObj[f._id] = f.count; });
      const gendersObj = {};
      genderFacets.forEach(f => { if (f._id) gendersObj[f._id] = f.count; });
      
      return res.json({ priceBuckets: priceBucketsObj, genders: gendersObj, colors: {} });
    }
    let dataAgg;
    if (/^contact\s+lenses$/i.test(requestedCategory)) {
      dataAgg = await ContactLens.aggregate([
        ...pipelineBase,
        { $facet: {
          genders: genderFacet.slice(1),
          colors: colorFacet.slice(1),
          prices: [ { $group: { _id: null, values: { $push: "$price" } } } ]
        } }
      ]);
    } else if (requestedCategory && !/^accessories$/i.test(requestedCategory)) {
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
        { $unionWith: { coll: "accesories", pipeline: [ { $match: baseMatch } ] } },
        { $facet: {
          genders: [ 
            { $group: { _id: { $toUpper: "$product_info.gender" }, count: { $sum: 1 } } },
            { $group: { _id: { $toUpper: "$gender" }, count: { $sum: 1 } } }
          ],
          colors: [ { $group: { _id: { $toUpper: "$product_info.color" }, count: { $sum: 1 } } } ],
          prices: [ { $group: { _id: null, values: { $push: "$price" } } } ]
        } }
      ]);
    }

    const gendersRaw = dataAgg?.[0]?.genders || [];
    const colorsRaw = dataAgg?.[0]?.colors || [];
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

    return res.json({ priceBuckets: priceCounts, genders, colors });
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
