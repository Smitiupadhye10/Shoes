import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true,
      enum: ["Men's Shoes", "Women's Shoes", "Kids Shoes", "Shoes Accessories"],
     },
    subCategory: { type: String },
    subSubCategory: { type: String },
    product_info: {
      brand: { type: String },
      gender: { type: String },
      size: { type: String },
      
      frameShape: { type: String },
      frameMaterial: { type: String },
      frameColor: { type: String },
      rimDetails: { type: String },
      warranty: { type: String },
    },
    images: {
      type: [String], // array of URLs
      required: true,
      validate: [arr => arr.length >= 1, "At least one image is required"],
    },
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
