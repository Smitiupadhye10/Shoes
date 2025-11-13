import express from "express";
import { adminAuth } from "../middleware/adminMiddleware.js";
import { listAllProducts, updateProduct, deleteProduct, listOrders, updateOrderStatus } from "../controllers/adminController.js";
import { createProduct } from "../controllers/productController.js";

const adminRouter = express.Router();

// Product management (admin only)
adminRouter.get("/products" , listAllProducts);
adminRouter.post("/products",   createProduct);
adminRouter.put("/products/:id",   updateProduct);
adminRouter.delete("/products/:id",   deleteProduct);

// Order management (admin only)
adminRouter.get("/orders",   listOrders);
adminRouter.put("/orders/:id/status",   updateOrderStatus);

export default adminRouter;

