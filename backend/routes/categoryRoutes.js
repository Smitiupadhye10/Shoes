import express from "express";
import Category from "../models/Category.js";

const categoryRouter = express.Router();

// GET all categories
categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a new category
categoryRouter.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADD a product to a category
categoryRouter.post("/:categoryId/products", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.products.push(req.body); // add product to category
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default categoryRouter;
