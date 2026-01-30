import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/auth/PrivateRoute';
import QuickSwitch from './components/auth/QuickSwitch';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';

// Page Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import SellItem from './pages/SellItem';
import Requests from './pages/Requests';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import EventSocietyPanel from './pages/EventSocietyPanel';
import ItemDetail from './pages/ItemDetail';
import RequestItem from './pages/RequestItem';
import MyRequests from './pages/MyRequests';

// Styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000,
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes with Dashboard Layout */}
          <Route path="/" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/marketplace" replace />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="item/:id" element={<ItemDetail />} />
            <Route path="sell" element={<SellItem />} />
            <Route path="requests" element={<Requests />} />
            <Route path="request-item" element={<RequestItem />} />
            <Route path="my-requests" element={<MyRequests />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="admin" element={
              <PrivateRoute requireAdmin={true}>
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="event-society" element={
              <PrivateRoute requireEventSociety={true}>
                <EventSocietyPanel />
              </PrivateRoute>
            } />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
        
        <QuickSwitch />
      </AuthProvider>
    </Router>
  );
}

export default App;
