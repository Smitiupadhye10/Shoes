import express from "express";
import multer from "multer";
import Product from "../models/Product.js";

const uploadRouter = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload 2 images
uploadRouter.post("/", upload.array("images", 2), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.path); // store paths in DB

    const newProduct = new Product({
      ...req.body,       // other product info sent in body
      product_info: {
        ...req.body.product_info,
        images: imagePaths,
      },
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading product", error });
  }
});

export default uploadRouter;
