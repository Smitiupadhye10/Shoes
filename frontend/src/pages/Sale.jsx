import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import api from "../api/axios.js";

const Sale = ({ addToCart, addToWishlist }) => {
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

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all products from all categories (no category specified = all categories)
        // Use a high limit to get all products, then filter for discounted ones
        const { data } = await api.get(`/products?limit=2000&page=1`);
        
        const allProducts = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        
        // Filter products that have discounts
        const discountedProducts = allProducts.filter(product => {
          const discountPercent = Number(product.discount || product.discountPercent || 0);
          const originalPrice = Number(product.originalPrice || 0);
          const finalPrice = Number(product.price || product.finalPrice || 0);
          
          // Product has discount if:
          // 1. discountPercent > 0, OR
          // 2. originalPrice > finalPrice (meaning there's a discount), OR
          // 3. onSale flag is true
          return discountPercent > 0 || (originalPrice > 0 && originalPrice > finalPrice) || product.onSale === true;
        });

        // Calculate pagination
        const totalProducts = discountedProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = discountedProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setPagination({
          currentPage: page,
          totalPages,
          totalProducts,
          productsPerPage: limit
        });
      } catch (err) {
        console.error("Error fetching discounted products:", err);
        setError(err.message || "Failed to load sale products");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [page, limit]);

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

  return (
    <section>
      <div style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container-optic pt-0 pb-6 sm:pb-8 px-4 sm:px-6">
          <h1 className="text-optic-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-12 md:mb-16 text-center" style={{ color: 'var(--text-primary)' }}>
            Sale  
          </h1>
          {!loading && products.length > 0 && (
            <p className="text-center mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
              {pagination.totalProducts} {pagination.totalProducts === 1 ? 'product' : 'products'} on sale
            </p>
          )}

          {loading ? (
            <div className="text-center py-20 text-lg" style={{ color: 'var(--text-secondary)' }}>
              Loading sale products...
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
                    showBestSeller={true}
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
                  No discounted products found.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Sale;
