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
      <div className="flex items-center justify-center gap-2 mt-8">
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

  const FiltersSidebar = () => {
    const priceCounts = facets.priceBuckets || {};
    const genderCounts = facets.genders || {};
    const colorCounts = facets.colors || {};
    const colorsList = Object.keys(colorCounts).length ? Object.keys(colorCounts) : COLORS_FALLBACK;

    const Section = ({ title, id, children }) => (
      <div className="bg-white rounded-lg border shadow-sm">
        <button
          onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <span className="font-medium">{title}</span>
          <span className="text-sm text-gray-500">{expanded[id] ? "−" : "+"}</span>
        </button>
        {expanded[id] && <div className="px-3 pb-3">{children}</div>}
      </div>
    );

    return (
      <aside className="space-y-4 md:sticky md:top-24">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          {(activePrice || activeGender || activeColor) && (
            <button onClick={clearAll} className="text-sm text-indigo-600 hover:underline">Clear all</button>
          )}
        </div>

        <Section title="Price" id="price">
          <div className="flex flex-col gap-2">
            {PRICE_RANGES.map((r) => {
              const count = priceCounts[r] || 0;
              const disabled = count === 0;
              return (
                <button
                  key={r}
                  onClick={() => !disabled && setParam("priceRange", activePrice === r ? null : r)}
                  className={`text-left px-3 py-2 rounded-md border flex items-center justify-between transition ${
                    activePrice === r ? "bg-indigo-600 text-white border-indigo-600" : disabled ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                  disabled={disabled}
                >
                  <span>{r}</span>
                  <span className="text-xs opacity-80">{count}</span>
                </button>
              );
            })}
            {activePrice && (
              <button onClick={() => setParam("priceRange", null)} className="text-sm text-gray-600 hover:underline self-start">Clear price</button>
            )}
          </div>
        </Section>

        {!isContactLenses && (
          <Section title="Gender" id="gender">
            <div className="flex flex-col gap-2">
              {GENDERS.map((g) => {
                const count = genderCounts[g.toUpperCase()] || 0;
                const disabled = count === 0;
                return (
                  <button
                    key={g}
                    onClick={() => !disabled && setParam("gender", activeGender === g ? null : g)}
                    className={`text-left px-3 py-2 rounded-md border flex items-center justify-between transition ${
                      activeGender === g ? "bg-indigo-600 text-white border-indigo-600" : disabled ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    disabled={disabled}
                  >
                    <span>{g}</span>
                    <span className="text-xs opacity-80">{count}</span>
                  </button>
                );
              })}
              {activeGender && (
                <button onClick={() => setParam("gender", null)} className="text-sm text-gray-600 hover:underline self-start">Clear gender</button>
              )}
            </div>
          </Section>
        )}

        {isContactLenses && (
          <Section title="Explore by Color" id="color">
            <div className="flex flex-col gap-2">
              {colorsList.map((c) => {
                const count = colorCounts[c.toUpperCase()] || 0;
                const disabled = Object.keys(colorCounts).length ? count === 0 : false;
                return (
                  <button
                    key={c}
                    onClick={() => !disabled && setParam("color", activeColor === c ? null : c)}
                    className={`text-left px-3 py-2 rounded-md border flex items-center justify-between transition ${
                      activeColor === c ? "bg-indigo-600 text-white border-indigo-600" : disabled ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    disabled={disabled}
                  >
                    <span>{c}</span>
                    <span className="text-xs opacity-80">{count || ""}</span>
                  </button>
                );
              })}
              {activeColor && (
                <button onClick={() => setParam("color", null)} className="text-sm text-gray-600 hover:underline self-start">Clear color</button>
              )}
            </div>
          </Section>
        )}
      </aside>
    );
  };

  const Breadcrumb = () => (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex space-x-1">
        <li className="flex items-center"><Link to="/" className="hover:text-indigo-600">Home</Link></li>
        <li className="flex items-center">/</li>
        <li className="flex items-center"><Link to="/shop" className="hover:text-indigo-600">Shop</Link></li>
        <li className="flex items-center">/</li>
        <li className="flex items-center text-gray-700">{category}</li>
      </ol>
    </nav>
  );

  const ActiveChips = () => {
    const chips = [];
    if (activePrice) chips.push({ k: 'priceRange', label: activePrice });
    if (activeGender) chips.push({ k: 'gender', label: activeGender });
    if (activeColor) chips.push({ k: 'color', label: activeColor });
    if (chips.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((c) => (
          <span key={c.k} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">
            {c.label}
            <button onClick={() => clearKey(c.k)} className="hover:text-indigo-900">×</button>
          </span>
        ))}
        <button className="text-sm text-gray-600 hover:underline" onClick={clearAll}>Clear all</button>
      </div>
    );
  };

  const ProductSkeleton = () => (
    <div className="animate-pulse bg-white border rounded-lg p-3">
      <div className="h-40 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc') arr.sort((a,b) => (a.price||0) - (b.price||0));
    if (sort === 'price-desc') arr.sort((a,b) => (b.price||0) - (a.price||0));
    if (sort === 'newest') arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr;
  }, [products, sort]);

  if (error) return <div className="text-red-600 text-center py-6">Error loading products: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb />
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category}</h1>
          <p className="text-sm text-gray-500">{pagination.totalProducts || 0} products</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setParamNoReset('sort', e.target.value); }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <ActiveChips />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          <FiltersSidebar />
        </div>

        {/* Products grid */}
        <div className="md:col-span-3">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-300 ease-in-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
            }`}
          >
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
              : (
                sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg border hover:shadow-md transition">
                      <ProductCard
                        product={product}
                        addToCart={() => addToCart?.(product)}
                        addToWishlist={() => addToWishlist?.(product)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">No products match your filters</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or clearing them to see more results.</p>
                    <button onClick={clearAll} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Clear all filters</button>
                  </div>
                )
              )}
          </div>
          {renderPageNumbers()}
        </div>
      </div>
    </div>
  );
}
