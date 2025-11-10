import { useState, useRef, useEffect } from "react";
import { categories } from "../data/categories";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from 'lucide-react';

const CategoryBar = ({ inline = false }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubField, setActiveSubField] = useState(null);
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const navigate = useNavigate();
  const barRef = useRef(null);

  // Click outside to close subfields
  useEffect(() => {
    function handleClick(e) {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setActiveCategory(null);
        setActiveSubField(null);
      }
    }
    if (activeCategory) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [activeCategory]);

  // Mock sub-subcategories data (you can expand this based on your needs)
  const subSubCategories = {
    'Eyeglasses': {
      'Gender':  
        ['Unisex' ,
        'Men',
        'Women' ,
        'Kids' ],
      'Collection': [ 
        'EyeX' ,
        'Tees' ,
        'Signature' ,
        'Spiderman' ] ,
      'Shape': [
        'Rectangle' ,
        'Round'   ,
        'Cat Eye' ,
        'Geometric'  ,
        'Wayfarer' ] 
    },
    'Sunglasses': {
      'Gender': [
        'Unisex' ,
        'Men' ,
        'Women' ,
        'Kids' ] ,
      'Collection': [
        'Smart Sunglasses' ,
        'Donald' ,
        'Glow Up' ,
        'Whiplash' ,
        'Vivd Geometry' ] ,
      'Shape': [
        'Aviator' ,
        'Wraparound' ,
        'Rectangle' ,
        'Wayfarer'  ,
        'Round' ] 
    },
    'Contact Lenses': {
      'Brands': [
        'Bausch & Lomb',
        'Acuvue' ,
        'Alcon'] ,
      'Explore by Disposability': [
        'Daily' ,
        'Monthly' ,
        'Yearly' ] ,
      'Explore by Power': [
        'Spherical' ,
        'Toric' ,
        'Multifocal' ] 
    }
  };

  const handleCategorySelect = (cat) => {
    // Navigate to the category page to show ALL products in that category
    const mainCatTitle = categories[cat].title;
    navigate(`/category/${encodeURIComponent(mainCatTitle)}`);
    // Toggle dropdown for subfields
    setActiveCategory(activeCategory === cat ? null : cat);
    setActiveSubField(null); // Reset subfield when changing main category
  };

  const handleSubFieldClick = (field, value) => {
    const mainCatTitle = categories[activeCategory].title;
    const params = new URLSearchParams({ [field]: value });
    navigate(`/category/${encodeURIComponent(mainCatTitle)}?${params.toString()}`);
    setActiveCategory(null);
    setActiveSubField(null);
  };

  const handleSubCategoryToggle = (field, value) => {
    const key = `${field}-${value}`;
    setExpandedSubCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setActiveSubField(expandedSubCategories[key] ? null : { field, value });
  };

  const handleSubSubCategoryClick = (mainCat, field, subValue, subSubValue) => {
    const params = new URLSearchParams({ [field]: subValue, [`${field}_sub`]: subSubValue });
    navigate(`/category/${encodeURIComponent(mainCat)}?${params.toString()}`);
    setActiveCategory(null);
    setActiveSubField(null);
  };

  if (inline) {
    return (
      <div className="relative" ref={barRef}>
        <div className="flex items-center gap-2 overflow-x-auto px-2 py-2">
          {Object.keys(categories).map((key) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border transition-all duration-200 whitespace-nowrap ${
                activeCategory === key
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-600 shadow-lg"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-sky-50 hover:border-sky-300 hover:shadow-md"
              }`}
              onClick={() => handleCategorySelect(key)}
            >
              <span>{categories[key].title}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeCategory === key ? 'rotate-180' : ''
                }`}
              />
            </button>
          ))}
        </div>

        {activeCategory && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-xl border border-gray-200 rounded-lg z-50">
            <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {Object.entries(categories[activeCategory].fields).map(([field, subfields]) => (
                <div key={field} className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">{field}</h3>
                  <div className="space-y-2">
                    {subfields.map((sub) => {
                      const key = `${field}-${sub}`;
                      const hasSubSubCategories = subSubCategories[categories[activeCategory].title]?.[field]?.[sub];
                      const isExpanded = expandedSubCategories[key];

                      return (
                        <div key={sub} className="relative">
                          <button
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                              activeSubField?.field === field && activeSubField?.value === sub
                                ? "bg-sky-100 text-sky-700 border-sky-300"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              if (hasSubSubCategories) {
                                handleSubCategoryToggle(field, sub);
                              } else {
                                handleSubFieldClick(field, sub);
                              }
                            }}
                          >
                            <span className="capitalize">{sub}</span>
                            {hasSubSubCategories && (
                              <ChevronRight 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            )}
                          </button>

                          {isExpanded && hasSubSubCategories && (
                            <div className="mt-2 ml-4 space-y-1">
                              {hasSubSubCategories.map((subSub) => (
                                <button
                                  key={subSub}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors duration-150 capitalize"
                                  onClick={() => handleSubSubCategoryClick(
                                    categories[activeCategory].title,
                                    field,
                                    sub,
                                    subSub
                                  )}
                                >
                                  {subSub}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-lg">
              <p className="text-sm text-gray-600">
                Showing all products in <span className="font-semibold text-gray-900">{categories[activeCategory].title}</span>
              </p>
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveSubField(null);
                }}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 border-t border-gray-200" ref={barRef}>
      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
        {Object.keys(categories).map((key) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all duration-200 min-w-[140px] whitespace-nowrap ${
              activeCategory === key
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-600 shadow-lg"
                : "bg-white text-gray-900 border-gray-300 hover:bg-sky-50 hover:border-sky-300 hover:shadow-md"
            }`}
            onClick={() => handleCategorySelect(key)}
          >
            <span>{categories[key].title}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                activeCategory === key ? 'rotate-180' : ''
              }`}
            />
          </button>
        ))}
      </div>
      
      {activeCategory && (
        <div className="bg-white shadow-xl border-t border-gray-200">
          <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {Object.entries(categories[activeCategory].fields).map(
              ([field, subfields]) => (
                <div key={field} className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">
                    {field}
                  </h3>
                  <div className="space-y-2">
                    {subfields.map((sub) => {
                      const key = `${field}-${sub}`;
                      const hasSubSubCategories = subSubCategories[categories[activeCategory].title]?.[field]?.[sub];
                      const isExpanded = expandedSubCategories[key];
                      
                      return (
                        <div key={sub} className="relative">
                          <button
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                              activeSubField?.field === field && activeSubField?.value === sub
                                ? "bg-sky-100 text-sky-700 border-sky-300"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              if (hasSubSubCategories) {
                                handleSubCategoryToggle(field, sub);
                              } else {
                                handleSubFieldClick(field, sub);
                              }
                            }}
                          >
                            <span className="capitalize">{sub}</span>
                            {hasSubSubCategories && (
                              <ChevronRight 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            )}
                          </button>
                          
                          {/* Sub-subcategories */}
                          {isExpanded && hasSubSubCategories && (
                            <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                              {hasSubSubCategories.map((subSub) => (
                                <button
                                  key={subSub}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors duration-150 capitalize"
                                  onClick={() => handleSubSubCategoryClick(
                                    categories[activeCategory].title,
                                    field,
                                    sub,
                                    subSub
                                  )}
                                >
                                  {subSub}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing all products in <span className="font-semibold text-gray-900">{categories[activeCategory].title}</span>
              </p>
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveSubField(null);
                }}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
