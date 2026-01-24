import React, { useState } from 'react';
import { X, MessageCircle, Send, Calendar, Heart, Star, Check, Shield, Truck, CreditCard, MapPin, Clock, Eye, Share2, Flag, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils';
import { useNotifications } from '../context/NotificationContext';

const ItemDetailModal = ({ listing, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const { addNotification } = useNotifications();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
    
    // Simulate seller response after 2 seconds
    setTimeout(() => {
      const sellerResponse = {
        id: Date.now() + 1,
        text: `Hi! Thanks for your interest in "${listing.title}". Yes, it's still available. When would you like to meet?`,
        sender: 'seller',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, sellerResponse]);
    }, 2000);

    addNotification({
      type: 'success',
      title: 'Message Sent',
      message: `Message sent to ${listing.seller.name}`
    });
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

  const conditionStyle = getConditionColor(listing.condition);
  const saveAmount = listing.originalPrice ? listing.originalPrice - listing.price : 0;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-primary-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
              Item Details
              {listing.trending && (
                <span className="px-3 py-1 bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  TRENDING
                </span>
              )}
              {listing.featured && (
                <span className="px-3 py-1 bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold rounded-full">
                  FEATURED
                </span>
              )}
            </h2>
            <p className="text-gray-500 text-sm mt-1">#{listing.id} • Posted today</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Item Details */}
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {listing.images.length > 1 && (
                  <div className="flex gap-3">
                    {listing.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-1 aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                          idx === currentImageIndex 
                            ? 'border-primary scale-105' 
                            : 'border-transparent hover:border-primary-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Title Section */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                        {listing.category}
                      </span>
                      <span className={`px-3 py-1 ${conditionStyle.bg} ${conditionStyle.text} text-sm font-medium rounded-full border ${conditionStyle.border}`}>
                        {listing.condition}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-dark mb-2">{listing.title}</h1>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      addNotification({
                        type: 'success',
                        title: isLiked ? 'Removed from favorites' : 'Added to favorites',
                        message: isLiked ? 'Item removed from your favorites' : 'Item added to your favorites'
                      });
                    }}
                    className="p-3 hover:bg-primary-50 rounded-xl transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-primary text-primary' : 'text-gray-400 hover:text-primary'}`} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(listing.price)}
                    </span>
                    {listing.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(listing.originalPrice)}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-bold rounded-lg">
                          Save ${saveAmount}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Views</span>
                    </div>
                    <p className="font-bold text-dark">{listing.views}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <p className="font-bold text-dark">{listing.likes}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Posted</span>
                    </div>
                    <p className="font-bold text-dark">Today</p>
                  </div>
                </div>
              </div>

              {/* Description & Details */}
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                </div>

                {/* Tags */}
                {listing.tags && listing.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {listing.campus}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-dark">{listing.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Seller Rating</p>
                    <p className="font-medium text-dark flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      {listing.seller.rating}/5.0
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Response Time</p>
                    <p className="font-medium text-dark">~1 hour</p>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {listing.seller.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-dark">{listing.seller.name}</h3>
                      {listing.seller.verified && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                          <Shield className="w-3 h-3" />
                          Verified Seller
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mb-2">Active seller • 98% positive reviews</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>24 items sold</span>
                      <span>•</span>
                      <span>Member since 2023</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium transition-colors">
                    View Profile
                  </button>
                  <button className="py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium transition-colors">
                    Other Items
                  </button>
                  <button className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                    <Flag className="w-3 h-3" />
                    Report
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Chat & Actions */}
            <div className="space-y-6">
              {/* Safety Tips */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Safe Trading Tips
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-primary-800">Meet on Campus</p>
                      <p className="text-sm text-primary-700">Always meet in public campus areas during daylight</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Inspect Items</p>
                      <p className="text-sm text-blue-700">Check the item thoroughly before purchasing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl">
                    <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-cyan-800">Secure Payment</p>
                      <p className="text-sm text-cyan-700">Use campus-recommended payment methods</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Chat with {listing.seller.name.split(' ')[0]}
                </h3>
                
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto mb-4 space-y-4 p-3 bg-primary-50 rounded-xl">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-primary-300" />
                      <p className="font-medium text-gray-600">Start a conversation</p>
                      <p className="text-sm text-gray-400 mt-1">Ask about availability, condition, or price</p>
                    </div>
                  ) : (
                    chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-white text-dark rounded-bl-sm border border-primary-200'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-2 ${
                            msg.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {msg.timestamp} {msg.sender === 'me' ? '• You' : `• ${listing.seller.name.split(' ')[0]}`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message ${listing.seller.name.split(' ')[0]} about "${listing.title}"...`}
                    rows={3}
                    className="input-field"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                      disabled={!message.trim()}
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessage(`Hi ${listing.seller.name.split(' ')[0]}, I'm interested in your "${listing.title}". Is it still available?`);
                      }}
                      className="btn-secondary text-sm"
                    >
                      Quick Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-dark mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      addNotification({
                        type: 'success',
                        title: 'Meeting Scheduled',
                        message: 'Suggested meeting time sent to seller'
                      });
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-medium">Suggest Meeting Time</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      addNotification({
                        type: 'info',
                        title: 'Shared',
                        message: 'Item link copied to clipboard'
                      });
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">Share Item</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      addNotification({
                        type: 'warning',
                        title: 'Offer Sent',
                        message: 'Price offer sent to seller for review'
                      });
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Make an Offer</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-primary-200 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Avg. Response</p>
                    <p className="font-bold text-dark">15 min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Campus Pickup</p>
                    <p className="font-bold text-dark flex items-center justify-center gap-1">
                      <Truck className="w-4 h-4 text-primary" />
                      Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
