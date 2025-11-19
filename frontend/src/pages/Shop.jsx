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

  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams();
        if (search) qs.set("search", search);
        if (category) qs.set("category", category);
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
  }, [page, limit, search, category]);

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
      <div className="flex items-center gap-3 mt-10 justify-center">
        <button
          onClick={() => goToPage(current - 1)}
          disabled={current <= 1}
          className={`px-4 py-2 rounded-lg border ${
            current <= 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-4 py-2 rounded-lg border ${
              p === current
                ? "bg-gray-900 text-white border-gray-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => goToPage(current + 1)}
          disabled={current >= total}
          className={`px-4 py-2 rounded-lg border ${
            current >= total
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-10 text-center text-gray-900">
        All Products
      </h1>

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 text-lg">{error}</div>
      ) : (
        <>
          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {getCategoryIcon(category)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {category} ({products.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
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

          {pagination.totalPages > 1 && renderPageNumbers()}

          {products.length === 0 && (
            <div className="text-center py-20 text-gray-600 text-lg">
              No products found.
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Shop;
