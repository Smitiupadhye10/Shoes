import mongoose from 'mongoose';

const { Schema } = mongoose;

// === Base Schema (Common fields for all Men's Shoes) ===
const mensShoeSchema = new Schema({
  // CORE FIELDS
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  finalPrice: { type: Number, min: 0 },

  // CATEGORIZATION & TYPE
  category: { type: String, default: "Men's Shoes", immutable: true },
  subCategory: { 
    type: String, 
    required: true, 
    enum: ['Formal', 'Sneakers', 'Boots', 'Loafers', 'Sandals'],
    description: 'The main shoe category'
  },
  subSubCategory: { type: String, trim: true }, // e.g., 'Oxfords', 'Running', 'Chelsea'
  
  // PRODUCT INFO
  product_info: {
    brand: { type: String, required: true, trim: true },
    gender: { type: String, default: 'Men', required: true, enum: ['Men'] }, // Constrained to Men
    color: { type: String, trim: true },
    
    // Material Info
    outerMaterial: { type: String, trim: true }, 
    soleMaterial: { type: String, trim: true },
    innerMaterial: { type: String, trim: true },
    
    // Common Style
    closureType: { type: String, enum: ['Lace-Up', 'Slip-On', 'Velcro', 'Buckle', 'Zipper'] },
    heelHeight: { type: String, trim: true }, 
    toeShape: { type: String, enum: ['Round', 'Pointed', 'Almond', 'Square'] },
    
    warranty: { type: String, trim: true }
  },

  // IMAGES - Support both formats for compatibility
  images: [{
    type: String
  }],
  thumbnail: {
    type: String
  },
  // Legacy format support
  Images: {
    image1: { type: String },
    image2: { type: String },
    additionalImages: [{ type: String }]
  },

  // INVENTORY
  sizes_inventory: [{
    _id: false,
    size: { type: String, required: true }, // e.g., 'US 9', 'EU 42', '9', '42'
    quantity: { type: Number, default: 0, min: 0 }
  }],

  // RATINGS & REVIEWS
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0, min: 0 },
  reviewsCount: { type: Number, default: 0, min: 0 },

  // STOCK & AVAILABILITY
  stock: { type: Number, default: 0, min: 0 },
  inStock: { type: Boolean, default: true },
  isNewArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

// Pre-save hook to calculate finalPrice
mensShoeSchema.pre('save', function (next) {
  if (this.discountPercent > 0 && this.price) {
    this.finalPrice = this.price - (this.price * this.discountPercent / 100);
  } else if (this.originalPrice && this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
  }
  this.updatedAt = Date.now();
  
  // Normalize images array from legacy Images format if needed
  if (this.images && this.images.length === 0 && this.Images) {
    const imgArray = [];
    if (this.Images.image1) imgArray.push(this.Images.image1);
    if (this.Images.image2) imgArray.push(this.Images.image2);
    if (this.Images.additionalImages && Array.isArray(this.Images.additionalImages)) {
      imgArray.push(...this.Images.additionalImages.filter(img => img));
    }
    if (imgArray.length > 0) {
      this.images = imgArray;
    }
  }
  
  next();
});

// Indexes for better query performance
mensShoeSchema.index({ category: 1, subCategory: 1 });
mensShoeSchema.index({ category: 1, 'product_info.gender': 1 });
mensShoeSchema.index({ subCategory: 1 });
mensShoeSchema.index({ 'product_info.brand': 1 });
mensShoeSchema.index({ title: 'text', description: 'text', 'product_info.brand': 'text' });

// Virtual for checking if product has available stock
mensShoeSchema.virtual('hasStock').get(function() {
  if (this.sizes_inventory && this.sizes_inventory.length > 0) {
    return this.sizes_inventory.some(si => si.quantity > 0);
  }
  return this.stock > 0 || this.inStock;
});

const MensShoe = mongoose.model('MensShoe', mensShoeSchema, 'mensshoes');

export default MensShoe;

