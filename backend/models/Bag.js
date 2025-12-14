import mongoose from 'mongoose';

const bagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "handbag",
      "backpack",
      "sling bag",
      "tote bag",
      "duffle bag",
      "wallet",
      "laptop bag",
      "travel bag", 
      "clutch",
      "shoulder bag" 
    ]
  },
  gender: {
    type: String,
    enum: ["men", "women", "unisex"],
    default: "unisex"
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  colors: {
    type: [String],
    default: []
  },
  material: {
    type: String,
    enum: [
      "leather",
      "faux leather",
      "canvas",
      "nylon",
      "polyester",
      "cotton",
      "synthetic",
      "jute",
      "suede",
      "other"
    ],
    default: "other"
  },
  size: {
    type: String,
    enum: ["small", "medium", "large", "extra large"],
    default: "medium"
  },
  capacityLiters: {
    type: Number, // useful for backpacks & travel bags
  },
  stock: {
    type: Number,
    default: 0
  },
  images: {
    type: [String], // Cloudinary URLs
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  features: {
    type: [String], // e.g., ["Water-resistant", "Laptop compartment"]
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate finalPrice
bagSchema.pre('save', function (next) {
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
bagSchema.index({ category: 1, gender: 1 });
bagSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Bag = mongoose.model('Bag', bagSchema, 'bags');
export default Bag;

