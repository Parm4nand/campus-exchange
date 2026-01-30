import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const SearchFilter = ({ searchQuery, setSearchQuery, filters, setFilters }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'books', label: 'Books & Textbooks' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing & Fashion' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'notes', label: 'Study Notes' },
  ];

  const campuses = [
    { value: 'all', label: 'All Campuses' },
    { value: 'main', label: 'Main Campus' },
    { value: 'north', label: 'North Campus' },
    { value: 'south', label: 'South Campus' },
  ];

  const conditions = [
    { value: 'all', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-1000', label: 'Under ₹1,000' },
    { value: '1000-5000', label: '₹1,000 - ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: '10000-50000', label: '₹10,000 - ₹50,000' },
    { value: '50000+', label: 'Over ₹50,000' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search items, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Campus Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campus
          </label>
          <div className="relative">
            <select
              value={filters.campus}
              onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {campuses.map(campus => (
                <option key={campus.value} value={campus.value}>
                  {campus.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex items-end">
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilters({ ...filters, condition: 'new' })}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          New Items
        </button>
        <button
          onClick={() => setFilters({ ...filters, priceRange: [0, 1000] })}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
        >
          Under ₹1000
        </button>
        <button
          onClick={() => setFilters({ ...filters, campus: 'main' })}
          className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
        >
          Main Campus
        </button>
        <button
          onClick={() => setFilters({ ...filters, rating: 4 })}
          className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors"
        >
          4+ Stars
        </button>
        <button
          onClick={() => {
            setSearchQuery('');
            setFilters({
              category: 'all',
              campus: 'all',
              priceRange: [0, 50000],
              condition: 'all',
              sortBy: 'newest'
            });
          }}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
