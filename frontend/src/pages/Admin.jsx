import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus, Package, ShoppingCart } from "lucide-react";
import api from "../api/axios";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    style: "",
    images: ["", ""],
    ratings: 0,
    discount: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      if (!token) {
        navigate("/signin");
        return;
      }
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          if (res.data.isAdmin) {
            setIsAdmin(true);
          } else {
            alert("Admin access required");
            navigate("/home");
          }
        } else {
          navigate("/signin");
        }
      } catch (error) {
        navigate("/signin");
      }
    };
    checkAdmin();
  }, [token, navigate]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "products") {
        fetchProducts();
      } else {
        fetchOrders();
      }
    }
  }, [activeTab, isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      subCategory: formData.subCategory || undefined,
      subSubCategory: formData.subSubCategory || undefined,
      product_info: {
        brand: formData.brand || undefined,
        size: formData.size || undefined,
        color: formData.color || undefined,
        material: formData.material || undefined,
        style: formData.style || undefined,
      },
      images: formData.images.filter((img) => img.trim()),
      ratings: parseFloat(formData.ratings) || 0,
      discount: parseFloat(formData.discount) || 0,
    };

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/admin/products", payload);
      }
        alert(editingProduct ? "Product updated!" : "Product added!");
        setShowProductForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
        alert("Product deleted!");
        fetchProducts();
    } catch (error) {
      alert("Error deleting product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      subSubCategory: product.subSubCategory || "",
      brand: product.product_info?.brand || "",
      size: product.product_info?.size || "",
      color: product.product_info?.color || "",
      material: product.product_info?.material || "",
      style: product.product_info?.style || "",
      images: Array.isArray(product.images) ? product.images : [product.images?.image1 || "", product.images?.image2 || ""],
      ratings: product.ratings || 0,
      discount: product.discount || 0,
    });
    setShowProductForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      brand: "",
      size: "",
      color: "",
      material: "",
      style: "",
      images: ["", ""],
      ratings: 0,
      discount: 0,
    });
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
        alert("Order status updated!");
        fetchOrders();
    } catch (error) {
      alert("Error updating order status");
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "products"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            <Package className="inline mr-2" size={20} />
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "orders"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            <ShoppingCart className="inline mr-2" size={20} />
            Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowProductForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price *</label>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        >
                          <option value="">Select</option>
                          <option value="Men's Shoes">Men's Shoes</option>
                          <option value="Women's Shoes">Women's Shoes</option>
                          <option value="Kids Shoes">Kids Shoes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sub Category</label>
                        <input
                          type="text"
                          value={formData.subCategory}
                          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sub Sub Category</label>
                        <input
                          type="text"
                          value={formData.subSubCategory}
                          onChange={(e) => setFormData({ ...formData, subSubCategory: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Brand</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Nike, Adidas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Size</label>
                        <input
                          type="text"
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., 7, 8, 9 or S, M, L"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Black, Brown, White"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Material</label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Leather, Canvas, Synthetic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Style</label>
                        <input
                          type="text"
                          value={formData.style}
                          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Casual, Formal, Sports"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount}
                          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ratings</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={formData.ratings}
                          onChange={(e) => setFormData({ ...formData, ratings: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image URLs *</label>
                      <input
                        type="text"
                        required
                        placeholder="Image 1 URL"
                        value={formData.images[0]}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[0] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full px-3 py-2 border rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Image 2 URL (optional)"
                        value={formData.images[1]}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[1] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                      >
                        {loading ? "Saving..." : editingProduct ? "Update" : "Add"} Product
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          resetForm();
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            {loading && <p>Loading...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow border">
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : product.images?.image1 || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-gray-600">₹{product.price}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            {loading && <p>Loading...</p>}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {order.userId?.name || order.userId?.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-2">
                        <span>
                          {item.productId?.title || "Product"} x {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

