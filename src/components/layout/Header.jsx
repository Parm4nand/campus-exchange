import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Bell, MessageSquare, Plus, User, Menu,
  Home, ShoppingBag, Calendar, Package, Settings,
  ChevronDown, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { path: '/requests', label: 'Requests', icon: <Package size={20} /> }, // CHANGED from '/request-item' to '/requests'
    { path: '/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/chat', label: 'Messages', icon: <MessageSquare size={20} /> },
  ];

  const currentPath = location.pathname;

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Your item was viewed 15 times', description: 'MacBook Air M1', time: '5 min ago', unread: true },
    { id: 2, title: 'New offer received', description: 'Someone offered ₹52,000', time: '1 hour ago', unread: true },
    { id: 3, title: 'Event registration confirmed', description: 'Annual Tech Fest 2024', time: '2 hours ago', unread: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white border-b border-gray-100'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Logo */}
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg">CX</span>
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    CampusXChange
                  </h1>
                  <p className="text-xs text-gray-500">NFSU Student Marketplace</p>
                </div>
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${currentPath.startsWith(item.path)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <span className="opacity-80">{item.icon}</span>
                    <span>{item.label}</span>
                    {currentPath.startsWith(item.path) && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items, requests, events..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 font-medium text-sm hover:text-blue-700"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile Search */}
              <button
                onClick={() => navigate('/marketplace')}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Search size={22} />
              </button>

              {/* Sell Button */}
              <button
                onClick={() => navigate('/sell')}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={20} />
                <span>Sell Item</span>
              </button>

              {/* Messages */}
              <button
                onClick={() => navigate('/chat')}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <MessageSquare size={22} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Bell size={22} />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 ${notification.unread
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-transparent'
                              }`}
                            onClick={() => {
                              setShowNotifications(false);
                              // Handle notification click
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                <p className="text-gray-600 text-xs mt-1">{notification.description}</p>
                                <span className="text-gray-500 text-xs mt-2 block">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border border-blue-200">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{userData?.name || 'Student'}</p>
                    <p className="text-xs text-gray-500 capitalize">{userData?.role || 'student'}</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500 hidden lg:block" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{userData?.name || 'Student'}</p>
                        <p className="text-sm text-gray-500">{userData?.email || 'student@nfsu.ac.in'}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <User size={18} className="text-gray-500" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/my-requests');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Package size={18} className="text-gray-500" />
                          <span>My Requests</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/sell');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Plus size={18} className="text-gray-500" />
                          <span>Sell Item</span>
                        </button>
                      </div>
                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (only visible on mobile) */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, requests..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </form>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
