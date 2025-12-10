import express from "express";
import Product from "../models/Product.js";
import ContactLens from "../models/ContactLens.js";
import Accessory from "../models/Accessory.js";

const router = express.Router();

// GET /api/all-products - Returns all products, contact lenses, and accessories
router.get("/", async (req, res) => {
  try {
    const [products, contactLenses, accessories] = await Promise.all([
      Product.find({}),
      ContactLens.find({}),
      Accessory.find({})
    ]);

    // Mark type for frontend filtering if needed
    const all = [
      ...products.map(p => ({ ...p._doc, type: "product", _type: "product" })),
      ...contactLenses.map(c => ({ ...c._doc, type: "contactLens", _type: "contactLens" })),
      ...accessories.map(a => {
        const doc = a._doc;
        return {
          ...doc,
          type: "accessory",
          _type: "accessory",
          title: doc.name || doc.title,
          discount: doc.discountPercent || 0,
          ratings: doc.rating || 0,
          numReviews: doc.reviewsCount || 0
        };
      })
    ];

    res.json(all);
  } catch (error) {
    console.error("Error in allProducts:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
