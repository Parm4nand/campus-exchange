import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [pendingListings, setPendingListings] = useState([
    {
      id: 'pending_1',
      title: 'Gaming Console - PS5',
      description: 'Like new PS5 with 2 controllers and 3 games',
      price: 45000,
      category: 'Electronics',
      condition: 'Like New',
      seller: { name: 'Rahul Sharma', email: 'rahul@nfsu.ac.in' },
      submittedAt: '2024-02-20T10:30:00Z',
      images: ['https://picsum.photos/400/400?random=5']
    },
    {
      id: 'pending_2',
      title: 'Engineering Physics Textbook',
      description: 'DC Pandey Physics for JEE, excellent condition',
      price: 800,
      category: 'Textbooks',
      condition: 'Excellent',
      seller: { name: 'Priya Singh', email: 'priya@nfsu.ac.in' },
      submittedAt: '2024-02-19T15:20:00Z',
      images: ['https://picsum.photos/400/400?random=6']
    }
  ]);

  const [approvedListings, setApprovedListings] = useState([]);
  const [rejectedListings, setRejectedListings] = useState([]);

  const approveListing = (listingId) => {
    const listing = pendingListings.find(l => l.id === listingId);
    if (listing) {
      setPendingListings(pendingListings.filter(l => l.id !== listingId));
      setApprovedListings([...approvedListings, { ...listing, approvedAt: new Date().toISOString() }]);
      return true;
    }
    return false;
  };

  const rejectListing = (listingId, reason) => {
    const listing = pendingListings.find(l => l.id === listingId);
    if (listing) {
      setPendingListings(pendingListings.filter(l => l.id !== listingId));
      setRejectedListings([...rejectedListings, { ...listing, rejectedAt: new Date().toISOString(), reason }]);
      return true;
    }
    return false;
  };

  const value = {
    pendingListings,
    approvedListings,
    rejectedListings,
    approveListing,
    rejectListing,
    totalPending: pendingListings.length,
    totalApproved: approvedListings.length,
    totalRejected: rejectedListings.length
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
