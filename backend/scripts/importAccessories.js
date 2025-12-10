import mongoose from "mongoose";
import Accessory from "../models/Accessory.js";
import dotenv from "dotenv";

dotenv.config();

// TODO: Replace with your actual MongoDB Atlas URI
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_ATLAS_URI";

// Example data array (replace with your actual data)
const accessories = [
  {
    productId: "ACC001",
    name: "Premium Eyeglass Case",
    brand: "RayBan",
    category: "Accessories",
    subCategory: "Cases",
    gender: "unisex",
    price: 500,
    originalPrice: 600,
    discountPercent: 16,
    images: ["https://example.com/case1.jpg"],
    thumbnail: "https://example.com/case1-thumb.jpg",
    rating: 4.5,
    ratingsCount: 120,
    reviewsCount: 85,
    stock: 50,
    colors: ["Black", "Brown", "Blue"],
    material: "Leather",
    pattern: "Solid",
    specifications: {
      type: "Hard Case",
      style: "Classic",
      usage: "Protection",
      closureType: "Zipper",
      dimensions: {
        height: "8cm",
        width: "16cm",
        depth: "4cm"
      },
      weight: "150g",
      warranty: "1 year"
    },
    description: "Premium quality eyeglass case for protection and style.",
    careInstructions: "Clean with soft cloth. Keep away from moisture.",
    isNewArrival: false,
    onSale: true,
    isFeatured: true,
    inStock: true
  },
  {
    productId: "ACC002",
    name: "Designer Sunglass Case - Men",
    brand: "Oakley",
    category: "Accessories",
    subCategory: "Cases",
    gender: "men",
    price: 800,
    originalPrice: 1000,
    discountPercent: 20,
    images: ["https://example.com/sunglass-case-men.jpg"],
    thumbnail: "https://example.com/sunglass-case-men-thumb.jpg",
    rating: 4.8,
    ratingsCount: 200,
    reviewsCount: 150,
    stock: 75,
    colors: ["Black", "Gray"],
    material: "Synthetic Leather",
    pattern: "Textured",
    specifications: {
      type: "Hard Case",
      style: "Sport",
      usage: "Protection",
      closureType: "Snap",
      dimensions: {
        height: "10cm",
        width: "18cm",
        depth: "5cm"
      },
      weight: "200g",
      warranty: "2 years"
    },
    description: "Stylish and durable sunglass case designed for men.",
    careInstructions: "Wipe clean with damp cloth.",
    isNewArrival: true,
    onSale: true,
    isFeatured: true,
    inStock: true
  },
  {
    productId: "ACC003",
    name: "Elegant Eyeglass Chain - Women",
    brand: "Vogue",
    category: "Accessories",
    subCategory: "Chains",
    gender: "women",
    price: 1200,
    originalPrice: 1500,
    discountPercent: 20,
    images: ["https://example.com/chain-women.jpg"],
    thumbnail: "https://example.com/chain-women-thumb.jpg",
    rating: 4.6,
    ratingsCount: 95,
    reviewsCount: 70,
    stock: 40,
    colors: ["Gold", "Silver", "Rose Gold"],
    material: "Metal",
    pattern: "Decorative",
    specifications: {
      type: "Chain",
      style: "Elegant",
      usage: "Convenience",
      closureType: "Magnetic",
      dimensions: {
        height: "45cm",
        width: "2mm",
        depth: "2mm"
      },
      weight: "25g",
      warranty: "6 months"
    },
    description: "Elegant eyeglass chain for women with decorative design.",
    careInstructions: "Store in provided pouch. Avoid contact with water.",
    isNewArrival: true,
    onSale: false,
    isFeatured: true,
    inStock: true
  }
  // Add more accessories as needed
];

async function importData() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
    
    // Clear existing accessories (optional - remove if you want to keep existing data)
    // await Accessory.deleteMany({});
    // console.log("Cleared existing accessories");
    
    await Accessory.insertMany(accessories);
    console.log(`Successfully imported ${accessories.length} accessories!`);
    process.exit(0);
  } catch (err) {
    console.error("Error importing accessories:", err);
    process.exit(1);
  }
}

importData();

