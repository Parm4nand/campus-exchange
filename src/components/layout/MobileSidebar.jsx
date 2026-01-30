import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, FileText, Calendar, MessageSquare, User, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  const navItems = [
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={22} /> },
    { path: '/requests', label: 'Requests', icon: <FileText size={22} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={22} /> },
    { path: '/chat', label: 'Messages', icon: <MessageSquare size={22} /> },
    { path: '/profile', label: 'Profile', icon: <User size={22} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CX</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">CampusXChange</h2>
              <p className="text-xs text-gray-500">NFSU Marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{userData?.name || 'Student'}</p>
              <p className="text-sm text-gray-500">{userData?.email || 'student@nfsu.ac.in'}</p>
              <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                {userData?.role || 'student'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-3 w-full p-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
              >
                <span className="opacity-80">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleNavigation('/sell')}
              className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium"
            >
              <Plus size={22} />
              <span>Sell Item</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/requests')}
              className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium"
            >
              <Plus size={22} />
              <span>Create Request</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            CampusXChange © 2024
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            NFSU Student Marketplace Platform
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
