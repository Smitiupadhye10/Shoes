import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ContactLens from "../models/ContactLens.js";

export const listAllProducts = async (req, res) => {
  try {
    // Get ALL products and contact lenses for admin dashboard
    const [products, contactLenses] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      ContactLens.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    // Tag each item with a _type field so frontend can distinguish
    const taggedProducts = products.map((p) => ({ ...p, _type: "product" }));
    const taggedContactLenses = contactLenses.map((c) => ({ ...c, _type: "contactLens" }));

    res.json([...taggedProducts, ...taggedContactLenses]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    // Normalize images
    let imagesArray = [];
    if (Array.isArray(body.images)) imagesArray = body.images.filter(Boolean);
    if (!imagesArray.length && body.Images) {
      const { image1, image2 } = body.Images || {};
      imagesArray = [image1, image2].filter(Boolean);
    }
    if (!imagesArray.length && body.image1) {
      imagesArray = [body.image1, body.image2].filter(Boolean);
    }

    const updateData = {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      subCategory: body.subCategory,
      subSubCategory: body.subSubCategory,
      product_info: body.product_info || {},
      images: imagesArray.length > 0 ? imagesArray : undefined,
      ratings: body.ratings,
      discount: body.discount,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error", error: error?.message });
    }
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    console.log('🔍 listOrders called');
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    console.log('🔍 Filter:', filter);
    console.log('🔍 Order model exists:', !!Order);
    
    // First try without populate to see if basic query works
    console.log('🔍 Trying basic Order.find...');
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    console.log('📊 Orders found (no populate):', orders.length);
    
    // If we have orders, try to populate them
    if (orders.length > 0) {
      try {
        console.log('🔍 Trying to populate...');
        const populatedOrders = await Order.find(filter)
          .populate("userId", "name email")
          .populate("items.productId")
          .sort({ createdAt: -1 });
        console.log('📊 Populated orders:', populatedOrders.length);
        res.json(populatedOrders);
      } catch (populateError) {
        console.error('❌ Populate error:', populateError);
        // Return orders without populate if populate fails
        res.json(orders);
      }
    } else {
      res.json(orders);
    }
  } catch (error) {
    console.error('❌ Error in listOrders:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "processing", "delivered", "cancel"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

