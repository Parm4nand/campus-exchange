import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ShoppingBag, MapPin, Filter, Heart, Star, TrendingUp, Tag, Clock, Eye, Sparkles } from 'lucide-react';
import { formatPrice, debounce } from '../utils';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemDetailModal from '../components/ItemDetailModal';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  const categories = ['All', 'Textbooks', 'Furniture', 'Electronics', 'Study Materials', 'Clothing', 'Sports', 'Other'];
  
  const mockListings = [
    {
      id: '1',
      title: 'Introduction to Algorithms Textbook',
      description: 'Like new condition, all chapters included. Perfect for CS students.',
      price: 45.00,
      originalPrice: 65.00,
      images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=30'],
      seller: { name: 'Alice Johnson', rating: 4.8, verified: true },
      category: 'Textbooks',
      condition: 'Like New',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 142,
      likes: 28,
      tags: ['CS', 'Algorithms', 'Textbook'],
      trending: true,
      featured: true
    },
    {
      id: '2',
      title: 'Mini Fridge - Perfect for Dorm',
      description: 'Compact fridge, works perfectly, moving sale. Energy efficient.',
      price: 80.00,
      originalPrice: 120.00,
      images: ['https://picsum.photos/400/400?random=2'],
      seller: { name: 'Bob Smith', rating: 4.9, verified: true },
      category: 'Furniture',
      condition: 'Good',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 98,
      likes: 25,
      tags: ['Dorm', 'Appliances'],
      trending: false,
      featured: false
    },
    {
      id: '3',
      title: 'Calculus Study Guide Bundle',
      description: 'Complete study materials for Calc I & II. Includes solved papers.',
      price: 25.00,
      images: ['https://picsum.photos/400/400?random=3'],
      seller: { name: 'Carol White', rating: 5.0, verified: true },
      category: 'Study Materials',
      condition: 'Excellent',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 135,
      likes: 42,
      tags: ['Math', 'Calculus', 'Study'],
      trending: true,
      featured: true
    },
    {
      id: '4',
      title: 'Gaming Laptop - ASUS ROG',
      description: 'RTX 3060, 16GB RAM, 1TB SSD, perfect for gaming and coding',
      price: 1200.00,
      originalPrice: 1500.00,
      images: ['https://picsum.photos/400/400?random=4'],
      seller: { name: 'David Lee', rating: 4.7, verified: true },
      category: 'Electronics',
      condition: 'Like New',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 289,
      likes: 45,
      tags: ['Gaming', 'Laptop', 'Premium'],
      trending: false,
      featured: true
    },
    {
      id: '5',
      title: 'Cycling Helmet - Safety Certified',
      description: 'Brand new, never used. Size M, adjustable straps.',
      price: 15.00,
      images: ['https://picsum.photos/400/400?random=5'],
      seller: { name: 'Emma Wilson', rating: 4.6, verified: false },
      category: 'Sports',
      condition: 'New',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 48,
      likes: 13,
      tags: ['Sports', 'Safety', 'Outdoor'],
      trending: false,
      featured: false
    },
    {
      id: '6',
      title: 'Winter Jacket - Waterproof',
      description: 'Columbia winter jacket, size L, excellent condition',
      price: 35.00,
      originalPrice: 80.00,
      images: ['https://picsum.photos/400/400?random=6'],
      seller: { name: 'Frank Miller', rating: 4.8, verified: true },
      category: 'Clothing',
      condition: 'Excellent',
      campus: 'NFSU Delhi',
      createdAt: new Date().toISOString(),
      views: 124,
      likes: 27,
      tags: ['Winter', 'Clothing', 'Jacket'],
      trending: true,
      featured: false
    }
  ];

  useEffect(() => {
    const loadListings = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setListings(mockListings);
      setLoading(false);
    };
    loadListings();
  }, []);

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const sortedAndFilteredListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'All' || listing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort listings
    switch(sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'trending':
        return filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.views - a.views);
      case 'featured':
        return filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      case 'recent':
      default:
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [listings, searchQuery, selectedCategory, sortBy]);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'New': return { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-300' };
      case 'Like New': return { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' };
      case 'Excellent': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      case 'Good': return { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' };
      case 'Fair': return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' };
      default: return { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-300' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Campus Marketplace</h1>
              <p className="text-white/90 text-xl">Buy, sell, and trade with your campus community</p>
            </div>
            <div className="hidden md:block">
              <Sparkles className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Search and Filter Bar */}
        <div className="card p-6 mb-8 animate-fade-in blue-glow">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search textbooks, electronics, furniture..."
                  className="input-field pl-12"
                  onChange={(e) => handleSearch(e.target.value)}
                  defaultValue={searchQuery}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-48"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="trending">Trending</option>
                <option value="featured">Featured</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`chip ${selectedCategory === category ? 'chip-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-blue p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/90 text-sm">Active Listings</p>
              <p className="text-2xl font-bold text-white">{sortedAndFilteredListings.length}</p>
            </div>
          </div>
          
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Trending Items</p>
              <p className="text-2xl font-bold text-dark">{sortedAndFilteredListings.filter(l => l.trending).length}</p>
            </div>
          </div>
          
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Best Deals</p>
              <p className="text-2xl font-bold text-dark">{sortedAndFilteredListings.filter(l => l.originalPrice).length}</p>
            </div>
          </div>
          
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Featured</p>
              <p className="text-2xl font-bold text-dark">{sortedAndFilteredListings.filter(l => l.featured).length}</p>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4 text-lg">Loading campus listings...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="title">Available Items</h2>
                <p className="caption mt-1">{sortedAndFilteredListings.length} items found • Campus Marketplace</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-primary font-medium focus:outline-none"
                >
                  <option value="recent">Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAndFilteredListings.map(listing => {
                const conditionStyle = getConditionColor(listing.condition);
                const saveAmount = listing.originalPrice ? listing.originalPrice - listing.price : 0;
                
                return (
                  <div
                    key={listing.id}
                    onClick={() => setSelectedListing(listing)}
                    className={`card card-hover cursor-pointer overflow-hidden group animate-slide-up ${
                      listing.featured ? 'border-2 border-primary/30 blue-glow' : ''
                    }`}
                  >
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {listing.featured && (
                          <div className="badge flex items-center gap-1 bg-gradient-to-r from-primary to-primary-light">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </div>
                        )}
                        {listing.trending && (
                          <div className="badge flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </div>
                        )}
                        {saveAmount > 0 && (
                          <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold shadow-lg">
                            Save ${saveAmount}
                          </div>
                        )}
                      </div>
                      
                      {/* Condition Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg ${conditionStyle.bg} ${conditionStyle.text} text-xs font-medium border ${conditionStyle.border}`}>
                        {listing.condition}
                      </div>
                      
                      {/* Like Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle like functionality
                        }}
                        className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group/like blue-glow"
                      >
                        <Heart className="w-5 h-5 text-primary group-hover/like:fill-primary" />
                      </button>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-dark line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {listing.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Price Section */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="price-tag">
                          {formatPrice(listing.price)}
                        </span>
                        {listing.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(listing.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {listing.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Seller Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {listing.seller.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark">{listing.seller.name}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="text-xs text-gray-500">{listing.seller.rating}</span>
                              {listing.seller.verified && (
                                <span className="text-xs text-primary font-medium ml-1">✓ Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{listing.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(listing.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {sortedAndFilteredListings.length === 0 && !loading && (
          <div className="text-center py-16 card animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('recent');
              }}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}

        {selectedListing && (
          <ItemDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Marketplace;
