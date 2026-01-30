import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, Eye, Filter, Users, Package,
  AlertCircle, Calendar, MessageSquare, Clock, DollarSign,
  MapPin, Tag, Book, Laptop, Sofa, Shirt, Gamepad, Music,
  ChevronDown, ChevronUp, Search, RefreshCw, ExternalLink,
  User, Mail, Phone, GraduationCap, Award, Trophy, Image,
  Loader2, BarChart2, TrendingUp, Bell, Flag, Archive,
  ChevronRight, MoreVertical, Download, Copy, Trash2
} from 'lucide-react';
import localDatabase from '../services/localDatabase';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedItems, setApprovedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingReviews: 0,
    resolvedToday: 0
  });
  const [auditLog, setAuditLog] = useState([]);
  const [auditLogLoading, setAuditLogLoading] = useState(false);
  const [undoLoading, setUndoLoading] = useState({});
  const { userData } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    if (userData && userData.role === 'admin') {
      loadAllData();
    }
  }, [activeTab, userData]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load items
      const pendingItemsData = await localDatabase.getItems({ status: 'pending', showAll: true });
      const approvedItemsData = await localDatabase.getItems({ status: 'approved', showAll: true });
      const rejectedItemsData = await localDatabase.getItems({ status: 'rejected', showAll: true });

      // Load requests
      const requestsData = await localDatabase.getRequests({ showAll: true });
      const pendingRequestsData = requestsData.filter(req => req.status === 'pending');

      const approvedRequestsData = requestsData.filter(req => req.status === 'approved' || req.status === 'active');
      // Load events
      const eventsData = await localDatabase.getEvents({ showAll: true });
      const pendingEventsData = eventsData.filter(event => event.status === 'pending');
      const approvedEventsData = eventsData.filter(event => event.status === 'approved');
      // Load users (ADD THIS)
      const db = localDatabase.getDatabase();
      const usersData = db.users.map(({ password, passwordHash, ...safeUser }) => safeUser);
      setAllUsers(usersData);
      setFilteredUsers(usersData);

      // Load audit log if needed
      if (activeTab === 'audit') {
        await loadAuditLog();
      }

      setPendingItems(pendingItemsData);
      setPendingRequests(pendingRequestsData);
      setApprovedRequests(approvedRequestsData);
      setPendingEvents(pendingEventsData);
      setApprovedEvents(approvedEventsData);
      setApprovedItems(approvedItemsData);
      setRejectedItems(rejectedItemsData);

      // Update stats
      setStats({
        totalUsers: usersData.length,
        totalItems: db.items.length,
        pendingReviews: pendingItemsData.length + pendingRequestsData.length + pendingEventsData.length,
        resolvedToday: 0 // You could track this with timestamps
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  const loadAuditLog = async () => {
    setAuditLogLoading(true);
    try {
      const auditData = await localDatabase.getAuditLog({ limit: 50 });
      setAuditLog(auditData);
    } catch (error) {
      console.error('Error loading audit log:', error);
      toast.error('Failed to load audit log');
    } finally {
      setAuditLogLoading(false);
    }
  };
  const handleUndoChange = async (auditEntryId) => {
    setUndoLoading(prev => ({ ...prev, [auditEntryId]: true }));

    try {
      const result = await localDatabase.undoChange(auditEntryId);

      if (result.success) {
        toast.success('Change undone successfully!');
        // Reload audit log to show updated entries
        await loadAuditLog();
      } else {
        toast.error(result.error || 'Failed to undo change');
      }
    } catch (error) {
      console.error('Error undoing change:', error);
      toast.error('Failed to undo change');
    } finally {
      setUndoLoading(prev => ({ ...prev, [auditEntryId]: false }));
    }
  };
  const handleDeleteUser = async (userId, userName, userEmail) => {
    const confirmationMessage = `⚠️ PERMANENT ACCOUNT DELETION ⚠️\n\nDelete "${userName}" (${userEmail}) permanently?\n\nThis will:\n• Delete account forever\n• Remove all their items\n• Delete all messages\n• Cannot be undone!\n\nClick OK to delete or Cancel to abort.`;

    if (!window.confirm(confirmationMessage)) {
      toast.error('Deletion cancelled');
      return;
    }

    try {
      const result = await localDatabase.deleteUserAccount(userId, userData.id);

      if (result.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <Trash2 className="text-gray-700" size={18} />
            <span>{result.message}</span>
          </div>,
          { duration: 4000 }
        );

        // Refresh data
        loadAllData();
      } else {
        toast.error(result.error || 'Failed to delete user account');
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
      toast.error('Failed to delete user account');
    }
  };

  const handleApprove = async (type, id) => {
    try {
      let result;
      let successMessage = '';

      switch (type) {
        case 'item':
          result = await localDatabase.approveItem(id, userData.id);
          successMessage = 'Item approved successfully!';
          break;
        case 'request':
          result = await localDatabase.approveRequest(id, userData.id);
          successMessage = 'Request approved successfully!';
          break;
        case 'event':
          result = await localDatabase.approveEvent(id, userData.id);
          successMessage = 'Event approved successfully!';
          break;
      }

      if (result.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <span>{successMessage}</span>
          </div>,
          { duration: 3000 }
        );
        setSelectedItem(null);
        setSelectedRequest(null);
        setSelectedEvent(null);
        loadAllData();
      } else {
        toast.error(result.error || `Failed to approve ${type}`);
      }
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      toast.error(`Failed to approve ${type}`);
    }
  };

  const handleReject = async (type, id) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      let result;
      let successMessage = '';

      switch (type) {
        case 'item':
          result = await localDatabase.rejectItem(id, userData.id, rejectionReason);
          successMessage = 'Item rejected successfully!';
          break;
        case 'request':
          result = await localDatabase.rejectRequest(id, userData.id, rejectionReason);
          successMessage = 'Request rejected successfully!';
          break;
        case 'event':
          result = await localDatabase.rejectEvent(id, userData.id, rejectionReason);
          successMessage = 'Event rejected successfully!';
          break;
      }

      if (result.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500" size={20} />
            <span>{successMessage}</span>
          </div>,
          { duration: 3000 }
        );
        setRejectionReason('');
        setSelectedItem(null);
        setSelectedRequest(null);
        setSelectedEvent(null);
        loadAllData();
      } else {
        toast.error(result.error || `Failed to reject ${type}`);
      }
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      toast.error(`Failed to reject ${type}`);
    }
  };
  // ==================== ADD THIS DELETE HANDLER ====================
  const handleDelete = async (type, id, itemTitle) => {
    const confirmationMessage = `Are you sure you want to delete "${itemTitle}"? This action is permanent and cannot be undone.`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      let result;
      let successMessage = '';

      switch (type) {
        case 'item':
          result = await localDatabase.deleteItem(id);
          successMessage = 'Item deleted successfully!';
          break;
        case 'request':
          result = await localDatabase.deleteRequest(id);
          successMessage = 'Request deleted successfully!';
          break;
        case 'event':
          result = await localDatabase.deleteEvent(id);
          successMessage = 'Event deleted successfully!';
          break;
      }

      if (result.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <Trash2 className="text-gray-700" size={20} />
            <span>{successMessage}</span>
          </div>,
          { duration: 3000 }
        );
        loadAllData();
      } else {
        toast.error(result.error || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };
  // Handle user search
  const handleUserSearch = (term) => {
    setUserSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(user =>
      user.name?.toLowerCase().includes(term.toLowerCase()) ||
      user.email?.toLowerCase().includes(term.toLowerCase()) ||
      user.publicId?.toLowerCase().includes(term.toLowerCase()) ||
      user.role?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Update user role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const result = await localDatabase.updateUser(userId, { role: newRole });

      if (result.success) {
        toast.success(`User role updated to ${newRole}!`);
        loadAllData(); // Reload data to reflect changes
        setSelectedUser(null);
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  const handleBanUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to ban "${userName}"? They will not be able to login until unbanned.`)) {
      return;
    }

    try {
      const result = await localDatabase.banUser(userId, userData.id, 'Admin decision');

      if (result.success) {
        toast.success(result.message || 'User banned successfully!');
        loadAllData(); // Refresh user list
      } else {
        toast.error(result.error || 'Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to unban "${userName}"? They will be able to login again.`)) {
      return;
    }

    try {
      const result = await localDatabase.unbanUser(userId, userData.id);

      if (result.success) {
        toast.success(result.message || 'User unbanned successfully!');
        loadAllData(); // Refresh user list
      } else {
        toast.error(result.error || 'Failed to unban user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };
  const handleResetLoginAttempts = async (userId, userName) => {
    if (!window.confirm(`Reset login attempts for "${userName}"? This will unlock their account if it's locked.`)) {
      return;
    }

    try {
      const result = await localDatabase.updateUser(userId, {
        loginAttempts: 0,
        lockUntil: null,
        lastLoginAttempt: new Date().toISOString()
      });

      if (result.success) {
        toast.success(`Login attempts reset for ${userName}. Account is now unlocked.`);
        loadAllData(); // Refresh user list
      } else {
        toast.error(result.error || 'Failed to reset login attempts');
      }
    } catch (error) {
      console.error('Error resetting login attempts:', error);
      toast.error('Failed to reset login attempts');
    }
  };


  const tabs = [
    {
      id: 'pending',
      label: 'Pending Review',
      count: pendingItems.length + pendingRequests.length + pendingEvents.length,
      icon: <AlertCircle size={18} />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'approved',
      label: 'Approved',
      count: approvedItems.length,
      icon: <CheckCircle size={18} />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: rejectedItems.length,
      icon: <XCircle size={18} />,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'users',
      label: 'Users',
      count: stats.totalUsers,
      icon: <Users size={18} />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'audit',
      label: 'Audit Log',
      count: 0, // We'll update this later
      icon: <Clock size={18} />,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'books': return <Book className="text-green-600" size={16} />;
      case 'electronics': return <Laptop className="text-purple-600" size={16} />;
      case 'furniture': return <Sofa className="text-yellow-600" size={16} />;
      case 'clothing': return <Shirt className="text-pink-600" size={16} />;
      case 'sports': return <Gamepad className="text-red-600" size={16} />;
      case 'music': return <Music className="text-indigo-600" size={16} />;
      default: return <Package className="text-gray-600" size={16} />;
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'academic': return <GraduationCap className="text-blue-600" size={16} />;
      case 'sports': return <Trophy className="text-green-600" size={16} />;
      case 'cultural': return <Award className="text-purple-600" size={16} />;
      case 'workshop': return <Book className="text-yellow-600" size={16} />;
      case 'social': return <Users className="text-pink-600" size={16} />;
      default: return <Calendar className="text-gray-600" size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if user is admin
  if (!userData || userData.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-red-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this panel.
            Please login with an admin account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Review and manage all campus content</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-4 py-2 rounded-xl">
              <User size={18} className="text-blue-600" />
              <span className="font-medium text-gray-900">{userData.name || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-blue-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-blue-200">Total Users</div>
            </div>
          </div>
          <div className="text-sm text-blue-200">All registered users</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-green-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <div className="text-sm text-green-200">Total Items</div>
            </div>
          </div>
          <div className="text-sm text-green-200">All marketplace items</div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-yellow-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <div className="text-sm text-yellow-200">Pending Reviews</div>
            </div>
          </div>
          <div className="text-sm text-yellow-200">Awaiting approval</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-purple-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <div className="text-sm text-purple-200">Resolved Today</div>
            </div>
          </div>
          <div className="text-sm text-purple-200">Approved/Rejected today</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 font-medium transition-all relative ${activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${tab.color}`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-gray-600">Loading content...</p>
            </div>
          ) : activeTab === 'pending' ? (
            <div className="space-y-8">
              {/* Pending Items */}
              {pendingItems.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Package className="text-blue-600" size={24} />
                      Marketplace Items ({pendingItems.length})
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingItems.map(item => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User size={14} />
                                  <span>{item.sellerName}</span>
                                  <Mail size={14} />
                                  <span>{item.sellerEmail || 'No email'}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-600">₹{item.price}</div>
                                <div className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                                {getCategoryIcon(item.category)}
                                {item.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {item.campus} Campus
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {item.condition}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove('item', item.id)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 font-medium flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={18} />
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-medium flex items-center justify-center gap-2"
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                              <button
                                onClick={() => handleDelete('item', item.id, item.title)}
                                className="px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium flex items-center justify-center gap-2"
                                title="Delete Item"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <MessageSquare className="text-purple-600" size={24} />
                      Requests ({pendingRequests.length})
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingRequests.map(request => (
                      <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{request.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} />
                              <span>{request.requesterName}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-600">₹{request.budget}</div>
                            <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{request.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {request.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {request.campus} Campus
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                            request.urgency === 'high' ? 'bg-yellow-100 text-yellow-800' :
                              request.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {request.urgency}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove('request', request.id)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 font-medium flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-medium flex items-center justify-center gap-2"
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                          {/* ADD DELETE BUTTON FOR EVENTS */}
                          <button
                            onClick={() => handleDelete('request', request.id, request.title)}
                            className="px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium flex items-center justify-center gap-2"
                            title="Delete Request"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Events */}
              {pendingEvents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Calendar className="text-indigo-600" size={24} />
                      Events ({pendingEvents.length})
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingEvents.map(event => (
                      <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User size={14} />
                                  <span>{event.creatorName || event.organizer}</span>
                                  {event.creatorRole === 'event_society' && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Event Society
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-indigo-600">
                                  {event.price === 0 ? 'FREE' : `₹${event.price}`}
                                </div>
                                <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                                {getEventTypeIcon(event.type)}
                                {event.type}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {event.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                Max: {event.maxParticipants}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove('event', event.id)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 font-medium flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={18} />
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedEvent(event)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-medium flex items-center justify-center gap-2"
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                              {/* ADD DELETE BUTTON FOR EVENTS */}
                              <button
                                onClick={() => handleDelete('event', event.id, event.title)}
                                className="px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium flex items-center justify-center gap-2"
                                title="Delete Request"  // ← This is correct for events
                              >
                                <Trash2 size={18} />
                              </button>
                              <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingItems.length === 0 && pendingRequests.length === 0 && pendingEvents.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">All Caught Up! 🎉</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    There are no pending reviews at the moment. Everything is up to date!
                  </p>
                  <button
                    onClick={loadAllData}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Refresh Data
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'approved' ? (
            <div className="space-y-8">
              {/* Approved Items Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Package className="text-blue-600" size={24} />
                    Approved Items ({approvedItems.length})
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Approved
                  </span>
                </div>
                {approvedItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedItems.slice(0, 12).map(item => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">By {item.sellerName}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
                          <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                        </div>
                        {/* DELETE BUTTON FOR ITEMS */}
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleDelete('item', item.id, item.title)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Item"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved items</h3>
                    <p className="text-gray-600">No items have been approved yet</p>
                  </div>
                )}
              </div>

              {/* Approved Requests Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="text-purple-600" size={24} />
                    Approved Requests ({approvedRequests.length})
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    Approved
                  </span>
                </div>
                {approvedRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {approvedRequests.map(request => (
                      <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{request.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} />
                              <span>{request.requesterName}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-600">₹{request.budget}</div>
                            <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{request.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {request.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {request.campus || request.school} Campus
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                            request.urgency === 'high' ? 'bg-yellow-100 text-yellow-800' :
                              request.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {request.urgency}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete('request', request.id, request.title)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-medium flex items-center justify-center gap-2"
                          >
                            <Trash2 size={18} />
                            Delete Request
                          </button>
                          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved requests</h3>
                    <p className="text-gray-600">No requests have been approved yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'rejected' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Rejected Items</h3>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  {rejectedItems.length} Rejected
                </span>
              </div>
              {rejectedItems.length > 0 ? (
                <div className="space-y-4">
                  {rejectedItems.map(item => (
                    <div key={item.id} className="bg-white border border-red-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">By {item.sellerName}</p>
                        </div>
                        <span className="text-lg font-bold text-red-600">₹{item.price}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                      {item.rejectionReason && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-2">
                          <p className="text-sm text-red-800">
                            <span className="font-semibold">Rejection Reason:</span> {item.rejectionReason}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Rejected on {formatDateTime(item.rejectedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rejected items</h3>
                  <p className="text-gray-600">No items have been rejected yet</p>
                </div>
              )}
              {/* Approved Events Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar className="text-indigo-600" size={24} />
                    Approved Events ({approvedEvents.length})
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Approved
                  </span>
                </div>
                {approvedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {approvedEvents.map(event => (
                      <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User size={14} />
                                  <span>{event.creatorName || event.organizer}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-indigo-600">
                                  {event.price === 0 ? 'FREE' : `₹${event.price}`}
                                </div>
                                <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {event.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {event.location}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {event.registeredCount || 0} registered
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete('event', event.id, event.title)}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2.5 rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium flex items-center justify-center gap-2"
                              >
                                <Trash2 size={18} />
                                Delete Event
                              </button>
                              <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved events</h3>
                    <p className="text-gray-600">No events have been approved yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'audit' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Audit Log</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    {auditLog.length} Entries
                  </span>
                  <button
                    onClick={loadAuditLog}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={18} className={auditLogLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
              </div>

              {auditLogLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                  <p className="text-gray-600">Loading audit log...</p>
                </div>
              ) : auditLog.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Time</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Action</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Details</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Login Attempts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {auditLog.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-600">
                              {new Date(entry.timestamp).toLocaleString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${entry.action.includes('UPDATE') ? 'bg-blue-100 text-blue-800' :
                                entry.action.includes('CREATE') ? 'bg-green-100 text-green-800' :
                                  entry.action.includes('DELETE') ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {entry.action}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-700">
                              User ID: {entry.userId}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              <div className="max-w-md">
                                {JSON.stringify(entry.details, null, 2)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {entry.action === 'USER_UPDATED' && (
                                <button
                                  onClick={() => handleUndoChange(entry.id)}
                                  disabled={undoLoading[entry.id]}
                                  className={`px-3 py-1 text-xs font-medium rounded-full ${undoLoading[entry.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    }`}
                                >
                                  {undoLoading[entry.id] ? 'Undoing...' : 'Undo'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Audit Log Entries</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    No audit log entries found. Changes made by users will appear here.
                  </p>
                  <button
                    onClick={loadAuditLog}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'users' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filteredUsers.length} Users
                  </span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Public ID</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Campus</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Login Attempts</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-white font-bold">
                                      {user.name?.charAt(0) || 'U'}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name || 'No Name'}</div>
                                  <div className="text-sm text-gray-600">ID: {user.id.substring(0, 8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-700">
                              @{user.publicId || 'no-id'}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-700">
                              {user.email}
                            </td>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                  user.role === 'event_society' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                  {user.role || 'student'}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user.status === 'banned' ? 'bg-red-100 text-red-800' :
                                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {user.status || 'active'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-700">
                              {user.campus || 'Main'}
                            </td>
                            <td className="py-4 px-6 text-sm">
                              <div className="flex flex-col">
                                <span className={`font-medium ${user.loginAttempts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {user.loginAttempts || 0} failed
                                </span>
                                {user.lockUntil && new Date(user.lockUntil) > new Date() && (
                                  <span className="text-xs text-red-500">
                                    Locked
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                                  title="Change User Role"
                                >
                                  Role
                                </button>

                                {/* Ban/Unban Button */}
                                {user.status === 'banned' ? (
                                  <button
                                    onClick={() => handleUnbanUser(user.id, user.name)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                                    title="Unban User"
                                  >
                                    Unban
                                  </button>
                                ) : user.role !== 'admin' ? ( // Don't show ban button for admins
                                  <button
                                    onClick={() => handleBanUser(user.id, user.name)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                                    title="Ban User"
                                  >
                                    Ban
                                  </button>
                                ) : null}

                                {/* Reset Login Attempts Button */}
                                {(user.loginAttempts > 0 || user.lockUntil) && (
                                  <button
                                    onClick={() => handleResetLoginAttempts(user.id, user.name)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-xs font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all"
                                    title="Reset Failed Login Attempts"
                                  >
                                    Reset
                                  </button>
                                )}

                                {/* Delete Account Button - Only for non-admin users */}
                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-black text-white text-xs font-medium rounded-lg hover:from-gray-900 hover:to-black transition-all"
                                    title="Permanently Delete Account"
                                  >
                                    Delete
                                  </button>
                                )}

                                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Users Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {userSearchTerm ? 'No users match your search. Try a different term.' : 'No users found in the system.'}
                  </p>
                  {userSearchTerm && (
                    <button
                      onClick={() => {
                        setUserSearchTerm('');
                        setFilteredUsers(allUsers);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}

              {/* User Role Change Modal */}
              {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">Change User Role</h3>
                      <p className="text-gray-600 mt-1">{selectedUser.name}</p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          {selectedUser.avatar ? (
                            <img
                              src={selectedUser.avatar}
                              alt={selectedUser.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-2xl font-bold">
                              {selectedUser.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{selectedUser.name}</h4>
                          <p className="text-gray-600">{selectedUser.email}</p>
                          <p className="text-sm text-gray-500">@{selectedUser.publicId}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Current Role
                          </label>
                          <div className={`px-4 py-2 rounded-lg inline-block ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            selectedUser.role === 'event_society' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {selectedUser.role || 'student'} <Shield size={14} className="inline ml-1" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Select New Role
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => handleUpdateUserRole(selectedUser.id, 'student')}
                              className={`px-4 py-3 rounded-xl border-2 transition-all ${selectedUser.role === 'student'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                            >
                              <div className="font-medium">Student</div>
                              <div className="text-xs text-gray-600 mt-1">Default access</div>
                            </button>
                            <button
                              onClick={() => handleUpdateUserRole(selectedUser.id, 'event_society')}
                              className={`px-4 py-3 rounded-xl border-2 transition-all ${selectedUser.role === 'event_society'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                }`}
                            >
                              <div className="font-medium">Event Society</div>
                              <div className="text-xs text-gray-600 mt-1">Event creation</div>
                            </button>
                            <button
                              onClick={() => handleUpdateUserRole(selectedUser.id, 'admin')}
                              className={`px-4 py-3 rounded-xl border-2 transition-all ${selectedUser.role === 'admin'
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                              <div className="font-medium">Admin</div>
                              <div className="text-xs text-gray-600 mt-1">Full access</div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedUser(null)}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                More features are coming soon to the admin panel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modals */}
      {/* Item Rejection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Reject Item</h3>
              <p className="text-gray-600 mt-1">"{selectedItem.title}"</p>
            </div>
            <div className="p-6">
              <label className="block text-gray-700 font-medium mb-3">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this item is being rejected. This will be sent to the seller."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject('item', selectedItem.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Reject Request</h3>
              <p className="text-gray-600 mt-1">"{selectedRequest.title}"</p>
            </div>
            <div className="p-6">
              <label className="block text-gray-700 font-medium mb-3">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected. This will be sent to the requester."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject('request', selectedRequest.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Rejection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Reject Event</h3>
              <p className="text-gray-600 mt-1">"{selectedEvent.title}"</p>
            </div>
            <div className="p-6">
              <label className="block text-gray-700 font-medium mb-3">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this event is being rejected. This will be sent to the event creator."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject('event', selectedEvent.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
