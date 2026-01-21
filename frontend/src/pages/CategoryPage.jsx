import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";
import { Filter, X, ChevronDown } from "lucide-react";

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
  const categoryParam = useMemo(() => decodeURIComponent(category || ""), [category]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalProducts: 0, productsPerPage: 50 });
  const [facets, setFacets] = useState({ priceBuckets: {}, genders: {}, colors: {}, subCategories: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "relevance");
  const [expanded, setExpanded] = useState({ 
    price: true, 
    color: true, 
    size: false,
    subCategory: false 
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const categoryLower = (category || "").toLowerCase();
  const isContactLenses = useMemo(() => /contact\s+lenses/i.test(category || ""), [category]);
  const isAccessories = useMemo(() => /^accessories$/i.test(category || ""), [category]);
  const isSkincare = useMemo(() => /^skincare$/i.test(category || ""), [category]);
  const isBags = useMemo(() => /^bags$/i.test(category || ""), [category]);
  const isMensShoes = useMemo(() => /men'?s\s+shoes/i.test(category || ""), [category]);
  const isWomensShoes = useMemo(() => /women'?s\s+shoes/i.test(category || ""), [category]);
  const isKidsShoes = useMemo(() => /kids'?\s+shoes?/i.test(category || ""), [category]);
  const isShoesAccessories = useMemo(() => /shoes?\s+accessories?/i.test(category || ""), [category]);
  const isGlasses = useMemo(() => /^(eyeglasses|sunglasses|computer\s+glasses)$/i.test(category || ""), [category]);
  
  // Track previous category to detect category changes
  const prevCategoryRef = useRef(categoryParam);

  useEffect(() => {
    const hasFilters = searchParams.get("priceRange") || searchParams.get("color") || searchParams.get("subCategory") || searchParams.get("size");
    const categoryChanged = prevCategoryRef.current !== categoryParam;
    prevCategoryRef.current = categoryParam;
    
    // If category changed, always reload
    if (categoryChanged) {
      setVisible(false);
      setLoading(true);
      setError(null);
    } else {
      // Normal loading for filter changes
      setVisible(false);
      setLoading(true);
      setError(null);
    }

    const params = new URLSearchParams(searchParams);
    if (categoryParam) params.set("category", categoryParam);
    params.set("page", String(page));
    params.set("limit", String(limit));
    // Include sort parameter if it exists and is not relevance (default)
    if (sort && sort !== 'relevance') {
      params.set("sort", sort);
    }
    
    // Remove availability from params - we'll filter on frontend
    const availabilityFilter = params.get("availability");
    params.delete("availability");

    const fadeTimeout = setTimeout(async () => {
      try {
        const requestParams = Object.fromEntries(params);
        console.log("Fetching products with params:", requestParams);
        const { data } = await api.get('/products', { params: requestParams });
        console.log("Products response:", { 
          isArray: Array.isArray(data), 
          hasProducts: !!data.products, 
          productsCount: Array.isArray(data) ? data.length : (Array.isArray(data.products) ? data.products.length : 0),
          pagination: data.pagination 
        });
        let newProducts = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        
        // Apply availability filter on frontend
        if (availabilityFilter) {
          if (availabilityFilter === "inStock") {
            newProducts = newProducts.filter(p => p.inStock !== false);
          } else if (availabilityFilter === "outOfStock") {
            newProducts = newProducts.filter(p => p.inStock === false);
          }
        }
        
        setProducts(newProducts);
        setPagination(
          data.pagination || { currentPage: page, totalPages: 0, totalProducts: 0, productsPerPage: limit }
        );
        // Clear any previous errors
        setError(null);
        // Show products immediately if clearing filters (no active filters)
        const hasActiveFilters = searchParams.get("priceRange") || searchParams.get("color") || searchParams.get("subCategory") || searchParams.get("size");
        if (newProducts.length > 0 && !hasActiveFilters) {
          setVisible(true);
        } else {
          setTimeout(() => setVisible(true), 80);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load products";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 80);

    // Fetch facets (exclude page/limit to avoid affecting counts)
    const facetParams = new URLSearchParams(searchParams);
    if (categoryParam) facetParams.set("category", categoryParam);
    facetParams.delete("page");
    facetParams.delete("limit");
    api.get('/products/facets', { params: Object.fromEntries(facetParams) })
      .then(({ data: f }) => setFacets({
        priceBuckets: f?.priceBuckets || {},
        genders: f?.genders || {},
        colors: f?.colors || {},
        subCategories: f?.subCategories || {},
      }))
      .catch((err) => {
        console.error("Error fetching facets:", err);
        // Don't set error state for facets, just log it
      });

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
    ["priceRange", "color", "subCategory", "size"].forEach((k) => params.delete(k));
    params.set("page", "1");
    // Keep products visible when clearing filters - don't trigger loading state
    setSearchParams(params, { replace: true });
    // Immediately show products if they exist
    if (products.length > 0) {
      setVisible(true);
      setLoading(false);
    }
  };

  const clearKey = (k) => setParam(k, null);

  const activePrice = searchParams.get("priceRange") || "";
  const activeColor = searchParams.get("color") || "";
  const activeSubCategory = searchParams.get("subCategory") || "";
  const activeSize = searchParams.get("size") || "";

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
              : "text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-800 hover:shadow-md"
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
                ? "text-white shadow-lg transform scale-110"
                : "text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-800 hover:shadow-md"
            }`}
            style={p === current ? { backgroundColor: 'var(--text-primary)', borderColor: 'var(--text-primary)' } : {}}
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
              : "text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-800 hover:shadow-md"
          }`}
        >
          Next →
        </button>
      </div>
    );
  };

  const FiltersSidebar = () => {
    const priceCounts = facets.priceBuckets || {};
    const colorCounts = facets.colors || {};
    const subCategoryCounts = facets.subCategories || {};
    const colorsList = Object.keys(colorCounts).length ? Object.keys(colorCounts) : COLORS_FALLBACK;
    
      const mensShoesSubcategories = ["Formal", "Sneakers", "Boots", "Loafers", "Sandals"];
      const womensShoesSubcategories = ["Heels", "Flats", "Sneakers", "Boots", "Sandals", "Chappals"];
      const kidsShoesSubcategories = ["Boys Footwear", "Girls Footwear"];
      const shoesAccessoriesSubcategories = ["Shoe Laces", "Shoe Polish", "Shoe Insoles", "Shoe Bags", "Shoe Trees", "Shoe Care Kits"];
      const activeSubCategory = searchParams.get("subCategory") || "";

    const Section = ({ title, id, children, count }) => (
      <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
          className="w-full flex items-center justify-between py-3 transition-all duration-200"
        >
          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            {title} {count !== undefined && `(${count})`}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${expanded[id] ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
          />
        </button>
        {expanded[id] && <div className="pb-3 transition-opacity duration-200">{children}</div>}
      </div>
    );

    return (
      <aside>
        <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Filter
          </h3>
          {(activePrice || activeColor || activeSubCategory || activeSize) && (
            <button 
              onClick={clearAll} 
              className="text-xs font-medium hover:underline transition-colors duration-200"
              style={{ color: 'var(--text-primary)' }}
            >
              Remove all
            </button>
          )}
        </div>
        
        <div className="space-y-0">

        <Section title="Price" id="price">
          <div className="flex flex-col gap-2">
            {PRICE_RANGES.map((r) => {
              const count = priceCounts[r] || 0;
              const disabled = count === 0;
              const isActive = activePrice === r;
              return (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => !disabled && setParam("priceRange", isActive ? null : r)}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: 'var(--text-primary)' }}
                  />
                  <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                    ₹{r} ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </Section>

        {/* Men's Shoes SubCategory Filter */}
        {isMensShoes && !isWomensShoes && (
          <Section title="Shoe Type" id="subCategory">
            <div className="flex flex-col gap-2">
              {mensShoesSubcategories.map((subCat) => {
                const count = subCategoryCounts[subCat.toUpperCase()] || 0;
                const disabled = count === 0;
                const isActive = activeSubCategory.toLowerCase() === subCat.toLowerCase();
                return (
                  <label key={subCat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => !disabled && setParam("subCategory", isActive ? null : subCat.toLowerCase())}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: 'var(--text-primary)' }}
                    />
                    <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                      {subCat} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>
        )}

        {/* Women's Shoes SubCategory Filter */}
        {isWomensShoes && (
          <Section title="Shoe Type" id="subCategory">
            <div className="flex flex-col gap-2">
              {womensShoesSubcategories.map((subCat) => {
                const count = subCategoryCounts[subCat.toUpperCase()] || 0;
                const disabled = count === 0;
                const isActive = activeSubCategory.toLowerCase() === subCat.toLowerCase();
                return (
                  <label key={subCat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => !disabled && setParam("subCategory", isActive ? null : subCat.toLowerCase())}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: 'var(--text-primary)' }}
                    />
                    <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                      {subCat} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>
        )}

        {/* Kids Shoes SubCategory Filter */}
        {isKidsShoes && (
          <Section title="Footwear Type" id="subCategory">
            <div className="flex flex-col gap-2">
              {kidsShoesSubcategories.map((subCat) => {
                const count = subCategoryCounts[subCat.toUpperCase()] || 0;
                const disabled = count === 0;
                const isActive = activeSubCategory.toLowerCase() === subCat.toLowerCase();
                return (
                  <label key={subCat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => !disabled && setParam("subCategory", isActive ? null : subCat.toLowerCase())}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: 'var(--text-primary)' }}
                    />
                    <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                      {subCat} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>
        )}

        {/* Shoes Accessories SubCategory Filter */}
        {isShoesAccessories && (
          <Section title="Accessory Type" id="subCategory">
            <div className="flex flex-col gap-2">
              {shoesAccessoriesSubcategories.map((subCat) => {
                const count = subCategoryCounts[subCat.toUpperCase()] || 0;
                const disabled = count === 0;
                const isActive = activeSubCategory.toLowerCase() === subCat.toLowerCase();
                return (
                  <label key={subCat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => !disabled && setParam("subCategory", isActive ? null : subCat.toLowerCase())}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: 'var(--text-primary)' }}
                    />
                    <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                      {subCat} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>
        )}

        {/* Color filter */}
        {(isMensShoes || isWomensShoes || isKidsShoes || isShoesAccessories) && (
          <Section title="Color" id="color">
            <div className="flex flex-col gap-2">
              {colorsList.map((c) => {
                const count = colorCounts[c.toUpperCase()] || 0;
                const disabled = Object.keys(colorCounts).length ? count === 0 : false;
                const isActive = activeColor === c;
                return (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => !disabled && setParam("color", isActive ? null : c)}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: 'var(--text-primary)' }}
                    />
                    <span className={`text-sm flex-1 ${disabled ? 'opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
                      {c} ({count || 0})
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>
        )}

        {/* Size filter - for shoes */}
        {(isMensShoes || isWomensShoes || isKidsShoes) && (
          <Section title="Size" id="size">
            <div className="flex flex-col gap-2">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Size filter coming soon</p>
            </div>
          </Section>
        )}
        </div>
      </aside>
    );
  };


  const Breadcrumb = () => (
    <nav className="text-sm mb-4 sm:mb-6 md:px-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <li className="flex items-center">
          <Link to="/" className="transition-colors duration-200 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Home
          </Link>
        </li>
        <li className="flex items-center" style={{ color: 'var(--text-secondary)' }}>/</li>
        <li className="flex items-center">
          <Link to="/shop" className="transition-colors duration-200 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Shop
          </Link>
        </li>
        <li className="flex items-center" style={{ color: 'var(--text-secondary)' }}>/</li>
        <li className="flex items-center">
          <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>
            {category}
          </span>
        </li>
      </ol>
    </nav>
  );

  const ActiveChips = () => {
    const chips = [];
    if (activePrice) chips.push({ k: 'priceRange', label: `₹${activePrice}` });
    if (activeSubCategory) chips.push({ k: 'subCategory', label: activeSubCategory.charAt(0).toUpperCase() + activeSubCategory.slice(1) });
    if (activeColor) chips.push({ k: 'color', label: activeColor });
    if (activeSize) chips.push({ k: 'size', label: activeSize });
    if (chips.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 mb-4 md:px-6">
        {chips.map((c) => (
          <span 
            key={c.k} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
            style={{ 
              backgroundColor: 'var(--text-primary)', 
              color: '#ffffff'
            }}
          >
            {c.label}
            <button 
              onClick={() => clearKey(c.k)} 
              className="hover:bg-white/30 rounded-full p-0.5 transition-colors duration-200 text-white font-bold text-sm leading-none w-4 h-4 flex items-center justify-center"
              style={{ color: '#ffffff' }}
            >
              ×
            </button>
          </span>
        ))}
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
    // For accessories, backend already sorts by subcategory, so we should preserve that order
    // Only apply additional sorting if needed (for client-side sorting when backend doesn't handle it)
    const arr = [...products];
    
    // For accessories, backend handles subcategory sorting
    if (isAccessories) {
      // Sort by subcategory first (alphabetically), then by selected criteria
      // Backend already sorts, but we ensure consistency here for client-side operations
      arr.sort((a, b) => {
        // First, sort by subcategory (alphabetically)
        const subCategoryA = String(a.subCategory || '').toLowerCase().trim();
        const subCategoryB = String(b.subCategory || '').toLowerCase().trim();
        
        // If subcategories are different, sort alphabetically (empty subcategories go to end)
        if (subCategoryA !== subCategoryB) {
          if (!subCategoryA) return 1; // Empty subcategory goes to end
          if (!subCategoryB) return -1; // Empty subcategory goes to end
          return subCategoryA.localeCompare(subCategoryB);
        }
        
        // If same subcategory, apply selected sort
        if (sort === 'price-asc') {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceA - priceB;
        }
        if (sort === 'price-desc') {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceB - priceA;
        }
        if (sort === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        }
        // For relevance or default, maintain backend order within subcategory group
        return 0;
      });
    } else if (isBags) {
      // For bags, sort by subcategory first, then gender, then selected criteria
      const genderOrder = (gender) => {
        const g = String(gender || '').toLowerCase().trim();
        if (g === 'men' || g === 'man' || g === 'male') return 1;
        if (g === 'women' || g === 'woman' || g === 'female') return 2;
        if (g === 'unisex') return 3;
        return 4;
      };
      
      arr.sort((a, b) => {
        // First, sort by subcategory (alphabetically)
        const subCategoryA = String(a.subCategory || a.category || '').toLowerCase().trim();
        const subCategoryB = String(b.subCategory || b.category || '').toLowerCase().trim();
        
        if (subCategoryA !== subCategoryB) {
          if (!subCategoryA) return 1;
          if (!subCategoryB) return -1;
          return subCategoryA.localeCompare(subCategoryB);
        }
        
        // If same subcategory, sort by gender
        const genderA = genderOrder(a.gender || a.product_info?.gender || '');
        const genderB = genderOrder(b.gender || b.product_info?.gender || '');
        
        if (genderA !== genderB) {
          return genderA - genderB;
        }
        
        // If same gender, apply selected sort
        if (sort === 'price-asc') {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceA - priceB;
        }
        if (sort === 'price-desc') {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceB - priceA;
        }
        if (sort === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        }
        return 0;
      });
    } else {
      // For non-accessories, apply normal sorting
      if (sort === 'price-asc') {
        arr.sort((a,b) => {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceA - priceB;
        });
      }
      if (sort === 'price-desc') {
        arr.sort((a,b) => {
          const priceA = a.finalPrice || a.price || 0;
          const priceB = b.finalPrice || b.price || 0;
          return priceB - priceA;
        });
      }
      if (sort === 'newest') {
        arr.sort((a,b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
      }
      if (sort === 'bestselling') {
        arr.sort((a,b) => {
          const ratingA = a.ratings || a.rating || 0;
          const ratingB = b.ratings || b.rating || 0;
          const reviewsA = a.numReviews || 0;
          const reviewsB = b.numReviews || 0;
          // Sort by rating first, then by number of reviews
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return reviewsB - reviewsA;
        });
      }
      if (sort === 'trending') {
        arr.sort((a,b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          // Trending = newest first
          return dateB - dateA;
        });
      }
    }
    return arr;
  }, [products, sort, isAccessories]);

  if (error) return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-semibold text-lg mb-2">⚠️ Error loading products</div>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full">
        <Breadcrumb />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:px-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
              {category}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Sort by:</label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setParamNoReset('sort', e.target.value); }}
              className="border rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="relevance">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {sortedProducts.length} of {pagination.totalProducts || 0} products
            </span>
          </div>
        </div>

        <ActiveChips />

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200"
            style={{
              backgroundColor: filtersOpen ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: filtersOpen ? 'var(--bg-secondary)' : 'var(--text-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {filtersOpen && <X className="w-4 h-4" />}
          </button>
          {(activePrice || activeColor || activeSubCategory || activeSize) && (
            <button
              onClick={clearAll}
              className="text-sm font-medium px-3 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Mobile Filter Overlay */}
        {filtersOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setFiltersOpen(false)}
          ></div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 relative">
          {/* Left sidebar - Hidden on mobile unless filtersOpen */}
          <div className={`md:col-span-1 ${filtersOpen ? 'fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 overflow-y-auto p-4 shadow-2xl transform transition-transform duration-300' : 'hidden md:block'}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
            {filtersOpen && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Filter</h3>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close filters"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div onClick={(e) => e.stopPropagation()} className="rounded-2xl p-4 sm:p-6 shadow-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <FiltersSidebar />
            </div>
            {filtersOpen && (
              <div className="sticky bottom-0 border-t pt-4 mt-4" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors"
                  style={{ backgroundColor: 'var(--text-primary)' }}
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          {/* Products grid */}
          <div className="md:col-span-3 md:px-6">
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 transition-all duration-500 ease-in-out ${
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
                          showBestSeller={sort === 'bestselling' || sort === 'trending'}
                          product={product}
                          addToCart={() => addToCart?.(product)}
                          addToWishlist={() => addToWishlist?.(product)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>No products match your filters</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your filters or clearing them to see more results.
                      </p>
                      <button 
                        onClick={clearAll} 
                        className="px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        style={{ backgroundColor: 'var(--text-primary)' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--text-secondary)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--text-primary)'}
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
