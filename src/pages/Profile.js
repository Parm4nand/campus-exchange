import React, { useState } from 'react';
import { User, Settings, ShoppingBag, Heart, Star, MapPin, Calendar, CreditCard, Shield, LogOut, Edit2, Camera, Package, MessageSquare, Bell, Globe, Lock, HelpCircle, Eye, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@nfsu.edu',
    avatar: 'AJ',
    campus: 'NFSU Delhi',
    memberSince: 'January 2023',
    rating: 4.8,
    totalSales: 24,
    totalPurchases: 18,
    responseRate: '98%',
    avgResponseTime: '15 min'
  });

  const mockListings = [
    { id: '1', title: 'Calculus Textbook', price: '$45', status: 'active', views: 142, likes: 28 },
    { id: '2', title: 'Gaming Laptop', price: '$1200', status: 'sold', views: 289, likes: 45 },
    { id: '3', title: 'Winter Jacket', price: '$35', status: 'active', views: 124, likes: 27 },
    { id: '4', title: 'Study Desk', price: '$80', status: 'reserved', views: 98, likes: 15 },
    { id: '5', title: 'Bicycle', price: '$150', status: 'active', views: 76, likes: 12 },
    { id: '6', title: 'Smartphone', price: '$400', status: 'sold', views: 210, likes: 34 }
  ];

  const mockReviews = [
    { id: '1', user: 'Sarah Chen', rating: 5, comment: 'Great seller! Item was exactly as described.', date: '2 days ago' },
    { id: '2', user: 'Mike Ross', rating: 4, comment: 'Fast response and smooth transaction.', date: '1 week ago' },
    { id: '3', user: 'Emma Wilson', rating: 5, comment: 'Perfect condition, highly recommended!', date: '2 weeks ago' }
  ];

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: ShoppingBag, count: 4 },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: 12 },
    { id: 'reviews', label: 'Reviews', icon: Star, count: 24 },
    { id: 'activity', label: 'Activity', icon: Calendar, count: 42 },
    { id: 'settings', label: 'Settings', icon: Settings, count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">My Profile</h1>
              <p className="text-white/90 text-xl">Manage your account and activities</p>
            </div>
            <div className="hidden md:block">
              <User className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8 blue-glow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.avatar}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-dark mb-1">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <button className="mt-4 md:mt-0 btn-secondary flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-gray-700">{user.campus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-gray-700">Member since {user.memberSince}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-bold text-dark">{user.rating}/5.0</span>
                  <span className="text-gray-600">({user.totalSales} sales)</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{user.totalSales}</p>
                  <p className="text-sm text-gray-600">Items Sold</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{user.totalPurchases}</p>
                  <p className="text-sm text-gray-600">Items Bought</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{user.responseRate}</p>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{user.avgResponseTime}</p>
                  <p className="text-sm text-gray-600">Avg. Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.count > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-white/20'
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-dark mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-medium">Sell an Item</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-medium">Messages</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors">
                  <Bell className="w-5 h-5 text-primary" />
                  <span className="font-medium">Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            {/* My Listings */}
            {activeTab === 'listings' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="title">My Listings</h2>
                  <button className="btn-primary flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Sell New Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockListings.map(listing => (
                    <div key={listing.id} className="card card-hover">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                              listing.status === 'active' ? 'bg-success/20 text-success' :
                              listing.status === 'sold' ? 'bg-gray-100 text-gray-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {listing.status.toUpperCase()}
                            </span>
                            <h3 className="font-bold text-dark mb-2">{listing.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{listing.price}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {listing.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {listing.likes}
                            </span>
                          </div>
                          <button className="btn-secondary text-sm px-3 py-1">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {activeTab === 'favorites' && (
              <div className="animate-fade-in">
                <h2 className="title mb-6">Favorites</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-6">Items you like will appear here</p>
                  <button className="btn-primary">Browse Marketplace</button>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="title">Reviews & Ratings</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-500 fill-current" />
                    <span className="text-2xl font-bold text-dark">{user.rating}</span>
                    <span className="text-gray-500">/5.0</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockReviews.map(review => (
                    <div key={review.id} className="card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {review.user[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-dark">{review.user}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h2 className="title mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Full Name</label>
                        <input type="text" defaultValue={user.name} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Email</label>
                        <input type="email" defaultValue={user.email} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Campus</label>
                        <select className="input-field" defaultValue={user.campus}>
                          <option>NFSU Delhi</option>
                          <option>NFSU Mumbai</option>
                          <option>NFSU Bangalore</option>
                          <option>NFSU Chennai</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Phone</label>
                        <input type="tel" placeholder="+1 (555) 123-4567" className="input-field" />
                      </div>
                    </div>
                    <button className="btn-primary mt-4">Save Changes</button>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Security
                    </h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-dark">Change Password</p>
                            <p className="text-sm text-gray-600">Update your login password</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-dark">Notifications</p>
                            <p className="text-sm text-gray-600">Manage your notification preferences</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-dark">Privacy</p>
                            <p className="text-sm text-gray-600">Control your privacy settings</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment Methods
                    </h3>
                    <div className="bg-primary-50 p-4 rounded-xl mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-dark">Campus Wallet</p>
                            <p className="text-sm text-gray-600">Balance: $245.50</p>
                          </div>
                        </div>
                        <button className="btn-secondary text-sm">Add Funds</button>
                      </div>
                    </div>
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-dark">Add Payment Method</p>
                        <p className="text-sm text-gray-600">Connect your bank account or card</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="card p-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-dark mb-2">Need Help?</h4>
                        <p className="text-gray-600 mb-4">Contact campus support for assistance</p>
                        <button className="btn-secondary">Contact Support</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
