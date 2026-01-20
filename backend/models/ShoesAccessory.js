import mongoose from "mongoose";

const { Schema } = mongoose;

const shoesAccessorySchema = new Schema({

  // BASIC INFO
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },

  // PRICING
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  finalPrice: { type: Number, min: 0 },

  // CATEGORY
  category: {
    type: String,
    default: "Shoes Accessories",
    immutable: true
  },

  // SUB CATEGORY
  subCategory: { type: String, trim: true },

  // PRODUCT INFO
  product_info: {
    brand: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },

    material: { type: String, trim: true },     // cotton, gel, foam, plastic, leather
    accessoryType: { type: String, trim: true },// laces, insoles, cleaner, spray, socks
    usage: { type: String, trim: true },         // sports, casual, formal, travel
    warranty: { type: String, trim: true },
    color: { type: String, trim: true }
  },

  // IMAGES
  images: [{ type: String }],
  thumbnail: { type: String },

  // INVENTORY
  stock: { type: Number, default: 0, min: 0 },
  inStock: { type: Boolean, default: true },

  // RATINGS
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0, min: 0 },
  reviewsCount: { type: Number, default: 0, min: 0 },

  // FLAGS
  isNewArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }

}, { timestamps: true });


// FINAL PRICE AUTO CALCULATION
shoesAccessorySchema.pre("save", function (next) {
  if (this.discountPercent > 0 && this.price) {
    this.finalPrice = this.price - (this.price * this.discountPercent / 100);
  } else {
    this.finalPrice = this.price;
  }
  next();
});


// INDEXES
shoesAccessorySchema.index({ category: 1 });
shoesAccessorySchema.index({ title: "text", description: "text", "product_info.brand": "text" });


const ShoesAccessory = mongoose.model(
  "ShoesAccessory",
  shoesAccessorySchema,
  "shoes_accessories"
);

export default ShoesAccessory;
