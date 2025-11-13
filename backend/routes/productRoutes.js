import express from "express";
import { listProducts, createProduct, getProductById, getFacets, adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "../controllers/productController.js";


const productRouter = express.Router();

// Public
productRouter.get("/", listProducts);
productRouter.get("/facets", getFacets);
productRouter.post("/", createProduct);
productRouter.get("/:id", getProductById);

// Admin (mounted at /api/products)
productRouter.get("/admin",   adminListProducts);
productRouter.post("/admin",   adminCreateProduct);
productRouter.put("/admin/:id",   adminUpdateProduct);
productRouter.delete("/admin/:id",   adminDeleteProduct);

export default productRouter;
