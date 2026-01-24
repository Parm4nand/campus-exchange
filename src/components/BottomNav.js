import React from 'react';
import { ShoppingBag, Package, Calendar, MessageCircle, Plus, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  
  const navItems = [
    { id: 'marketplace', icon: ShoppingBag, label: 'Market', color: 'primary' },
    { id: 'requests', icon: Package, label: 'Requests', color: 'primary' },
    { id: 'events', icon: Calendar, label: 'Events', color: 'primary' },
    { id: 'messages', icon: MessageCircle, label: 'Chat', color: 'primary' },
    { id: 'create', icon: Plus, label: 'Sell', color: 'primary' },
    { id: 'profile', icon: User, label: 'Profile', color: 'primary' },
  ];

  // If user is admin, add admin to nav items
  const allNavItems = user?.isAdmin 
    ? [...navItems, { id: 'admin', icon: Shield, label: 'Admin', color: 'primary' }]
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-primary-200/60 z-50 shadow-bottom-nav">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {allNavItems.map((item) => {
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex flex-col items-center py-3 px-2 transition-all duration-300 flex-1 min-w-0 ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary" />
                )}
                
                {/* Icon Container */}
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-50 scale-110' 
                    : 'hover:bg-primary-50'
                }`}>
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`} />
                  
                  {/* Notification Badge */}
                  {(item.id === 'messages' || item.id === 'marketplace') && !isActive && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                      3
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-semibold mt-1 transition-all duration-300 ${
                  isActive ? 'scale-105 opacity-100' : 'opacity-90'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
