import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Clock, AlertCircle, CheckCircle, XCircle,
  Plus, MessageCircle, Eye, TrendingUp, DollarSign,
  MapPin, Calendar, User, Shield, ChevronRight,
  Book, Laptop, Sofa, Shirt, Gamepad, FileText,
  X, Sliders, Upload, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import localDatabase from '../services/localDatabase';

const Requests = () => {
  const navigate = useNavigate();
  const { userData, userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    status: 'all',
    budgetRange: 'all',
    sortBy: 'newest'
  });
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [selectedRequestForContact, setSelectedRequestForContact] = useState(null);
  // Form state for creating requests
  const [formData, setFormData] = useState({
    title: '',
    category: 'books',
    description: '',
    budget: '',
    school: 'Engineering', // Default to first school
    urgency: 'normal',
    contactPreference: 'chat'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detailed sample requests data
  const sampleRequests = [
    {
      id: '1',
      title: 'HC Verma Physics Volume 1 & 2',
      description: 'Looking for HC Verma Physics textbooks for JEE preparation. Need both volumes in good condition. Preferably latest edition.',
      category: 'books',
      school: 'forensic',
      budget: 800,
      urgency: 'high',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student', // ← ADD THIS
      requester: {
        id: 'user_1m2b3c4d_st123abc_student', // ← ADD THIS
        name: 'Rahul Sharma',
        email: 'rahul.sharma@nfsu.ac.in',
        rating: 4.8,
        verified: true
      },
      createdAt: '2024-02-15',
      responses: 3,
      views: 45,
      tags: ['Physics', 'JEE', 'Textbook', 'Engineering']
    },
    {
      id: '2',
      title: 'MacBook Air M1 or M2 for Development',
      description: 'Looking for a MacBook Air M1/M2 for iOS development and studies. Minimum 8GB RAM, 256GB SSD. Good battery health required.',
      category: 'electronics',
      school: 'engineering',
      budget: 45000,
      urgency: 'normal',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
      requester: {
        id: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
        name: 'Priya Patel',
        email: 'priya.patel@nfsu.ac.in',
        rating: 4.9,
        verified: true
      },
      createdAt: '2024-02-14',
      responses: 7,
      views: 89,
      tags: ['Laptop', 'Apple', 'Development', 'MacBook']
    },
    {
      id: '3',
      title: 'Study Table with Storage for Dorm',
      description: 'Need a compact study table with shelves/drawers for my dorm room. Should be sturdy and in good condition.',
      category: 'furniture',
      school: 'cyber',
      budget: 2500,
      urgency: 'normal',
      status: 'pending',
      requesterId: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
      requester: {
        id: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
        name: 'Amit Kumar',
        email: 'amit.kumar@nfsu.ac.in',
        rating: 4.5,
        verified: true
      },
      createdAt: '2024-02-13',
      responses: 2,
      views: 32,
      tags: ['Furniture', 'Desk', 'Dorm', 'Study']
    },
    {
      id: '4',
      title: 'Casio fx-991EX Scientific Calculator',
      description: 'Need a Casio fx-991EX scientific calculator for engineering exams. Must be in working condition with good battery.',
      category: 'electronics',
      school: 'cyber',
      budget: 1200,
      urgency: 'urgent',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
      requester: {
        id: 'user_1m2b3c4d_st123abc_student', // ← Test Student ID
        name: 'Neha Singh',
        email: 'neha.singh@nfsu.ac.in',
        rating: 4.7,
        verified: true
      },
      createdAt: '2024-02-12',
      responses: 5,
      views: 67,
      tags: ['Calculator', 'Engineering', 'Casio', 'Exam']
    },
    {
      id: '5',
      title: 'Complete Python & Data Science Notes',
      description: 'Looking for comprehensive handwritten/digital notes for Python programming and Data Science courses. Preferably from topper students.',
      category: 'notes',
      school: 'cyber',
      budget: 500,
      urgency: 'high',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student',
      requester: {
        id: 'user_1m2b3c4d_st123abc_student',
        name: 'Sandeep Verma',
        email: 'sandeep.verma@nfsu.ac.in',
        rating: 4.6,
        verified: true
      },
      createdAt: '2024-02-11',
      responses: 4,
      views: 54,
      tags: ['Python', 'Data Science', 'Notes', 'Programming']
    },
    {
      id: '6',
      title: 'Basketball Shoes Size 10',
      description: 'Looking for good condition basketball shoes for college tournaments. Nike/Adidas preferred. Size 10.',
      category: 'sports',
      school: 'engineering',
      budget: 2000,
      urgency: 'low',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student',
      requester: {
        id: 'user_1m2b3c4d_st123abc_student',
        name: 'Rajesh Mehta',
        email: 'rajesh.mehta@nfsu.ac.in',
        rating: 4.4,
        verified: true
      },
      createdAt: '2024-02-10',
      responses: 1,
      views: 28,
      tags: ['Shoes', 'Sports', 'Basketball', 'Footwear']
    },
    {
      id: '7',
      title: 'Gaming PC (Ryzen 5/RTX 3060+)',
      description: 'Looking for a gaming PC setup for game development. Minimum Ryzen 5, RTX 3060, 16GB RAM. Monitor optional.',
      category: 'electronics',
      school: 'forensic',
      budget: 60000,
      urgency: 'normal',
      status: 'pending',
      requesterId: 'user_1m2b3c4d_st123abc_student',
      requester: {
        id: 'user_1m2b3c4d_st123abc_student',
        name: 'Vikram Joshi',
        email: 'vikram.joshi@nfsu.ac.in',
        rating: 4.8,
        verified: true
      },
      createdAt: '2024-02-09',
      responses: 0,
      views: 41,
      tags: ['Gaming PC', 'Computer', 'RTX', 'Ryzen']
    },
    {
      id: '8',
      title: 'Winter Jacket Size M',
      description: 'Need a warm winter jacket for campus. Size Medium. Dark colors preferred. Good condition.',
      category: 'fashion',
      school: 'cyber',
      budget: 1500,
      urgency: 'high',
      status: 'active',
      requesterId: 'user_1m2b3c4d_st123abc_student',
      requester: {
        id: 'user_1m2b3c4d_st123abc_student',
        name: 'Anjali Reddy',
        email: 'anjali.reddy@nfsu.ac.in',
        rating: 4.9,
        verified: true
      },
      createdAt: '2024-02-08',
      responses: 3,
      views: 39,
      tags: ['Jacket', 'Winter', 'Clothing', 'Fashion']
    }
  ];

  // Initialize with requests from database
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Try to get requests from database
        const dbRequests = await localDatabase.getRequests({

          showAll: false
        });

        // Combine with sample requests (remove duplicates)
        const combinedRequests = [...sampleRequests];

        if (dbRequests && dbRequests.length > 0) {
          // Add database requests that don't already exist in sample requests
          dbRequests.forEach(dbReq => {
            if (!combinedRequests || !Array.isArray(combinedRequests) ||
              !combinedRequests.some(sampleReq => sampleReq && sampleReq.id === dbReq.id)) {
              // Format database request to match our structure
              const formattedReq = {
                id: dbReq.id,
                title: dbReq.title,
                description: dbReq.description,
                category: dbReq.category,
                school: dbReq.school || dbReq.campus || 'forensic',
                budget: dbReq.budget || 0,
                urgency: dbReq.urgency || 'normal',
                status: dbReq.status || 'active',
                requesterId: dbReq.requesterId, // ← ADD THIS
                requester: {
                  id: dbReq.requesterId, // ← ADD THIS
                  name: dbReq.requesterName || 'NFSU Student',
                  email: dbReq.requesterEmail || '',
                  rating: 4.5,
                  verified: true
                },

                createdAt: dbReq.createdAt ? new Date(dbReq.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                responses: 0,
                views: dbReq.views || 0,
                tags: Array.isArray(dbReq.tags) ? dbReq.tags : (dbReq.tags ? [dbReq.tags] : [])
              };
              combinedRequests.push(formattedReq);
            }
          });
        }

        setRequests(combinedRequests);
        setFilteredRequests(combinedRequests);

      } catch (error) {
        console.error('Error fetching requests:', error);
        // Fallback to sample requests only
        setRequests(sampleRequests);
        setFilteredRequests(sampleRequests);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All Requests', icon: <TrendingUp className="text-blue-600" size={20} />, count: sampleRequests.length },
    { id: 'books', label: 'Books', icon: <Book className="text-green-600" size={20} />, count: sampleRequests.filter(r => r.category === 'books').length },
    { id: 'electronics', label: 'Electronics', icon: <Laptop className="text-purple-600" size={20} />, count: sampleRequests.filter(r => r.category === 'electronics').length },
    { id: 'furniture', label: 'Furniture', icon: <Sofa className="text-yellow-600" size={20} />, count: sampleRequests.filter(r => r.category === 'furniture').length },
    { id: 'fashion', label: 'Fashion', icon: <Shirt className="text-pink-600" size={20} />, count: sampleRequests.filter(r => r.category === 'fashion').length },
    { id: 'sports', label: 'Sports', icon: <Gamepad className="text-red-600" size={20} />, count: sampleRequests.filter(r => r.category === 'sports').length },
    { id: 'notes', label: 'Study Notes', icon: <FileText className="text-indigo-600" size={20} />, count: sampleRequests.filter(r => r.category === 'notes').length },
  ];

  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active', icon: <CheckCircle size={16} className="text-green-500" /> },
    { id: 'fulfilled', label: 'Fulfilled', icon: <CheckCircle size={16} className="text-blue-500" /> },
    { id: 'approved', label: 'Approved', icon: <Shield size={16} className="text-purple-500" /> },
  ];

  // School options (replacing campus)
  const schoolOptions = [
    { id: 'all', label: 'All Schools' },
    { id: 'forensic', label: 'School of Forensic Science' },
    { id: 'cyber', label: 'School of Cyber Security & Digital Forensics' },
    { id: 'police', label: 'School of Police Science and Security Studies' },
    { id: 'engineering', label: 'School of Engineering & Technology' },
    { id: 'management', label: 'School of Management Studies' },
    { id: 'pharmacy', label: 'School of Pharmacy' },
    { id: 'research', label: 'School of Doctoral Studies & Research' },
    { id: 'open', label: 'School of Open Learning' },
  ];

  // Budget ranges
  const budgetRanges = [
    { id: 'all', label: 'All Budgets' },
    { id: 'under-1000', label: 'Under ₹1000', min: 0, max: 999 },
    { id: '1000-5000', label: '₹1000 - ₹5000', min: 1000, max: 5000 },
    { id: '5000-20000', label: '₹5000 - ₹20000', min: 5000, max: 20000 },
    { id: 'above-20000', label: 'Above ₹20000', min: 20000, max: Infinity },
  ];

  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'budget-high', label: 'Budget: High to Low' },
    { id: 'budget-low', label: 'Budget: Low to High' },
    { id: 'urgency', label: 'Most Urgent' },
    { id: 'responses', label: 'Most Responses' },
  ];

  // Urgency options for form
  const urgencyOptions = [
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { id: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', label: 'High', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  ];

  // Filter function
  const applyFilters = () => {
    setLoading(true);
    console.log('applyFilters called. Total requests:', requests.length);
    console.log('First request:', requests[0]);
    console.log('First request tags:', requests[0]?.tags);
    console.log('Tags type:', typeof requests[0]?.tags);

    console.log('Filtering requests. First request:', requests[0]);
    console.log('Active school filter:', activeFilters.school);
    let result = [...requests];

    // If requests array is empty, use sampleRequests as fallback
    if (result.length === 0) {
      result = [...sampleRequests];
    }

    // Apply category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(req => req.category === activeFilters.category);
    }

    // Apply status filter
    if (activeFilters.status !== 'all') {
      // For 'active' filter, show both 'active' and 'approved' requests
      if (activeFilters.status === 'active') {
        result = result.filter(req => req.status === 'active' || req.status === 'approved');
      } else {
        result = result.filter(req => req.status === activeFilters.status);
      }
    } else {
      // Default: show active, approved, and fulfilled requests (not pending)
      result = result.filter(req =>
        req.status === 'active' ||
        req.status === 'approved' ||
        req.status === 'fulfilled'
      );
    }

    // Apply budget filter
    if (activeFilters.budgetRange !== 'all') {
      const range = budgetRanges.find(r => r.id === activeFilters.budgetRange);
      if (range && range.min !== undefined) {
        result = result.filter(req => {
          if (range.max === Infinity) {
            return req.budget >= range.min;
          }
          return req.budget >= range.min && req.budget <= range.max;
        });
      }
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(req => {
        // Safe title check
        const hasTitle = req && req.title && typeof req.title === 'string' &&
          req.title.toLowerCase().includes(query);

        // Safe description check  
        const hasDescription = req && req.description && typeof req.description === 'string' &&
          req.description.toLowerCase().includes(query);

        // Safe tags check
        let hasTags = false;
        if (req && req.tags && Array.isArray(req.tags)) {
          try {
            hasTags = req.tags.some(tag =>
              tag && typeof tag === 'string' && tag.toLowerCase().includes(query)
            );
          } catch (error) {
            console.error('Error checking tags:', error);
            hasTags = false;
          }
        }

        return hasTitle || hasDescription || hasTags;
      });
    }

    // Apply sorting
    if (activeFilters.sortBy === 'budget-high') {
      result.sort((a, b) => b.budget - a.budget);
    } else if (activeFilters.sortBy === 'budget-low') {
      result.sort((a, b) => a.budget - b.budget);
    } else if (activeFilters.sortBy === 'urgency') {
      const urgencyOrder = { 'urgent': 4, 'high': 3, 'normal': 2, 'low': 1 };
      result.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);
    } else if (activeFilters.sortBy === 'responses') {
      result.sort((a, b) => b.responses - a.responses);
    } else if (activeFilters.sortBy === 'newest') {
      // Sort by date (newest first)
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
    }

    // Always show results immediately
    setFilteredRequests(result);
    setLoading(false);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handleStatusChange = (statusId) => {
    setActiveFilters(prev => ({
      ...prev,
      status: statusId
    }));
  };

  const handleBudgetChange = (budgetId) => {
    setActiveFilters(prev => ({
      ...prev,
      budgetRange: budgetId
    }));
  };

  const handleSortChange = (sortId) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: sortId
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      category: 'all',
      status: 'all',
      budgetRange: 'all',
      sortBy: 'newest'
    });
    setActiveCategory('all');
    setSearchQuery('');
  };

  const handleViewRequest = async (requestId) => {
    try {
      await localDatabase.incrementItemViews(requestId); // Or create a similar function for requests
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category !== 'all') count++;
    if (activeFilters.status !== 'all') count++;
    if (activeFilters.budgetRange !== 'all') count++;
    if (activeFilters.sortBy !== 'newest') count++;
    return count;
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error('Please login to create a request');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare request data for database
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        school: formData.school,
        budget: parseInt(formData.budget) || 0,
        urgency: formData.urgency,
        requesterId: userData.id,
        requesterName: userData.name,
        requesterEmail: userData.email,
        requesterRole: userRole || 'student',
        contactPreference: formData.contactPreference,
        status: userRole === 'admin' ? 'approved' : 'pending',
        views: 0,
        tags: formData.title.toLowerCase().split(' ')
      };

      // Save to database
      const result = await localDatabase.createRequest(requestData);

      if (result.success) {
        // Create formatted request for local state
        const newRequest = {
          id: result.requestId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          school: formData.school,
          budget: parseInt(formData.budget) || 0,
          urgency: formData.urgency,
          status: userRole === 'admin' ? 'active' : 'pending',
          requester: {
            name: userData.name,
            email: userData.email,
            rating: 4.5,
            verified: true
          },
          createdAt: new Date().toISOString().split('T')[0],
          responses: 0,
          views: 0,
          tags: formData.title.toLowerCase().split(' ')
        };

        // Only add to state if approved (admin) or show pending in separate list
        if (userRole === 'admin' || result.status === 'approved') {
          setRequests(prev => [newRequest, ...prev]);
          setFilteredRequests(prev => [newRequest, ...prev]);
        }

        toast.success(
          userRole === 'admin' || result.status === 'approved'
            ? 'Request created and published!'
            : 'Request submitted for admin approval!'
        );

        // Reset form
        setFormData({
          title: '',
          category: 'books',
          description: '',
          budget: '',
          school: 'forensic',
          urgency: 'normal',
          contactPreference: 'chat'
        });

        setShowCreateForm(false);
      } else {
        toast.error('Failed to create request. Please try again.');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFulfillRequest = (requestId) => {
    if (!userData) {
      toast.error('Please login to offer items');
      navigate('/login');
      return;
    }
    navigate('/chat');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>;
      case 'approved': return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Approved</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending Approval</span>;
      case 'fulfilled': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Fulfilled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    const option = urgencyOptions.find(o => o.id === urgency);
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${option?.color}`}>
      {option?.label}
    </span>;
  };

  const RequestCard = ({ request }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getUrgencyBadge(request.urgency)}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{request.title}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">₹{request.budget.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Budget</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {request.tags && Array.isArray(request.tags) && request.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
            {request.tags && Array.isArray(request.tags) && request.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{request.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span className="capitalize">
                {schoolOptions.find(s => s.id === request.school)?.label || request.school}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{request.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye size={14} />
              <span>{request.views} views</span>
            </div>
          </div>

          {/* Requester */}
          <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{request.requester.name}</div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{request.requester.rating}</span>
                  {request.requester.verified && (
                    <Shield size={12} className="text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleViewRequest(request.id);
                setSelectedRequestForContact(request);
                setShowContactOptions(true);
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              Contact Requester
            </button>
            {/* Contact Options Modal */}
            {showContactOptions && selectedRequestForContact && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Contact Requester</h2>
                      <button
                        onClick={() => {
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-xl"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{selectedRequestForContact.title}</h3>
                        <p className="text-sm text-gray-600">Budget: ₹{selectedRequestForContact.budget?.toLocaleString() || '0'}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <p className="text-gray-700 font-medium">How would you like to help?</p>

                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}&purpose=offer`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">₹</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Make an Offer</div>
                            <div className="text-sm text-gray-600">Offer your item that matches their request</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}&purpose=questions`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold">?</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Ask Questions</div>
                            <div className="text-sm text-gray-600">Get more details about what they need</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}&purpose=negotiate`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MapPin size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Arrange Meetup</div>
                            <div className="text-sm text-gray-600">Discuss pickup location & time</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MessageCircle size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Just Chat</div>
                            <div className="text-sm text-gray-600">Start a general conversation</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          // Navigate to chat with the requester
                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}&purpose=questions`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600 font-bold">↔</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Negotiate Price</div>
                            <div className="text-sm text-gray-600">Discuss budget and make a counter-offer</div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          // Get the requester ID - check both locations
                          const requesterId = selectedRequestForContact.requesterId ||
                            (selectedRequestForContact.requester && selectedRequestForContact.requester.id);

                          if (!requesterId) {
                            console.error('No requesterId found for request:', selectedRequestForContact);
                            toast.error('Cannot contact this requester. User ID not found.');
                            return;
                          }

                          // Navigate to chat with the requester
                          navigate(`/chat?userId=${requesterId}&context=request&contextId=${selectedRequestForContact.id}&purpose=negotiate`);
                          setShowContactOptions(false);
                          setSelectedRequestForContact(null);
                        }}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Star = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-yellow-300" size={24} />
              <span className="text-yellow-200 font-medium">NFSU Requests Board</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Find What Others Need</h1>
            <p className="text-lg text-blue-100 mb-6">
              Browse requests from fellow students. Help others by offering items you have, or post your own requests.
            </p>

            {/* Search and Create Button */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search requests (textbooks, laptops, furniture...)"
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-gray-900"
                />
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="lg:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className={`hidden lg:block ${filtersCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            {filtersCollapsed ? (
              // Collapsed state - only Filter icon button
              <div className="flex flex-col items-center py-4">
                <button
                  onClick={() => setFiltersCollapsed(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Expand Filters"
                >
                  <Filter size={20} className="text-gray-500" />
                </button>
                {getActiveFilterCount() > 0 && (
                  <div className="mt-2">
                    <span className="bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Expanded state
              <>
                {/* Header for expanded state */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                  <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Reset All
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>





                {/* Budget Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Budget Range</h4>
                  <div className="space-y-2">
                    {budgetRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handleBudgetChange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.budgetRange === range.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilters.sortBy === option.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${filtersCollapsed ? 'lg:ml-0' : ''}`}>
          {/* Mobile Filters Bar */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Sliders size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              <select
                value={activeFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === 'all' ? 'All Requests' : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredRequests.length} requests found
                  {searchQuery && ` for "${searchQuery}"`}
                  {activeFilters.status !== 'all' && ` • ${statusOptions.find(s => s.id === activeFilters.status)?.label}`}
                </p>
              </div>

              {getActiveFilterCount() > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Categories Quick Select - Mobile */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border transition-colors ${activeCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notice */}
          {userRole === 'admin' && (
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="text-yellow-600" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Admin Controls Active</h4>
                  <p className="text-sm text-gray-600">You can approve pending requests and manage all requests.</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm font-medium rounded-full">
                    {requests.filter(r => r.status === 'pending').length} pending
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className={`grid gap-6 ${filtersCollapsed ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
              {filteredRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No requests found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No requests matching "${searchQuery}". Try different keywords.`
                  : 'No requests available with current filters. Be the first to create one!'}
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Create First Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create New Request</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    What are you looking for? *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., HC Verma Physics Textbook, Gaming Laptop, Study Table"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    required
                  />
                </div>

                {/* Category and Campus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      required
                    >
                      <option value="books">Books & Study Material</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="fashion">Fashion</option>
                      <option value="sports">Sports Equipment</option>
                      <option value="notes">Study Notes</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">School *</label>
                    <select
                      name="school"
                      value={formData.school}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      required
                    >
                      <option value="forensic">School of Forensic Science</option>
                      <option value="cyber">School of Cyber Security & Digital Forensics</option>
                      <option value="police">School of Police Science and Security Studies</option>
                      <option value="engineering">School of Engineering & Technology</option>
                      <option value="management">School of Management Studies</option>
                      <option value="pharmacy">School of Pharmacy</option>
                      <option value="research">School of Doctoral Studies & Research</option>
                      <option value="open">School of Open Learning</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Detailed Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe exactly what you need. Include details like edition, brand, condition preferences, special requirements, etc."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    required
                  />
                </div>

                {/* Budget and Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Maximum Budget (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleFormChange}
                        placeholder="e.g., 5000"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Urgency *</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      required
                    >
                      <option value="low">Low - Whenever available</option>
                      <option value="normal">Normal - Within 2 weeks</option>
                      <option value="high">High - Need it soon</option>
                      <option value="urgent">Urgent - Need immediately</option>
                    </select>
                  </div>
                </div>

                {/* Admin Notice */}
                {userRole !== 'admin' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-yellow-600" size={18} />
                      <span className="font-semibold text-yellow-800">Admin Approval Required</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Your request will be reviewed by campus administration before being published.
                      This usually takes 24-48 hours.
                    </p>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for better responses:</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Be specific about brand, model, edition, size, etc.</li>
                    <li>• Mention your maximum budget clearly</li>
                    <li>• Specify preferred condition (new, like new, good, fair)</li>
                    <li>• Include any special requirements or accessories needed</li>
                    <li>• Set appropriate urgency level</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'Creating Request...' : userRole === 'admin' ? 'Publish Request' : 'Submit for Approval'}
                  </button>
                  <p className="text-center text-gray-500 text-sm mt-3">
                    {userRole === 'admin'
                      ? 'Request will be published immediately'
                      : 'Request will be visible after admin approval'}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              {/* Mobile filter content would go here */}
              <div className="text-center text-gray-600 py-8">
                Use desktop for advanced filters
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
