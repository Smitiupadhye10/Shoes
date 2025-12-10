import mongoose from 'mongoose';

const skincareProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['moisturizer', 'serum', 'cleanser', 'facewash', 'sunscreen'],
    default: 'moisturizer'
  },
  skinType: {
    type: String,
    enum: ['all', 'dry', 'oily', 'combination', 'sensitive', 'normal'],
    default: 'all'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  ingredients: {
    type: [String], // array of ingredient names
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  thumbnail: {
    type: String
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate finalPrice before saving
skincareProductSchema.pre('save', function (next) {
  if (this.discountPercent > 0 && this.price) {
    this.finalPrice = this.price - (this.price * this.discountPercent / 100);
  } else if (this.originalPrice && this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
  }
  this.updatedAt = Date.now();
  next();
});

// Indexes
skincareProductSchema.index({ category: 1 });
skincareProductSchema.index({ brand: 1 });
skincareProductSchema.index({ productName: 'text', brand: 'text', description: 'text' });

const SkincareProduct = mongoose.model('SkincareProduct', skincareProductSchema, 'skincareproducts');

export default SkincareProduct;

