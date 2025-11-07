import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Eye, Sun, Monitor, Phone } from 'lucide-react';

const Shop = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalProducts: 0, productsPerPage: 18 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(18);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (category) qs.set("category", category);
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    const url = `http://localhost:4000/api/products?${qs.toString()}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setPagination(data.pagination || { currentPage: page, totalPages: 0, totalProducts: 0, productsPerPage: limit });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, search, category]);

  const goToPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const total = pagination.totalPages || 0;
    const current = pagination.currentPage || 1;
    const pages = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(current - 1)}
          disabled={current <= 1}
          className={`px-3 py-1 rounded border ${current <= 1 ? "text-gray-400 border-gray-200" : "text-gray-700 hover:bg-gray-50"}`}
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 rounded border ${p === current ? "bg-gray-900 text-white border-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => goToPage(current + 1)}
          disabled={current >= total}
          className={`px-3 py-1 rounded border ${current >= total ? "text-gray-400 border-gray-200" : "text-gray-700 hover:bg-gray-50"}`}
        >
          Next
        </button>
      </div>
    );
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'Eyeglasses': return <Eye className="w-5 h-5" />;
      case 'Sunglasses': return <Sun className="w-5 h-5" />;
      case 'Computer glasses': return <Monitor className="w-5 h-5" />;
      case 'Contact lenses': return <Phone className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">All Products</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <>
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                  {getCategoryIcon(category)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {category} ({categoryProducts.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={() => addToCart(product)}
                    addToWishlist={() => addToWishlist(product)}
                  />
                ))}
              </div>
            </div>
          ))}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">{renderPageNumbers()}</div>
          )}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Shop;
