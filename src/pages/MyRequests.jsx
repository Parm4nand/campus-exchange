import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyRequests = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    // Redirect to Requests page with a filter for user's requests
    if (userData) {
      navigate('/requests');
    } else {
      navigate('/login');
    }
  }, [navigate, userData]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your requests...</p>
      </div>
    </div>
  );
};

export default MyRequests;
