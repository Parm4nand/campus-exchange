import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthScreen from './AuthScreen';
import Marketplace from './Marketplace';
import RequestsPage from './RequestsPage';
import EventsPage from './EventsPage';
import Messages from './Messages';
import CreateListing from './CreateListing';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import NotificationContainer from '../components/NotificationContainer';
import TestNotification from '../components/TestNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('marketplace');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your campus experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 blue-theme">
      <NotificationContainer />
      <TestNotification />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'requests' && <RequestsPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'messages' && <Messages />}
        {currentPage === 'create' && <CreateListing />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'admin' && user?.isAdmin && <AdminDashboard />}
      </main>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default MainApp;
