import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Filter, MapPin, Star, TrendingUp, Shield,
  Sparkles, Book, Laptop, Sofa, Shirt, FileText, ChevronRight,
  Zap, Award, CheckCircle, Truck, X, Sliders,
  Eye, MessageCircle, Heart, Package, Gamepad, ChevronLeft,
  RefreshCw, Loader2  // Add these two
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ItemCard from '../components/marketplace/ItemCard.jsx';
import localDatabase from '../services/localDatabase';

const Marketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    priceRange: 'all',
    condition: 'all',
    sortBy: 'newest'
  });
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [selectedItemForChat, setSelectedItemForChat] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  // Sample detailed items data with seller IDs
  // Update lines 20-160 - replace the detailedItems array with this:

  // Sample detailed items data with secure seller IDs
  const detailedItems = [
    {
      id: '1',
      title: 'Introduction to Algorithms (CLRS) - 4th Edition',
      description: 'Brand new MIT Press textbook. The comprehensive guide to algorithms used by computer science students worldwide.',
      price: 2499,
      originalPrice: 3499,
      category: 'books',
      campus: 'School of Cyber Security & Digital Forensics',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      rating: 4.9,
      reviews: 127,
      sellerId: 'user_1m2b3c4e_ad456def_admin', // ← SECURE ADMIN ID
      seller: 'Admin User',
      condition: 'New',
      quantity: 5,
      tags: ['Textbook', 'DSA', 'Computer Science'],
      views: 245,
      sold: 12,
      specifications: {
        author: 'Thomas H. Cormen',
        publisher: 'MIT Press',
        edition: '4th'
      }
    },
    {
      id: '2',
      title: 'Apple MacBook Air M1 2020 (8GB/256GB)',
      description: 'Lightly used MacBook Air with Apple M1 chip. Perfect for coding, design, and studies.',
      price: 54999,
      originalPrice: 79999,
      category: 'electronics',
      campus: 'School of Engineering & Technology',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
      rating: 4.8,
      reviews: 89,
      sellerId: 'user_1m2b3c4f_ev789ghi_event_society', // ← SECURE EVENT SOCIETY ID
      seller: 'Event Society',
      condition: 'Excellent',
      quantity: 1,
      tags: ['Laptop', 'Apple', 'Student'],
      views: 567,
      sold: 0,
      specifications: {
        processor: 'Apple M1',
        ram: '8GB',
        storage: '256GB SSD'
      }
    },
    {
      id: '3',
      title: 'Ergonomic Study Desk with LED & Storage',
      description: 'Modern study desk with built-in shelves, drawers, and LED lighting. Perfect for dorm rooms.',
      price: 4599,
      originalPrice: 6999,
      category: 'furniture',
      campus: 'School of Police Science and Security Studies',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      rating: 4.6,
      reviews: 45,
      sellerId: 'user_1m2b3c4d_st123abc_student', // ← SECURE STUDENT ID
      seller: 'Test Student',
      condition: 'Good',
      quantity: 2,
      tags: ['Furniture', 'Desk', 'Dorm'],
      views: 123,
      sold: 3,
      specifications: {
        material: 'Engineered Wood',
        dimensions: '120x60x75 cm'
      }
    },
    // Update the rest of the items similarly...
    {
      id: '4',
      title: 'Sony WH-1000XM4 Wireless Headphones',
      description: 'Industry-leading noise cancellation with 30-hour battery life. Perfect for study sessions.',
      price: 18999,
      originalPrice: 24999,
      category: 'electronics',
      campus: 'School of Management Studies',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      rating: 4.7,
      reviews: 67,
      sellerId: 'user_1m2b3c4e_ad456def_admin', // ← SECURE ADMIN ID
      seller: 'Admin User',
      condition: 'Like New',
      quantity: 1,
      tags: ['Headphones', 'Wireless', 'Noise Cancelling'],
      views: 189,
      sold: 0,
      specifications: {
        battery: '30 hours',
        features: 'Noise Cancelling'
      }
    },
    {
      id: '5',
      title: 'Calculus & Linear Algebra Complete Notes',
      description: 'Comprehensive handwritten notes by topper student (CGPA 9.8). Digital PDF also available.',
      price: 499,
      originalPrice: 999,
      category: 'notes',
      campus: 'School of Doctoral Studies & Research',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
      rating: 4.9,
      reviews: 213,
      sellerId: 'user_1m2b3c4f_ev789ghi_event_society', // ← SECURE EVENT SOCIETY ID
      seller: 'Event Society',
      condition: 'New',
      quantity: 10,
      tags: ['Notes', 'Engineering', 'Math'],
      views: 456,
      sold: 45,
      specifications: {
        pages: '120 pages',
        format: 'Handwritten + PDF'
      }
    },
    {
      id: '6',
      title: 'Casio Scientific Calculator fx-991EX',
      description: 'Brand new scientific calculator with 552 functions. Essential for engineering students.',
      price: 1499,
      originalPrice: 1999,
      category: 'electronics',
      campus: 'School of Forensic Science',
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&h=400&fit=crop',
      rating: 4.9,
      reviews: 156,
      sellerId: 'user_1m2b3c4d_st123abc_student', // ← SECURE STUDENT ID
      seller: 'Test Student',
      condition: 'New',
      quantity: 8,
      tags: ['Calculator', 'Scientific', 'Engineering'],
      views: 321,
      sold: 23,
      specifications: {
        functions: '552 functions',
        display: '4-line display'
      }
    },
    {
      id: '7',
      title: 'Gaming PC Setup (Ryzen 5/RTX 3060/16GB)',
      description: 'Powerful gaming PC perfect for gaming and development work. Includes monitor and peripherals.',
      price: 64999,
      originalPrice: 89999,
      category: 'electronics',
      campus: 'School of Pharmacy',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop',
      rating: 4.8,
      reviews: 34,
      sellerId: 'user_1m2b3c4e_ad456def_admin', // ← SECURE ADMIN ID
      seller: 'Admin User',
      condition: 'Very Good',
      quantity: 1,
      tags: ['Gaming PC', 'Computer', 'RTX 3060'],
      views: 432,
      sold: 0,
      specifications: {
        cpu: 'Ryzen 5 5600X',
        gpu: 'RTX 3060 12GB'
      }
    },
    {
      id: '8',
      title: 'Python & Data Science Complete Bundle',
      description: 'Complete set of textbooks for Python programming and Data Science. 3 books in excellent condition.',
      price: 2999,
      originalPrice: 4999,
      category: 'books',
      campus: 'School of Cyber Security & Digital Forensics',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
      rating: 4.8,
      reviews: 78,
      sellerId: 'user_1m2b3c4f_ev789ghi_event_society', // ← SECURE EVENT SOCIETY ID
      seller: 'Event Society',
      condition: 'Excellent',
      quantity: 3,
      tags: ['Python', 'Data Science', 'Programming'],
      views: 198,
      sold: 7,
      specifications: {
        books: '3 Book Set',
        condition: 'Like New'
      }
    },
    {
      id: '9',
      title: 'Nike Air Force 1 Shoes (Size 9)',
      description: 'Classic white Nike Air Force 1 shoes. Worn only a few times, in perfect condition.',
      price: 3999,
      originalPrice: 5999,
      category: 'fashion',
      campus: 'School of Open Learning',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop',
      rating: 4.5,
      reviews: 42,
      sellerId: 'user_1m2b3c4d_st123abc_student', // ← SECURE STUDENT ID
      seller: 'Test Student',
      condition: 'Like New',
      quantity: 1,
      tags: ['Shoes', 'Nike', 'Fashion'],
      views: 156,
      sold: 0,
      specifications: {
        size: '9',
        color: 'White'
      }
    },
    {
      id: '10',
      title: 'Basketball - Official Size 7',
      description: 'Professional basketball, used for college tournaments. Good condition with proper grip.',
      price: 899,
      originalPrice: 1499,
      category: 'sports',
      campus: 'School of Engineering & Technology',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
      rating: 4.4,
      reviews: 23,
      sellerId: 'user_1m2b3c4e_ad456def_admin', // ← SECURE ADMIN ID
      seller: 'Admin User',
      condition: 'Good',
      quantity: 2,
      tags: ['Basketball', 'Sports', 'Equipment'],
      views: 89,
      sold: 1,
      specifications: {
        size: 'Official Size 7',
        material: 'Leather'
      }
    }
  ];

  // Initialize with items from database combined with sample items
  useEffect(() => {
    const fetchAndSetItems = async () => {
      try {
        // First try to get items from database
        const dbItems = await localDatabase.getItems({
          status: 'approved',
          showAll: false
        });
        console.log('Fetched from database:', dbItems);
        console.log('First item status:', dbItems[0]?.status);
        console.log('First item isAvailable:', dbItems[0]?.isAvailable);

        // Combine database items with sample items
        // Remove duplicates based on ID
        const combinedItems = [...detailedItems];

        if (dbItems && dbItems.length > 0) {
          // Add database items that don't already exist in sample items
          dbItems.forEach(dbItem => {
            if (!combinedItems.some(sampleItem => sampleItem.id === dbItem.id)) {
              combinedItems.push(dbItem);
            }
          });
        }

        setItems(combinedItems);
        setFilteredItems(combinedItems);
        console.log('Combined items to display:', combinedItems);
        console.log('Combined items count:', combinedItems.length);

      } catch (error) {
        console.error('Error fetching items:', error);
        // Fallback to sample items only on error
        setItems(detailedItems);
        setFilteredItems(detailedItems);
      }

      // Reset filters to default on initial load
      setActiveFilters({
        category: 'all',
        priceRange: 'all',
        condition: 'all',
        sortBy: 'newest',
        // deliveryTime: 'all'
      });
      setActiveCategory('all');

      // Check for search query in URL
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchInput(searchParam);
        setSearchQuery(searchParam);
        handleSearch(searchParam);
      } else {
        // Reset to show all items when no search
        setSearchQuery('');
        setSearchInput('');
      }
    };

    fetchAndSetItems();
  }, [location]);

  // Working categories with proper counts
  // Working categories with proper counts - computed from items
  const categories = [
    {
      id: 'all',
      label: 'All Items',
      icon: <Sparkles className="text-blue-600" size={20} />,
      count: items.length
    },
    {
      id: 'books',
      label: 'Books',
      icon: <Book className="text-green-600" size={20} />,
      count: items.filter(item => item.category === 'books').length
    },
    {
      id: 'electronics',
      label: 'Electronics',
      icon: <Laptop className="text-purple-600" size={20} />,
      count: items.filter(item => item.category === 'electronics').length
    },
    {
      id: 'furniture',
      label: 'Furniture',
      icon: <Sofa className="text-yellow-600" size={20} />,
      count: items.filter(item => item.category === 'furniture').length
    },
    {
      id: 'fashion',
      label: 'Fashion',
      icon: <Shirt className="text-pink-600" size={20} />,
      count: items.filter(item => item.category === 'fashion').length
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: <Gamepad className="text-red-600" size={20} />,
      count: items.filter(item => item.category === 'sports').length
    },
    {
      id: 'notes',
      label: 'Study Notes',
      icon: <FileText className="text-indigo-600" size={20} />,
      count: items.filter(item => item.category === 'notes').length
    },
  ];

  // Price range options
  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-1000', label: 'Under ₹1000', min: 0, max: 999 },
    { id: '1000-5000', label: '₹1000 - ₹5000', min: 1000, max: 5000 },
    { id: '5000-20000', label: '₹5000 - ₹20000', min: 5000, max: 20000 },
    { id: 'above-20000', label: 'Above ₹20000', min: 20000, max: Infinity },
  ];

  // Condition options
  const conditionOptions = [
    { id: 'all', label: 'All Conditions' },
    { id: 'new', label: 'New' },
    { id: 'like-new', label: 'Like New' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'discount', label: 'Best Discount' },
  ];



  // Main filter function
  const applyFilters = () => {
    setLoading(true);

    let result = [...items]; // Always start with all items

    // If items array is empty, use detailedItems as fallback
    if (result.length === 0) {
      result = [...detailedItems];
    }

    // Apply category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(item => item.category === activeFilters.category);
    }

    // Apply price range filter
    if (activeFilters.priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === activeFilters.priceRange);
      if (range && range.min !== undefined) {
        result = result.filter(item => {
          if (range.max === Infinity) {
            return item.price >= range.min;
          }
          return item.price >= range.min && item.price <= range.max;
        });
      }
    }

    // Apply condition filter
    if (activeFilters.condition !== 'all') {
      result = result.filter(item => {
        const itemCondition = item.condition.toLowerCase().replace(/ /g, '-');
        return itemCondition === activeFilters.condition;
      });
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (activeFilters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeFilters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeFilters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeFilters.sortBy === 'discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (activeFilters.sortBy === 'newest') {
      // Sort by id (newest items have higher IDs)
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    // Always show results immediately
    setFilteredItems(result);
    setLoading(false);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchQuery]);
  // Add this useEffect near other useEffects
  useEffect(() => {
    console.log('Current filtered items:', filteredItems);
    console.log('Current filtered items count:', filteredItems.length);
  }, [filteredItems]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // When query is completely cleared, reset to show all items immediately
    if (query.trim() === '') {
      setFilteredItems(detailedItems);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handlePriceRangeChange = (rangeId) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: rangeId
    }));
  };

  const handleConditionChange = (conditionId) => {
    setActiveFilters(prev => ({
      ...prev,
      condition: conditionId
    }));
  };

  const handleSortChange = (sortId) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: sortId
    }));
  };



  const handleResetFilters = () => {
    setActiveFilters({
      category: 'all',
      priceRange: 'all',
      condition: 'all',
      sortBy: 'newest',
      // deliveryTime: 'all'
    });
    setActiveCategory('all');
    setSearchQuery('');
    setSearchInput('');
    setItems(detailedItems); // Reset to all items
    setFilteredItems(detailedItems); // Also reset filtered items
  };;

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category !== 'all') count++;
    if (activeFilters.priceRange !== 'all') count++;
    if (activeFilters.condition !== 'all') count++;
    if (activeFilters.sortBy !== 'newest') count++;
    return count;
  };





  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-300" size={24} />
              <span className="text-yellow-200 font-medium">NFSU Official Marketplace</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">Find Everything You Need on Campus</h1>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  // Filter in real-time as user types
                  handleSearch(e.target.value);
                }}
                placeholder="Search for textbooks, laptops, furniture, notes..."
                className="w-full pl-12 pr-32 py-3 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-gray-900"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <button
                    onClick={async () => {
                      setRefreshing(true);
                      try {
                        const dbItems = await localDatabase.getItems({
                          status: 'approved',
                          showAll: false
                        });

                        // Combine with sample items (remove duplicates)
                        const combinedItems = [...detailedItems];
                        if (dbItems && dbItems.length > 0) {
                          dbItems.forEach(dbItem => {
                            if (!combinedItems.some(sampleItem => sampleItem.id === dbItem.id)) {
                              combinedItems.push(dbItem);
                            }
                          });
                        }

                        setItems(combinedItems);
                        setFilteredItems(combinedItems);
                        toast.success('Items refreshed!');
                      } catch (error) {
                        console.error('Error refreshing items:', error);
                        toast.error('Failed to refresh items');
                      } finally {
                        setRefreshing(false);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Refresh items"
                  >
                    <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className={`hidden lg:block ${filtersCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            {filtersCollapsed ? (
              // Collapsed state - only Filter icon button
              <div className="flex flex-col items-center py-4">
                <button
                  onClick={() => setFiltersCollapsed(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Expand Filters"
                >
                  <Filter size={20} className="text-gray-500" />
                </button>
                {getActiveFilterCount() > 0 && (
                  <div className="mt-2">
                    <span className="bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Expanded state
              <>
                {/* Header for expanded state */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                  <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Reset All
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handlePriceRangeChange(range.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.priceRange === range.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <span>{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Condition</h4>
                  <div className="space-y-2">
                    {conditionOptions.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => handleConditionChange(condition.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.condition === condition.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {condition.label}
                      </button>
                    ))}
                  </div>
                </div>



                {/* Sort */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.sortBy === option.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${filtersCollapsed ? 'lg:ml-0' : ''}`}>
          {/* Mobile Filters Bar */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Sliders size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              <select
                value={activeFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === 'all' ? 'All Items' : categories.find(c => c.id === activeCategory)?.label}
            </h2>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-600">
                {filteredItems.length} items found
                {searchQuery && ` for "${searchQuery}"`}
                {activeFilters.priceRange !== 'all' && ` • ${priceRanges.find(r => r.id === activeFilters.priceRange)?.label}`}
                {activeFilters.condition !== 'all' && ` • ${conditionOptions.find(c => c.id === activeFilters.condition)?.label}`}
              </p>
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Categories Quick Select - Mobile */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border transition-colors ${activeCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className={`grid gap-4 ${filtersCollapsed ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} userData={userData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No items found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No items matching "${searchQuery}". Try different keywords.`
                  : 'No items available with current filters. Try changing your filters.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {
        showMobileFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handlePriceRangeChange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.priceRange === range.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Condition</h4>
                  <div className="space-y-2">
                    {conditionOptions.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => handleConditionChange(condition.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.condition === condition.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {condition.label}
                      </button>
                    ))}
                  </div>
                </div>



                <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetFilters}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Marketplace;
