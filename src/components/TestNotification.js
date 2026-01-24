import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const TestNotification = () => {
  const { testNotification } = useNotifications();

  return (
    <button
      onClick={testNotification}
      className="fixed bottom-20 right-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      title="Test Notification"
    >
      <Bell className="w-5 h-5" />
    </button>
  );
};

export default TestNotification;
