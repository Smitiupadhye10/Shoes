import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductsCategoryFilter() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");

  useEffect(() => {
    api.get("/products")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Build unique lists from products
  const categories = [...new Set(products.map((p) => p.category))];
  const subCategories = [...new Set(products.filter(
      (p) => !category || p.category === category
    ).map((p) => p.subCategory)
  )];
  const subSubCategories = [...new Set(products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!subCategory || p.subCategory === subCategory)
    ).map((p) => p.subSubCategory)
  )];

  // Filter products according to selection
  const filteredProducts = products.filter((p) => {
    return (
      (!category || p.category === category) &&
      (!subCategory || p.subCategory === subCategory) &&
      (!subSubCategory || p.subSubCategory === subSubCategory)
    );
  });

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category Filter */}
        <select
          className="p-2 border rounded"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
            setSubSubCategory("");
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* SubCategory Filter */}
        <select
          className="p-2 border rounded"
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setSubSubCategory("");
          }}
          disabled={!category}
        >
          <option value="">All SubCategories</option>
          {subCategories
            .filter((sc) => sc)
            .map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
        </select>

        {/* SubSubCategory Filter */}
        <select
          className="p-2 border rounded"
          value={subSubCategory}
          onChange={(e) => setSubSubCategory(e.target.value)}
          disabled={!subCategory}
        >
          <option value="">All SubSubCategories</option>
          {subSubCategories
            .filter((ssc) => ssc)
            .map((ssc) => (
              <option key={ssc} value={ssc}>
                {ssc}
              </option>
            ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="p-4 bg-white shadow rounded">
            <img
              src={product.images?.image1 || product.Images?.image1}
              alt={product.title}
              className="h-48 w-full object-cover rounded mb-2"
            />
            <h3 className="font-bold">{product.title}</h3>
            <p>{product.description}</p>
            <div className="text-indigo-600 font-semibold my-1">
              ₹{product.price}
            </div>
            <div className="text-xs text-gray-500">
              {product.category} / {product.subCategory} / {product.subSubCategory}
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-gray-500 mt-10 text-center">No products found.</div>
      )}
    </div>
  );
}
