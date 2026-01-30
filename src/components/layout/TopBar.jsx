import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationSystem from '../NotificationSystem';

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  onMenuClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center: CampusXchange Title */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div 
                onClick={() => navigate('/marketplace')}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <h1 className="font-bold text-gray-900 text-xl">CampusXchange</h1>
                <p className="text-xs text-gray-500 text-center">NFSU Marketplace</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Help */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                <HelpCircle size={20} />
                <span>Help</span>
              </button>

              {/* Notifications - REAL NotificationSystem */}
              <NotificationSystem />
            </div>
          </div>

          {/* Mobile Center Title - Only shows on mobile */}
          <div className="md:hidden flex items-center justify-center mt-2">
            <div 
              onClick={() => navigate('/marketplace')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <h1 className="font-bold text-gray-900 text-lg text-center">CampusXchange</h1>
              <p className="text-xs text-gray-500 text-center">NFSU Marketplace</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="space-y-4">
                <button onClick={() => { navigate('/marketplace'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Marketplace</span>
                </button>
                <button onClick={() => { navigate('/requests'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Requests</span>
                </button>
                <button onClick={() => { navigate('/events'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Events</span>
                </button>
                <button onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Messages</span>
                </button>
                <button onClick={() => { navigate('/sell'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Sell Item</span>
                </button>
                <button onClick={() => { navigate('/request-item'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors">
                  <span className="font-medium">Make Request</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button onClick={() => { navigate('/help'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 w-full">
                  <HelpCircle size={18} />
                  <span>Help & Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;