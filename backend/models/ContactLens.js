import mongoose from "mongoose";

const contactLensSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    category: { type: String, required: true, enum: ['Contact Lenses'] },
    subCategory: { type: String },
    subSubCategory: { type: String },
    product_info: {
      brand: { type: String, trim: true },
      lensType: { type: String },
      usageDuration: { type: String, required: true },
      material: { type: String },
      packaging: { type: String },
      color: { type: String },
      waterContent: { type: Number },
      powerRange: { type: String },
      baseCurve: { type: Number },
      diameter: { type: Number },
      warranty: { type: String }
    },
    images: {
      type: [String],
      required: true,
      validate: [arr => arr.length >= 1, "At least one image is required"],
    },
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

const ContactLens = mongoose.model("ContactLens", contactLensSchema);
export default ContactLens;
