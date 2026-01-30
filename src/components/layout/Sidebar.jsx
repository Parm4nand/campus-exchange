import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Calendar,
  MessageSquare,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();

  // Updated navigation items with correct paths
  const mainNavItems = [
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={22} />, badge: null },
    { path: '/requests', label: 'Requests', icon: <FileText size={22} />, badge: null },
    { path: '/events', label: 'Events', icon: <Calendar size={22} />, badge: null },
    { path: '/chat', label: 'Messages', icon: <MessageSquare size={22} />, badge: '5' },
  ];

  const secondaryNavItems = [
    { path: '/sell', label: 'Sell Item', icon: <Plus size={22} /> },
    { path: '/profile', label: 'Profile', icon: <User size={22} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        shadow-xl
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!collapsed ? (
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
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    CampusXChange
                  </h1>
                  <p className="text-xs text-gray-500">NFSU</p>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => navigate('/marketplace')}
                className="mx-auto"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CX</span>
                </div>
              </button>
            )}
            
            {/* Collapse Toggle */}
            <button
              onClick={onToggle}
              className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {collapsed ? (
                <ChevronRight size={20} className="text-gray-500" />
              ) : (
                <ChevronLeft size={20} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200">
                  <User size={24} className="text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{userData?.name || 'Student'}</p>
                <p className="text-sm text-gray-500 truncate">{userData?.email || 'student@nfsu.ac.in'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                  {userData?.role || 'student'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          {/* Main Navigation */}
          <div className="px-4 space-y-1">
            <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 ${
              collapsed ? 'text-center' : ''
            }`}>
              {collapsed ? '···' : 'Navigation'}
            </p>
            
            {mainNavItems.map((item) => {
              const isActive = currentPath === item.path || 
                              currentPath.startsWith(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center w-full p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${collapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  
                  {!collapsed && item.badge && (
                    <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div className="px-4 mt-8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation('/sell')}
                  className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Sell Item
                </button>
                <button
                  onClick={() => handleNavigation('/requests')}
                  className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Request
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed ? (
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl w-full"
              >
                <User size={20} className="text-gray-500" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl w-full"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center justify-center p-3 text-gray-700 hover:bg-gray-50 rounded-xl w-full"
              >
                <User size={20} className="text-gray-500" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-xl w-full"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
