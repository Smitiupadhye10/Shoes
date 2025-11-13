import mongoose from "mongoose";
import ContactLens from "../models/ContactLens.js";

// TODO: Replace with your actual MongoDB Atlas URI
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_ATLAS_URI";

// Example data array (replace with your actual data)
const contactLenses = [
  {
    title: "Acme Daily Soft Lenses",
    price: 1200,
    description: "Comfortable daily disposable lenses.",
    category: "Contact Lenses",
    subCategory: "Daily",
    subSubCategory: "Soft",
    product_info: {
      brand: "Acme",
      lensType: "Soft",
      usageDuration: "Daily Disposable",
      material: "Hydrogel",
      packaging: "Box of 30",
      color: "Clear",
      waterContent: 58,
      powerRange: "-0.50 to -12.00",
      baseCurve: 8.6,
      diameter: 14.2,
      warranty: "1 year"
    },
    images: ["https://example.com/lens1.jpg"],
    ratings: 4.5,
    discount: 10
  }
  // Add more objects as needed
];

async function importData() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await ContactLens.insertMany(contactLenses);
    console.log("Contact lens data imported successfully!");
    process.exit();
  } catch (err) {
    console.error("Error importing data:", err);
    process.exit(1);
  }
}

importData();
