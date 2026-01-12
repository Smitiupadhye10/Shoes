import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import allProductRouter from "./routes/allProductsRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import healthRouter from "./routes/healthRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Required environment variables check
if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in backend/.env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in backend/.env");
  process.exit(1);
}

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.path}`);
  console.log("🔍 Headers:", req.headers);
  console.log("🔍 Body:", req.body);
  next();
});

// Routes mounting
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlist", verifyToken, wishlistRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/all-products", allProductRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", verifyToken, cartRouter);
app.use("/api/health", healthRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend server running", timestamp: new Date() });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Fallback / 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});
