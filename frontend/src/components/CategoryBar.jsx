import { useState, useRef, useEffect } from "react";
import { categories } from "../data/categories";
import { useNavigate } from "react-router-dom";

const CategoryBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const barRef = useRef(null);

  // Click outside to close subfields
  useEffect(() => {
    if (!activeCategory) return;
    function handleClick(e) {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setActiveCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeCategory]);

  const handleCategorySelect = (cat) => {
    // Navigate to the category page to show ALL products in that category
    const mainCatTitle = categories[cat].title;
    navigate(`/category/${encodeURIComponent(mainCatTitle)}`);
    // Toggle dropdown for subfields
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  const handleSubFieldClick = (field, value) => {
    const mainCatTitle = categories[activeCategory].title;
    const params = new URLSearchParams({ [field]: value });
    navigate(`/category/${encodeURIComponent(mainCatTitle)}?${params.toString()}`);
    setActiveCategory(null);
  };

  return (
    <div className="bg-gray-100 border-t border-gray-200" ref={barRef}>
      <div className="flex justify-center gap-2 overflow-x-auto px-2 py-3">
        {Object.keys(categories).map((key) => (
          <button
            key={key}
            className={`px-5 py-2 rounded font-semibold border transition-colors duration-150 min-w-[120px] whitespace-nowrap ${
              activeCategory === key
                ? "bg-blue-700 text-white border-blue-600"
                : "bg-white text-gray-900 border-gray-300 hover:bg-blue-100"
            }`}
            onClick={() => handleCategorySelect(key)}
          >
            {categories[key].title}
          </button>
        ))}
      </div>
      {activeCategory && (
        <div className="bg-white shadow-inner p-3 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 border-t">
          {Object.entries(categories[activeCategory].fields).map(
            ([field, subfields]) => (
              <div key={field}>
                <h3 className="font-semibold text-gray-800 mb-2 text-base">{field}</h3>
                <ul className="flex flex-wrap gap-2">
                  {subfields.map((sub) => (
                    <li key={sub}>
                      <button
                        className="px-4 py-1 rounded bg-gray-100 hover:bg-blue-200 text-sm text-gray-700 font-medium border border-gray-200 min-w-[70px] capitalize"
                        onClick={() => handleSubFieldClick(field, sub)}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
