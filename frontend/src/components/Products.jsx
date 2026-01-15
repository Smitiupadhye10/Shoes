// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import api from "../api/axios";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [usageDuration, setUsageDuration] = useState("");
  const [color, setColor] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/all-products");
        // Handle both array and object responses
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build unique lists for filters
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const brands = [...new Set(products.map((p) => p.product_info?.brand).filter(Boolean))];
  const usageDurations = [...new Set(products.map((p) => p.product_info?.usageDuration).filter(Boolean))];
  const colors = [...new Set(products.map((p) => p.product_info?.color).filter(Boolean))];
  const subCategories = [...new Set(products.map((p) => p.subCategory).filter(Boolean))];
  const subSubCategories = [...new Set(products.map((p) => p.subSubCategory).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter((p) => {
    return (
      (!category || p.category === category) &&
      (!brand || p.product_info?.brand === brand) &&
      (!usageDuration || p.product_info?.usageDuration === usageDuration) &&
      (!color || p.product_info?.color === color) &&
      (!subCategory || p.subCategory === subCategory) &&
      (!subSubCategory || p.subSubCategory === subSubCategory)
    );
  });

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (products.length === 0) return <p className="text-center mt-10">No products found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="p-2 border rounded" value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="p-2 border rounded" value={usageDuration} onChange={e => setUsageDuration(e.target.value)}>
          <option value="">All Usage Durations</option>
          {usageDurations.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select className="p-2 border rounded" value={color} onChange={e => setColor(e.target.value)}>
          <option value="">All Colors</option>
          {colors.map(col => <option key={col} value={col}>{col}</option>)}
        </select>
        <select className="p-2 border rounded" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
          <option value="">All SubCategories</option>
          {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
        </select>
        <select className="p-2 border rounded" value={subSubCategory} onChange={e => setSubSubCategory(e.target.value)}>
          <option value="">All SubSubCategories</option>
          {subSubCategories.map(ssc => <option key={ssc} value={ssc}>{ssc}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-gray-500 mt-10 text-center">No products found.</div>
      )}
    </div>
  );
};

export default Products;
