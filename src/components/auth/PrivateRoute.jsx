import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Shield, Users } from 'lucide-react';

const PrivateRoute = ({ children, requireAdmin = false, requireEventSociety = false }) => {
  const { currentUser, loading, userData } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires admin but user is not admin
  if (requireAdmin && userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={48} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin Access Required</h1>
          <p className="text-gray-600 mb-4">
            You need administrator privileges to access this page.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your current role: <span className="font-semibold text-gray-900 capitalize">{userData?.role || 'student'}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Login as admin@nfsu.ac.in with password "admin123"
            </p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Go to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if route requires event society but user is not event_society or admin
  if (requireEventSociety && userData?.role !== 'event_society' && userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={48} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Event Society Access Required</h1>
          <p className="text-gray-600 mb-4">
            You need Event Society or Administrator privileges to access this panel.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your current role: <span className="font-semibold text-gray-900 capitalize">{userData?.role || 'student'}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Login options:
            </p>
            <div className="mt-2 space-y-1 text-left">
              <div className="text-xs text-gray-600">• Event Society: events@nfsu.ac.in / EventSociety@2024</div>
              <div className="text-xs text-gray-600">• Admin: admin@nfsu.ac.in / admin123</div>
            </div>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.href = '/events'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Go to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
