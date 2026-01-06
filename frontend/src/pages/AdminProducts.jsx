import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight, Package, X } from "lucide-react";

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
    gender: "",
    size: "",
    frameShape: "",
    frameMaterial: "",
    frameColor: "",
    rimDetails: "",
    warranty: "",
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
      const res = await fetch("http://localhost:4000/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized access. Please log in as admin.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

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
      const res = await fetch(`http://localhost:4000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        alert("Error deleting product");
      }
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
      gender: product.product_info?.gender || "",
      size: product.product_info?.size || "",
      frameShape: product.product_info?.frameShape || "",
      frameMaterial: product.product_info?.frameMaterial || "",
      frameColor: product.product_info?.frameColor || "",
      rimDetails: product.product_info?.rimDetails || "",
      warranty: product.product_info?.warranty || "",
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
      gender: "",
      size: "",
      frameShape: "",
      frameMaterial: "",
      frameColor: "",
      rimDetails: "",
      warranty: "",
      images: ["", ""],
      ratings: 0,
      discount: 0,
    });
  };

  // ✅ Handle form submit (Add / Update)
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
        gender: formData.gender || undefined,
        size: formData.size || undefined,
        frameShape: formData.frameShape || undefined,
        frameMaterial: formData.frameMaterial || undefined,
        frameColor: formData.frameColor || undefined,
        rimDetails: formData.rimDetails || undefined,
        warranty: formData.warranty || undefined,
      },
      images: formData.images.filter((img) => img.trim()),
      ratings: parseFloat(formData.ratings) || 0,
      discount: parseFloat(formData.discount) || 0,
    };

    try {
      const url = editingProduct
        ? `http://localhost:4000/api/admin/products/${editingProduct._id}`
        : "http://localhost:4000/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingProduct ? "Product updated successfully!" : "Product added!");
        setShowProductForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await res.json();
        alert(error.message || "Error saving product");
      }
    } catch (error) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-optic p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-optic-heading text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Product Management</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setShowProductForm(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Product
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="w-full h-40 object-contain mb-4 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  />
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{product.title}</h3>
                  <p className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>₹{product.price}</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{product.category}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      <Trash2 size={16} />
                      Delete
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="card-optic w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
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
                    className="w-full p-3 rounded-lg border transition-colors"
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
                  className="w-full p-3 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Eyeglasses">Eyeglasses</option>
                    <option value="Sunglasses">Sunglasses</option>
                    <option value="Computer Glasses">Computer Glasses</option>
                    <option value="Contact Lenses">Contact Lenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Sub Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Frame Material</label>
                  <input
                    type="text"
                    value={formData.frameMaterial}
                    onChange={(e) => setFormData({ ...formData, frameMaterial: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Image URL 1 *</label>
                  <input
                    type="url"
                    required
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value, formData.images[1]] })}
                    className="w-full p-3 rounded-lg border transition-colors"
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
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Warranty</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
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
                  className="btn-secondary"
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
