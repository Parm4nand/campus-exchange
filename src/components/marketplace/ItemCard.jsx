import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageCircle, Heart, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import localDatabase from '../../services/localDatabase';

const ItemCard = ({ item, userData }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [viewCount, setViewCount] = useState(item.views || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [selectedItemForChat, setSelectedItemForChat] = useState(null);
  console.log('ItemCard rendering:', item.id, item.title, item.image, item.images);
  console.log('ItemCard full item:', item);
  // Function to increment view count in database
  const incrementViewCount = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await localDatabase.incrementItemViews(item.id);

      if (result.success) {
        setViewCount(result.views);

        // Optional: Log to audit trail
        await localDatabase.logAudit('ITEM_VIEWED', userData?.id || 'anonymous', {
          itemId: item.id,
          itemTitle: item.title,
          currentViews: result.views,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating view count:', error);
      // Fallback to localStorage if database fails
      const viewsKey = `item_views_${item.id}`;
      const currentViews = parseInt(localStorage.getItem(viewsKey) || '0');
      const newViews = currentViews + 1;
      localStorage.setItem(viewsKey, newViews.toString());
      setViewCount(newViews);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = () => {
    if (!userData) {
      toast.error('Please login to chat with seller');
      return;
    }
    setSelectedItemForChat(item);
    setShowChatOptions(true);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
    // Track view when image is clicked
    incrementViewCount();
  };

  const handleViewDetails = () => {
    // Track view when details are clicked
    incrementViewCount();
    navigate(`/item/${item.id}`);
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setShowImageModal(false);
  };

  // Load initial view count from database
  useEffect(() => {
    const loadViewCount = async () => {
      try {
        // Get the latest item data from database
        const dbItem = await localDatabase.getItem(item.id);
        if (dbItem && dbItem.views) {
          setViewCount(dbItem.views);
        }
      } catch (error) {
        console.error('Error loading view count:', error);
        // Fallback to localStorage
        const viewsKey = `item_views_${item.id}`;
        const savedViews = localStorage.getItem(viewsKey);
        if (savedViews) {
          setViewCount(parseInt(savedViews));
        }
      }
    };

    loadViewCount();
  }, [item.id]);

  const calculateDiscount = () => {
    if (item.originalPrice && item.price < item.originalPrice) {
      return Math.round((1 - item.price / item.originalPrice) * 100);
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 w-full">
        {/* Image Container */}
        <div
          className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={item.image || (item.images && item.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9IiNlZWVlZWUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiLz48dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              console.log('Image failed to load for item:', item.id, 'src:', e.target.src);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9IiNlZWVlZWUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiLz48dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
            }}
            onLoad={() => console.log('Image loaded for item:', item.id)}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Like Button - Only badge we keep */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:shadow-md"
            >
              <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow">
              {item.condition || 'Good'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category & Campus */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {item.category?.toUpperCase() || 'ITEM'}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              {item.campus || 'Campus'}
            </div>
          </div>

          <h3
            onClick={handleViewDetails}
            className="font-bold text-gray-900 text-lg leading-tight mb-2 cursor-pointer hover:text-blue-600 line-clamp-1"
          >
            {item.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-blue-600">₹{item.price?.toLocaleString()}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>
            {/* Real view count - Now using viewCount state */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Eye size={14} />
                <span>{viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rating & Seller */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold ml-1">{item.rating || 4.5}</span>
                <span className="text-gray-500 text-sm ml-1">({item.reviews || 0})</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              by {item.seller || item.sellerName || 'Seller'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              View Details
            </button>
            <button
              onClick={handleChatClick}
              className="px-3 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
              title="Contact seller"
            >
              <MessageCircle size={16} />
            </button>
          </div>

          {/* Quick Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{item.campus || 'Campus'}</span>
              </div>
              <div className="text-gray-500">
                {item.quantity > 1 ? `${item.quantity} left` : 'Last one'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/95"
            onClick={handleCloseModal}
            style={{ pointerEvents: 'auto' }}
          />

          <div className="relative h-full flex items-center justify-center p-4">
            <div
              className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 z-10 shadow-lg border border-gray-200"
              >
                <X size={24} className="text-gray-800" />
              </button>

              <img
                src={item.image || (item.images && item.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9IiNlZWVlZWUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiLz48dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
                alt={item.title}
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-50"
              />
              <div className="p-4 bg-gray-900">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">₹{item.price?.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      handleViewDetails();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Chat Options Modal - Same as ItemDetail.jsx */}
      {showChatOptions && selectedItemForChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Contact Seller</h2>
                <button
                  onClick={() => {
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img
                    src={selectedItemForChat.image}
                    alt={selectedItemForChat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{selectedItemForChat.title}</h3>
                  <p className="text-sm text-gray-600">Price: ₹{selectedItemForChat.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-700 font-medium">What would you like to do?</p>

                <button
                  onClick={() => {
                    navigate(`/chat?userId=${selectedItemForChat.sellerId}&context=item&contextId=${selectedItemForChat.id}&purpose=negotiate`);
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">₹</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Negotiate Price</div>
                      <div className="text-sm text-gray-600">Make an offer or ask for discount</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate(`/chat?userId=${selectedItemForChat.sellerId}&context=item&contextId=${selectedItemForChat.id}&purpose=questions`);
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">?</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Ask Questions</div>
                      <div className="text-sm text-gray-600">Get more details about the item</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate(`/chat?userId=${selectedItemForChat.sellerId}&context=item&contextId=${selectedItemForChat.id}&purpose=meet`);
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Arrange Meetup</div>
                      <div className="text-sm text-gray-600">Discuss pickup location & time</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate(`/chat?userId=${selectedItemForChat.sellerId}&context=item&contextId=${selectedItemForChat.id}`);
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MessageCircle size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Just Chat</div>
                      <div className="text-sm text-gray-600">Start a general conversation</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowChatOptions(false);
                    setSelectedItemForChat(null);
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;