import express from "express";
import ContactLens from "../models/ContactLens.js";

const contactLensRouter = express.Router();

// POST /api/contact-lenses - Add a new contact lens
contactLensRouter.post("/", async (req, res) => {
  try {
    const lens = new ContactLens(req.body);
    await lens.save();
    res.status(201).json({ success: true, lens });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// (Optional) GET all contact lenses
contactLensRouter.get("/", async (req, res) => {
  try {
    const lenses = await ContactLens.find();
    res.json({ success: true, lenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default contactLensRouter;
