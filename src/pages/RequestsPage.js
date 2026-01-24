import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Clock, Users, Tag, CheckCircle, MessageSquare, Share2, Heart } from 'lucide-react';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockRequests = [
    {
      id: '1',
      title: 'Looking for Calculus Textbook',
      description: 'Need Calculus II textbook for this semester. Preferably new or like new condition.',
      category: 'Textbooks',
      budget: '$30 - $50',
      campus: 'NFSU Delhi',
      createdAt: '2 hours ago',
      responses: 5,
      user: { name: 'John Doe', avatar: 'JD' },
      urgent: true,
      status: 'active'
    },
    {
      id: '2',
      title: 'Need Dorm Room Mini Fridge',
      description: 'Looking for a compact fridge for dorm room. Must be energy efficient and in good working condition.',
      category: 'Furniture',
      budget: '$60 - $100',
      campus: 'NFSU Delhi',
      createdAt: '5 hours ago',
      responses: 3,
      user: { name: 'Sarah Chen', avatar: 'SC' },
      urgent: false,
      status: 'active'
    },
    {
      id: '3',
      title: 'Searching for Used Laptop',
      description: 'Need a laptop for coding and assignments. Minimum 8GB RAM, SSD preferred.',
      category: 'Electronics',
      budget: '$300 - $500',
      campus: 'NFSU Delhi',
      createdAt: '1 day ago',
      responses: 8,
      user: { name: 'Mike Ross', avatar: 'MR' },
      urgent: true,
      status: 'active'
    },
    {
      id: '4',
      title: 'Winter Jacket Size M',
      description: 'Looking for a warm winter jacket. Columbia, North Face, or similar brands preferred.',
      category: 'Clothing',
      budget: '$40 - $70',
      campus: 'NFSU Delhi',
      createdAt: '2 days ago',
      responses: 4,
      user: { name: 'Emma Wilson', avatar: 'EW' },
      urgent: false,
      status: 'active'
    },
    {
      id: '5',
      title: 'Study Table for Room',
      description: 'Need a sturdy study table. Preferably with shelves and in good condition.',
      category: 'Furniture',
      budget: '$50 - $80',
      campus: 'NFSU Delhi',
      createdAt: '3 days ago',
      responses: 2,
      user: { name: 'Alex Turner', avatar: 'AT' },
      urgent: false,
      status: 'active'
    },
    {
      id: '6',
      title: 'Graphics Calculator TI-84',
      description: 'Looking for Texas Instruments TI-84 calculator for math courses.',
      category: 'Study Materials',
      budget: '$60 - $90',
      campus: 'NFSU Delhi',
      createdAt: '1 week ago',
      responses: 6,
      user: { name: 'Priya Sharma', avatar: 'PS' },
      urgent: false,
      status: 'active'
    }
  ];

  const categories = ['All', 'Textbooks', 'Furniture', 'Electronics', 'Clothing', 'Study Materials', 'Sports', 'Other'];

  const tabs = [
    { id: 'all', label: 'All Requests', count: mockRequests.length },
    { id: 'urgent', label: 'Urgent', count: mockRequests.filter(r => r.urgent).length },
    { id: 'my', label: 'My Requests', count: 2 },
    { id: 'responded', label: 'Responded', count: 3 },
    { id: 'fulfilled', label: 'Fulfilled', count: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Campus Requests</h1>
              <p className="text-white/90 text-xl">Find what you need or help others find what they're looking for</p>
            </div>
            <div className="hidden md:block">
              <Users className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Search and Filter Bar */}
        <div className="card p-6 mb-8 blue-glow">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search for requests..."
                  className="input-field pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select className="input-field w-40">
                <option>Sort by: Newest</option>
                <option>Sort by: Urgent</option>
                <option>Sort by: Most Responses</option>
              </select>
              
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                className={`chip ${category === 'All' ? 'chip-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20'
                  : 'bg-primary-100 text-primary-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Requests</p>
                <p className="text-3xl font-bold text-dark">42</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Urgent Requests</p>
                <p className="text-3xl font-bold text-dark">8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card-blue p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm mb-1">Avg. Response Time</p>
                <p className="text-3xl font-bold text-white">2.4 hours</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="mb-6">
          <h2 className="title mb-4">Recent Requests</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockRequests.map(request => (
              <div key={request.id} className="card card-hover">
                <div className="p-6">
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {request.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {request.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-dark mb-2">{request.title}</h3>
                      <p className="text-gray-600 mb-4">{request.description}</p>
                    </div>
                  </div>

                  {/* Budget and Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{request.budget}</span>
                        <span className="text-sm text-gray-500">Budget</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{request.campus}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{request.createdAt}</span>
                    </div>
                  </div>

                  {/* User and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {request.user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark">{request.user.name}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {request.responses} responses
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="card-blue p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Can't find what you're looking for?</h3>
          <p className="text-white/80 mb-6">Post your request and let the campus community help you find it</p>
          <button className="btn-white flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Create New Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
