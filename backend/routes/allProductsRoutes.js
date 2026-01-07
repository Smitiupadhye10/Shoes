import express from "express";
import MensShoe from "../models/MensShoe.js";
import WomensShoe from "../models/WomensShoe.js";
import KidsShoe from "../models/KidsShoe.js";

const router = express.Router();

// GET /api/all-products - Returns all shoes (Men's, Women's, and Kids)
router.get("/", async (req, res) => {
  try {
    const [mensShoes, womensShoes, kidsShoes] = await Promise.all([
      MensShoe.find({}),
      WomensShoe.find({}),
      KidsShoe.find({})
    ]);

    // Mark type for frontend filtering if needed
    const all = [
      ...mensShoes.map(p => ({ ...p._doc, type: "mensShoe" })),
      ...womensShoes.map(c => ({ ...c._doc, type: "womensShoe" })),
      ...kidsShoes.map(k => ({ ...k._doc, type: "kidsShoe" }))
    ];

    res.json(all);
  } catch (error) {
    console.error("Error in allProducts:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
