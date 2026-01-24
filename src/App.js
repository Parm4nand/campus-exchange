import React from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import MainApp from './pages/MainApp';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AdminProvider>
          <MainApp />
        </AdminProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
