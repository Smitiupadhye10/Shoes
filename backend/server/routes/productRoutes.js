import express from "express";
import { listProducts, createProduct, getProductById, getFacets, adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "../controllers/productController.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", listProducts);
router.get("/facets", getFacets);
router.post("/", createProduct);
router.get("/:id", getProductById);

// Admin (mounted at /api/products)
router.get("/admin", verifyToken, requireAdmin, adminListProducts);
router.post("/admin", verifyToken, requireAdmin, adminCreateProduct);
router.put("/admin/:id", verifyToken, requireAdmin, adminUpdateProduct);
router.delete("/admin/:id", verifyToken, requireAdmin, adminDeleteProduct);

export default router;
