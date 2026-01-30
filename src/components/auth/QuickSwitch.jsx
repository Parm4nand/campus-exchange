import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Shield, LogOut, Calendar } from 'lucide-react';

const QuickSwitch = () => {
  const { currentUser, userData, login, logout } = useAuth();

  const switchToStudent = async () => {
    try {
      const result = await login('student@nfsu.ac.in', 'password123');
      if (result.success) {
        toast.success('Switched to Student account');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to switch to student');
      }
    } catch (error) {
      toast.error('Failed to switch to student');
    }
  };

  const switchToAdmin = async () => {
    try {
      const result = await login('admin@nfsu.ac.in', 'admin123');
      if (result.success) {
        toast.success('Switched to Admin account');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to switch to admin');
      }
    } catch (error) {
      toast.error('Failed to switch to admin');
    }
  };

  const switchToEventSociety = async () => {
    try {
      const result = await login('events@nfsu.ac.in', 'EventSociety@2024');
      if (result.success) {
        toast.success('Switched to Event Society account');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to switch to event society');
      }
    } catch (error) {
      toast.error('Failed to switch to event society');
    }
  };

  // Only show in development/local environment
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            🔧 Quick Switch
          </span>
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {userData?.role || 'Unknown'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
            Logged in as: <strong>{userData?.name || currentUser?.email}</strong>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <button
              onClick={switchToStudent}
              className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1"
            >
              <User size={12} />
              Student
            </button>
            
            <button
              onClick={switchToAdmin}
              className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-1"
            >
              <Shield size={12} />
              Admin
            </button>
            
            <button
              onClick={switchToEventSociety}
              className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors flex items-center gap-1"
            >
              <Calendar size={12} />
              Event Society
            </button>
            
            <button
              onClick={logout}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Development tool • All features enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSwitch;
