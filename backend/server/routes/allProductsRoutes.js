import express from "express";
import Product from "../models/Product.js";
import ContactLens from "../models/ContactLens.js";

const router = express.Router();

// GET /api/all-products - Returns all products and contact lenses
router.get("/", async (req, res) => {
  try {
    const [products, contactLenses] = await Promise.all([
      Product.find({}),
      ContactLens.find({})
    ]);
    
    // Mark type for frontend filtering if needed
    const all = [
      ...products.map(p => ({ ...p._doc, type: "product" })),
      ...contactLenses.map(c => ({ ...c._doc, type: "contactLens" }))
    ];
    
    res.json(all);
  } catch (error) {
    console.error('Error in allProducts:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
