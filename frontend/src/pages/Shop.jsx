import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import api from "../api/axios.js";
import { Eye, Sun, Monitor, Phone } from "lucide-react";

const Shop = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    productsPerPage: 18
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(18);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams();
        if (search) qs.set("search", search);
        // Don't set category - fetch from all categories
        qs.set("page", page);
        qs.set("limit", limit);

        const { data } = await api.get(`/products?${qs.toString()}`);

        setProducts(Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []));
        setPagination(
          data.pagination || {
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
            productsPerPage: limit
          }
        );
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, search]);

  const goToPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const pages = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);

    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-medium transition-all text-sm sm:text-base ${
              p === current
                ? "scale-110"
                : "hover:scale-105"
            }`}
            style={{ 
              backgroundColor: p === current ? 'var(--text-primary)' : 'transparent',
              color: p === current ? 'var(--bg-secondary)' : 'var(--text-primary)',
              border: p === current ? 'none' : `2px solid var(--text-primary)`
            }}
          >
            {p}
          </button>
        ))}
      </div>
    );
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "eyeglasses":
        return <Eye className="w-5 h-5" />;
      case "sunglasses":
        return <Sun className="w-5 h-5" />;
      case "computer glasses":
        return <Monitor className="w-5 h-5" />;
      case "contact lenses":
        return <Phone className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  return (
    <section>
      <div style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic pt-0 pb-6 sm:pb-8 px-4 sm:px-6">
          <h1 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-12 md:mb-16 text-center" style={{ color: 'var(--text-primary)' }}>
            {search ? `Search Results for: "${search}"` : 'All Products'}
          </h1>
          {search && products.length > 0 && (
            <p className="text-center mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
              Found {pagination.totalProducts || products.length} {pagination.totalProducts === 1 ? 'product' : 'products'}
            </p>
          )}

          {loading ? (
            <div className="text-center py-20 text-lg" style={{ color: 'var(--text-secondary)' }}>
              Loading products...
            </div>
        ) : error ? (
          <div className="text-center py-20 text-lg text-red-600">{error}</div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  addToCart={() => addToCart(product)}
                  addToWishlist={() => addToWishlist(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center px-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                      pagination.currentPage <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: pagination.currentPage <= 1 ? 'var(--border-color)' : 'var(--text-primary)',
                      color: pagination.currentPage <= 1 ? 'var(--text-secondary)' : 'var(--bg-secondary)'
                    }}
                  >
                    Previous
                  </button>

                  {renderPageNumbers()}

                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                      pagination.currentPage >= pagination.totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: pagination.currentPage >= pagination.totalPages ? 'var(--border-color)' : 'var(--text-primary)',
                      color: pagination.currentPage >= pagination.totalPages ? 'var(--text-secondary)' : 'var(--bg-secondary)'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-20 text-lg" style={{ color: 'var(--text-secondary)' }}>
                No products found.
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </section>
  );
};

export default Shop;
