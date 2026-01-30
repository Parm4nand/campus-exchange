import React, { useState } from 'react';
import { Heart, Shield, Users, Globe, ChevronUp, ChevronDown } from 'lucide-react';

const Footer = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <footer className={`bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 transition-all duration-500 ease-in-out ${isCollapsed ? 'h-16' : 'h-auto'}`}>
      
      {/* Collapse/Expand Button - Only shows when footer is at bottom */}
      <div className="flex justify-center -mt-4 mb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-t-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center w-12 h-8 shadow-lg hover:shadow-xl active:scale-95"
          title="Toggle footer"
        >
          {isCollapsed ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronUp size={18} />
          )}
        </button>
      </div>

      {/* Footer Content - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CX</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">CampusXChange</h3>
                  <p className="text-sm text-gray-600">NFSU Marketplace</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                The official marketplace for NFSU students. Buy, sell, and connect with your campus community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Marketplace', 'Sell Item', 'Make Request', 'Events', 'Messages'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-all duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Policies</h4>
              <div className="space-y-2">
                {['Terms of Service', 'Privacy Policy', 'Community Guidelines', 'Refund Policy', 'Safety Tips'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-all duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Campus Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">NFSU Campuses</h4>
              <div className="space-y-2">
                {['Main Campus', 'North Campus', 'South Campus', 'Law Campus', 'Distance Learning'].map((campus) => (
                  <div key={campus} className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {campus}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={18} className="text-green-500" />
                  <span>Verified Campus Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={18} className="text-blue-500" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={18} className="text-purple-500" />
                  <span>Secure Transactions</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <span className="text-lg">f</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <span className="text-lg">📸</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <span className="text-lg">𝕏</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <span className="text-lg">in</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Made with <Heart size={12} className="inline text-red-500" /> for NFSU students
            </p>
            <p className="text-gray-400 text-xs mt-2">
              © 2024 CampusXchange. All rights reserved. National Forensic Sciences University
            </p>
            <p className="text-gray-800 font-bold text-xs mt-2 bg-yellow-100 px-3 py-1 rounded-full inline-block">
              🚀 Built by NullPointers
            </p>
          </div>
        </div>
      )}

      {/* Collapsed State - Shows when footer is collapsed */}
      {isCollapsed && (
        <div className="h-16 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 opacity-70 mb-1">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CX</span>
            </div>
            <p className="text-gray-500 text-sm">CampusXchange NFSU</p>
          </div>
          <p className="text-gray-400 text-xs">Click button above to expand</p>
        </div>
      )}
    </footer>
  );
};

export default Footer;