import React, { useState } from 'react';
import { ShoppingBag, Bell, Shield, X, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getPageTheme } from '../utils/theme';

const Header = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const theme = getPageTheme(currentPage);

  const mockNotifications = [
    {
      id: 1,
      title: 'New message from Alice',
      description: 'Is the textbook still available?',
      time: '10 minutes ago',
      type: 'message',
      read: false
    },
    {
      id: 2,
      title: 'Listing Approved',
      description: 'Your "Gaming Console" listing has been approved',
      time: '2 hours ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Event Registration Confirmed',
      description: 'Your registration for Tech Fest is confirmed',
      time: '1 day ago',
      type: 'event',
      read: true
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    // In a real app, you would update this on the server
    console.log('Marked notification as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, you would update this on the server
    console.log('Marked all notifications as read');
  };

  const clearAllNotifications = () => {
    // In a real app, you would clear notifications
    console.log('Cleared all notifications');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'event':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b ${theme.border} ${theme.bg} backdrop-blur-sm bg-opacity-90`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentPage('marketplace')}
          >
            <div className={`p-2 rounded-lg ${theme.light} group-hover:scale-110 transition-transform`}>
              <ShoppingBag className={`w-6 h-6 ${theme.text}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                CampusXchange
              </h1>
              <p className="text-xs text-gray-500">{user?.campus || 'NFSU Delhi'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.isAdmin && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`px-4 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
            <div className="relative">
              <button
                className={`p-2 rounded-lg ${theme.light} hover:opacity-80 transition-all relative`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className={`w-5 h-5 ${theme.text}`} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {mockNotifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No notifications</p>
                        <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-gray-900">{notification.title}</p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setCurrentPage('profile')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
