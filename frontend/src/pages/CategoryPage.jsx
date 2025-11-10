import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const PRICE_RANGES = [
  "300-1000",
  "1001-2000",
  "2001-3000",
  "3001-4000",
  "4001-5000",
  "5000+",
];

const GENDERS = ["Men", "Women", "Unisex", "Kids"];
const COLORS_FALLBACK = ["Blue", "Green", "Brown", "Gray", "Clear", "Hazel"]; // used if facets not loaded
export default function CategoryPage({ addToCart, addToWishlist }) {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalProducts: 0, productsPerPage: 18 });
  const [facets, setFacets] = useState({ priceBuckets: {}, genders: {}, colors: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "relevance");
  const [expanded, setExpanded] = useState({ price: true, gender: true, color: true });

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "18", 10);

  const categoryLower = (category || "").toLowerCase();
  const isContactLenses = useMemo(() => /contact\s+lenses/i.test(category || ""), [category]);

  useEffect(() => {
    setVisible(false);
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(searchParams);
    if (category) params.set("category", category);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const url = `http://localhost:4000/api/products?${params.toString()}`;

    const fadeTimeout = setTimeout(() => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data.products) ? data.products : []);
          setPagination(
            data.pagination || { currentPage: page, totalPages: 0, totalProducts: 0, productsPerPage: limit }
          );
          setTimeout(() => setVisible(true), 80);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 80);

    // Fetch facets (exclude page/limit to avoid affecting counts)
    const facetParams = new URLSearchParams(searchParams);
    if (category) facetParams.set("category", category);
    facetParams.delete("page");
    facetParams.delete("limit");
    fetch(`http://localhost:4000/api/products/facets?${facetParams.toString()}`)
      .then((r) => r.json())
      .then((f) => setFacets({
        priceBuckets: f?.priceBuckets || {},
        genders: f?.genders || {},
        colors: f?.colors || {},
      }))
      .catch(() => {});

    return () => clearTimeout(fadeTimeout);
  }, [category, page, limit, searchParams]);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === null || value === undefined || value === "") params.delete(key);
    else params.set(key, value);
    // Reset to first page when filters change
    params.set("page", "1");
    setSearchParams(params);
  };

  const setParamNoReset = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === null || value === undefined || value === "") params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    ["priceRange", "gender", "color"].forEach((k) => params.delete(k));
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearKey = (k) => setParam(k, null);

  const activePrice = searchParams.get("priceRange") || "";
  const activeGender = searchParams.get("gender") || "";
  const activeColor = searchParams.get("color") || "";

  const goToPage = (p) => {
    if (p < 1 || p > (pagination.totalPages || 1)) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const total = pagination.totalPages || 0;
    const current = pagination.currentPage || 1;
    const pages = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-10 mb-6">
        <button
          onClick={() => goToPage(current - 1)}
          disabled={current <= 1}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
            current <= 1 
              ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50" 
              : "text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-400 hover:shadow-md"
          }`}
        >
          ← Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${
              p === current 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg transform scale-110" 
                : "text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-400 hover:shadow-md"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => goToPage(current + 1)}
          disabled={current >= total}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
            current >= total 
              ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50" 
              : "text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-400 hover:shadow-md"
          }`}
        >
          Next →
        </button>
      </div>
    );
  };

  const FiltersSidebar = () => {
    const priceCounts = facets.priceBuckets || {};
    const genderCounts = facets.genders || {};
    const colorCounts = facets.colors || {};
    const colorsList = Object.keys(colorCounts).length ? Object.keys(colorCounts) : COLORS_FALLBACK;

    const Section = ({ title, id, children }) => (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <button
          onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-200"
        >
          <span className="font-semibold text-gray-800">{title}</span>
          <span className={`text-lg font-bold transition-transform duration-200 ${expanded[id] ? 'rotate-180' : ''} text-indigo-600`}>
            ▼
          </span>
        </button>
        {expanded[id] && <div className="px-4 pb-4 pt-2 transition-opacity duration-200">{children}</div>}
      </div>
    );

    return (
      <aside className="space-y-5 md:sticky md:top-24">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Filters
          </h3>
          {(activePrice || activeGender || activeColor) && (
            <button 
              onClick={clearAll} 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
            >
              Clear all
            </button>
          )}
        </div>

        <Section title="Price" id="price">
          <div className="flex flex-col gap-2.5">
            {PRICE_RANGES.map((r) => {
              const count = priceCounts[r] || 0;
              const disabled = count === 0;
              return (
                <button
                  key={r}
                  onClick={() => !disabled && setParam("priceRange", activePrice === r ? null : r)}
                  className={`text-left px-4 py-2.5 rounded-lg border-2 flex items-center justify-between transition-all duration-200 ${
                    activePrice === r 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md transform scale-[1.02]" 
                      : disabled 
                        ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50" 
                        : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:shadow-sm border-gray-200"
                  }`}
                  disabled={disabled}
                >
                  <span className="font-medium">₹{r}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    activePrice === r ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
            {activePrice && (
              <button 
                onClick={() => setParam("priceRange", null)} 
                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline self-start font-medium mt-1"
              >
                Clear price
              </button>
            )}
          </div>
        </Section>

        {!isContactLenses && (
          <Section title="Gender" id="gender">
            <div className="flex flex-col gap-2.5">
              {GENDERS.map((g) => {
                const count = genderCounts[g.toUpperCase()] || 0;
                const disabled = count === 0;
                return (
                  <button
                    key={g}
                    onClick={() => !disabled && setParam("gender", activeGender === g ? null : g)}
                    className={`text-left px-4 py-2.5 rounded-lg border-2 flex items-center justify-between transition-all duration-200 ${
                      activeGender === g 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md transform scale-[1.02]" 
                        : disabled 
                          ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50" 
                          : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:shadow-sm border-gray-200"
                    }`}
                    disabled={disabled}
                  >
                    <span className="font-medium">{g}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      activeGender === g ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              {activeGender && (
                <button 
                  onClick={() => setParam("gender", null)} 
                  className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline self-start font-medium mt-1"
                >
                  Clear gender
                </button>
              )}
            </div>
          </Section>
        )}

        {isContactLenses && (
          <Section title="Explore by Color" id="color">
            <div className="flex flex-col gap-2.5">
              {colorsList.map((c) => {
                const count = colorCounts[c.toUpperCase()] || 0;
                const disabled = Object.keys(colorCounts).length ? count === 0 : false;
                return (
                  <button
                    key={c}
                    onClick={() => !disabled && setParam("color", activeColor === c ? null : c)}
                    className={`text-left px-4 py-2.5 rounded-lg border-2 flex items-center justify-between transition-all duration-200 ${
                      activeColor === c 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md transform scale-[1.02]" 
                        : disabled 
                          ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50" 
                          : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:shadow-sm border-gray-200"
                    }`}
                    disabled={disabled}
                  >
                    <span className="font-medium">{c}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      activeColor === c ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      {count || ""}
                    </span>
                  </button>
                );
              })}
              {activeColor && (
                <button 
                  onClick={() => setParam("color", null)} 
                  className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline self-start font-medium mt-1"
                >
                  Clear color
                </button>
              )}
            </div>
          </Section>
        )}
      </aside>
    );
  };

  const Breadcrumb = () => (
    <nav className="text-sm mb-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <li className="flex items-center">
          <Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 font-medium">
            Home
          </Link>
        </li>
        <li className="flex items-center text-gray-400">/</li>
        <li className="flex items-center">
          <Link to="/shop" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 font-medium">
            Shop
          </Link>
        </li>
        <li className="flex items-center text-gray-400">/</li>
        <li className="flex items-center">
          <span className="text-gray-800 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {category}
          </span>
        </li>
      </ol>
    </nav>
  );

  const ActiveChips = () => {
    const chips = [];
    if (activePrice) chips.push({ k: 'priceRange', label: `₹${activePrice}` });
    if (activeGender) chips.push({ k: 'gender', label: activeGender });
    if (activeColor) chips.push({ k: 'color', label: activeColor });
    if (chips.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-600">Active filters:</span>
        {chips.map((c) => (
          <span 
            key={c.k} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-medium shadow-sm border border-indigo-200"
          >
            {c.label}
            <button 
              onClick={() => clearKey(c.k)} 
              className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors duration-200 text-indigo-800 font-bold"
            >
              ×
            </button>
          </span>
        ))}
        <button 
          className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors duration-200" 
          onClick={clearAll}
        >
          Clear all
        </button>
      </div>
    );
  };

  const ProductSkeleton = () => (
    <div className="animate-pulse bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"></div>
      <div className="h-5 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-lg mb-2 w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
    </div>
  );

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc') arr.sort((a,b) => (a.price||0) - (b.price||0));
    if (sort === 'price-desc') arr.sort((a,b) => (b.price||0) - (a.price||0));
    if (sort === 'newest') arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr;
  }, [products, sort]);

  if (error) return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-semibold text-lg mb-2">⚠️ Error loading products</div>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <Breadcrumb />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {category}
            </h1>
            <p className="text-gray-600 font-medium">
              {pagination.totalProducts || 0} {pagination.totalProducts === 1 ? 'product' : 'products'} available
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setParamNoReset('sort', e.target.value); }}
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium bg-white hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <ActiveChips />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <FiltersSidebar />
          </div>

          {/* Products grid */}
          <div className="md:col-span-3">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              {loading
                ? Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
                : (
                  sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <div 
                        key={product._id} 
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        <ProductCard
                          product={product}
                          addToCart={() => addToCart?.(product)}
                          addToWishlist={() => addToWishlist?.(product)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No products match your filters</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your filters or clearing them to see more results.
                      </p>
                      <button 
                        onClick={clearAll} 
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )
                )}
            </div>
            {renderPageNumbers()}
          </div>
        </div>
      </div>
    </div>
  );
}
