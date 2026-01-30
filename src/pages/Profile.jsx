import React, { useState, useEffect } from 'react';
import {
  User, Settings, LogOut, Bell, Shield, HelpCircle,
  Package, ShoppingBag, MessageSquare, Star, Clock,
  CreditCard, Lock, Globe, Trash2, Mail, Phone,
  Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import localDatabase from '../services/localDatabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userData, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userItems, setUserItems] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingReviews, setPendingReviews] = useState(0);
  // Add this state for profile editing
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    school: userData?.school || 'main'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Add state for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  useEffect(() => {
    if (userData) {
      loadUserData();
      // Initialize profile form with user data
      setProfileForm({
        name: userData.name || '',
        phone: userData.phone || '',
        campus: userData.campus || 'main'
      });
    }
  }, [userData]);
  useEffect(() => {
    const loadPendingReviews = async () => {
      if (userData?.role === 'admin') {
        try {
          const items = await localDatabase.getItems({ status: 'pending' });
          const events = await localDatabase.getEvents({ status: 'pending' });
          const requests = await localDatabase.getRequests({ status: 'pending' });

          setPendingReviews(items.length + events.length + requests.length);
        } catch (error) {
          console.error('Error loading pending reviews:', error);
        }
      }
    };

    loadPendingReviews();
  }, [userData]);
  const loadUserData = async () => {
    if (!userData) return;

    setLoading(true);
    try {
      // Load user's items
      const items = await localDatabase.getItems({ userId: userData.id });
      setUserItems(items);

      // Load user's requests
      const requests = await localDatabase.getRequests({ userId: userData.id });
      setUserRequests(requests);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set sample data for demo
      if (userData.id === '1') {
        setUserItems([
          {
            id: '1',
            title: 'Python Programming Textbook',
            description: 'Complete Python programming guide',
            price: 1200,
            category: 'books',
            status: 'approved',
            views: 45,
            createdAt: new Date().toISOString()
          }
        ]);
        setUserRequests([
          {
            id: '1',
            title: 'Looking for Calculus Textbook',
            description: 'Need Calculus II textbook',
            status: 'open',
            responses: 3,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSaveProfile = async () => {
    if (!userData) {
      toast.error('No user data found');
      return;
    }

    setIsSavingProfile(true);
    try {
      console.log('🔄 Saving profile for user:', userData.id);
      console.log('📝 Profile data to save:', {
        name: profileForm.name,
        phone: profileForm.phone,
        school: profileForm.school
      });

      // Use AuthContext's updateProfile method
      const result = await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        campus: profileForm.campus
      });

      console.log('✅ Update result:', result);

      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        console.error('❌ Update failed:', result.error);
        toast.error(`Failed to update profile: ${result.error || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSavingProfile(false);
    }
  };
  // handle Password
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //handleChangePassword
  const handleChangePassword = async () => {
    if (!userData) return;

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    setIsChangingPassword(true);
    try {
      // First, verify current password
      const isValid = await localDatabase.verifyPassword(userData.email, passwordForm.currentPassword);

      if (!isValid) {
        toast.error('Current password is incorrect!');
        setIsChangingPassword(false);
        return;
      }

      // Update password in database
      const result = await localDatabase.updateUser(userData.id, {
        password: passwordForm.newPassword
      });

      if (result.success) {
        toast.success('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };
  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={18} /> },
    { id: 'listings', label: 'My Listings', icon: <Package size={18} /> },
    { id: 'requests', label: 'My Requests', icon: <ShoppingBag size={18} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="text-gray-400" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to login to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account, listings, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">{userData.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h3>
              <p className="text-gray-600 mb-1">{userData.email}</p>
              <p className="text-blue-600 font-semibold capitalize mb-4 flex items-center gap-2">
                {userData.role === 'admin' ? (
                  <>
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      Admin
                    </span>
                    <span className="text-gray-400">•</span>
                  </>
                ) : (
                  <span>{userData.role}</span>
                )}
                <span>NFSU</span>
              </p>

              <div className="w-full border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold text-yellow-500">4.8★</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(userData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">School</span>
                  <span className="font-medium">
                    {userData.school ?
                      `${userData.school.charAt(0).toUpperCase()}${userData.school.slice(1)} Campus` :
                      'NFSU Main Campus'
                    }
                  </span>
                </div>
                {/* ADD THIS BLOCK FOR PUBLIC ID */}
                {userData.publicId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Public ID</span>
                    <span className="font-medium text-blue-600">@{userData.publicId}</span>
                  </div>
                )}
              </div>
              {/* ADMIN DASHBOARD BUTTON - Only visible to admin users */}
              {userData.role === 'admin' && (
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <Shield size={18} />
                    Admin Dashboard
                  </button>
                  <p className="text-xs text-blue-600 text-center mt-2">
                    Manage users, approve content, view analytics
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 border-b border-gray-100 last:border-b-0 ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid with Conditional Admin Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Active Listings</h3>
                    <Package className="text-blue-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{userItems.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Items for sale</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Active Requests</h3>
                    <ShoppingBag className="text-green-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{userRequests.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Items you're looking for</p>
                </div>

                {userData.role === 'admin' ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-blue-700 font-medium">Pending Reviews</h3>
                      <Shield className="text-blue-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{pendingReviews}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      {pendingReviews === 1 ? 'Item awaiting approval' : 'Items awaiting approval'}
                    </p>
                    {pendingReviews > 0 && (
                      <button
                        onClick={() => navigate('/admin')}
                        className="mt-3 text-blue-700 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        Review Now →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Your Rating</h3>
                      <Star className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-gray-500 mt-1">Based on 24 reviews</p>
                  </div>
                )}
              </div>

              {/* Recent Activity - REAL DATA */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {userItems.length > 0 || userRequests.length > 0 ? (
                    <>
                      {/* Show items activity */}
                      {userItems.slice(0, 3).map(item => (
                        <div key={`item-${item.id}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="text-blue-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Listed "{item.title}" for ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(item.createdAt)} • {item.status === 'approved' ? '✅ Approved' :
                                item.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/item/${item.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ))}

                      {/* Show requests activity */}
                      {userRequests.slice(0, 3).map(request => (
                        <div key={`request-${request.id}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <ShoppingBag className="text-purple-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Requested "{request.title}" ({request.responses || 0} responses)
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(request.createdAt)} • {request.status === 'approved' ? '✅ Active' :
                                request.status === 'pending' ? '⏳ Pending' : '❌ Closed'}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/requests#${request.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-600">No recent activity yet</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Start by listing an item or making a request!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className={`grid gap-4 ${userData.role === 'admin' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  <button
                    onClick={() => navigate('/sell')}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="text-green-600" size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Sell New Item</h4>
                    </div>
                    <p className="text-gray-600 text-sm">List your item for sale on marketplace</p>
                  </button>

                  <button
                    onClick={() => navigate('/request-item')}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="text-blue-600" size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Request Item</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Looking for something? Post a request</p>
                  </button>

                  {userData.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Shield className="text-blue-600" size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">Admin Dashboard</h4>
                      </div>
                      <p className="text-gray-600 text-sm">Manage users, content, and view analytics</p>
                      <div className="mt-3 text-blue-600 font-medium text-sm flex items-center gap-1">
                        Go to Dashboard →
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
                <p className="text-gray-600">Manage your account preferences and security</p>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Personal Info */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={18} />
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          defaultValue={userData.email}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileFormChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Campus</label>
                        <select
                          name="campus"
                          value={profileForm.campus}
                          onChange={handleProfileFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="main">Main Campus</option>
                          <option value="north">North Campus</option>
                          <option value="south">South Campus</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                {/* Security */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock size={18} />
                    Security
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Lock size={18} />
                        <span>Change Password</span>
                      </div>
                      <span className="text-blue-600">Change</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield size={18} />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <span className="text-gray-500">Not enabled</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                      <CreditCard size={18} />
                      <span>Linked Accounts</span>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell size={18} />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'New Messages', checked: true },
                      { label: 'Item Offers', checked: true },
                      { label: 'Request Responses', checked: true },
                      { label: 'Price Drops', checked: false },
                      { label: 'Campus Events', checked: true },
                      { label: 'Promotional Emails', checked: false },
                    ].map((item, index) => (
                      <label key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe size={18} />
                    Privacy
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                      <Eye size={18} />
                      <span>Privacy Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                      <HelpCircle size={18} />
                      <span>Data & Privacy Help</span>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 bg-red-50 rounded-b-xl">
                  <h4 className="font-semibold text-red-900 mb-4">Danger Zone</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center justify-between text-red-600">
                      <div className="flex items-center gap-3">
                        <Trash2 size={18} />
                        <span>Delete Account</span>
                      </div>
                      <span>Delete</span>
                    </button>
                    <p className="text-red-700 text-sm">
                      Warning: This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs */}
          {(activeTab === 'listings' || activeTab === 'requests' || activeTab === 'messages') && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'listings' && <Package className="text-gray-400" size={32} />}
                {activeTab === 'requests' && <ShoppingBag className="text-gray-400" size={32} />}
                {activeTab === 'messages' && <MessageSquare className="text-gray-400" size={32} />}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'listings' && 'My Listings'}
                {activeTab === 'requests' && 'My Requests'}
                {activeTab === 'messages' && 'Messages'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'listings' && 'View and manage all your listed items'}
                {activeTab === 'requests' && 'Track your item requests and responses'}
                {activeTab === 'messages' && 'Check your conversations with buyers/sellers'}
              </p>
              <button
                onClick={() => navigate(activeTab === 'listings' ? '/sell' : activeTab === 'requests' ? '/request-item' : '/chat')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Go to {activeTab === 'listings' ? 'Sell Item' : activeTab === 'requests' ? 'Request Item' : 'Messages'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <p className="text-gray-600 text-sm mt-1">Enter your current and new password</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};


export default Profile;
