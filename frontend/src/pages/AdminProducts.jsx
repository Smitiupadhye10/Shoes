import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight, Package, X } from "lucide-react";
import api from "../api/axios";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // change this for more/less per page

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
    fetchProducts();
  }, []);

  // ✅ Fetch products with sorting and error handling
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admin/products");

      // Handle both possible API response shapes
      const productsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];

      // ✅ Sort products by _id (descending → newest first)
      const sortedProducts = [...productsArray].sort((a, b) =>
        b._id.localeCompare(a._id)
      );

      setProducts(sortedProducts);
      console.log(`✅ Loaded ${sortedProducts.length} products`);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // ✅ Handle delete
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

  // ✅ Handle edit
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
      images: Array.isArray(product.images)
        ? product.images
        : [product.images?.image1 || "", product.images?.image2 || ""],
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

  // ✅ Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure required fields are present
    if (!formData.title || !formData.title.trim()) {
      alert("Title is required");
      setLoading(false);
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Price is required and must be greater than 0");
      setLoading(false);
      return;
    }
    if (!formData.category) {
      alert("Category is required");
      setLoading(false);
      return;
    }
    if (!formData.subCategory || !formData.subCategory.trim()) {
      alert("SubCategory is required");
      setLoading(false);
      return;
    }
    if (!formData.brand || !formData.brand.trim()) {
      alert("Brand is required");
      setLoading(false);
      return;
    }
    if (!formData.images || formData.images.length === 0 || !formData.images[0] || !formData.images[0].trim()) {
      alert("At least one image URL is required");
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description || "",
      category: formData.category,
      subCategory: formData.subCategory.trim(),
      subSubCategory: formData.subSubCategory ? formData.subSubCategory.trim() : undefined,
      product_info: {
        brand: formData.brand.trim(),
        size: formData.size ? formData.size.trim() : undefined,
        color: formData.color ? formData.color.trim() : undefined,
        material: formData.material ? formData.material.trim() : undefined,
        style: formData.style ? formData.style.trim() : undefined,
      },
      images: formData.images.filter((img) => img && img.trim()),
      ratings: parseFloat(formData.ratings) || 0,
      discount: parseFloat(formData.discount) || 0,
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
        alert("Product updated successfully!");
      } else {
        await api.post("/admin/products", payload);
        alert("Product added!");
      }
        setShowProductForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", JSON.stringify(error.response?.data, null, 2));
      
      const errorData = error.response?.data;
      let errorMessage = "Error saving product";
      
      if (errorData) {
        // Try to get the most descriptive error message
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.error) {
          errorMessage += `\n\nError: ${errorData.error}`;
        }
        if (errorData.received) {
          errorMessage += `\n\nReceived: ${errorData.received}`;
        }
        
        // Handle validation errors
        if (errorData.errors) {
          const errorFields = Object.keys(errorData.errors);
          errorMessage += "\n\nValidation Errors:\n" + errorFields.map(field => {
            const fieldError = errorData.errors[field];
            return `- ${field}: ${fieldError?.message || fieldError || 'Invalid value'}`;
          }).join("\n");
        }
        
        // Handle details array
        if (errorData.details && Array.isArray(errorData.details)) {
          errorMessage += "\n\nDetails:\n" + errorData.details.map(d => `- ${d.field}: ${d.message}`).join("\n");
        } else if (errorData.details) {
          errorMessage += `\n\nDetails: ${JSON.stringify(errorData.details, null, 2)}`;
        }
        
        // If no specific message, show the whole error data
        if (errorMessage === "Error saving product" && Object.keys(errorData).length > 0) {
          errorMessage += `\n\n${JSON.stringify(errorData, null, 2)}`;
        }
      } else {
        errorMessage += `\n\nStatus: ${error.response?.status || 'Unknown'}\n${error.message}`;
      }
      
      console.error("Final error message:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-optic p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Product Management</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setShowProductForm(true);
            }}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="ml-2">Add Product</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="card-optic p-4 mb-6" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-4" style={{ borderTop: '4px solid var(--text-heading)', borderRight: '4px solid transparent' }}></div>
              <p className="text-optic-body text-xl" style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="card-optic p-12 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Package className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <p className="text-optic-body text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>No products found</p>
            <p className="text-optic-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Click "Add Product" to create your first product.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="card-optic p-6 hover:shadow-xl transition-all"
                >
                  <img
                    src={
                      Array.isArray(product.images)
                        ? product.images[0]
                        : product.images?.image1 || "/placeholder.jpg"
                    }
                    alt={product.title}
                    className="w-full h-32 sm:h-40 object-contain mb-3 sm:mb-4 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  />
                  <h3 className="font-bold text-base sm:text-lg mb-2 truncate" style={{ color: 'var(--text-primary)' }}>{product.title}</h3>
                  <p className="text-lg sm:text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>₹{product.price}</p>
                  <p className="text-xs sm:text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{product.category}</p>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 btn-secondary text-xs sm:text-sm flex items-center justify-center gap-2 py-2"
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-3">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-all disabled:opacity-50"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <ChevronLeft />
                </button>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-all disabled:opacity-50"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="card-optic w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-optic-heading text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Price *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Men's Shoes">Men's Shoes</option>
                    <option value="Women's Shoes">Women's Shoes</option>
                    <option value="Kids Shoes">Kids Shoes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Sub Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="e.g., 7, 8, 9 or S, M, L"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="e.g., Black, Brown, White"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="e.g., Leather, Canvas, Synthetic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Style</label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="e.g., Casual, Formal, Sports"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Image URL 1 *</label>
                  <input
                    type="url"
                    required
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value, formData.images[1]] })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Image URL 2</label>
                  <input
                    type="url"
                    value={formData.images[1]}
                    onChange={(e) => setFormData({ ...formData, images: [formData.images[0], e.target.value] })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Ratings</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.ratings}
                    onChange={(e) => setFormData({ ...formData, ratings: e.target.value })}
                    className="w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 order-2 sm:order-1"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="btn-secondary order-1 sm:order-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
