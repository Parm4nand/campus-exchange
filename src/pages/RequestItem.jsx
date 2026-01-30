import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestItem = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main Requests page where users can create requests
    navigate('/requests');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Requests page...</p>
      </div>
    </div>
  );
};

export default RequestItem;
