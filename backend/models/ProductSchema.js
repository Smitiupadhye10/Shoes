import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
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
      image1: { type: String, required: true },
      image2: { type: String },
    },
  },
  { timestamps: true }
);

export default productSchema;
